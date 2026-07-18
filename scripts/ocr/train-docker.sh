#!/usr/bin/env bash
# One command to train + install the Aksara Bali OCR model. Requires Docker.
#
#   bash scripts/ocr/train-docker.sh
#
# Steps: generate the labelled corpus (Node), build the training image, run the
# pipeline in a container, and drop ban.traineddata into public/tessdata/.
# Env: LINES (corpus size, default 5000), MAX_ITER (default 8000).
set -euo pipefail
cd "$(dirname "$0")/../.."

LINES="${LINES:-5000}"
MAX_ITER="${MAX_ITER:-8000}"

echo "==> [1/3] Generating corpus ($LINES lines)"
node scripts/ocr/generate-training-data.mjs --lines "$LINES" --eval 400

echo "==> [2/3] Building training image"
docker build -t aksara-ocr-train scripts/ocr

echo "==> [3/3] Training in container"
# pwd -W gives a Windows path Docker Desktop accepts from Git Bash; falls back to
# $PWD on Linux/macOS.
HOSTDIR="$( (pwd -W 2>/dev/null) || pwd )"
docker run --rm \
  -e MAX_ITER="$MAX_ITER" \
  -v "$HOSTDIR":/work \
  aksara-ocr-train \
  bash scripts/ocr/train.sh

echo "==> Done. Model at public/tessdata/ban.traineddata"
