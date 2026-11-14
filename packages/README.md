# @aksara-bali packages

Five packages taken out of [aksarabali.doniwirawan.xyz](https://aksarabali.doniwirawan.xyz), so the next script tool doesn't start from zero. That might be a Javanese, Sundanese or Lontara converter, a school worksheet generator, or another Balinese app.

The site uses all of them itself, so they get tested in real use with every deploy.

| Package | What it's for | Use it when you want… |
|---|---|---|
| [`@aksara-bali/core`](core/) | The conversion engine: Latin ⇄ Aksara Bali, plus the keyboard layout and practice words. Plain JavaScript, no dependencies. | Script conversion anywhere: a web page, a Node API, a bot, a spreadsheet script. |
| [`@aksara-bali/kamus`](kamus/) | Indonesian ⇄ Balinese dictionary lookup with speech levels, a word-by-word sentence helper, and a loader for the live Kamus data (5,600+ entries, plus Old Balinese). | Translation features: look up a word, pick the andap or alus form, or rough out a sentence. |
| [`@aksara-bali/design`](design/) | The Tridatu look as plain CSS: colours, fonts, light and dark themes, the braided thread, page shell, converter workbench. | A new page or tool that looks like part of the same family, whatever framework you use. |
| [`@aksara-bali/react`](react/) | React components that render that design: workbench, header and footer, glyph grid, on-screen script keyboard. | To build a React or Next.js tool fast, without writing the markup yourself. |
| [`create-aksara-tool`](create-aksara-tool/) | A starter generator: `npm create aksara-tool my-tool` gives a working converter site. | To start a new tool in one command. |

## How they fit together

```text
create-aksara-tool        →  generates a Next.js app that uses ↓
@aksara-bali/react         →  components; they render markup styled by ↓
@aksara-bali/design        →  CSS only, works without React too
@aksara-bali/core          →  the engine; the components never convert by themselves
```

`core`, `kamus` and `design` don't depend on anything. `react` uses `design`'s class names, but takes the converter as a prop, so you can plug in a different script's engine.

## Common jobs

**Convert text in your own code**

```js
import { toBali, toLatin } from '@aksara-bali/core'
toBali('rahajeng semeng')   // Aksara Bali
toLatin('ᬩᬮᬶ')              // 'bali'
```

**Look up and translate words**

```js
import { loadKamus } from '@aksara-bali/kamus'
const kamus = await loadKamus()
kamus.toBalinese('makan', { level: 'alus' })   // 'marayunan'
kamus.sentence('saya makan di rumah').map(t => t.out).join('')
```

**Give an existing site the Aksara Bali look**

```js
import '@aksara-bali/design/index.css'
```

Then use the classes: `.site-header`, `.page-head`, `.bench`, `.aksara`, … The full list is in [design/README.md](design/README.md). The rules behind the look are in [design/DESIGN.md](design/DESIGN.md).

**Build a converter page in React**

```jsx
<Workbench>
  <BenchPane label="Latin"><BenchInput value={text} onChange={…} /></BenchPane>
  <BenchSeam />
  <BenchPane script label="Aksara Bali"><BenchOutput value={toBali(text)} lang="ban-Bali" /></BenchPane>
</Workbench>
```

**Start a converter for another script**

```sh
npm create aksara-tool aksara-jawa
```

Then edit `script.config.js`. Swap in that script's converter, wordmark, language tag (for example `jv-Java`) and keyboard layout, and load the matching Noto font. The pages and the design stay the same.

## Licences

- **Packages:** MIT. Anyone may use them, including commercially.
- **The aksarabali.doniwirawan.xyz site:** PolyForm Noncommercial 1.0.0.
- **Kamus data:** not bundled in any package. `@aksara-bali/kamus` fetches it from the site. Parts of it are CC BY-NC 4.0, so credit the sources and keep use non-commercial.

## Working on the packages

They are npm workspaces inside this repo.

```sh
npm install                          # links packages/* into node_modules
npm test                             # core's golden tests + kamus tests
npm run build -w @aksara-bali/react  # bundles react/dist (only needed for publishing)
```

- **Changing conversion behaviour:** change it in `core`, then update `core/test/golden.json` on purpose. Those recordings are what the live site writes.
- **The site uses the source directly:** it compiles `react` straight from `react/src` (see `next.config.mjs`), so a deploy never depends on `dist/`.

## Status

- **Version:** 0.1.0.
- **npm:** not published yet. The `@aksara-bali` scope needs an npm organization first (free for public packages).
- **Until then:** install from a local tarball (`npm pack -w @aksara-bali/core`) or from this repo.
