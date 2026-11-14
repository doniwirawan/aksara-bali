# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Indonesian, mostly Balinese, students, parents and teachers who arrive from Google searching "aksara Bali", "translate latin ke aksara Bali" and similar. They type a word, a name or a phrase, then copy or download the result for homework, a tattoo, a banner, an invitation or a ceremony. Many are on phones. (Confirmed by the user, 2026-11-14.)

## Product Purpose

Aksara Bali converts Latin text to Balinese script (Unicode U+1B00–U+1B7F) in real time, and back, and helps people learn to read and write the script. It exists for education and cultural preservation; success is a visitor leaving with correct script they can use, and some coming back to learn.

## Positioning

A free, bilingual (Indonesian/English) converter that also teaches: Sanskrit-aware conversion (100+ term database, V=W), a Balinese dictionary (Kamus), read-from-photo OCR, leveled quizzes, a writing canvas scored against the real glyph (mouse, touch or webcam hand gestures), an on-screen aksara keyboard, and a blog on the script and Balinese culture. Also ships as an Android app.

## Operating Context

Visitors land from search on the converter (home), a blog post, or the Kamus. They type, copy, download or listen. Downloads (image/APK) ask for an email first; collected addresses feed the Play tester list. Accounts are optional and store quiz/writing/conversion history on a dashboard. Live at aksarabali.doniwirawan.xyz (Vercel, deploys from master). PWA with service worker.

## Capabilities and Constraints

- Next.js 15 pages router, React 19, Bootstrap 5, lucide-react icons, Supabase auth/data, Tesseract.js OCR, driver.js tours.
- UI is bilingual ID/EN via a locale toggle; dark/light mode toggle. Both must keep working.
- Balinese glyphs render with Noto Sans Balinese.
- Existing copy, headings and meta text carry SEO rankings and stay unless the user approves a change.
- Admin panel (/admin) is out of scope for the redesign.
- Converter tokenizer has known, deliberately unfixed gaps (nga/f/vowel runs/pepet).

## Brand Commitments

- Name: "Aksara Bali" (Converter). App icon at public/icons/ (favicon, PWA, Play listing).
- Footer keeps: AI-disclosure note, credit to bennylin's transliterasijawa, MIT notice, Ko-fi, GitHub, Play Store and APK links, version/build ref.

## Evidence on Hand

- 30+ blog posts with generated covers in public/covers/.
- Kamus data public/data/kamus-bali.json; Sanskrit DB public/data/sanskrit-database.json.
- No testimonials, user counts or press exist; do not invent them.

## Product Principles

1. The converter is the front door: a visitor should be typing within a second of landing.
2. The script is the hero; Latin UI serves it.
3. Correctness over flourish: say plainly when output should be checked with a teacher or native speaker.
4. Free and approachable for a 12-year-old on a cheap phone.

## Accessibility & Inclusion

Mobile-first, low-end Android phones on mobile data; Indonesian is the default language.
