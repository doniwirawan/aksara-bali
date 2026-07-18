# tessdata

The in-browser Aksara Bali OCR reader (`/read`) loads its model from this folder:

```
public/tessdata/ban.traineddata
```

That file is **not** in the repo — it's a trained artefact. Produce it by following
`scripts/ocr/README.md`, then drop the resulting `ban.traineddata` here.

Until the model is present, the reader detects it's missing and shows setup
instructions instead of erroring. The model is served uncompressed (the OCR wrapper
sets `gzip: false`).
