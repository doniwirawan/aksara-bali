#!/usr/bin/env bash
# In-container Aksara Bali OCR training pipeline. Run via train-docker.sh (which
# generates the corpus, builds the image, and mounts the repo at /work).
#
# Renders the synthetic Balinese corpus with every available Balinese font,
# trains a from-scratch Tesseract LSTM model, and writes the result to
# public/tessdata/ban.traineddata so the web reader picks it up automatically.
#
# All intermediate work happens in a container-local scratch dir (/build) — only
# the final model is written back to the mounted repo. This keeps the bind mount
# clean and fast on Docker Desktop / Windows.
#
# Env: MAX_ITER (default 8000), TARGET_ERR (default 0.008)
set -euo pipefail

SRC=scripts/ocr/out          # mounted from host: has ban.training_text
BUILD=/build                 # container-local scratch
IMG="$BUILD/img"
TRAINED="$BUILD/trained"
MAX_ITER="${MAX_ITER:-8000}"
TARGET_ERR="${TARGET_ERR:-0.008}"

rm -rf "$BUILD"; mkdir -p "$IMG" "$TRAINED"
cp "$SRC/ban.training_text" "$BUILD/"

# Balinese fonts present in fonts-noto-core.
FONTS=("Noto Sans Balinese" "Noto Serif Balinese")

echo "==> Rendering corpus with ${#FONTS[@]} font(s)"
: > "$BUILD/ban.training_files.txt"
exp=0
for f in "${FONTS[@]}"; do
  safe=$(echo "$f" | tr ' ' '_')
  base="$IMG/ban.$safe.exp$exp"
  echo "    - $f"
  text2image \
    --text="$BUILD/ban.training_text" \
    --outputbase="$base" \
    --font="$f" \
    --fonts_dir=/usr/share/fonts \
    --max_pages=0 \
    --margin=30 \
    --leading=48 \
    --xsize=3000 --ysize=560 >/dev/null 2>&1
  tesseract "$base.tif" "$base" --psm 6 lstm.train >/dev/null 2>&1
  echo "$base.lstmf" >> "$BUILD/ban.training_files.txt"
  exp=$((exp + 1))
done

echo "==> Building unicharset"
unicharset_extractor \
  --output_unicharset "$BUILD/ban.unicharset" \
  --norm_mode 2 \
  "$IMG"/*.box >/dev/null 2>&1
NUM=$(head -1 "$BUILD/ban.unicharset")
echo "    unicharset size: $NUM"

echo "==> Building starter traineddata"
combine_lang_model \
  --input_unicharset "$BUILD/ban.unicharset" \
  --script_dir /langdata \
  --output_dir "$TRAINED" \
  --lang ban >/dev/null 2>&1

echo "==> Training (max_iterations=$MAX_ITER, target_error_rate=$TARGET_ERR)"
lstmtraining \
  --traineddata "$TRAINED/ban/ban.traineddata" \
  --net_spec "[1,36,0,1 Ct3,3,16 Mp3,3 Lfys48 Lfx96 Lrx96 Lfx256 O1c${NUM}]" \
  --model_output "$TRAINED/ban" \
  --train_listfile "$BUILD/ban.training_files.txt" \
  --max_iterations "$MAX_ITER" \
  --target_error_rate "$TARGET_ERR" 2>&1 \
  | grep --line-buffered -E "At iteration|error rate|Finished" || true

echo "==> Finalizing model"
lstmtraining \
  --stop_training \
  --continue_from "$TRAINED/ban_checkpoint" \
  --traineddata "$TRAINED/ban/ban.traineddata" \
  --model_output "$BUILD/ban.traineddata" >/dev/null 2>&1

mkdir -p public/tessdata
cp "$BUILD/ban.traineddata" public/tessdata/ban.traineddata
echo "==> Wrote public/tessdata/ban.traineddata ($(du -h public/tessdata/ban.traineddata | cut -f1))"

# Smoke test: render a known phrase and read it back.
echo "==> Smoke test"
printf 'ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ\n' > "$BUILD/phrase.txt"
text2image --text="$BUILD/phrase.txt" --outputbase="$BUILD/phrase" \
  --font="Noto Sans Balinese" --fonts_dir=/usr/share/fonts \
  --max_pages=1 --margin=30 --xsize=1200 --ysize=300 >/dev/null 2>&1
echo -n "    recognised: '"
tesseract "$BUILD/phrase.tif" stdout --tessdata-dir public/tessdata -l ban --psm 7 2>/dev/null | tr -d '\n'
echo "'  (expected: 'ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ')"
