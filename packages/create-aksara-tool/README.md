# create-aksara-tool

Start a script-converter web app in one command:

```sh
npm create aksara-tool my-tool
cd my-tool
npm install
npm run dev
```

You get a Next.js app with:
- the Tridatu design, with light and dark themes;
- an Indonesian/English switch;
- a Latin ⇄ script workbench with copy;
- an on-screen script keyboard;
- a PWA manifest.

It uses `@aksara-bali/core`, `@aksara-bali/design` and `@aksara-bali/react`.

## Another script

Everything script-specific is in `script.config.js`:

```js
export const script = {
  name: 'Aksara Bali',      // product name in Latin
  mark: 'ᬅᬓ᭄ᬱᬭ',            // wordmark in the script
  lang: 'ban-Bali',         // BCP-47 tag
  toScript: toBali,         // Latin -> script
  toLatin,                  // script -> Latin
  keyboard: BALINESE_KEYBOARD,  // { groups, marks } or null
  sample: 'om swastyastu',
}
```

To build a converter for Javanese, Sundanese or Lontara, swap in that script's engine, wordmark, language tag and keyboard. Then change the Noto font in `pages/_document.jsx` to match. The pages and the design stay the same.

MIT © Doni Wirawan
