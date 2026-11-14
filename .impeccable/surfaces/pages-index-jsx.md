---
version: 1
slug: "pages-index-jsx"
primary_target: "pages/index.jsx"
related_targets: ["components/Navbar.jsx","components/Footer.jsx"]
---

# Surface brief: site shell + converter home (whole public site)

Scope: all public pages (/, /translate, /practice, /read, /blog, /blog/[slug], /faq, /auth/*, /dashboard, /privacy, /terms) plus shared Navbar/Footer. Admin out of scope.
Visitor mode: Operate (converter, Kamus, Latihan, dashboard); Read (blog, FAQ, legal) inherits the same world.
Audience/job: Balinese students, parents, teachers from search; type a word or name, copy/download aksara.
Constraints: keep all copy, SEO meta, ID/EN toggle, dark mode, email gate, tours, analytics data-track attributes.

## Direction contract

THESIS: The aksara is bound to Latin by the tridatu thread (red, white, black) every Balinese wrist wears. Refuses the translator-clone default of two equal grey boxes with a blue accent.

OWN-WORLD: Nawa Sanga colours as flat, unmodulated fields: bang red #B4232B owns the aksara output field; selem black #17140F owns the top bar and footer; putih white #F7F6F2 is the ground; kuning turmeric #E2A41C marks selection/active mode; a blue #2B5C9E for links only. Square corners, 1-2px black rules, no shadows, gradients, glass or grain. Latin in Schibsted Grotesk; script in Noto Sans Balinese, always set large. Glyph grids (keyboard, chart, quiz) use one fixed cell size.

STORY: Visitor lands, sees their words become aksara at once on a red field, copies or downloads, then notices Kamus/Latihan shown working on real words and keeps learning.

FIRST VIEWPORT: 6px braided tridatu rule at very top; black 64px bar (aksara wordmark in turmeric + "Aksara Bali", nav, EN, theme, Masuk). Short H1 left with one-line lede right. Below, a bordered two-pane workbench: white Latin input left, red aksara output right, joined by a vertical braided seam; actions (Salin primary in white-on-red, Unduh, Dengar, Bagikan) as a flat button row on the red field's bottom edge. Mode switch under with turmeric underline. Mobile: panes stack, seam turns horizontal.

FORM: Tridatu (Nawa Sanga colour system), position 3 of my ordered grounded list; seed:2d03d01a1288acb0. Raises: flat colour fields own regions (from Guide Map); fixed glyph cell grid (from Split-flap); tools shown working, no feature-tile grid (from Monochrome Product).

SIGNATURE MOVE: the braided tridatu thread as seam between Latin and aksara, under the header, as active-tab and progress indicator; it slides (background-position) briefly when the output changes. Motion grammar: 150-200ms ease-out, reduced-motion disables.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
