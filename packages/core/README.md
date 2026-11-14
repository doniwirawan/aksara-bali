# @aksara-bali/core

Latin ⇄ Aksara Bali (Balinese script, Unicode U+1B00–U+1B7F) transliteration. No dependencies; runs in browsers and Node.

It's the engine behind [aksarabali.doniwirawan.xyz](https://aksarabali.doniwirawan.xyz).

```sh
npm i @aksara-bali/core
```

```js
import { toBali, toLatin } from '@aksara-bali/core'

toBali('om swastyastu')   // 'ᬑᬫ᭄​ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ'
toLatin('ᬩᬮᬶ')            // 'bali'
```

## API

| Export | What it is |
|---|---|
| `toBali(text)` / `convertLatinToBalinese(text)` | Latin → Aksara Bali. Words are separated by U+200B, not spaces. |
| `toLatin(text)` / `convertBalineseToLatin(text)` | Aksara Bali → Latin. Unknown glyphs pass through unchanged. |
| `normalizeDiacritics(text)` | Maps ā ī ū ě ṇ ñ ś … to the plain spellings the engine reads. |
| `balineseMapping` | The syllable → codepoint table. |
| `BALINESE_KEYBOARD` | On-screen keyboard data: consonants in hanacaraka order, vowels, numerals, and the pangangge (vowel signs). |
| `QUIZ_WORDS` | About 90 graded practice words with Indonesian/English glosses. |

## Typing conventions

- `x` or `ě` writes pepet (ᭂ): `xmbah`, `pĕpĕt`.
- `aa`, `ii`, `uu` (or ā ī ū) write the long vowels.
- `v` is read as `w`, and `f` as `p`.
- `ng` at the end of a syllable becomes cecek (ᬂ). Followed by a vowel, it becomes the letter nga.

## Limits

The output follows simple rules, so it is not a scholarly transliteration. Clusters and some Sanskrit spellings may need hand correction. Check anything official, printed or ceremonial with a teacher or a native speaker.

## Building for another script

Copy `src/latin-to-bali.js`, replace `balineseMapping` with the other script's table, and keep the look-ahead loop. The tests in `test/` record known outputs, so add your own pairs before changing the logic.

MIT © Doni Wirawan
