# Kamus Bahasa Bali Kuno–Indonesia import

Source: *Kamus Bahasa Bali Kuno–Indonesia* (Pusat Pembinaan dan Pengembangan Bahasa, 1985), CC BY-NC 4.0:
https://repositori.kemendikdasmen.go.id/2854/

Old Balinese is the language of the 9th–14th century inscriptions. It's not everyday Balinese, so it lives in its own file, `public/data/kamus-bali-kuno.json`, and its own tab on `/translate`.

```sh
# column-split the PDF's OCR text by word position (same script as the 2016 import)
uv run --no-project --with pymupdf python -I ../kbi2016/columns.py bkuno.pdf bkuno-cols.txt
node parse.mjs bkuno-cols.txt ../../public/data/kamus-bali.json kuno-out.json kuno-rejects.txt
```

`parse.mjs` keeps headwords only and drops anything doubtful:
- meanings the book itself marks `(?)`;
- name entries (`n. orang`, `n. diri`);
- headwords that appear only once in the book;
- glosses with rare words, digits, stray name markers, or bits of example text.

Out of 2,510 candidates, 382 passed. That set is small but clean. A native-speaker review of the rejects would be the way to grow it.
