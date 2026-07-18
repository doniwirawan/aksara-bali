# Self-contained Tesseract training environment for the Aksara Bali OCR model.
# Ubuntu's tesseract-ocr package ships every training binary (text2image,
# lstmtraining, combine_lang_model, …) and fonts-noto-core ships three Balinese
# fonts, so nothing needs to be installed on the host — only Docker.
#
# Pinned to 24.04 for Tesseract 5.x: the model must be trained with the same
# major engine version the browser runs (tesseract.js-core 5.x). A 4.x-trained
# model reads poorly under 5.x inference.
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update -qq \
 && apt-get install -y -qq \
      tesseract-ocr \
      fonts-noto-core \
      fontconfig \
      wget ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# combine_lang_model needs radical-stroke.txt from langdata (one small file,
# not the whole multi-GB repo).
RUN mkdir -p /langdata \
 && wget -q -O /langdata/radical-stroke.txt \
      https://github.com/tesseract-ocr/langdata_lstm/raw/main/radical-stroke.txt

WORKDIR /work
