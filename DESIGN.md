---
name: Aksara Bali
description: Latin to Balinese script converter and learning site, set in the Tridatu world.
colors:
  bang-red: "#B4232B"
  bang-red-deep: "#8E1A21"
  selem-black: "#17140F"
  kuning-turmeric: "#E2A41C"
  turmeric-pressed: "#C98F12"
  putih-ground: "#F7F6F2"
  surface: "#FFFFFF"
  surface-2: "#EFEDE6"
  ink: "#17140F"
  mute: "#5E594F"
  line: "#DEDBD2"
  link-blue: "#2B5C9E"
  ok: "#2F7D4A"
  ok-tint: "#E4F1E8"
  danger: "#A11D24"
  danger-tint: "#F6E3E2"
  warn: "#9A6B00"
  warn-tint: "#FBF0D6"
  shell-text: "#BDB7AA"
  shell-rule: "#3A352D"
  shell-ghost-border: "#5A5348"
  dark-red: "#C0313A"
  dark-ground: "#12100C"
  dark-surface: "#1C1915"
  dark-surface-2: "#26221C"
  dark-ink: "#F1EEE6"
  dark-mute: "#A9A396"
  dark-line: "#3A352D"
  dark-accent: "#E0575E"
  dark-link: "#93B8EC"
typography:
  display:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(2rem, 1.3rem + 2.6vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
  aksara-output:
    fontFamily: "Noto Sans Balinese, serif"
    fontSize: "clamp(2rem, 1.4rem + 2.2vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.9
    fontFeature: "'liga' on, 'calt' on"
  aksara-input:
    fontFamily: "Noto Sans Balinese, serif"
    fontSize: "clamp(1.75rem, 1.3rem + 1.6vw, 2.75rem)"
    fontWeight: 400
    lineHeight: 1.8
  latin-input:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1rem + 0.9vw, 1.75rem)"
    fontWeight: 500
    lineHeight: 1.4
  mono:
    fontFamily: "Cascadia Code, Consolas, SF Mono, Menlo, monospace"
    fontSize: "13px"
    fontWeight: 400
rounded:
  none: "0"
spacing:
  xs: "6px"
  sm: "12px"
  md: "20px"
  lg: "24px"
  xl: "40px"
  section: "72px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.putih-ground}"
    rounded: "{rounded.none}"
  button-primary-hover:
    backgroundColor: "{colors.bang-red}"
    textColor: "{colors.surface}"
  button-primary-active:
    backgroundColor: "{colors.bang-red-deep}"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  button-outline-hover:
    backgroundColor: "{colors.surface-2}"
  cta-red:
    backgroundColor: "{colors.bang-red}"
    textColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    height: "46px"
  cta-red-hover:
    backgroundColor: "{colors.dark-red}"
  bench-action-primary:
    backgroundColor: "{colors.putih-ground}"
    textColor: "{colors.bang-red}"
    height: "52px"
  bench-action:
    textColor: "{colors.surface}"
    height: "52px"
  bench-action-hover:
    backgroundColor: "{colors.bang-red-deep}"
  bench-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "38px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  site-header:
    backgroundColor: "{colors.selem-black}"
    textColor: "{colors.putih-ground}"
    height: "60px"
  site-login:
    backgroundColor: "{colors.putih-ground}"
    textColor: "{colors.selem-black}"
    padding: "0 16px"
    height: "34px"
  site-login-hover:
    backgroundColor: "{colors.kuning-turmeric}"
  strip-install:
    backgroundColor: "{colors.kuning-turmeric}"
    textColor: "{colors.selem-black}"
    padding: "8px 24px"
---

# Design System: Aksara Bali

## Overview

**Creative North Star: "The Tridatu Thread"**

The tridatu is the red, white and black thread worn on Balinese wrists. Here it binds Latin to aksara: a braided stripe of those three colours runs across the top of every page, closes the footer, and forms the seam between the Latin input and the aksara output on the converter workbench. Everything else stays out of its way.

