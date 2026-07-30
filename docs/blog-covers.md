# Blog cover images

Every blog post gets a generated 1200×630 PNG cover: an Unsplash photo with an
SVG text overlay composited on top by [sharp](https://sharp.pixelplumbing.com/).
Covers live in `public/covers/<slug>.png` and are served from the site itself,
so `image_url` no longer points at a bare stock photo.

## The two scripts

| Script | What it does |
|---|---|
| `scripts/fetch-unsplash-photos.mjs` | Builds `scripts/data/unsplash-photos.json` — a catalogue of candidate photos, each with photographer name, profile URL, and photo page URL |
| `scripts/gen-blog-covers.mjs` | Composites the covers and (with `--update`) writes `image_url` plus the credit fields back to Supabase |

```bash
node scripts/fetch-unsplash-photos.mjs          # refresh the photo catalogue
node scripts/gen-blog-covers.mjs                # write PNGs only
node scripts/gen-blog-covers.mjs --update       # PNGs + point posts at them
node scripts/gen-blog-covers.mjs my-slug        # just one post
```

## Adding a cover for a new post

1. Seed the post first — `gen-blog-covers.mjs` reads published posts from Supabase.
2. Add an entry to `ASSIGN` in `scripts/gen-blog-covers.mjs`:

   ```js
   'my-post-slug': ['bali-temple', 0, ['First line', 'Second line']],
   //                ^ catalogue bucket  ^ index  ^ short display title
   ```

   Without an entry the script falls back to the post category's bucket and
   auto-wraps the post title, which works but rarely reads as well.
3. Run `node scripts/gen-blog-covers.mjs --update`.
4. Commit the new PNG — covers are static assets in the repo.

Seed scripts also set `image_url` themselves, so a seed replay overwrites the
cover URL. Point the seed script's `image_url` at
`https://<domain>/covers/<slug>.png`, or re-run the cover script afterwards.

## Design of the overlay

- 1200×630, the Open Graph card ratio, so the same file works as `og:image`
- Dark left-to-right scrim plus a bottom gradient, keeping text legible on any photo
- Gold rule + uppercase kicker (from the post category), white title, footer line
- A large low-opacity Balinese letter as a watermark on the right
- `position: 'attention'` on the resize so the crop keeps the photo's subject

## Why the overlay text is Latin only

The SVG rasteriser behind sharp does **no complex-script shaping**. Composed
Balinese — a consonant plus a vowel sign, or a stacked cluster — would render
with marks in the wrong place. The watermark is therefore always a single
un-composed base letter (`ᬓ`, `ᬩ`, `ᬮ`, …), which needs no shaping and renders
correctly.

If you ever need real composed Balinese in an image, render it in the browser
(the converter's word-art PNG export does this) rather than through sharp.

## Attribution

Unsplash asks for photographer credit, so the catalogue keeps it and the cover
script writes it to the post:

| Column | Contents |
|---|---|
| `image_credit` | photographer name |
| `image_credit_url` | photographer's Unsplash profile |
| `image_source_url` | the photo's page on Unsplash |

`pages/blog/[slug].jsx` renders these as "Photo by *name* on Unsplash" beneath
the cover. Keep them populated when adding photos by hand.

`fetch-unsplash-photos.mjs` skips Unsplash+ (`plus.unsplash.com`) results — those
carry different licence terms from the free Unsplash licence.

## Gotchas

- Unsplash answers **401 to node's `fetch`** for search pages regardless of
  headers, so the catalogue builder shells out to `curl`. The `napi` metadata
  endpoint is fine with `fetch`.
- Photo IDs in `images.unsplash.com/photo-…` URLs are *not* the IDs the API
  accepts; the catalogue stores both the image URL and the page URL to avoid
  having to map between them.
- Covers are palette-quantised PNGs, typically 100–350 KB. If a cover lands far
  above that, the source photo is probably very noisy — pick another.
