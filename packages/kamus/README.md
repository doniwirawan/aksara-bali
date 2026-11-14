# @aksara-bali/kamus

Indonesian ⇄ Balinese dictionary lookup with speech levels (*anggah-ungguh*: andap, alus singgih, alus sor, mider). It includes a word-by-word sentence helper and a loader for the live Kamus data behind [aksarabali.doniwirawan.xyz/translate](https://aksarabali.doniwirawan.xyz/translate/). It has no dependencies.

```sh
npm i @aksara-bali/kamus
```

## Quick start: use the live data

```js
import { loadKamus } from '@aksara-bali/kamus'

const kamus = await loadKamus()            // ~5,600 entries, fetched once
kamus.search('rumah')                      // ranked entries, both directions
kamus.toBalinese('makan')                  // 'madaar'   (andap, everyday)
kamus.toBalinese('makan', { level: 'alus' }) // 'marayunan'
kamus.sentence('saya makan nasi di rumah', { level: 'andap' })
     .map(t => t.out).join('')             // 'aké madaar nasi ba umah'

const kuno = await loadKamus('kuno')       // Old Balinese (inscription language)
kuno.search('ayam')                        // hayam, syap, …
```

Combine it with [`@aksara-bali/core`](../core/) to write the result in script:

```js
import { toBali } from '@aksara-bali/core'
toBali(kamus.toBalinese('rumah'))          // 'ᬉᬫᬳ᭄'
```

## With your own data

Entries have the shape `{ i, a, s, o, m }`:

| Field | Meaning |
|---|---|
| `i` | Indonesian |
| `a` | andap (everyday) |
| `s` | alus singgih (honours the other person) |
| `o` | alus sor (humbles yourself) |
| `m` | mider (neutral polite) |

Any field may list alternatives separated by commas ("puri, gria").

```js
import { createKamus } from '@aksara-bali/kamus'
const kamus = createKamus([{ i: 'rumah', a: 'umah', s: 'griya', o: 'jero', m: '' }])
```

Other shapes work too if you name the fields to search: `createKamus(entries, { fields: ['k', 'i'] })`.

## API

| Function | Returns |
|---|---|
| `loadKamus(which?, { baseUrl?, fetch? })` | A dictionary over the live data. `which` is `'modern'` (default) or `'kuno'`. Also carries `.source` and `.count`. |
| `createKamus(entries, { fields? })` | A dictionary over your own entries. |
| `kamus.search(query, { limit = 40 })` | Ranked: exact match, then listed alternative, then prefix, then substring. Accents are ignored. |
| `kamus.lookup(word)` | Entries where some field matches `word` exactly. |
| `kamus.toBalinese(indonesian, { level })` | One word. `'andap'` prefers a › m › s › o; `'alus'` prefers s › m › o › a. Returns `null` if the word is unknown. |
| `kamus.sentence(text, { level })` | Tokens `{ token, out, matched, entry }`. Spaces and punctuation pass through with `matched: null`; unknown words keep their Indonesian spelling with `matched: false`. |
| `kamus.forms()` | A `Set` of every Balinese word form. |
| `LEVELS` | The four speech levels, with Indonesian and English labels. |
| `normalize(s)` | Lowercases text and strips accents (`yéh` → `yeh`). |

## Honest limits

- **`sentence()` is substitution, not translation.** Balinese word order differs from Indonesian, and the right speech level depends on who you are speaking to. Show the result as a starting point, and mark the unmatched words.
- **The data contains reading errors.** It was read automatically from printed dictionaries, so expect some mistakes. Anything official, printed or ceremonial should be checked by a native speaker.

## Data licence

The code is MIT. The data is **not** bundled: `loadKamus()` fetches it from the site. It combines the *Kamus Anggah-Ungguh Kruna Bali–Indonesia*, the *Kamus Bali–Indonesia* ed. 3 (Badan Bahasa, 2016, **CC BY-NC 4.0**), the *Kamus Bahasa Bali Kuno–Indonesia* (1985, **CC BY-NC 4.0**) and community additions.

If you use the data:
- credit the sources (they are listed in the file's `source` field);
- keep the use non-commercial.

MIT © Doni Wirawan (code)