Colour comes from the Nawa Sanga directions and is laid down as flat, unmodulated fields that each own a region. Bang red holds the script output. Selem black holds the shell (header, footer, app band). Putih off-white is the ground. Kuning turmeric marks whatever is selected, active, focused or highlighted. A single blue is reserved for links. Corners are square everywhere (Bootstrap's radius tokens are forced to 0), depth comes from 1-2px rules, and nothing floats.

Density is that of a working tool, not a brochure. The home page shows its tools working on real words (tool rows with live demos) rather than a grid of feature tiles. Balinese script is always set large, because it is the product.

**Key Characteristics:**
- Flat Nawa Sanga colour fields that own regions; no gradients, glass, grain or drop shadows.
- The braided tridatu thread as the one ornament, used as seam, top rule, footer rule and progress bar.
- Square corners on every component, including Bootstrap primitives.
- Turmeric as the single "this is chosen" signal: active mode, focus ring, selection, active chip.
- Schibsted Grotesk at heavy weights for Latin; Noto Sans Balinese, always large, for aksara.
- Full dark theme via `[data-bs-theme="dark"]`, with the shell staying black in both themes.

## Colors

Four Balinese direction colours as flat fields, warm off-white neutrals, and one link blue.

### Primary
- **Bang Red** (bang-red): the aksara output pane, the primary call to action (Play Store / APK), checked form controls, the caret, the active nav underline in light mode, spinners. One red pane per screen; it is the place the script lives.
- **Bang Red Deep** (bang-red-deep): pressed and hover state on red surfaces (bench actions, red buttons) and the active state of the ink primary button.

### Secondary
- **Selem Black** (selem-black): the site header, footer, app band, strip buttons and the black third of the thread. It does not flip in dark mode; the shell is black in both themes.

### Tertiary
- **Kuning Turmeric** (kuning-turmeric): selection and activity only. The 3px underline on the checked mode and active pill, the 3px focus outline, the inset focus ring on the bench input, `::selection`, the chosen swatch outline, glyph-grid hits, the brand aksara in the header, the install strip. **Turmeric Pressed** (turmeric-pressed) is its button hover.

### Neutral
- **Putih Ground** (putih-ground): page background and the white third of the thread; also the text on black and the face of the primary bench action.
- **Surface** (surface) and **Surface 2** (surface-2): pure white for inputs, cards, panels and the Latin pane; Surface 2 for hover fills, alerts, offline strip, progress track.
- **Ink** (ink) and **Mute** (mute): body text and secondary text. Ink also fills the default primary button.
- **Line** (line): 1px dividers and component borders. The stronger frame (`--line-strong`) is ink, used at 2px around the workbench and on top of the tool list.
- **Shell Text / Shell Rule / Shell Ghost Border**: the muted text, dividers and ghost-button borders inside the black shell.
- **Link Blue** (link-blue): inline links only, hover shifts to the accent red.
- **Status**: ok, danger and warn each pair with a tint for alerts; warn-tint doubles as `--accent-tint`.

Dark theme swaps the neutrals to dark-ground, dark-surface, dark-surface-2, dark-ink, dark-mute, dark-line; red lifts to dark-red, the text accent to dark-accent, links to dark-link. On red surfaces, text is white at full strength, 78% for secondary counts and 28% for internal rules (`--red-soft`, `--red-rule`).

### Named Rules
**The Field Ownership Rule.** Each Nawa Sanga colour owns a region, not a decoration: red owns the script, black owns the shell, off-white owns the ground. Do not scatter red as small accents across a page that already has its red field.

**The One Signal Rule.** Turmeric means "selected, active or focused" and nothing else. If it is not a state, it is not turmeric (the brand aksara and install strip are the two shell exceptions).

**The Blue Is For Links Rule.** Link blue appears only on inline links and Bootstrap info roles. Buttons and chips never turn blue.

## Typography

**Display Font:** Schibsted Grotesk (with system-ui, Segoe UI, Roboto, sans-serif)
**Body Font:** Schibsted Grotesk
**Script Font:** Noto Sans Balinese (with serif), ligatures and contextual alternates on
**Mono Font:** Cascadia Code (with Consolas, SF Mono, Menlo), only for the build reference in the footer

**Character:** A sturdy grotesk set heavy and tight for headings, plain at 16px for reading, against a script face that is always given room and size. Latin explains; aksara is the exhibit.

### Hierarchy
- **Display** (800, fluid 2rem to 3.25rem, line-height 1.02, -0.03em): the one page title in the page head, max 18ch, text-wrap balance.
- **Headline** (800, fluid 1.5rem to 2.25rem, -0.025em): section titles below the workbench.
- **Title** (800, 20-22px, -0.02em): tool-row names, panel titles, app-band title.
- **Body** (400, 16px, line-height 1.6): running text; ledes in mute at 16px / 1.55, max 46ch (page lede) or 60ch (section lede).
- **Label** (700, 13px, 0.08em, uppercase): workbench pane labels only ("Latin", "Aksara Bali"); footer column heads use the same treatment at 12px / 0.1em.
- **Aksara output** (400, fluid 2rem to 3.5rem, line-height 1.9): the red output field. Aksara input is 1.75rem to 2.75rem / 1.8; inline aksara demos sit at 24-34px.
- **Latin input** (500, fluid 1.25rem to 1.75rem, line-height 1.4): text typed into the workbench, so the user's words read as large as the result.

### Named Rules
**The Script Is Large Rule.** Balinese glyphs in content sit at 20px or more (the shipped floor; demos and grids run 24-34px), and in the converter output they are the largest type on the page. The header wordmark, which drops to 17px on phones under 440px, is the one use below that floor. Placeholders and empty states fall back to 16px Latin.

**The Heavy Heading Rule.** All headings are Schibsted Grotesk 800 with negative tracking and balanced wrapping. There is no second display face.

## Layout

Content sits in a centred 1240px column with 24px side padding (16px under 640px). Every public page opens with a page head: display title left, one-line lede right, wrapping with a 16px / 48px gap and aligned to the baseline end. Below it comes the page's working surface.

On the home page that surface is the two-pane workbench: `minmax(0,1fr) 14px minmax(0,1fr)`, Latin left, red aksara right, thread seam between. Under 760px the panes stack and the seam turns horizontal (12px tall); the action row reflows into a 2-column grid. Below the bench, sections are separated by 56-72px; the footer begins 72px below content.

Spacing is set in literal pixel steps that recur across components: 6px (tool gaps), 12px (chip padding, small gaps), 20px (pane padding), 24px (grid gaps, page gutters), 40px (panel offset, footer columns), 72px (section breaks). The header and footer collapse at 860px: nav moves into a black drawer, footer grid goes from 1.6fr / 1fr / 1fr / 1fr to two columns. Tap targets reach 44px under 576px.

Glyph grids (keyboard, quiz cells, chart) use one fixed cell size per grid (48 x 52px in the home demo) with shared 1px hairlines.

## Elevation & Depth

The system is flat. There are no drop shadows; Bootstrap cards and alerts have `box-shadow: none`. Depth and grouping come from rules: 1px line borders for components, 2px ink frames for the workbench and the top of the tool list, and solid colour fields (black shell, red pane) that separate regions by colour rather than height.

`box-shadow` appears only as a drawn line: an inset 3px turmeric underline for active pills and expanded chips, an inset 3px turmeric ring on the focused bench input, and a 3px translucent turmeric halo on focused form fields. These are indicators, not elevation.

### Named Rules
**The Flat Field Rule.** No surface casts a shadow. If something needs separating, give it a rule or a field colour.

**The Drawn Line Rule.** Inset or halo shadows are allowed only as 3px turmeric state lines (active, expanded, focus).

## Shapes

Every corner is square (0 radius), enforced globally by zeroing Bootstrap's radius tokens and per component. Borders are 1px `line` at rest and shift to ink on hover; frames that bound a whole tool are 2px ink. The only patterned shape is the thread: a 115deg repeating stripe of red / off-white / black in 8px bands (28px tile) for horizontal uses, a 170deg 10px-band variant for the vertical seam. Swatches are 28px squares; the segmented control is a row of 40 x 36px square cells.

### Named Rules
**The Square Corner Rule.** Radius is 0 everywhere, including avatars, badges, modals, dropdowns, popovers and scrollbar thumbs.

## Components

### Buttons
Flat, square, confident; colour change on hover, a 1px press on active.
- **Shape:** square corners (0), weight 600, colour transitions at 150ms ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Primary:** ink fill with ground text; hover turns bang red with white text; active is bang red deep.
- **Red (success/danger roles and `cta--red`):** bang red fill, white text, hover deepens. The CTA variant is 46px tall, 18px horizontal padding, 700 weight, used for Play Store / APK.
- **Outline / light:** surface fill, line border, ink text; hover fills surface 2 and borders ink.
- **Ghost on black (`cta--ghost`, footer app links):** shell ghost border, off-white text; hover borders off-white.
- **Warning:** turmeric fill with black text.
- **Focus:** 3px turmeric outline with 2px offset, everywhere.

### Chips
- **Style (bench chips):** 38px tall, surface fill, 1px line border, 600 14px text with an icon.
- **State:** hover borders ink; expanded (`aria-expanded`) borders ink and gains an inset 3px turmeric underline; disabled drops to mute.

### Cards / Containers
- **Corner Style:** square.
- **Background:** surface.
- **Shadow Strategy:** none (see Elevation).
- **Border:** 1px line; card headers 700 weight over a 1px line.
- **Internal Padding:** 16-20px (panel head 16px 20px, panel body 20px).

### Inputs / Fields
- **Style:** surface fill, 1px line border, square, placeholder in mute.
- **Focus:** border turns ink plus a 3px turmeric halo (`0 0 0 3px rgba(226,164,28,0.45)`). Checkboxes, radios and ranges use bang red as accent.
- **Bench input:** borderless inside the bench frame; focus is an inset 3px turmeric ring.

### Navigation
- **Header:** sticky black bar, 60px, thread directly above. Brand is the aksara wordmark in turmeric (22px) beside "Aksara Bali" in 800 17px off-white. Nav links 500 15px in shell text; hover off-white; active is 700 off-white with a 3px bottom border in red (turmeric in dark mode). Tools (EN, theme) are 34px square-cornered outline buttons in 700 12px tracked caps; "Masuk" is an off-white block that turns turmeric on hover; the avatar is a red square (turmeric for admins).
- **Mobile (under 860px):** nav hides behind a burger; the drawer is black with 16px 600 links separated by dark rules, active and hover in turmeric.
- **Mode switch:** text tabs with a 3px bottom border; checked is ink text with a turmeric underline.
- **Footer:** black, four columns, thread on top; links in shell text turning turmeric on hover.

### Converter Workbench (signature)
A 2px ink-framed, two-pane tool. Each pane has a 52px label bar (uppercase label plus tabular-numeral count) over a 1px rule. The Latin pane is white; the script pane is a full bang red field with white text. A 14px vertical thread seam joins them and slides once (`threadPullV`, 0.5s ease-out) when output changes; new output fades from 0.35 to full opacity over 0.35s. Actions sit flush along the red pane's bottom edge as equal-width 52px cells divided by 28%-white rules: transparent with white text, hover bang red deep; the primary (Salin / Copy) is an off-white cell with red text. A small uppercase "flip" toggle swaps direction. Under the bench, a mode switch and a 13px mute note.

### Tool Rows
The home page's list of tools shown working: a 2px ink rule on top, then rows of `260px | demo | 140px` with 22px padding and 1px line dividers. Name in 800 22px, description in mute 15px, a live demo (aksara at 34px, a glyph cell grid with turmeric hits), and a "go" link that turns accent red on row hover while the row fills with surface. Collapses to a single column under 860px.

### App Band and Strips
The app band is a black field with an 800 22px title, shell-text copy, and red + ghost CTAs. The install strip is a turmeric field with a black button; the offline strip is surface 2, centred.

### Word Art Controls
Colour swatches are 28px squares with a 1px line border; the chosen one gets a 3px turmeric outline offset 2px. The segmented control is a 1px-bordered row of 40 x 36px cells; the active cell inverts to ink with ground-coloured icon.

### Coverage and Known Gaps
- The shared classes above (shell, page frame, workbench, tool rows, app band, strips, word art controls) live in `styles/globals.css`. Most inner pages (translate, practice, blog, dashboard, auth, FAQ, legal) still style their content with inline styles that point at the tokens instead of shared classes; a few of them keep leftover hex values (for example a `#8b8b9e` dark-mode mute in the Kamus page, amber callout colours in blog posts). Treat those as debt. They are not part of the system.
- The admin panel (`/admin`) is out of scope and still uses the previous look.
- The build differs from the original direction in two places, and the build is what this file records: the header bar is 60px (not 64px), and active tabs use a 3px solid underline (red or turmeric), not the thread.

## Do's and Don'ts

### Do:
- **Do** give the aksara its own bang red field and set it at the largest size on the screen.
- **Do** use the braided thread as the only ornament: top rule, footer rule, workbench seam, progress bar.
- **Do** mark every selected, active or focused state with turmeric (3px underline, 3px outline, or inset 3px ring).
- **Do** keep every corner at 0 and separate regions with 1px line rules or 2px ink frames.
- **Do** reference the tokens (`var(--surface)`, `var(--ink)`, `var(--line)`) instead of hex, so dark mode follows.
- **Do** keep motion at 150-200ms on `cubic-bezier(0.16, 1, 0.3, 1)` and let reduced-motion disable it.
- **Do** show tools working on real words instead of describing them in feature tiles.

### Don't:
- **Don't** add drop shadows, gradients (other than the thread), glass or grain.
- **Don't** round corners, including pills, avatars and badges.
- **Don't** use turmeric decoratively, or blue for anything except links.
- **Don't** build the converter as two equal grey boxes with a blue accent.
- **Don't** let the shell (header, footer, app band) follow the light theme; it stays selem black.
- **Don't** set Balinese glyphs in content below 20px or in any face other than Noto Sans Balinese.
