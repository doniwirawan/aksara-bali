import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Batch 4: consonant clusters (the reference gap our chart post only gestured
// at), ready-to-copy script blocks, and the language-vs-script question behind
// "translate bahasa Indonesia ke bahasa Bali".
//
// Every Balinese example was produced with utils/balineseConverter.js and
// checked against the known tokenizer gaps — words containing nga/ngi/nge
// mid-word, an "f", or two adjacent vowels are deliberately avoided.

const COVERS = 'https://transliterasi-latin-ke-bahasa-bali.vercel.app/covers/'

const posts = [
  {
    slug: 'gantungan-gempelan-aksara-bali',
    title: 'Gantungan dan Gempelan: Cara Menulis Gugus Konsonan dalam Aksara Bali',
    title_en: 'Gantungan and Gempelan: Writing Consonant Clusters in Balinese Script',
    excerpt: 'Kenapa aksara Bali menggantung konsonan kedua di bawah yang pertama, kapan memakai adeg-adeg, dan bagaimana gugus konsonan ditulis pada teks digital.',
    excerpt_en: 'Why Balinese script hangs the second consonant beneath the first, when adeg-adeg is used instead, and how clusters are encoded in digital text.',
    category: 'Panduan Belajar',
    tags: ['gantungan', 'gempelan', 'gugus konsonan', 'adeg-adeg', 'belajar aksara bali'],
    image_url: COVERS + 'gantungan-gempelan-aksara-bali.png',
    read_time: '7 menit',
    content: `
## Masalah yang Diselesaikan Gantungan

Setiap aksara Bali sudah membawa vokal /a/ di dalamnya. ᬓ dibaca "ka", ᬲ dibaca "sa". Lalu bagaimana menulis kata seperti "suksma", yang punya dua konsonan berdempetan tanpa vokal di antaranya?

Jawabannya: konsonan kedua tidak ditulis dalam bentuk penuh. Ia menyusut menjadi bentuk kecil yang **digantung di bawah** aksara pertama. Bentuk itulah yang disebut **gantungan**.

| Kalau ditulis penuh | Yang benar | Kata |
|--------------------|-----------|------|
| ᬲᬸ + ᬓ + ᬲ + ᬫ | ᬲᬸᬓ᭄ᬲ᭄ᬫ | suksma |
| ᬩ + ᬦ + ᬚ + ᬭ | ᬩᬦ᭄ᬚᬭ᭄ | banjar |

Tanpa gantungan, "suksma" akan terbaca "sukasama" — tiga suku kata tambahan yang tidak ada dalam kata aslinya.

## Gantungan dan Gempelan

Keduanya menjalankan tugas yang sama — menempelkan konsonan kedua pada yang pertama — hanya berbeda letak:

- **Gantungan** — bentuk kecil aksara digantung tepat **di bawah** aksara pertama
- **Gempelan** — bentuk kecilnya menempel **di sisi** aksara pertama, dipakai oleh sebagian aksara yang bentuknya tidak memungkinkan digantung rapi di bawah

Anda tidak perlu menghafal aksara mana memakai yang mana: font aksara Bali menentukannya sendiri saat menampilkan teks. Yang perlu Anda tahu adalah kapan sebuah konsonan harus kehilangan vokalnya.

## Adeg-adeg: Saudara Dekat Gantungan

Adeg-adeg (᭄) juga menghilangkan vokal bawaan sebuah aksara. Bedanya terletak pada posisi:

| Situasi | Yang dipakai | Contoh |
|---------|-------------|--------|
| Konsonan di akhir kata | adeg-adeg | ᬯᬬᬦ᭄ (wayan) |
| Konsonan bertemu konsonan di tengah kata | gantungan / gempelan | ᬩᬦ᭄ᬚᬭ᭄ (banjar) |

Dalam tulisan tangan tradisional, memakai adeg-adeg di tengah kata dianggap kurang rapi — di situlah gantungan berperan.

## Bagaimana Teks Digital Menuliskannya

Ada satu hal teknis yang sering membingungkan saat orang membandingkan tulisan tangan dengan teks komputer: **dalam Unicode, gantungan tidak punya karakter tersendiri.**

Yang tersimpan sebenarnya adalah "konsonan + adeg-adeg + konsonan". Fontlah yang membaca urutan itu dan menggambarkannya sebagai bentuk gantungan. Jadi ketika Anda menyalin ᬩᬦ᭄ᬚᬭ᭄ dan membongkar isinya, Anda akan menemukan tanda adeg-adeg di tengah kata — padahal yang tampil di layar adalah ja yang tergantung di bawah na.

Karena itu, hasil dari <a href="/">konverter aksara Bali</a> sudah benar meskipun Anda melihat adeg-adeg di tengah kata. Yang penting adalah bagaimana teks itu **tampil** ketika font aksara Bali tersedia.

## Contoh Kata Bergugus

| Latin | Aksara Bali | Gugus |
|-------|------------|-------|
| banjar | ᬩᬦ᭄ᬚᬭ᭄ | n + ja |
| suksma | ᬲᬸᬓ᭄ᬲ᭄ᬫ | k + sa, s + ma |
| karya | ᬓᬭ᭄ᬬ | r + ya |
| warga | ᬯᬭ᭄ᬕ | r + ga |
| bakti | ᬩᬓ᭄ᬢᬶ | k + ta |
| sakti | ᬲᬓ᭄ᬢᬶ | k + ta |
| krama | ᬓ᭄ᬭᬫ | k + ra |
| tri | ᬢ᭄ᬭᬶ | t + ra |
| putra | ᬧᬸᬢ᭄ᬭ | t + ra |
| sastra | ᬲᬲ᭄ᬢ᭄ᬭ | s + ta, t + ra |
| swasti | ᬲ᭄ᬯᬲ᭄ᬢᬶ | s + wa, s + ta |
| margi | ᬫᬭ᭄ᬕᬶ | r + ga |

Perhatikan "sastra" dan "swasti": sebuah kata bisa memuat lebih dari satu gugus, dan gugusnya bisa muncul di awal kata, bukan hanya di tengah.

## Tiga Aturan Praktis

1. **Tulis sesuai bunyi.** Kalau tidak ada vokal yang Anda ucapkan di antara dua konsonan, di situlah gugus terbentuk. "Bakti" punya gugus; "bakati" tidak.
2. **Jangan menyisipkan spasi di dalam kata.** Spasi memutus gugus dan mengubah bacaannya.
3. **Periksa tampilannya, bukan kodenya.** Kalau font aksara Bali sudah terpasang dan bentuk gantungannya muncul, tulisan Anda benar.

## Kesalahan yang Sering Terjadi

- **Mengetik vokal yang tidak diucapkan.** "Suksama" dan "suksma" menghasilkan tulisan yang berbeda; ucapkan pelan-pelan untuk memastikan.
- **Menganggap adeg-adeg di tengah kata sebagai kesalahan.** Itu justru cara Unicode menyimpan gantungan.
- **Melihat kotak-kotak dan mengira konversinya gagal.** Kotak (□□□) berarti font belum terpasang — lihat <a href="/blog/cara-instal-font-aksara-bali">panduan instal font</a>.
- **Menyalin ke aplikasi yang tidak mendukung penggabungan huruf.** Sebagian aplikasi lama menampilkan aksara secara terpisah tanpa membentuk gantungan. Untuk keperluan desain, ekspor sebagai gambar PNG dari konverter.

## Cara Melatihnya

Gugus konsonan adalah bagian aksara Bali yang paling menuntut latihan tangan. Dua cara yang membantu:

1. **Kanvas menulis** di <a href="/practice">halaman latihan</a> — gambar bentuk gantungannya sendiri, lalu bandingkan dengan hasil konverter.
2. **Papan ketik aksara Bali** di halaman yang sama — susun gugusnya aksara demi aksara supaya Anda melihat bagaimana tiap bagian bergabung.

Untuk rujukan bentuk dasar setiap aksara, simpan <a href="/blog/daftar-lengkap-aksara-bali">daftar lengkap aksara Bali</a>. Untuk memahami tanda vokal yang menyertainya, ada artikel <a href="/blog/pangangge-tanda-vokal-aksara-bali">pangangge</a>.

## Pertanyaan Singkat

**Apakah konverter menangani gugus secara otomatis?** Ya. Ketik "banjar" di <a href="/">konverter</a> dan gantungannya terbentuk sendiri.

**Kenapa hasil salinan saya terlihat terpisah-pisah?** Aplikasi tujuan mungkin tidak menerapkan penggabungan aksara. Coba aplikasi lain, atau kirim sebagai gambar.

**Apakah gantungan dipakai untuk semua konsonan?** Semua konsonan bisa membentuk gugus, tetapi bentuk kecilnya berbeda-beda — sebagian tergantung di bawah, sebagian menempel di sisi.
`.trim(),
    content_en: `
## The Problem Gantungan Solves

Every Balinese letter carries an /a/ vowel inside it. ᬓ reads "ka", ᬲ reads "sa". So how do you write a word like "suksma", where two consonants meet with no vowel between them?

The answer: the second consonant is not written in full. It shrinks into a small form that **hangs beneath** the first letter. That form is called **gantungan**.

| If written in full | Correct | Word |
|-------------------|---------|------|
| ᬲᬸ + ᬓ + ᬲ + ᬫ | ᬲᬸᬓ᭄ᬲ᭄ᬫ | suksma |
| ᬩ + ᬦ + ᬚ + ᬭ | ᬩᬦ᭄ᬚᬭ᭄ | banjar |

Without gantungan, "suksma" would read "sukasama" — three syllables that are not in the word at all.

## Gantungan and Gempelan

Both do the same job — attaching the second consonant to the first — and differ only in placement:

- **Gantungan** — the small form hangs directly **below** the first letter
- **Gempelan** — the small form attaches **to the side**, used by letters whose shape does not sit neatly underneath

You do not need to memorise which letter takes which: the Balinese font decides when rendering. What you need to know is when a consonant should lose its vowel.

## Adeg-adeg: Gantungan's Close Relative

Adeg-adeg (᭄) also removes a letter's inherent vowel. The difference is position:

| Situation | What is used | Example |
|-----------|-------------|---------|
| Consonant at the end of a word | adeg-adeg | ᬯᬬᬦ᭄ (wayan) |
| Consonant meeting consonant mid-word | gantungan / gempelan | ᬩᬦ᭄ᬚᬭ᭄ (banjar) |

In traditional handwriting, using adeg-adeg inside a word is considered untidy — that is what gantungan is for.

## How Digital Text Stores It

One technical point trips people up when comparing handwriting with computer text: **Unicode has no separate character for gantungan.**

What is actually stored is "consonant + adeg-adeg + consonant". The font reads that sequence and draws it as a hanging form. So if you copy ᬩᬦ᭄ᬚᬭ᭄ and inspect it, you will find an adeg-adeg in the middle of the word — even though what appears on screen is a ja hanging below a na.

That is why output from the <a href="/">Balinese script converter</a> is correct even when you see a mid-word adeg-adeg. What matters is how the text **renders** once a Balinese font is available.

## Cluster Examples

| Latin | Balinese script | Cluster |
|-------|----------------|---------|
| banjar | ᬩᬦ᭄ᬚᬭ᭄ | n + ja |
| suksma | ᬲᬸᬓ᭄ᬲ᭄ᬫ | k + sa, s + ma |
| karya | ᬓᬭ᭄ᬬ | r + ya |
| warga | ᬯᬭ᭄ᬕ | r + ga |
| bakti | ᬩᬓ᭄ᬢᬶ | k + ta |
| sakti | ᬲᬓ᭄ᬢᬶ | k + ta |
| krama | ᬓ᭄ᬭᬫ | k + ra |
| tri | ᬢ᭄ᬭᬶ | t + ra |
| putra | ᬧᬸᬢ᭄ᬭ | t + ra |
| sastra | ᬲᬲ᭄ᬢ᭄ᬭ | s + ta, t + ra |
| swasti | ᬲ᭄ᬯᬲ᭄ᬢᬶ | s + wa, s + ta |
| margi | ᬫᬭ᭄ᬕᬶ | r + ga |

Note "sastra" and "swasti": a word can hold more than one cluster, and clusters can open a word rather than only sit inside it.

## Three Practical Rules

1. **Write by sound.** If there is no vowel you actually pronounce between two consonants, that is where a cluster forms. "Bakti" has one; "bakati" does not.
2. **Never put a space inside a word.** A space breaks the cluster and changes the reading.
3. **Judge the rendering, not the code points.** If a Balinese font is installed and the hanging form appears, your text is right.

## Common Mistakes

- **Typing vowels you do not say.** "Suksama" and "suksma" produce different script; say it slowly to be sure.
- **Treating mid-word adeg-adeg as an error.** That is exactly how Unicode stores gantungan.
- **Seeing boxes and assuming conversion failed.** Boxes (□□□) mean no font — see the <a href="/blog/cara-instal-font-aksara-bali">font installation guide</a>.
- **Pasting into apps that do not shape text.** Some older apps show letters separately without forming gantungan. For design work, export a PNG from the converter instead.

## How to Practise

Consonant clusters are the part of Balinese script that most rewards hand practice. Two things help:

1. **The writing canvas** on the <a href="/practice">practice page</a> — draw the hanging forms yourself, then compare against converter output.
2. **The Balinese keyboard** on the same page — assemble clusters letter by letter so you can see how the parts combine.

For the base shape of every letter, keep the <a href="/blog/daftar-lengkap-aksara-bali">complete Balinese script chart</a> handy. For the vowel signs that go with them, see the <a href="/blog/pangangge-tanda-vokal-aksara-bali">pangangge article</a>.

## Quick Questions

**Does the converter handle clusters automatically?** Yes. Type "banjar" into the <a href="/">converter</a> and the gantungan forms itself.

**Why does my pasted text look separated?** The destination app may not apply script shaping. Try another app, or send it as an image.

**Do all consonants use gantungan?** All consonants can form clusters, but their small forms differ — some hang below, some attach to the side.
`.trim(),
  },

  {
    slug: 'copy-paste-aksara-bali',
    title: 'Copy Paste Aksara Bali: Kumpulan Teks Siap Salin',
    title_en: 'Copy and Paste Balinese Script: Ready-to-Use Text Blocks',
    excerpt: 'Kumpulan aksara Bali siap salin — salam, kata umum, aksara dasar, angka, dan tanda baca — plus cara menempelkannya ke WhatsApp, Instagram, dan aplikasi desain.',
    excerpt_en: 'Ready-to-copy Balinese script — greetings, common words, base letters, numerals, and punctuation — plus how to paste it into WhatsApp, Instagram, and design apps.',
    category: 'Teknologi & Budaya',
    tags: ['copy paste aksara bali', 'aksara bali siap salin', 'unicode', 'aksara bali online'],
    image_url: COVERS + 'copy-paste-aksara-bali.png',
    read_time: '5 menit',
    content: `
## Aksara Bali Siap Salin

Semua aksara di halaman ini adalah **teks Unicode**, bukan gambar. Sorot, salin, lalu tempel ke mana pun Anda butuhkan — bio Instagram, caption, dokumen, undangan, atau berkas desain.

Kalau kata yang Anda cari tidak ada di sini, buat sendiri lewat <a href="/">konverter aksara Bali</a>: ketik dalam huruf Latin, hasil aksaranya muncul seketika dan bisa langsung disalin.

## Salam dan Ucapan

| Bahasa Bali | Arti | Aksara — siap salin |
|------------|------|--------------------|
| om swastyastu | salam pembuka | ᬑᬫ᭄​ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ |
| om shanti shanti shanti om | salam penutup | ᬑᬫ᭄​ᬰᬦ᭄ᬢᬶ​ᬰᬦ᭄ᬢᬶ​ᬰᬦ᭄ᬢᬶ​ᬑᬫ᭄ |
| rahajeng semeng | selamat pagi | ᬭᬳᬚᬾᬂ​ᬲᬾᬫᬾᬂ |
| rahajeng rauh | selamat datang | ᬭᬳᬚᬾᬂ​ᬭᬉᬳ᭄ |
| rahajeng nyepi | selamat hari Nyepi | ᬭᬳᬚᬾᬂ​ᬦ᭄ᬬᬾᬧᬶ |
| matur suksma | terima kasih | ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ |
| sami sami | sama-sama | ᬲᬫᬶ​ᬲᬫᬶ |
| ampura | mohon maaf | ᬅᬫ᭄ᬧᬸᬭ |
| dumogi rahayu | semoga selamat | ᬤᬸᬫᭀᬕᬶ​ᬭᬳᬬᬸ |

## Kata Umum

| Bahasa Bali | Arti | Aksara — siap salin |
|------------|------|--------------------|
| bali | Bali | ᬩᬮᬶ |
| pura | pura | ᬧᬸᬭ |
| umah | rumah | ᬉᬫᬳ᭄ |
| desa | desa | ᬤᬾᬲ |
| banjar | banjar | ᬩᬦ᭄ᬚᬭ᭄ |
| toya | air | ᬢᭀᬬ |
| sekar | bunga | ᬲᬾᬓᬭ᭄ |
| gunung | gunung | ᬕᬸᬦᬸᬂ |
| pasih | laut | ᬧᬲᬶᬳ᭄ |
| bulan | bulan | ᬩᬸᬮᬦ᭄ |
| guru | guru | ᬕᬸᬭᬸ |
| buku | buku | ᬩᬸᬓᬸ |
| melajah | belajar | ᬫᬾᬮᬚᬳ᭄ |
| tresna | cinta | ᬢ᭄ᬭᬾᬲ᭄ᬦ |

## 18 Aksara Dasar

Untuk disalin satu per satu:

| Aksara | Latin | Aksara | Latin |
|--------|-------|--------|-------|
| ᬳ | ha | ᬫ | ma |
| ᬦ | na | ᬕ | ga |
| ᬘ | ca | ᬩ | ba |
| ᬭ | ra | ᬗ | nga |
| ᬓ | ka | ᬧ | pa |
| ᬤ | da | ᬚ | ja |
| ᬢ | ta | ᬬ | ya |
| ᬲ | sa | ᬜ | nya |
| ᬯ | wa | | |
| ᬮ | la | | |

Baris lengkapnya: ᬳ ᬦ ᬘ ᬭ ᬓ ᬤ ᬢ ᬲ ᬯ ᬮ ᬫ ᬕ ᬩ ᬗ ᬧ ᬚ ᬬ ᬜ

## Angka Bali

| Angka | Aksara | Angka | Aksara |
|-------|--------|-------|--------|
| 0 | ᭐ | 5 | ᭕ |
| 1 | ᭑ | 6 | ᭖ |
| 2 | ᭒ | 7 | ᭗ |
| 3 | ᭓ | 8 | ᭘ |
| 4 | ᭔ | 9 | ᭙ |

Deret lengkap: ᭐ ᭑ ᭒ ᭓ ᭔ ᭕ ᭖ ᭗ ᭘ ᭙

## Tanda Baca dan Hiasan

| Tanda | Nama | Fungsi |
|-------|------|--------|
| ᭚ | panti | pembuka teks |
| ᭛ | pamada | pembuka bagian |
| ᭜ | windu | penanda bulat |
| ᭞ | carik siki | pemisah bagian kalimat |
| ᭟ | carik pareren | penanda akhir kalimat |

## Ke Mana Hasilnya Bisa Ditempel

- **WhatsApp dan Telegram** — umumnya tampil normal di Android modern dan iOS
- **Instagram, TikTok, X** — bergantung pada font aplikasi; untuk tampilan yang pasti, pakai gambar
- **Word, Google Docs, Notion** — tampil selama font aksara Bali tersedia di perangkat
- **Canva, Photoshop, Figma** — perlu memasang font aksara Bali seperti Noto Sans Balinese lebih dulu

## Kalau Hasil Tempelan Jadi Kotak-kotak

Kotak kecil (□□□) berarti teksnya sudah benar, tetapi perangkat atau aplikasi tujuan tidak punya font aksara Bali untuk menggambarnya. Dua jalan keluar:

1. Pasang fontnya — ikuti <a href="/blog/cara-instal-font-aksara-bali">panduan instal font aksara Bali</a>.
2. Kirim sebagai gambar — konverter bisa mengekspor hasilnya sebagai PNG berlatar transparan, dan gambar tampil sama di semua perangkat.

## Membuat Teks Anda Sendiri

Daftar di atas hanya titik awal. Untuk kata, nama, atau kalimat apa pun:

1. Buka <a href="/">konverter aksara Bali</a>
2. Ketik teks Latin sesuai bunyinya
3. Tekan **Salin**, lalu tempel

Untuk menulis nama, ada panduannya di <a href="/blog/nama-dalam-aksara-bali">menulis nama dalam aksara Bali</a>. Untuk memahami tanda-tanda yang muncul, simpan <a href="/blog/daftar-lengkap-aksara-bali">daftar lengkap aksara Bali</a>.

## Sebelum Dipakai untuk Sesuatu yang Permanen

Teks siap salin memudahkan, tetapi tetap perlu diperiksa sebelum dicetak di undangan, spanduk, atau apalagi ditato. Satu tanda vokal yang keliru sudah cukup untuk mengubah arti sebuah kata. Untuk teks upacara, mintalah pemeriksaan dari guru bahasa Bali atau penutur asli.
`.trim(),
    content_en: `
## Ready-to-Copy Balinese Script

Everything on this page is **Unicode text**, not images. Select it, copy it, and paste it wherever you need — an Instagram bio, a caption, a document, an invitation, a design file.

If the word you want is not here, make it yourself with the <a href="/">Balinese script converter</a>: type in Latin letters and the script appears instantly, ready to copy.

## Greetings

| Balinese | Meaning | Script — ready to copy |
|----------|---------|-----------------------|
| om swastyastu | opening greeting | ᬑᬫ᭄​ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ |
| om shanti shanti shanti om | closing greeting | ᬑᬫ᭄​ᬰᬦ᭄ᬢᬶ​ᬰᬦ᭄ᬢᬶ​ᬰᬦ᭄ᬢᬶ​ᬑᬫ᭄ |
| rahajeng semeng | good morning | ᬭᬳᬚᬾᬂ​ᬲᬾᬫᬾᬂ |
| rahajeng rauh | welcome | ᬭᬳᬚᬾᬂ​ᬭᬉᬳ᭄ |
| rahajeng nyepi | happy Nyepi | ᬭᬳᬚᬾᬂ​ᬦ᭄ᬬᬾᬧᬶ |
| matur suksma | thank you | ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ |
| sami sami | you are welcome | ᬲᬫᬶ​ᬲᬫᬶ |
| ampura | sorry | ᬅᬫ᭄ᬧᬸᬭ |
| dumogi rahayu | may you be safe | ᬤᬸᬫᭀᬕᬶ​ᬭᬳᬬᬸ |

## Common Words

| Balinese | Meaning | Script — ready to copy |
|----------|---------|-----------------------|
| bali | Bali | ᬩᬮᬶ |
| pura | temple | ᬧᬸᬭ |
| umah | house | ᬉᬫᬳ᭄ |
| desa | village | ᬤᬾᬲ |
| banjar | banjar (community) | ᬩᬦ᭄ᬚᬭ᭄ |
| toya | water | ᬢᭀᬬ |
| sekar | flower | ᬲᬾᬓᬭ᭄ |
| gunung | mountain | ᬕᬸᬦᬸᬂ |
| pasih | sea | ᬧᬲᬶᬳ᭄ |
| bulan | moon | ᬩᬸᬮᬦ᭄ |
| guru | teacher | ᬕᬸᬭᬸ |
| buku | book | ᬩᬸᬓᬸ |
| melajah | to learn | ᬫᬾᬮᬚᬳ᭄ |
| tresna | love | ᬢ᭄ᬭᬾᬲ᭄ᬦ |

## The 18 Base Letters

To copy one at a time:

| Letter | Latin | Letter | Latin |
|--------|-------|--------|-------|
| ᬳ | ha | ᬫ | ma |
| ᬦ | na | ᬕ | ga |
| ᬘ | ca | ᬩ | ba |
| ᬭ | ra | ᬗ | nga |
| ᬓ | ka | ᬧ | pa |
| ᬤ | da | ᬚ | ja |
| ᬢ | ta | ᬬ | ya |
| ᬲ | sa | ᬜ | nya |
| ᬯ | wa | | |
| ᬮ | la | | |

The full row: ᬳ ᬦ ᬘ ᬭ ᬓ ᬤ ᬢ ᬲ ᬯ ᬮ ᬫ ᬕ ᬩ ᬗ ᬧ ᬚ ᬬ ᬜ

## Balinese Numerals

| Digit | Numeral | Digit | Numeral |
|-------|---------|-------|---------|
| 0 | ᭐ | 5 | ᭕ |
| 1 | ᭑ | 6 | ᭖ |
| 2 | ᭒ | 7 | ᭗ |
| 3 | ᭓ | 8 | ᭘ |
| 4 | ᭔ | 9 | ᭙ |

The full run: ᭐ ᭑ ᭒ ᭓ ᭔ ᭕ ᭖ ᭗ ᭘ ᭙

## Punctuation and Ornaments

| Mark | Name | Function |
|------|------|----------|
| ᭚ | panti | opens a text |
| ᭛ | pamada | opens a section |
| ᭜ | windu | round marker |
| ᭞ | carik siki | separates clauses |
| ᭟ | carik pareren | ends a sentence |

## Where It Pastes Cleanly

- **WhatsApp and Telegram** — usually fine on modern Android and iOS
- **Instagram, TikTok, X** — depends on the app's fonts; use an image when appearance must be certain
- **Word, Google Docs, Notion** — fine as long as a Balinese font is installed
- **Canva, Photoshop, Figma** — install a Balinese font such as Noto Sans Balinese first

## If Your Pasted Text Turns Into Boxes

Small boxes (□□□) mean the text is correct but the destination device or app has no Balinese font to draw it. Two ways out:

1. Install the font — follow the <a href="/blog/cara-instal-font-aksara-bali">font installation guide</a>.
2. Send it as an image — the converter exports results as a transparent PNG, which looks identical everywhere.

## Making Your Own

The lists above are a starting point. For any other word, name, or sentence:

1. Open the <a href="/">Balinese script converter</a>
2. Type the Latin text the way it sounds
3. Press **Copy**, then paste

For names there is a dedicated guide: <a href="/blog/nama-dalam-aksara-bali">writing your name in Balinese script</a>. To understand the marks you see, keep the <a href="/blog/daftar-lengkap-aksara-bali">complete script chart</a> nearby.

## Before Using It for Anything Permanent

Ready-made text is convenient, but still check it before it goes on an invitation, a banner, or a tattoo. A single wrong vowel sign is enough to change a word's meaning. For ritual text, have a Balinese teacher or native speaker review it.
`.trim(),
  },

  {
    slug: 'translate-bahasa-indonesia-ke-bahasa-bali',
    title: 'Translate Bahasa Indonesia ke Bahasa Bali: Yang Bisa dan Tidak Bisa Dilakukan Alat Otomatis',
    title_en: 'Translating Indonesian to Balinese: What Automatic Tools Can and Cannot Do',
    excerpt: 'Bedanya menerjemahkan bahasa dan mengalihaksarakan tulisan, kosakata Indonesia–Bali untuk memulai, dan cara menggabungkan keduanya agar hasilnya benar-benar berbahasa Bali.',
    excerpt_en: 'The difference between translating a language and transliterating a script, a starter Indonesian–Balinese vocabulary, and how to combine both for genuinely Balinese wording.',
    category: 'Panduan Belajar',
    tags: ['translate bahasa bali', 'bahasa indonesia ke bahasa bali', 'kamus bali', 'basa bali'],
    image_url: COVERS + 'translate-bahasa-indonesia-ke-bahasa-bali.png',
    read_time: '7 menit',
    content: `
## Dua Pekerjaan yang Sering Tertukar

Orang yang mencari "translate bahasa Indonesia ke bahasa Bali" sebenarnya bisa memaksudkan dua hal yang sangat berbeda:

| Yang dimaksud | Nama pekerjaannya | Contoh |
|--------------|------------------|--------|
| Mengubah **arti** ke bahasa Bali | terjemahan | terima kasih → matur suksma |
| Mengubah **tulisan** ke aksara Bali | transliterasi | matur suksma → ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ |

Konverter di situs ini mengerjakan yang kedua. Kalau Anda memasukkan kalimat bahasa Indonesia, hasilnya adalah kalimat bahasa Indonesia yang ditulis dengan aksara Bali — bentuknya indah, tetapi bahasanya tetap Indonesia.

Untuk mendapatkan kalimat yang benar-benar berbahasa Bali, urutannya: **terjemahkan dulu, baru alihaksarakan.**

## Kenapa Terjemahan Bahasa Bali Tidak Bisa Sepenuhnya Otomatis

Bahasa Bali mengenal **sor singgih** — tingkatan tutur. Satu gagasan yang sama diucapkan dengan kata yang berbeda tergantung kepada siapa Anda berbicara: kepada teman sebaya, kepada orang yang dihormati, atau dalam konteks keagamaan.

Akibatnya, satu kata bahasa Indonesia sering punya lebih dari satu padanan Bali, dan memilih yang keliru bukan sekadar salah kata — bisa terdengar kurang sopan. Inilah alasan alat penerjemah otomatis untuk bahasa Bali jauh lebih jarang, dan jauh lebih rapuh, dibanding alat alih aksara.

Pilihan katanya juga bergantung pada konteks yang tidak terlihat oleh mesin: usia lawan bicara, kedudukan sosial, dan situasi percakapan.

## Kosakata untuk Memulai

Kata-kata berikut aman dipakai dalam percakapan sehari-hari yang sopan.

| Indonesia | Bahasa Bali | Aksara Bali |
|-----------|------------|------------|
| terima kasih | matur suksma | ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ |
| sama-sama | sami sami | ᬲᬫᬶ​ᬲᬫᬶ |
| maaf | ampura | ᬅᬫ᭄ᬧᬸᬭ |
| permisi | sugra | ᬲᬸᬕ᭄ᬭ |
| selamat pagi | rahajeng semeng | ᬭᬳᬚᬾᬂ​ᬲᬾᬫᬾᬂ |
| selamat datang | rahajeng rauh | ᬭᬳᬚᬾᬂ​ᬭᬉᬳ᭄ |
| apa kabar | punapi gatra | ᬧᬸᬦᬧᬶ​ᬕᬢ᭄ᬭ |
| baik | becik | ᬩᬾᬘᬶᬓ᭄ |
| ya | inggih | ᬇᬂᬕᬶᬳ᭄ |
| tidak | nenten | ᬦᬾᬦ᭄ᬢᬾᬦ᭄ |
| sudah | sampun | ᬲᬫ᭄ᬧᬸᬦ᭄ |
| belum | durung | ᬤᬸᬭᬸᬂ |
| sekarang | mangkin | ᬫᬂᬓᬶᬦ᭄ |
| ada | wenten | ᬯᬾᬦ᭄ᬢᬾᬦ᭄ |
| dari | saking | ᬲᬓᬶᬂ |
| di | ring | ᬭᬶᬂ |
| yang | sane | ᬲᬦᬾ |
| ini | niki | ᬦᬶᬓᬶ |
| itu | punika | ᬧᬸᬦᬶᬓ |
| lagi | malih | ᬫᬮᬶᬳ᭄ |
| semua | sami | ᬲᬫᬶ |
| sangat | pisan | ᬧᬶᬲᬦ᭄ |
| saudara | semeton | ᬲᬾᬫᬾᬢᭀᬦ᭄ |
| ibu | meme | ᬫᬾᬫᬾ |
| ayah | bapa | ᬩᬧ |
| kakak | beli | ᬩᬾᬮᬶ |
| adik | adi | ᬅᬤᬶ |
| rumah | umah | ᬉᬫᬳ᭄ |
| air | toya | ᬢᭀᬬ |
| bunga | sekar | ᬲᬾᬓᬭ᭄ |
| laut | pasih | ᬧᬲᬶᬳ᭄ |
| jalan | margi | ᬫᬭ᭄ᬕᬶ |
| belajar | melajah | ᬫᬾᬮᬚᬳ᭄ |
| cinta | tresna | ᬢ᭄ᬭᬾᬲ᭄ᬦ |

## Cara Menggabungkan Keduanya

1. **Susun kalimatnya dalam bahasa Bali** — dengan kosakata di atas, kamus, atau bantuan penutur asli.
2. **Ketik kalimat Bali itu** di <a href="/">konverter aksara Bali</a>.
3. **Periksa hasilnya** dengan mode terbalik atau tombol pelafalan, lalu salin.

Contohnya: "terima kasih banyak" → *matur suksma pisan* → ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ​ᬧᬶᬲᬦ᭄

## Ke Mana Mencari Terjemahan yang Tepat

- **Kamus Bali–Indonesia** terbitan Balai Bahasa dan Dinas Kebudayaan Provinsi Bali
- **Basa Bali Wiki** — kamus daring dan komunitas bahasa Bali
- **Guru bahasa Bali** di sekolah, atau dosen program studi Sastra Bali di universitas setempat
- **Komunitas daring** — banyak grup media sosial yang aktif membantu memeriksa kalimat

Untuk keperluan upacara, undangan, atau sambutan resmi, pemeriksaan oleh manusia bukan pilihan tambahan — ia bagian dari pekerjaan.

## Kesalahan yang Sering Terjadi

- **Menerjemahkan kata per kata.** Struktur kalimat bahasa Bali tidak selalu sejajar dengan bahasa Indonesia.
- **Mencampur tingkatan tutur.** Satu kalimat sebaiknya konsisten memakai satu tingkatan.
- **Menganggap hasil alih aksara sebagai terjemahan.** Tulisan aksara Bali dari kalimat Indonesia tetaplah bahasa Indonesia.
- **Memakai kalimat panjang untuk tato atau cetakan** tanpa diperiksa penutur asli.

## Pertanyaan Singkat

**Apakah situs ini bisa menerjemahkan kalimat ke bahasa Bali?** Tidak. Situs ini mengubah tulisan Latin menjadi aksara Bali. Untuk arti, gunakan kamus atau bantuan penutur asli, lalu alihaksarakan hasilnya di sini.

**Apakah ada padanan Bali untuk setiap kata Indonesia?** Tidak selalu, dan sebaliknya juga berlaku — sebagian kata Bali tidak punya padanan ringkas dalam bahasa Indonesia.

**Bagaimana menuliskan hasil terjemahan saya dalam aksara Bali?** Ketik kalimat Balinya di <a href="/">konverter</a>; aksaranya muncul seketika dan bisa disalin.

**Ada daftar ucapan sehari-hari yang siap pakai?** Ada, di artikel <a href="/blog/ucapan-bahasa-bali-sehari-hari">ucapan bahasa Bali sehari-hari</a> dan <a href="/blog/copy-paste-aksara-bali">kumpulan teks siap salin</a>.
`.trim(),
    content_en: `
## Two Jobs People Keep Confusing

Someone searching for a way to turn Indonesian into Balinese may mean one of two very different things:

| What they want | The actual task | Example |
|---------------|----------------|---------|
| Change the **meaning** into Balinese | translation | thank you → matur suksma |
| Change the **writing** into Balinese script | transliteration | matur suksma → ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ |

This site's converter does the second. Feed it an Indonesian or English sentence and you get that same sentence written in Balinese characters — beautiful to look at, but still in the original language.

For genuinely Balinese wording the order is: **translate first, then transliterate.**

## Why Balinese Translation Cannot Be Fully Automatic

Balinese has **sor singgih** — speech levels. The same idea is expressed with different words depending on who you are addressing: a peer, someone of higher standing, or a religious setting.

As a result, a single Indonesian word often has several Balinese equivalents, and picking the wrong one is not merely inaccurate — it can sound impolite. That is why automatic Balinese translators are rare and fragile compared with transliteration tools.

Word choice also depends on context a machine cannot see: the listener's age, social standing, and the situation itself.

## A Starter Vocabulary

The words below are safe for ordinary polite conversation.

| Indonesian | Balinese | Balinese script |
|-----------|----------|----------------|
| terima kasih | matur suksma | ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ |
| sama-sama | sami sami | ᬲᬫᬶ​ᬲᬫᬶ |
| maaf | ampura | ᬅᬫ᭄ᬧᬸᬭ |
| permisi | sugra | ᬲᬸᬕ᭄ᬭ |
| selamat pagi | rahajeng semeng | ᬭᬳᬚᬾᬂ​ᬲᬾᬫᬾᬂ |
| selamat datang | rahajeng rauh | ᬭᬳᬚᬾᬂ​ᬭᬉᬳ᭄ |
| apa kabar | punapi gatra | ᬧᬸᬦᬧᬶ​ᬕᬢ᭄ᬭ |
| baik | becik | ᬩᬾᬘᬶᬓ᭄ |
| ya | inggih | ᬇᬂᬕᬶᬳ᭄ |
| tidak | nenten | ᬦᬾᬦ᭄ᬢᬾᬦ᭄ |
| sudah | sampun | ᬲᬫ᭄ᬧᬸᬦ᭄ |
| belum | durung | ᬤᬸᬭᬸᬂ |
| sekarang | mangkin | ᬫᬂᬓᬶᬦ᭄ |
| ada | wenten | ᬯᬾᬦ᭄ᬢᬾᬦ᭄ |
| dari | saking | ᬲᬓᬶᬂ |
| di | ring | ᬭᬶᬂ |
| yang | sane | ᬲᬦᬾ |
| ini | niki | ᬦᬶᬓᬶ |
| itu | punika | ᬧᬸᬦᬶᬓ |
| lagi | malih | ᬫᬮᬶᬳ᭄ |
| semua | sami | ᬲᬫᬶ |
| sangat | pisan | ᬧᬶᬲᬦ᭄ |
| saudara | semeton | ᬲᬾᬫᬾᬢᭀᬦ᭄ |
| ibu | meme | ᬫᬾᬫᬾ |
| ayah | bapa | ᬩᬧ |
| kakak | beli | ᬩᬾᬮᬶ |
| adik | adi | ᬅᬤᬶ |
| rumah | umah | ᬉᬫᬳ᭄ |
| air | toya | ᬢᭀᬬ |
| bunga | sekar | ᬲᬾᬓᬭ᭄ |
| laut | pasih | ᬧᬲᬶᬳ᭄ |
| jalan | margi | ᬫᬭ᭄ᬕᬶ |
| belajar | melajah | ᬫᬾᬮᬚᬳ᭄ |
| cinta | tresna | ᬢ᭄ᬭᬾᬲ᭄ᬦ |

## Combining the Two Steps

1. **Compose the sentence in Balinese** — using the vocabulary above, a dictionary, or a native speaker.
2. **Type that Balinese sentence** into the <a href="/">Balinese script converter</a>.
3. **Check the result** with reverse mode or the pronunciation button, then copy it.

For example: "thank you very much" → *matur suksma pisan* → ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ​ᬧᬶᬲᬦ᭄

## Where to Get Reliable Translations

- **Kamus Bali–Indonesia**, published by Balai Bahasa and the Bali provincial culture office
- **Basa Bali Wiki** — an online dictionary and language community
- **Balinese language teachers** at schools, or lecturers in Balinese literature programmes
- **Online communities** — several active social media groups will happily check a sentence

For ceremonies, invitations, or formal speeches, human review is not an optional extra — it is part of the job.

## Common Mistakes

- **Translating word by word.** Balinese sentence structure does not always mirror Indonesian.
- **Mixing speech levels.** Keep one level consistent within a sentence.
- **Treating transliteration as translation.** An Indonesian sentence in Balinese characters is still Indonesian.
- **Using long sentences for tattoos or print** without a native speaker's review.

## Quick Questions

**Can this site translate sentences into Balinese?** No. It converts Latin writing into Balinese script. For meaning, use a dictionary or a native speaker, then transliterate the result here.

**Does every Indonesian word have a Balinese equivalent?** Not always — and the reverse holds too; some Balinese words have no compact Indonesian equivalent.

**How do I write my translation in Balinese script?** Type the Balinese sentence into the <a href="/">converter</a>; the script appears instantly and can be copied.

**Is there a ready-made list of everyday phrases?** Yes — see <a href="/blog/ucapan-bahasa-bali-sehari-hari">everyday Balinese phrases</a> and <a href="/blog/copy-paste-aksara-bali">ready-to-copy script</a>.
`.trim(),
  },
]

for (const post of posts) {
  const { data: existing } = await supabase
    .from('blog_posts').select('id').eq('slug', post.slug).maybeSingle()

  if (existing) {
    const { error } = await supabase.from('blog_posts')
      .update({ ...post, published: true, author: 'Doni Wirawan', updated_at: new Date().toISOString() })
      .eq('id', existing.id)
    console.log('Updated:', error || post.slug)
  } else {
    const { error } = await supabase.from('blog_posts')
      .insert([{ ...post, published: true, author: 'Doni Wirawan' }])
    console.log('Inserted:', error || post.slug)
  }
}
