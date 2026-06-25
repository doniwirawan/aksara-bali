import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const slug = 'aplikasi-android-aksara-bali-rilis-baru'

const content = `
## Aplikasi Android Aksara Bali Kini Lebih Lengkap

Kabar gembira bagi para pencinta aksara Bali! Aplikasi **Aksara Bali** untuk Android kini hadir dengan versi terbaru (v1.1.0) yang membawa banyak fitur baru. Aplikasi ini memungkinkan Anda mengonversi tulisan Latin ke aksara Bali, berlatih, dan belajar — sepenuhnya **bekerja secara offline** langsung di ponsel Anda.

Anda bisa mengunduh APK terbaru secara gratis melalui halaman rilis resmi di GitHub.

## Apa yang Baru di Versi Ini

Versi terbaru ini merupakan pembaruan besar dengan banyak penyempurnaan:

- **Kuis berjenjang** — Mode kuis kini memiliki tingkat kesulitan bertingkat, target streak harian, dan lebih banyak pencapaian (achievement) untuk menjaga semangat belajar Anda.
- **Dengarkan pelafalan aksara** — Ketuk sebuah aksara untuk mendengar cara membacanya, menggunakan text-to-speech langsung di perangkat (tanpa internet).
- **Konverter dengan gaya word-art** — Hasil konversi kini bisa ditampilkan sebagai karya seni huruf dan diunduh sebagai gambar PNG transparan.
- **Konversi ramah kalimat & paragraf** — Mendukung teks panjang, bukan hanya kata per kata.
- **Tema terang & gelap** — Desain hangat bernuansa lontar dan emas dengan dukungan mode gelap (Material 3).
- **Keyboard aksara Bali** — Ketik langsung dalam aksara Bali dengan input balik (reverse input).
- **Referensi aksara lengkap** — Tab referensi untuk mempelajari setiap aksara, lengkap dengan latihan menulis.

## Fitur Utama Aplikasi

| Fitur | Keterangan |
|-------|-----------|
| Konverter dua arah | Latin → Aksara Bali dan sebaliknya, sepenuhnya di perangkat |
| Kuis & latihan | Pilihan ganda berjenjang dengan skor per mode |
| Referensi (Learn) | Pelajari aksara dasar, pangangge, hingga gantungan |
| Pelafalan | Ketuk aksara untuk mendengar bunyinya (TTS on-device) |
| Font bawaan | Noto Sans Balinese dibundel — tampil sempurna tanpa instalasi font |
| Offline penuh | Tidak perlu koneksi internet untuk fitur inti |

## Cara Mengunduh dan Memasang

1. Buka halaman **rilis** aplikasi di GitHub dan unduh berkas APK terbaru.
2. Di ponsel Anda, aktifkan opsi **"Instal aplikasi tak dikenal"** (Install unknown apps) untuk peramban atau pengelola berkas yang Anda gunakan.
3. Buka berkas APK yang sudah diunduh, lalu ketuk **Pasang** (Install).
4. Setelah terpasang, buka aplikasi dan mulai mengonversi serta belajar aksara Bali!

> Catatan: Build ini ditandatangani dengan kunci debug untuk distribusi sideload. Versi yang dirilis melalui Google Play Store nantinya akan ditandatangani oleh Play.

## Mengapa Menggunakan Aplikasi Ini?

Aplikasi Aksara Bali dibuat sebagai bagian dari upaya pelestarian aksara Bali di era digital. Dengan bekerja sepenuhnya offline, aplikasi ini cocok digunakan di mana saja — di kelas, di pura, atau saat bepergian — tanpa khawatir akan koneksi internet. Baik Anda seorang pelajar, guru, maupun siapa pun yang ingin mendekatkan diri dengan warisan budaya Bali, aplikasi ini adalah teman belajar yang praktis.

Selamat mencoba, dan mari bersama-sama melestarikan aksara Bali!
`.trim()

const contentEn = `
## The Aksara Bali Android App Just Got Bigger

Great news for Balinese script enthusiasts! The **Aksara Bali** Android app now ships in its newest version (v1.1.0), packed with new features. The app lets you convert Latin text into Balinese script, practice, and learn — all working **fully offline**, right on your phone.

You can download the latest APK for free from the official releases page on GitHub.

## What's New in This Version

This release is a major update with many improvements:

- **Leveled quizzes** — Quiz mode now has tiered difficulty, daily streak targets, and more achievements to keep you motivated.
- **Hear letter pronunciation** — Tap a letter to hear how it's read, using on-device text-to-speech (no internet needed).
- **Word-art converter styling** — Conversion results can be displayed as letter art and downloaded as a transparent PNG image.
- **Sentence & paragraph friendly** — Handles long text, not just single words.
- **Light & dark themes** — A warm lontar-and-gold design with dark mode support (Material 3).
- **Balinese keyboard** — Type directly in Balinese script with reverse input.
- **Full script reference** — A reference tab to study each letter, complete with writing practice.

## Key App Features

| Feature | Description |
|---------|-------------|
| Two-way converter | Latin → Balinese script and back, fully on-device |
| Quiz & practice | Leveled multiple-choice with per-mode scoring |
| Reference (Learn) | Learn base letters, vowel signs, and conjuncts |
| Pronunciation | Tap a letter to hear it (on-device TTS) |
| Bundled font | Noto Sans Balinese included — renders perfectly with no font install |
| Fully offline | No internet required for core features |

## How to Download and Install

1. Open the app's **releases** page on GitHub and download the latest APK file.
2. On your phone, enable **"Install unknown apps"** for the browser or file manager you're using.
3. Open the downloaded APK file and tap **Install**.
4. Once installed, open the app and start converting and learning Balinese script!

> Note: This build is debug-signed for sideload distribution. A future Google Play Store release will be Play-signed.

## Why Use This App?

The Aksara Bali app was built as part of an effort to preserve Balinese script in the digital age. Because it works fully offline, it's perfect to use anywhere — in class, at a temple, or while traveling — with no worry about connectivity. Whether you're a student, a teacher, or simply someone who wants to connect with Bali's cultural heritage, this app is a practical study companion.

Enjoy, and let's preserve Balinese script together!
`.trim()

const post = {
  slug,
  title: 'Aplikasi Android Aksara Bali Versi Baru: Konverter, Kuis & Belajar Offline',
  title_en: 'New Aksara Bali Android App: Converter, Quizzes & Offline Learning',
  excerpt: 'Aplikasi Aksara Bali untuk Android hadir dengan versi terbaru — kuis berjenjang, pelafalan aksara, konverter gaya word-art, dan belajar sepenuhnya offline. Unduh APK-nya gratis.',
  excerpt_en: 'The Aksara Bali Android app is here in its newest version — leveled quizzes, letter pronunciation, word-art converter, and fully offline learning. Download the APK for free.',
  content,
  content_en: contentEn,
  category: 'Teknologi & Budaya',
  tags: ['aplikasi android', 'apk', 'aksara bali', 'rilis', 'offline'],
  image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
  published: true,
  author: 'Doni Wirawan',
  read_time: '4 menit',
}

const { data: existing } = await supabase.from('blog_posts').select('id').eq('slug', slug).maybeSingle()

let result
if (existing) {
  result = await supabase.from('blog_posts')
    .update({ ...post, updated_at: new Date().toISOString() })
    .eq('id', existing.id).select().single()
  console.log('Updated existing post:', result.error || result.data.slug)
} else {
  result = await supabase.from('blog_posts').insert([post]).select().single()
  console.log('Inserted new post:', result.error || result.data.slug)
}
