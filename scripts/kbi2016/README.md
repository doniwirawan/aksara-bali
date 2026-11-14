# Kamus Bali–Indonesia 2016 import

Source: *Kamus Bali–Indonesia*, edisi ke-3 (Badan Pengembangan dan Pembinaan Bahasa, 2016; ISBN 979885550X), published under CC BY-NC 4.0 at
https://repositori.kemendikdasmen.go.id/16215/

The PDF's OCR text is usable word by word, but its reading order mixes the two columns. Two steps turn it into Kamus entries.

```sh
# 1. Read each page column by column, using word positions (needs PyMuPDF)
uv run --no-project --with pymupdf python -I columns.py kbi-2016.pdf kbi-cols.txt

# 2. Pull out headwords and their glosses, then filter
node parse.mjs kbi-cols.txt ../../public/data/kamus-bali.json kbi-out.json kbi-rejects.txt
```

`parse.mjs` takes only headwords: no derived forms and no example sentences. It favours precision over recall and drops anything doubtful:

- **Glosses with rare words.** Any gloss word that is not in the existing Kamus, and appears fewer than 3 times across all glosses, gets the entry dropped. OCR garbage and leaked Balinese example text show up this way.
- **Bad headwords.** A headword is dropped if it appears only once and has a syllable with no vowel (`ja.ga.dl.ta`), or has a vowel run that Balinese spelling avoids (`seiur`), which is usually "l" misread as "i".
- **Broken text.** Glosses that are cut off, have unbalanced brackets, or hyphenate in a way that isn't reduplication are dropped.
- **Duplicates.** Words already in the Kamus are skipped.
- **Systematic misreadings** are repaired instead: `beijalan` → berjalan, `wama` → warna, and abbreviations such as `yg`, `dg`, `km`, `sj`.

The result goes to `scripts/data/kamus-kbi2016.json`, together with 9 entries checked by hand. `build-kamus.mjs` merges that file, and on the page each entry is labelled with its source.

In the 2016 run, 3,316 parsed headwords and 9 hand-checked entries were kept. About 1,300 were dropped as rare or unsure, and 870 were already in the Kamus.
