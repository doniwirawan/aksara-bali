# What This App Is About

**Aksara Bali Converter** is a web app for **learning and converting Balinese script** (Aksara Bali). You type in regular Latin letters (or Indonesian/Sanskrit words) and it transliterates them into traditional Balinese characters in real time. On top of the converter, it's a small learning platform with practice tools, a blog, and progress tracking.

🌐 Live: https://transliterasi-latin-ke-bahasa-bali.vercel.app

---

## The core idea

Balinese script is a centuries-old writing system (Unicode block U+1B00–U+1B7F) used for Balinese and Sanskrit. Most people can't read or write it anymore. This app makes it approachable by:

1. **Converting** Latin text → Aksara Bali instantly.
2. **Teaching** people to recognize and hand-write the characters.
3. **Preserving** cultural context through articles and a Sanskrit term database.

It's built for education and cultural preservation.

---

## What you can actually do in it

| Feature | What it does |
|---|---|
| **Converter** | Real-time Latin → Aksara Bali transliteration, with a 100+ Sanskrit term database (handles V=W, e.g. Vishnu = Wisnu). Copy, share, works offline. |
| **Quiz Mode** | Image-based "which character is this?" quizzes; scores saved to your account. |
| **Writing Canvas** | Draw characters with mouse, touch, **or hand gestures** (via your webcam + MediaPipe). It scores how close your drawing is to the real shape. |
| **Balinese Keyboard** | On-screen keyboard to compose Balinese text directly. |
| **Blog** | Bilingual (Indonesian + English) articles about the script's history and structure. |
| **Dashboard** | Personal learning stats — conversions done, quiz scores, writing history. |
| **FAQ** | Categorized Q&A about the script and the app. |
| **Admin panel** | Manage blog posts and FAQs, view usage stats and users (login-protected). |

Plus: installable as a **PWA**, **dark/light mode**, **bilingual UI**, and SEO setup.

---

## How it's built

- **Framework:** Next.js 15 (Pages Router), JavaScript/JSX
- **Database + Auth:** Supabase (PostgreSQL)
- **Hand gestures:** MediaPipe Hands
- **Blog photos:** Unsplash API
- **Script font:** Noto Sans Balinese
- **Hosting:** Vercel

The transliteration logic lives in `utils/balineseConverter.js`, and the Sanskrit term list in `public/data/sanskrit-database.json`. User data (quiz results, writing checks, conversions, blog, FAQ) is stored in Supabase tables defined in `supabase-schema.sql`.

---

*In one sentence: it's a Next.js + Supabase web app that converts Latin text to Balinese script and helps people learn to read and write Aksara Bali through quizzes, gesture-based writing practice, and an on-screen keyboard.*
