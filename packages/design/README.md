# @aksara-bali/design

**Tridatu** is the design system behind [aksarabali.doniwirawan.xyz](https://aksarabali.doniwirawan.xyz), shipped as plain CSS so it works with any framework.

The colours are the three strands of the tridatu thread (red, white and black) plus turmeric, from the Nawa Sanga direction colours. They are laid down as flat fields:

- **Red** holds the script.
- **Black** holds the shell (header and footer).
- **White** is the page ground.
- **Turmeric** marks the active or selected choice.

Corners are square and there are no drop shadows. The braided thread is the only ornament. Light and dark themes are included.

```sh
npm i @aksara-bali/design
```

```js
import '@aksara-bali/design/index.css'        // tokens + base + components
import '@aksara-bali/design/bootstrap.css'    // optional: re-skin Bootstrap 5 (load after bootstrap.min.css)
import '@aksara-bali/design/driver.css'       // optional: re-skin driver.js tours
```

You also need these two fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Balinese:wght@400;700&family=Schibsted+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

For dark mode, set `data-bs-theme="dark"` on `<html>`.

## Files

| File | Contents |
|---|---|
| `tokens.css` | Colour, font, thread and motion custom properties, for light and dark. |
| `base.css` | Reset, type, links, `.aksara`/`.balinese-text`, `.thread`, focus, selection, scrollbars, reduced motion. |
| `components.css` | `.site-header`, `.site-footer`, `.page`/`.page-head`, `.bench` (the converter workbench), `.panel`, `.tool-row`, `.app-band`, `.cta`, `.glyphs`, `.akb` (the keyboard), `.swatch`, `.seg`, `.mode`, `.tour-btn`. |
| `bootstrap.css` | Points Bootstrap 5's variables, buttons, cards, forms and alerts at the tokens. |
| `driver.css` | driver.js popovers styled to match. |
| `DESIGN.md` | The full system: tokens, type ramp, named rules, and what not to do. |

The React components in `@aksara-bali/react` render this markup for you.

MIT © Doni Wirawan
