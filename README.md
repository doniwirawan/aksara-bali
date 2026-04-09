# Aksara Bali Converter

A full-featured web app for learning and converting Balinese script (Aksara Bali). Built with Next.js and Supabase.

🌐 **Live demo**: [transliterasi-latin-ke-bahasa-bali.vercel.app](https://transliterasi-latin-ke-bahasa-bali.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat&logo=supabase)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)

---

## Features

### ⚡ Latin → Aksara Bali Converter
- Real-time character-by-character transliteration
- 100+ Sanskrit term database with V=W equivalency (Vishnu = Wisnu)
- Auto-detect, Sanskrit-only, and Balinese-only modes
- Copy result, share link, and offline support

### 🎯 Practice — Quiz Mode
- Image-based recognition quizzes
- Score tracking saved to your account
- Progressive difficulty across all Balinese characters

### ✍️ Practice — Writing Canvas
- Draw Aksara Bali with mouse, touch screen, or **hand gestures** (MediaPipe)
- Shape-matching scoring: checks precision and coverage against a reference render
- Undo, clear, and check buttons; gesture controls (point = draw, palm = erase, pinch = lift)

### 🎹 Practice — Balinese Keyboard
- On-screen keyboard for composing Balinese text directly
- Aksara Wianjana, Pangangge, and punctuation tabs

### 📝 Blog
- Articles about Aksara Bali history, structure, and cultural context
- Managed via the admin dashboard, stored in Supabase
- Bilingual content (Indonesian + English), category filtering, related posts

### 📊 Learning Dashboard
- Personal stats: conversion count, quiz scores, writing practice history
- Tracks progress over time, requires login

### ❓ FAQ
- Categorized Q&A about Balinese script, app usage, and technical details
- Admin-managed via Supabase

### 🛡️ Admin Dashboard
- Manage blog posts (Markdown, bilingual, Unsplash photo picker)
- Manage FAQ items
- View aggregate usage stats and registered users
- Protected by Supabase JWT authentication

### Other
- **PWA**: Install as a native app, offline basic conversion works
- **Dark / Light mode**: Persisted to localStorage
- **Bilingual UI**: Indonesian and English
- **SEO**: Structured data, canonical URLs, Open Graph, sitemap

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (Pages Router) |
| Language | JavaScript (JSX) |
| Database / Auth | Supabase (PostgreSQL + Supabase Auth) |
| Hand Gesture | MediaPipe Hands (via CDN) |
| Photos | Unsplash API (with proper attribution + download tracking) |
| Font | Noto Sans Balinese (Google Fonts) |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone

```bash
git clone https://github.com/doniwirawan/aksara-bali.git
cd aksara-bali
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase-schema.sql` in the Supabase SQL Editor to create all tables
3. Enable **Email Auth** under Authentication → Providers
4. Register your admin email in Supabase Auth (Authentication → Users → Invite)

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (secret) |
| `NEXT_PUBLIC_ADMIN_EMAIL` | The email you registered as admin |
| `UNSPLASH_ACCESS_KEY` | [unsplash.com/developers](https://unsplash.com/developers) (optional) |
| `NEXT_PUBLIC_SITE_URL` | Your production URL |

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Schema

All tables are defined in `supabase-schema.sql`. Run it once in the Supabase SQL Editor.

| Table | Purpose |
|---|---|
| `blog_posts` | Blog articles (title, content, image, credit, published flag) |
| `faq_items` | FAQ entries by category |
| `quiz_results` | Per-user quiz attempt history |
| `writing_checks` | Per-user writing practice history |
| `conversions` | Aggregate conversion counter |

After adding Unsplash attribution support, also run:

```sql
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_credit TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_credit_url TEXT;
```

---

## Project Structure

```
aksara-bali/
├── components/
│   ├── LatinBalineseConverter.jsx   # Main converter UI
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── LanguageSwitcher.jsx
│   └── practice/
│       ├── QuizMode.jsx             # Quiz practice
│       ├── HandGestureCanvas.jsx    # Writing canvas + MediaPipe
│       └── BalineseKeyboard.jsx     # On-screen keyboard
├── context/
│   └── AuthContext.jsx              # Supabase auth session
├── pages/
│   ├── index.jsx                    # Landing page + converter
│   ├── practice.jsx                 # Practice hub (quiz/write/keyboard)
│   ├── blog/
│   │   ├── index.jsx                # Blog listing
│   │   └── [slug].jsx               # Blog article
│   ├── dashboard/index.jsx          # Learning dashboard
│   ├── faq.jsx                      # FAQ page
│   ├── admin/index.jsx              # Admin dashboard
│   ├── auth/
│   │   ├── login.jsx
│   │   └── register.jsx
│   └── api/
│       ├── blog-posts.js
│       ├── faq-items.js
│       ├── quiz-results.js
│       ├── writing-checks.js
│       ├── conversions.js
│       ├── unsplash-search.js       # Proxy + format Unsplash results
│       ├── unsplash-download.js     # Trigger Unsplash download event
│       └── admin-users.js
├── utils/
│   ├── balineseConverter.js         # Transliteration engine
│   ├── supabase.js                  # Supabase client helpers
│   └── practiceTranslations.js
├── public/
│   └── data/sanskrit-database.json  # 100+ Sanskrit terms
├── supabase-schema.sql
├── scripts/add-unsplash-attribution.sql
└── .env.example
```

---

## Deployment

This project is optimised for **Vercel**:

```bash
npm i -g vercel
vercel
```

Set all environment variables in the Vercel dashboard under **Settings → Environment Variables** before deploying to production.

---

## Unsplash Attribution

This app integrates with the Unsplash API following their [official guidelines](https://unsplash.com/api-terms):

- All images use hotlinked URLs from `photo.urls` properties
- Download events are triggered server-side via `/api/unsplash-download` when an admin selects a photo
- Every blog post hero image shows "Photo by [Name] on Unsplash" with UTM-tracked links back to the photographer's profile and the specific photo page

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes
4. Open a pull request

Please do not commit `.env.local` or any file containing real API keys or credentials.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Acknowledgements

- [Supabase](https://supabase.com) — database and authentication
- [MediaPipe](https://mediapipe.dev) — hand gesture recognition
- [Unsplash](https://unsplash.com) — photography
- [Google Fonts — Noto Sans Balinese](https://fonts.google.com/noto/specimen/Noto+Sans+Balinese) — script rendering
- [Unicode Consortium](https://www.unicode.org/charts/PDF/U1B00.pdf) — Balinese script standardisation (U+1B00–U+1B7F)
- Balinese cultural heritage community

---

*Built for educational purposes and cultural preservation of the Aksara Bali script tradition.*
