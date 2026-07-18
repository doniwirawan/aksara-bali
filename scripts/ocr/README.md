# Aksara Bali OCR — training the model

This folder builds a **free, offline, in-browser** OCR model for Balinese script.
The web reader at `/read` runs [Tesseract.js](https://github.com/naptha/tesseract.js)
(WASM) with a custom `ban.traineddata`. There is **no ready-made Balinese model to
download** — this is how you produce one.

The clever bit: we don't scrape or hand-label anything. The app already knows how to
render Latin → Aksara Bali, so we **generate** perfectly-labelled training images from
our own converter. The OCR model only has to learn *glyph → Unicode*; turning that
Unicode back into readable Latin is done deterministically by `utils/balineseToLatin.js`.

```
Latin word ──(app converter)──▶ Balinese Unicode ──(text2image + font)──▶ line image
                                        │                                      │
                                   ground truth  ◀── model learns image → Unicode ─┘
```

---

## 0. Prerequisites

You need the **Tesseract training tools** (not just the runtime) and a **Balinese font
that shapes correctly**. No GPU required — LSTM training runs on CPU.

| Tool | Windows | macOS | Linux |
|---|---|---|---|
| Tesseract + training tools | [UB Mannheim installer](https://github.com/UB-Mannheim/tesseract/wiki) (tick "Training Tools") | `brew install tesseract` + build training tools, or use Docker | `apt install tesseract-ocr libtesseract-dev`, then build `training` targets |
| Noto Sans Balinese (TTF) | [Download from Google Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+Balinese) and install | same | same, drop in `~/.fonts` and `fc-cache -f` |

Verify the training binaries are on your `PATH`:

```bash
text2image --version
lstmtraining --version
combine_lang_model --version
unicharset_extractor --help
```

You also need Tesseract's **langdata** (script definitions) once:

```bash
git clone --depth 1 https://github.com/tesseract-ocr/langdata_lstm.git
```

> The easiest all-in-one environment is the official
> [`tesstrain`](https://github.com/tesseract-ocr/tesstrain) repo or the
> `tesseractshadow/tesseract4re` Docker image — both ship every binary below.

---

## 1. Generate the labelled corpus

From the project root:

```bash
node scripts/ocr/generate-training-data.mjs --lines 5000 --eval 400
```

This writes to `scripts/ocr/out/`:

- `ban.training_text` — one Balinese line per row (the training corpus)
- `ban.eval_text` — held-out lines for measuring accuracy
- `ban.reference.tsv` — `latin <TAB> balinese`, for eyeballing correctness

Want more/other words? Create `scripts/ocr/wordlist.txt` (one Latin word or phrase per
line, `#` for comments) and re-run — it overrides the built-in vocabulary. More varied
text = a more robust model.

---

## 2. Render the corpus to line images

`text2image` uses Pango/HarfBuzz, so it shapes Balinese conjuncts and vowel signs
correctly (a plain canvas would not).

```bash
mkdir -p scripts/ocr/out/ban
text2image \
  --text=scripts/ocr/out/ban.training_text \
  --outputbase=scripts/ocr/out/ban/ban.NotoSansBalinese.exp0 \
  --font="Noto Sans Balinese" \
  --fonts_dir=/usr/share/fonts \
  --max_pages=0 --leading=32 --xsize=3600 --ysize=480 --margin=40
```

Repeat with a few more Balinese-capable fonts (e.g. *Noto Serif Balinese*, *Vimala*,
*Bali Simbar*) using `exp1`, `exp2`, … as the suffix. Multiple fonts dramatically
improve real-world accuracy.

Make the `.lstmf` feature files and list them:

```bash
for tif in scripts/ocr/out/ban/*.exp*.tif; do
  base="${tif%.tif}"
  tesseract "$tif" "$base" --psm 6 lstm.train
done
ls scripts/ocr/out/ban/*.lstmf > scripts/ocr/out/ban.training_files.txt
```

---

## 3. Build the starter model (unicharset + from-scratch traineddata)

Because no Balinese base model exists, we train **from scratch**.

```bash
# Collect every glyph used in the corpus
unicharset_extractor \
  --output_unicharset scripts/ocr/out/ban/ban.unicharset \
  --norm_mode 2 \
  scripts/ocr/out/ban/*.exp*.box

# Wrap it into a starter traineddata
combine_lang_model \
  --input_unicharset scripts/ocr/out/ban/ban.unicharset \
  --script_dir langdata_lstm \
  --output_dir scripts/ocr/out/trained \
  --lang ban
```

---

## 4. Train

```bash
lstmtraining \
  --traineddata scripts/ocr/out/trained/ban/ban.traineddata \
  --net_spec '[1,36,0,1 Ct3,3,16 Mp3,3 Lfys48 Lfx96 Lrx96 Lfx256 O1c1]' \
  --model_output scripts/ocr/out/trained/ban \
  --train_listfile scripts/ocr/out/ban.training_files.txt \
  --max_iterations 10000
```

`O1c1` auto-sizes the output layer to the unicharset. Watch the char error rate (BCER)
print as it runs; 10k–20k iterations is usually enough for a single-font synthetic set.
On CPU this is minutes-to-an-hour depending on corpus size.

Finalize into a distributable model:

```bash
lstmtraining \
  --stop_training \
  --continue_from scripts/ocr/out/trained/ban_checkpoint \
  --traineddata scripts/ocr/out/trained/ban/ban.traineddata \
  --model_output scripts/ocr/out/ban.traineddata
```

---

## 5. Evaluate (optional but recommended)

Render `ban.eval_text` the same way (step 2, into a separate folder), build its
`.lstmf` list, then:

```bash
lstmeval \
  --model scripts/ocr/out/ban.traineddata \
  --eval_listfile scripts/ocr/out/ban.eval_files.txt
```

A char error rate under a few percent on the held-out set means it's ready.

---

## 6. Install the model into the app

Copy the finished model where the web reader looks for it:

```bash
mkdir -p public/tessdata
cp scripts/ocr/out/ban.traineddata public/tessdata/ban.traineddata
```

That's it. Open `/read`, upload a photo of Balinese script, and it will recognise the
glyphs (Tesseract.js, fully in-browser) and transliterate them to Latin. The page
detects a missing model and shows a friendly notice until `ban.traineddata` is present,
so you can ship the UI before the model is trained.

---

## Improving accuracy

Real photos are harder than clean renders. To close the gap:

- **More fonts** in step 2 (biggest win).
- **Augment** the images: slight rotation, blur, noise, JPEG artefacts, uneven
  lighting — mimic phone photos. (tesstrain supports `--random_augment`.)
- **Fine-tune on real samples**: photograph printed/lontar Balinese, crop to lines,
  hand-type the ground truth into `*.gt.txt`, and continue training with
  `--continue_from` your synthetic checkpoint.
- Longer training / more corpus lines from a bigger `wordlist.txt`.

The generated corpus and `.traineddata` live under `out/` and are git-ignored — they're
build artefacts, reproducible from this script.
