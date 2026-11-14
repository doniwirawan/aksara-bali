# @aksara-bali/react

React components for script-converter tools, in the Tridatu design. They render `@aksara-bali/design` markup and contain no conversion logic, so they work with any script.

```sh
npm i @aksara-bali/react @aksara-bali/design @aksara-bali/core
```

```jsx
import '@aksara-bali/design/index.css'
import { useState } from 'react'
import { toBali } from '@aksara-bali/core'
import { Page, Workbench, BenchPane, BenchSeam, BenchInput, BenchOutput, BenchActions, BenchAction } from '@aksara-bali/react'

export default function Converter() {
  const [text, setText] = useState('')
  const out = toBali(text)
  return (
    <Page title="Konverter Aksara Bali" lede="Ketik Latin, baca aksara.">
      <Workbench pulled={!!out}>
        <BenchPane label="Latin" labelFor="in">
          <BenchInput id="in" value={text} onChange={e => setText(e.target.value)} />
        </BenchPane>
        <BenchSeam />
        <BenchPane script label="Aksara Bali">
          <BenchOutput value={out} lang="ban-Bali" placeholder="Hasil muncul di sini" />
          <BenchActions>
            <BenchAction primary onClick={() => navigator.clipboard.writeText(out)}>Salin</BenchAction>
          </BenchActions>
        </BenchPane>
      </Workbench>
    </Page>
  )
}
```

## Components

| Component | Use |
|---|---|
| `Workbench`, `BenchPane`, `BenchSeam` | The two-pane converter frame. `BenchPane script` is the red output field. |
| `BenchInput`, `BenchOutput` | Source textarea and live output. `script` / `latin` switch the typeface. |
| `BenchTools`, `BenchKey`, `BenchChip`, `BenchIcon` | Helper keys and tool buttons under the input or in the label bar. |
| `BenchActions`, `BenchAction`, `BenchFlip` | The action bar on the output (`primary` for Copy) and the direction switch. |
| `SiteHeader`, `HeaderTool`, `SiteFooter`, `Thread` | Black shell with the braided thread. The header folds into a drawer on phones. |
| `Page`, `Band` | Page frame with title and lede; black call-to-action band. |
| `GlyphGrid` | Fixed-cell glyph grid for charts and quiz choices. `hit` highlights a glyph and `onPick` makes the cells clickable. |
| `AksaraKeyboard` | On-screen keyboard for any `{ groups, marks }` layout, such as `BALINESE_KEYBOARD` from core. |

`react` is a peer dependency (version 18 or later). The components are client-side.

MIT © Doni Wirawan
