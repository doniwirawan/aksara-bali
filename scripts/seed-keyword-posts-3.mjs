import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Batch 3, written against the two pages that currently outrank us:
// bennylin's "Nulisa Aksara Bali" (owns the typing/QWERTY + taling/pepet
// vocabulary) and komangputra.com (owns the scholarly reference vocabulary:
// wreastra, swara, wyanjana, articulation groups, pasang pageh).
//
// NOTE: this file is the current source of truth for daftar-lengkap-aksara-bali.
// It supersedes the shorter version in seed-keyword-posts-2.mjs — re-run this
// one last if you ever replay both.
//
// Every code point below was verified against the Unicode Balinese block.

const posts = [
  {
    slug: 'daftar-lengkap-aksara-bali',
    title: 'Daftar Lengkap Aksara Bali: Wreastra, Swara, Wyanjana, Pangangge, dan Angka',
    title_en: 'Complete Balinese Script Chart: Wreastra, Swara, Wyanjana, Vowel Signs, and Numerals',
    excerpt: 'Tabel referensi aksara Bali lengkap: 18 aksara wreastra, 14 aksara swara, 33 aksara wyanjana menurut tempat artikulasi, pangangge, angka, tanda baca, dan kode Unicode-nya.',
    excerpt_en: 'A complete Balinese script reference: the 18 wreastra letters, 14 swara vowels, 33 wyanjana consonants by articulation, vowel signs, numerals, punctuation, and Unicode code points.',
    category: 'Panduan Belajar',
    tags: ['daftar aksara bali', 'tabel aksara bali', 'balinese alphabet', 'hanacaraka', 'unicode aksara bali', 'referensi'],
    image_url: 'https://transliterasi-latin-ke-bahasa-bali.vercel.app/covers/daftar-lengkap-aksara-bali.png',
    read_time: '10 menit',
    content: `
## Referensi Lengkap Aksara Bali

Halaman ini adalah tabel rujukan (*glyph chart*) aksara Bali — setiap aksara ditampilkan bersama nama, padanan Latin, dan kode Unicode-nya. Simpan halaman ini untuk dibuka saat Anda menulis, membaca papan nama, atau memeriksa hasil konversi.

Untuk mengubah teks dengan cepat, gunakan <a href="/">konverter aksara Bali</a>. Untuk memahami apa yang Anda lihat, mulailah dari sini.

## Tiga Kelompok Besar Aksara Bali

Aksara Bali secara tradisional dibagi menurut pemakaiannya:

- **Aksara wreastra** — 18 aksara untuk menulis bahasa Bali sehari-hari
- **Aksara swalalita** — aksara tambahan untuk kata serapan Sansekerta dan Jawa Kuno (Kawi), termasuk aksara murda
- **Aksara modre** — aksara bercorak sakral yang dipakai dalam rerajahan dan teks keagamaan

Untuk keperluan menulis sehari-hari, kelompok pertama sudah lebih dari cukup.

## Aksara Wreastra: 18 Aksara Dasar

Urutan tradisionalnya disebut **hanacaraka**. Setiap aksara sudah membawa vokal /a/ — ᬓ dibaca "ka", bukan "k".

| Aksara | Latin | Unicode | Aksara | Latin | Unicode |
|--------|-------|---------|--------|-------|---------|
| ᬳ | ha | U+1B33 | ᬫ | ma | U+1B2B |
| ᬦ | na | U+1B26 | ᬕ | ga | U+1B15 |
| ᬘ | ca | U+1B18 | ᬩ | ba | U+1B29 |
| ᬭ | ra | U+1B2D | ᬗ | nga | U+1B17 |
| ᬓ | ka | U+1B13 | ᬧ | pa | U+1B27 |
| ᬤ | da | U+1B24 | ᬚ | ja | U+1B1A |
| ᬢ | ta | U+1B22 | ᬬ | ya | U+1B2C |
| ᬲ | sa | U+1B32 | ᬜ | nya | U+1B1C |
| ᬯ | wa | U+1B2F | | | |
| ᬮ | la | U+1B2E | | | |

Panduan menghafalnya ada di artikel <a href="/blog/belajar-hanacaraka-panduan-lengkap">hanacaraka</a>.

## Aksara Swara: 14 Vokal Mandiri

Aksara swara dipakai untuk suku kata yang tidak berawalan konsonan — misalnya "api" (ᬅᬧᬶ) atau "umah" (ᬉᬫᬳ᭄). Vokalnya terbagi dua: **hreswa** (pendek) dan **dirgha** (panjang).

| Hreswa (pendek) | Latin | Dirgha (panjang) | Latin |
|-----------------|-------|------------------|-------|
| ᬅ | a | ᬆ | ā |
| ᬇ | i | ᬈ | ī |
| ᬉ | u | ᬊ | ū |
| ᬏ | e | ᬐ | ai |
| ᬑ | o | ᬒ | au |
| ᬋ | ṛ (rě) | ᬌ | ṝ |
| ᬍ | ḷ (lě) | ᬎ | ḹ |

Bahasa Bali modern tidak lagi membedakan panjang-pendeknya dalam pelafalan. Vokal panjang tetap dipakai untuk mengeja kata serapan Sansekerta dan Kawi sesuai ejaan aslinya — kebiasaan ini disebut **pasang pageh**, ejaan berdasarkan akar kata.

## Aksara Wyanjana: Konsonan Menurut Tempat Artikulasi

Sebagai turunan tradisi tulis India, aksara Bali menyediakan 33 aksara konsonan untuk menuliskan seluruh bunyi Sansekerta-Kawi. Penyusunannya mengikuti tempat artikulasi — dari pangkal tenggorokan ke bibir.

| Kelompok | Aksara |
|----------|--------|
| Kanthya (velar) | ᬓ ka, ᬔ kha, ᬕ ga, ᬖ gha, ᬗ nga, ᬳ ha |
| Talawya (palatal) | ᬘ ca, ᬙ cha, ᬚ ja, ᬛ jha, ᬜ nya, ᬬ ya, ᬰ sa (saga) |
| Murdhanya (retrofleks) | ᬝ ṭa, ᬞ ṭha, ᬟ ḍa, ᬠ ḍha, ᬡ ṇa, ᬭ ra, ᬱ ṣa |
| Dantya (dental) | ᬢ ta, ᬣ tha, ᬤ da, ᬥ dha, ᬦ na, ᬮ la, ᬲ sa |
| Osthya (labial) | ᬧ pa, ᬨ pha, ᬩ ba, ᬪ bha, ᬫ ma, ᬯ wa |

Aksara pada kolom kedua tiap pasangan (kha, gha, cha, jha, dan seterusnya) disebut **mahaprana** — bunyi beraspirasi — sementara pasangannya disebut **alpaprana**. Aksara retrofleks inilah yang lazim disebut **aksara murda**; pembahasannya ada di artikel <a href="/blog/aksara-murda-huruf-kapital-bali">aksara murda</a>.

Untuk menulis bahasa Bali sehari-hari Anda tidak perlu menghafalnya. Konverter di situs ini mengenali ratusan kata Sansekerta umum dan memilih bentuk murda-nya secara otomatis.

## Pangangge Suara: Tanda Vokal

Ketika vokal mengikuti konsonan, ia ditulis sebagai tanda yang menempel, bukan aksara tersendiri. Contoh berikut memakai ᬓ (ka).

| Tanda | Nama | Bunyi | Letak | Contoh | Unicode |
|-------|------|-------|-------|--------|---------|
| ᬶ | ulu | -i | atas | ᬓᬶ | U+1B36 |
| ᬷ | ulu sari | -ī | atas | ᬓᬷ | U+1B37 |
| ᬸ | suku | -u | bawah | ᬓᬸ | U+1B38 |
| ᬹ | suku ilut | -ū | bawah | ᬓᬹ | U+1B39 |
| ᬵ | tedung | -ā | kanan | ᬓᬵ | U+1B35 |
| ᬾ | taling | -e | kiri | ᬓᬾ | U+1B3E |
| ᭀ | taling tedung | -o | mengapit | ᬓᭀ | U+1B40 |
| ᭂ | pepet | -ě (pepet) | atas | ᬓᭂ | U+1B42 |
| ᭃ | pepet tedung | -ö | atas + kanan | ᬓᭃ | U+1B43 |

## Taling dan Pepet: Beda yang Sering Terlewat

Huruf "e" dalam ejaan Latin bahasa Bali sebenarnya mewakili **dua bunyi berbeda**, dan aksara Bali menuliskannya dengan tanda yang berbeda pula:

- **Taling** (ᬾ) — bunyi /e/ seperti pada *dewa*, *sekar*, *becik*
- **Pepet** (ᭂ) — bunyi /ə/ seperti pada *ketut* atau *sěmeng*, bunyi "e" lemah

Inilah sumber kesalahan paling umum saat mengetik aksara Bali dengan keyboard biasa: satu tombol "e" harus mewakili dua tanda. Konverter di situs ini menuliskan **taling** untuk "e". Kalau Anda memerlukan pepet, gunakan papan ketik aksara Bali di <a href="/practice">halaman latihan</a> dan pilih tombol ᭂ. Penjelasan lengkap konvensi pengetikan ada di artikel <a href="/blog/cara-mengetik-aksara-bali-keyboard">cara mengetik aksara Bali di keyboard</a>.

## Ra Repa dan La Lenga

Ada satu aturan yang wajib diingat: gabungan **ra + pepet** dan **la + pepet** tidak ditulis sebagai konsonan bertanda, melainkan diganti aksara tersendiri.

| Seharusnya | Ditulis | Nama |
|-----------|---------|------|
| ᬭ + ᭂ | ᬋ | ra repa |
| ᬮ + ᭂ | ᬍ | la lenga |

## Pangangge Tengenan: Konsonan Penutup

Tiga bunyi penutup punya tanda khusus dan tidak ditulis sebagai aksara penuh. Contoh memakai ᬲ (sa).

| Tanda | Nama | Bunyi | Contoh | Unicode |
|-------|------|-------|--------|---------|
| ᬂ | cecek | -ng | ᬲᬂ (sang) | U+1B02 |
| ᬃ | surang | -r | ᬲᬃ (sar) | U+1B03 |
| ᬄ | bisah | -h | ᬲᬄ (sah) | U+1B04 |
| ᭄ | adeg-adeg | mematikan vokal | ᬲᬓ᭄ (sak) | U+1B44 |

## Gantungan dan Gempelan

Ketika dua konsonan bertemu tanpa vokal di tengah kata, konsonan kedua tidak ditulis penuh. Bentuk kecilnya digantung **di bawah** aksara pertama (*gantungan*) atau ditempelkan **di sampingnya** (*gempelan*), tergantung aksaranya.

| Kata | Aksara | Keterangan |
|------|--------|-----------|
| surya | ᬲᬸᬭ᭄ᬬ | ya digantung di bawah ra |
| banjar | ᬩᬦ᭄ᬚᬭ᭄ | ja digantung di bawah na |
| suksma | ᬲᬸᬓ᭄ᬲ᭄ᬫ | dua gugus berturutan |

Adeg-adeg umumnya hanya dipakai di akhir kata; di tengah kata, gugus konsonan ditulis dengan gantungan atau gempelan.

## Angka Bali

| Angka | Aksara | Unicode | Angka | Aksara | Unicode |
|-------|--------|---------|-------|--------|---------|
| 0 | ᭐ | U+1B50 | 5 | ᭕ | U+1B55 |
| 1 | ᭑ | U+1B51 | 6 | ᭖ | U+1B56 |
| 2 | ᭒ | U+1B52 | 7 | ᭗ | U+1B57 |
| 3 | ᭓ | U+1B53 | 8 | ᭘ | U+1B58 |
| 4 | ᭔ | U+1B54 | 9 | ᭙ | U+1B59 |

Tahun 2026 ditulis ᭒᭐᭒᭖. Sejarah dan pemakaiannya dibahas di artikel <a href="/blog/angka-bali-sistem-penomoran-tradisional">angka Bali</a>.

## Tanda Baca

| Tanda | Nama | Fungsi | Unicode |
|-------|------|--------|---------|
| ᭚ | panti | pembuka teks | U+1B5A |
| ᭛ | pamada | pembuka bagian | U+1B5B |
| ᭜ | windu | penanda bulat | U+1B5C |
| ᭝ | carik pamungkah | pembuka kalimat | U+1B5D |
| ᭞ | carik siki | pemisah antar bagian kalimat | U+1B5E |
| ᭟ | carik pareren | penanda akhir kalimat | U+1B5F |

Penulisan tradisional pada lontar tidak memakai spasi antar kata. Teks digital modern umumnya menyisipkan pemisah tipis agar lebih mudah dibaca di layar.

## Blok Unicode Aksara Bali

Aksara Bali masuk ke dalam standar Unicode versi 5.0 pada tahun 2006, menempati blok **U+1B00–U+1B7F**. Inilah yang membuat aksara Bali bisa ditulis, disalin, dicari, dan diindeks seperti teks biasa — bukan sekadar gambar.

| Rentang | Isi |
|---------|-----|
| U+1B00–U+1B04 | tanda sengau dan penutup (ulu candra, ulu ricem, cecek, surang, bisah) |
| U+1B05–U+1B12 | aksara swara (vokal mandiri) |
| U+1B13–U+1B33 | aksara wyanjana (konsonan) |
| U+1B35–U+1B44 | pangangge (tanda vokal dan adeg-adeg) |
| U+1B50–U+1B59 | angka Bali |
| U+1B5A–U+1B60 | tanda baca |

Agar aksara ini tampil di perangkat Anda, dibutuhkan font yang mendukung blok tersebut — misalnya **Noto Sans Balinese**.

## Kalau Tabel di Atas Tampil Kotak-kotak

Kotak kosong (□□□) berarti perangkat Anda belum memiliki font aksara Bali; teksnya sendiri sudah benar. Ikuti <a href="/blog/cara-instal-font-aksara-bali">panduan instal font</a> — setelah terpasang, aksara Bali akan tampil normal di seluruh aplikasi.

## Cara Memakai Tabel Ini

1. **Membaca papan nama atau ukiran** — kenali bentuk dasar aksaranya lebih dulu, baru perhatikan pangangge yang menempel.
2. **Memeriksa hasil konverter** — cocokkan aksara demi aksara sebelum tulisan dicetak atau ditato.
3. **Berlatih menulis** — gunakan kanvas menulis dan papan ketik di <a href="/practice">halaman latihan</a>, lalu bandingkan hasilnya dengan tabel ini.
`.trim(),
    content_en: `
## A Complete Balinese Script Reference

This page is a Balinese glyph chart — every character shown with its name, Latin equivalent, and Unicode code point. Bookmark it for when you are writing, reading signage, or checking converter output.

To convert text quickly, use the <a href="/">Balinese script converter</a>. To understand what you are looking at, start here.

## The Three Groups of Balinese Letters

Balinese letters are traditionally grouped by use:

- **Aksara wreastra** — the 18 letters used for everyday Balinese
- **Aksara swalalita** — additional letters for Sanskrit and Old Javanese (Kawi) loanwords, including the murda letters
- **Aksara modre** — sacred forms used in rerajahan and religious texts

For everyday writing, the first group is more than enough.

## Wreastra: The 18 Base Letters

Their traditional order is called **hanacaraka**. Each letter already carries an /a/ vowel — ᬓ reads "ka", not "k".

| Letter | Latin | Unicode | Letter | Latin | Unicode |
|--------|-------|---------|--------|-------|---------|
| ᬳ | ha | U+1B33 | ᬫ | ma | U+1B2B |
| ᬦ | na | U+1B26 | ᬕ | ga | U+1B15 |
| ᬘ | ca | U+1B18 | ᬩ | ba | U+1B29 |
| ᬭ | ra | U+1B2D | ᬗ | nga | U+1B17 |
| ᬓ | ka | U+1B13 | ᬧ | pa | U+1B27 |
| ᬤ | da | U+1B24 | ᬚ | ja | U+1B1A |
| ᬢ | ta | U+1B22 | ᬬ | ya | U+1B2C |
| ᬲ | sa | U+1B32 | ᬜ | nya | U+1B1C |
| ᬯ | wa | U+1B2F | | | |
| ᬮ | la | U+1B2E | | | |

There is a memorisation guide in the <a href="/blog/belajar-hanacaraka-panduan-lengkap">hanacaraka article</a>.

## Swara: The 14 Independent Vowels

Swara letters are used for syllables with no initial consonant — for example "api" (ᬅᬧᬶ) or "umah" (ᬉᬫᬳ᭄). They come in two series: **hreswa** (short) and **dirgha** (long).

| Hreswa (short) | Latin | Dirgha (long) | Latin |
|----------------|-------|---------------|-------|
| ᬅ | a | ᬆ | ā |
| ᬇ | i | ᬈ | ī |
| ᬉ | u | ᬊ | ū |
| ᬏ | e | ᬐ | ai |
| ᬑ | o | ᬒ | au |
| ᬋ | ṛ (rě) | ᬌ | ṝ |
| ᬍ | ḷ (lě) | ᬎ | ḹ |

Modern spoken Balinese no longer distinguishes vowel length. The long vowels survive in spelling, used to write Sanskrit and Kawi loanwords in their original form — a convention called **pasang pageh**, spelling by root word.

## Wyanjana: Consonants by Place of Articulation

As an inheritor of the Indic writing tradition, Balinese provides 33 consonant letters covering the full Sanskrit-Kawi sound inventory, arranged by where they are articulated — from the throat outward to the lips.

| Group | Letters |
|-------|---------|
| Kanthya (velar) | ᬓ ka, ᬔ kha, ᬕ ga, ᬖ gha, ᬗ nga, ᬳ ha |
| Talawya (palatal) | ᬘ ca, ᬙ cha, ᬚ ja, ᬛ jha, ᬜ nya, ᬬ ya, ᬰ sa (saga) |
| Murdhanya (retroflex) | ᬝ ṭa, ᬞ ṭha, ᬟ ḍa, ᬠ ḍha, ᬡ ṇa, ᬭ ra, ᬱ ṣa |
| Dantya (dental) | ᬢ ta, ᬣ tha, ᬤ da, ᬥ dha, ᬦ na, ᬮ la, ᬲ sa |
| Osthya (labial) | ᬧ pa, ᬨ pha, ᬩ ba, ᬪ bha, ᬫ ma, ᬯ wa |

The second letter in each pair (kha, gha, cha, jha, and so on) is called **mahaprana** — the aspirated sound — while its partner is **alpaprana**. The retroflex series is what is commonly called **aksara murda**; see the <a href="/blog/aksara-murda-huruf-kapital-bali">murda article</a>.

You do not need to memorise these for everyday Balinese. This site's converter recognises hundreds of common Sanskrit words and applies the murda forms automatically.

## Pangangge Suara: Vowel Signs

When a vowel follows a consonant it is written as an attached mark rather than its own letter. The examples use ᬓ (ka).

| Sign | Name | Sound | Position | Example | Unicode |
|------|------|-------|----------|---------|---------|
| ᬶ | ulu | -i | above | ᬓᬶ | U+1B36 |
| ᬷ | ulu sari | -ī | above | ᬓᬷ | U+1B37 |
| ᬸ | suku | -u | below | ᬓᬸ | U+1B38 |
| ᬹ | suku ilut | -ū | below | ᬓᬹ | U+1B39 |
| ᬵ | tedung | -ā | right | ᬓᬵ | U+1B35 |
| ᬾ | taling | -e | left | ᬓᬾ | U+1B3E |
| ᭀ | taling tedung | -o | both sides | ᬓᭀ | U+1B40 |
| ᭂ | pepet | -ě (schwa) | above | ᬓᭂ | U+1B42 |
| ᭃ | pepet tedung | -ö | above + right | ᬓᭃ | U+1B43 |

## Taling vs Pepet: The Distinction Most People Miss

The letter "e" in romanised Balinese actually stands for **two different sounds**, and Balinese script writes them with different marks:

- **Taling** (ᬾ) — the /e/ in *dewa*, *sekar*, *becik*
- **Pepet** (ᭂ) — the schwa /ə/, the weak "e" in words like *ketut* or *sěmeng*

This is the single most common error when typing Balinese on an ordinary keyboard: one "e" key has to stand for two marks. This site's converter writes **taling** for "e". When you need pepet, use the Balinese keyboard on the <a href="/practice">practice page</a> and tap the ᭂ key. The full set of typing conventions is covered in <a href="/blog/cara-mengetik-aksara-bali-keyboard">typing Balinese script on a keyboard</a>.

## Ra Repa and La Lenga

One rule is mandatory: **ra + pepet** and **la + pepet** are never written as a marked consonant. They are replaced by their own letters.

| Would be | Written as | Name |
|----------|-----------|------|
| ᬭ + ᭂ | ᬋ | ra repa |
| ᬮ + ᭂ | ᬍ | la lenga |

## Pangangge Tengenan: Final Consonants

Three closing sounds get dedicated marks instead of full letters. Examples use ᬲ (sa).

| Sign | Name | Sound | Example | Unicode |
|------|------|-------|---------|---------|
| ᬂ | cecek | -ng | ᬲᬂ (sang) | U+1B02 |
| ᬃ | surang | -r | ᬲᬃ (sar) | U+1B03 |
| ᬄ | bisah | -h | ᬲᬄ (sah) | U+1B04 |
| ᭄ | adeg-adeg | kills the vowel | ᬲᬓ᭄ (sak) | U+1B44 |

## Gantungan and Gempelan

When two consonants meet with no vowel between them inside a word, the second is not written in full. Its small form hangs **below** the first letter (*gantungan*) or attaches **beside** it (*gempelan*), depending on the letter.

| Word | Script | Note |
|------|--------|------|
| surya | ᬲᬸᬭ᭄ᬬ | ya hangs under ra |
| banjar | ᬩᬦ᭄ᬚᬭ᭄ | ja hangs under na |
| suksma | ᬲᬸᬓ᭄ᬲ᭄ᬫ | two clusters in a row |

Adeg-adeg is normally reserved for word-final position; inside a word, clusters use gantungan or gempelan.

## Balinese Numerals

| Digit | Numeral | Unicode | Digit | Numeral | Unicode |
|-------|---------|---------|-------|---------|---------|
| 0 | ᭐ | U+1B50 | 5 | ᭕ | U+1B55 |
| 1 | ᭑ | U+1B51 | 6 | ᭖ | U+1B56 |
| 2 | ᭒ | U+1B52 | 7 | ᭗ | U+1B57 |
| 3 | ᭓ | U+1B53 | 8 | ᭘ | U+1B58 |
| 4 | ᭔ | U+1B54 | 9 | ᭙ | U+1B59 |

The year 2026 is written ᭒᭐᭒᭖. Their history is covered in the <a href="/blog/angka-bali-sistem-penomoran-tradisional">Balinese numerals article</a>.

## Punctuation

| Mark | Name | Function | Unicode |
|------|------|----------|---------|
| ᭚ | panti | opens a text | U+1B5A |
| ᭛ | pamada | opens a section | U+1B5B |
| ᭜ | windu | round marker | U+1B5C |
| ᭝ | carik pamungkah | opens a sentence | U+1B5D |
| ᭞ | carik siki | separates clauses | U+1B5E |
| ᭟ | carik pareren | ends a sentence | U+1B5F |

Traditional lontar writing uses no spaces between words. Modern digital text usually inserts a thin separator so it reads more easily on screen.

## The Balinese Unicode Block

Balinese script entered the Unicode Standard in version 5.0 (2006), occupying the block **U+1B00–U+1B7F**. That is what makes Balinese writable, copyable, searchable, and indexable as ordinary text rather than as pictures.

| Range | Contents |
|-------|----------|
| U+1B00–U+1B04 | nasal and final signs (ulu candra, ulu ricem, cecek, surang, bisah) |
| U+1B05–U+1B12 | swara (independent vowels) |
| U+1B13–U+1B33 | wyanjana (consonants) |
| U+1B35–U+1B44 | pangangge (vowel signs and adeg-adeg) |
| U+1B50–U+1B59 | Balinese digits |
| U+1B5A–U+1B60 | punctuation |

For these characters to appear on your device you need a font covering the block — **Noto Sans Balinese** being the usual choice.

## If the Tables Above Look Like Boxes

Empty boxes (□□□) mean your device has no Balinese font; the text itself is correct. Follow the <a href="/blog/cara-instal-font-aksara-bali">font installation guide</a> — once installed, Balinese renders correctly across all your apps.

## How to Use This Chart

1. **Reading signage or carving** — identify the base letter shape first, then read the attached signs.
2. **Checking converter output** — match character by character before anything is printed or tattooed.
3. **Practising writing** — use the canvas and keyboard on the <a href="/practice">practice page</a>, then compare against this chart.
`.trim(),
  },

  {
    slug: 'cara-mengetik-aksara-bali-keyboard',
    title: 'Cara Mengetik Aksara Bali dengan Keyboard Biasa (QWERTY)',
    title_en: 'How to Type Balinese Script on an Ordinary QWERTY Keyboard',
    excerpt: 'Cara mengetik aksara Bali memakai keyboard QWERTY biasa: konvensi pengetikan, perbedaan taling dan pepet, adeg-adeg, gantungan, hingga papan ketik aksara di layar.',
    excerpt_en: 'How to type Balinese script with a normal QWERTY keyboard: typing conventions, taling vs pepet, adeg-adeg, consonant stacking, and the on-screen Balinese keyboard.',
    category: 'Panduan Belajar',
    tags: ['cara mengetik aksara bali', 'keyboard aksara bali', 'qwerty', 'taling pepet', 'papan ketik aksara bali'],
    image_url: 'https://transliterasi-latin-ke-bahasa-bali.vercel.app/covers/cara-mengetik-aksara-bali-keyboard.png',
    read_time: '7 menit',
    content: `
## Mengetik Aksara Bali Tanpa Keyboard Khusus

Keyboard Anda tidak punya tombol aksara Bali, dan tidak perlu punya. Ada dua cara mengetik aksara Bali dengan papan ketik QWERTY biasa — satu cepat, satu presisi — dan keduanya berjalan di browser.

| Cara | Anda mengetik | Cocok untuk |
|------|--------------|-------------|
| Konversi otomatis | huruf Latin | teks panjang, menulis cepat |
| Papan ketik aksara | aksara langsung | teks upacara, kutipan, kontrol penuh |

## Cara 1: Ketik Latin, Aksara Muncul Otomatis

1. Buka <a href="/">halaman konverter</a>.
2. Ketik seperti biasa di kolom kiri — tulis sesuai bunyi, misalnya "rahajeng semeng".
3. Aksara Bali muncul di kolom kanan sambil Anda mengetik. Tidak ada tombol konversi.
4. Tekan tombol **Salin** untuk membawa hasilnya ke aplikasi lain.

Cara ini paling cepat karena Anda mengetik dengan kecepatan normal. Alat yang menentukan bentuk aksaranya — termasuk kapan memakai gantungan dan kapan memakai adeg-adeg.

## Konvensi Pengetikan yang Perlu Diketahui

Beberapa hal berperilaku berbeda dari dugaan pertama:

- **Tulis sesuai bunyi, bukan ejaan baku.** "Suksma", bukan "sooksma"; "melajah", bukan "mlajah".
- **Ketik "w", bukan "v".** Tradisi Bali merealisasikan bunyi /v/ sebagai /w/ — *Veda* ditulis *Weda* (ᬯᬾᬤ).
- **Gugus "ng" dan "ny" diketik utuh.** "Sayang" menghasilkan ᬲᬬᬂ, dengan cecek sebagai penutup.
- **Konsonan penutup ditangani otomatis.** "Wayan" (ᬯᬬᬦ᭄) mendapat adeg-adeg di akhir tanpa Anda ketik.
- **Kata Sansekerta dikenali sendiri.** Ratusan kata seperti *dharma* atau *Saraswati* otomatis memakai aksara murda.
- **Angka ikut berubah.** Ketik 2026, hasilnya ᭒᭐᭒᭖.

## Taling dan Pepet: Satu Tombol, Dua Bunyi

Ini bagian yang paling sering menimbulkan kebingungan. Huruf "e" dalam bahasa Bali mewakili dua bunyi berbeda, dan aksara Bali menuliskannya dengan dua tanda berbeda:

| Bunyi | Tanda | Nama | Contoh kata |
|-------|-------|------|------------|
| /e/ | ᬾ | taling | dewa, sekar, becik |
| /ə/ | ᭂ | pepet | ketut, sěmeng |

Karena keyboard QWERTY hanya punya satu tombol "e", setiap alat harus memilih konvensinya sendiri. **Konverter di situs ini menuliskan taling (ᬾ) untuk setiap "e" yang Anda ketik.**

Kalau tulisan Anda memerlukan pepet, gunakan papan ketik aksara Bali di <a href="/practice">halaman latihan</a> dan ketuk tombol ᭂ. Ini penting untuk teks yang menuntut ketepatan — kutipan lontar, teks upacara, atau bahan ajar.

Satu aturan tambahan yang menyertainya: gabungan **ra + pepet** ditulis ᬋ (ra repa) dan **la + pepet** ditulis ᬍ (la lenga), bukan sebagai konsonan bertanda. Rinciannya ada di <a href="/blog/daftar-lengkap-aksara-bali">daftar lengkap aksara Bali</a>.

## Cara 2: Papan Ketik Aksara Bali di Layar

Papan ketik di <a href="/practice">halaman latihan</a> menampilkan aksaranya langsung sebagai tombol: 18 aksara dasar, aksara murda, vokal mandiri, pangangge (termasuk pepet), adeg-adeg, cecek, bisah, dan angka Bali.

Anda mengetuk ᬓ lalu ᬸ untuk mendapatkan ᬓᬸ. Setiap keputusan penulisan ada di tangan Anda — termasuk pilihan aksara untuk bunyi yang mirip, misalnya sa dental (ᬲ) atau sa saga (ᬰ) pada kata serapan Sansekerta.

Gunakan cara ini ketika ketepatan lebih penting daripada kecepatan.

## Spasi: Dengan atau Tanpa

Penulisan tradisional pada lontar tidak memakai spasi antar kata — dikenal sebagai *scriptio continua*. Teks digital modern umumnya menyisipkan pemisah tipis antar kata agar mudah dibaca di layar, dan itulah yang dilakukan konverter di situs ini. Untuk tampilan gaya lontar, hapus spasi pada teks Latin Anda sebelum dikonversi.

## Cara 3: Tidak Mengetik Sama Sekali — Baca dari Foto

Kadang tulisannya sudah ada, hanya belum berbentuk teks: papan nama pura, ukiran, halaman lontar, atau tangkapan layar. Untuk itu ada panel **Baca dari foto** di <a href="/">halaman konverter</a>.

1. Buka panel **Baca dari foto**.
2. Seret gambarnya ke area unggah, tekan **Pilih gambar**, atau **Ambil foto** langsung dengan kamera ponsel.
3. OCR akan mengenali aksaranya, lalu menampilkan bacaannya dalam huruf Latin — siap disunting dan disalin.

Hasilnya sangat bergantung pada kualitas gambar. Foto yang tajam, tegak lurus, dengan kontras tinggi antara tulisan dan latarnya memberi hasil paling baik; ukiran batu yang aus atau lontar berbayang jauh lebih sulit dikenali. Perlakukan hasilnya sebagai draf yang masih perlu Anda periksa, bukan bacaan final.

## Mengetik di Ponsel

Ketiga cara di atas bekerja di layar sentuh. Situs ini juga bisa dipasang sebagai aplikasi lewat menu browser ("Tambahkan ke layar utama"), sehingga konverter dan papan ketiknya tetap berjalan tanpa internet. Pengguna Android yang ingin aplikasi asli bisa melihat artikel <a href="/blog/aplikasi-android-aksara-bali-rilis-baru">aplikasi Android Aksara Bali</a>.

## Setelah Selesai Mengetik

- **Salin** — hasilnya teks Unicode, bisa ditempel ke WhatsApp, Word, atau media sosial
- **Unduh** — simpan sebagai berkas teks
- **Gambar PNG** — ekspor sebagai word-art berlatar transparan, aman dipakai di aplikasi desain
- **Mode terbalik** — tempelkan aksara Bali untuk membacanya kembali dalam huruf Latin

Kalau hasil tempelan tampil sebagai kotak-kotak (□□□), perangkat penerima belum punya font aksara Bali — teksnya sendiri sudah benar. Ikuti <a href="/blog/cara-instal-font-aksara-bali">panduan instal font</a>, atau kirimkan sebagai gambar.

## Pertanyaan Singkat

**Apakah perlu memasang keyboard layout khusus?** Tidak. Semuanya berjalan di dalam browser.

**Bisakah mengetik langsung dalam aksara tanpa lewat Latin?** Bisa, lewat papan ketik di <a href="/practice">halaman latihan</a>.

**Bagaimana menulis pepet?** Gunakan tombol ᭂ pada papan ketik tersebut; konverter Latin menuliskan taling untuk "e".

**Bagaimana membaca aksara Bali yang sudah ada?** Pakai mode terbalik di konverter, atau unggah fotonya ke panel **Baca dari foto** di <a href="/">halaman konverter</a> yang memakai OCR.

## Mulai Mengetik

Untuk menulis cepat, buka <a href="/">konverter aksara Bali</a>. Untuk mengetik aksara demi aksara dengan kontrol penuh, buka <a href="/practice">papan ketik aksara Bali</a>. Kalau Anda ingin memahami tanda-tanda yang muncul, simpan <a href="/blog/daftar-lengkap-aksara-bali">daftar lengkap aksara Bali</a> sebagai rujukan.
`.trim(),
    content_en: `
## Typing Balinese Without a Special Keyboard

Your keyboard has no Balinese keys, and it does not need any. There are two ways to type Balinese script on an ordinary QWERTY keyboard — one fast, one precise — and both run in the browser.

| Method | You type | Best for |
|--------|----------|----------|
| Automatic conversion | Latin letters | long text, writing quickly |
| On-screen script keyboard | script directly | ritual text, quotations, full control |

## Method 1: Type Latin, Script Appears

1. Open the <a href="/">converter page</a>.
2. Type normally in the left box — spell by sound, e.g. "rahajeng semeng".
3. Balinese script appears on the right as you type. There is no convert button.
4. Press **Copy** to take the result into another app.

This is the fastest route because you type at normal speed. The tool decides the letter forms — including when to stack consonants and when to apply adeg-adeg.

## Typing Conventions Worth Knowing

A few things behave differently than you might first assume:

- **Spell by sound, not by standard orthography.** "Suksma", not "sooksma"; "melajah", not "mlajah".
- **Type "w", not "v".** Balinese tradition realises /v/ as /w/ — *Veda* is written *Weda* (ᬯᬾᬤ).
- **Type "ng" and "ny" as written.** "Sayang" produces ᬲᬬᬂ, with cecek as the final mark.
- **Final consonants are handled for you.** "Wayan" (ᬯᬬᬦ᭄) gets its adeg-adeg without you typing one.
- **Sanskrit words are detected.** Hundreds of words such as *dharma* or *Saraswati* automatically take murda letters.
- **Numbers convert too.** Type 2026 and you get ᭒᭐᭒᭖.

## Taling and Pepet: One Key, Two Sounds

This is the most common source of confusion. The letter "e" in Balinese stands for two different sounds, and the script writes them with two different marks:

| Sound | Sign | Name | Example words |
|-------|------|------|--------------|
| /e/ | ᬾ | taling | dewa, sekar, becik |
| /ə/ | ᭂ | pepet | ketut, sěmeng |

Because a QWERTY keyboard has only one "e" key, every tool has to pick a convention. **This site's converter writes taling (ᬾ) for every "e" you type.**

When your text needs pepet, use the Balinese keyboard on the <a href="/practice">practice page</a> and tap the ᭂ key. This matters for text where precision counts — lontar quotations, ritual text, or teaching material.

One rule travels with it: **ra + pepet** is written ᬋ (ra repa) and **la + pepet** is written ᬍ (la lenga), never as a marked consonant. Details are in the <a href="/blog/daftar-lengkap-aksara-bali">complete Balinese script chart</a>.

## Method 2: The On-Screen Balinese Keyboard

The keyboard on the <a href="/practice">practice page</a> lays the script out as keys: the 18 base letters, murda letters, independent vowels, vowel signs (pepet included), adeg-adeg, cecek, bisah, and Balinese digits.

You tap ᬓ then ᬸ to get ᬓᬸ. Every writing decision stays yours — including which letter to use for similar sounds, such as dental sa (ᬲ) versus sa saga (ᬰ) in Sanskrit loanwords.

Use this when precision matters more than speed.

## Spaces: With or Without

Traditional lontar writing uses no spaces between words — *scriptio continua*. Modern digital text usually inserts a thin word separator so it reads well on screen, and that is what this site's converter does. For a lontar-style look, remove the spaces from your Latin text before converting.

## Method 3: Do Not Type at All — Read It From a Photo

Sometimes the writing already exists, just not as text: temple signage, carving, a lontar page, a screenshot. For that there is a **Baca dari foto** (read from photo) panel on the <a href="/">converter page</a>.

1. Open the **Baca dari foto** panel.
2. Drag an image onto the drop area, press **Pilih gambar** to pick a file, or **Ambil foto** to shoot one with your phone camera.
3. OCR recognises the characters and shows the reading in Latin letters — ready to edit and copy.

Results depend heavily on image quality. Sharp, straight-on photos with strong contrast between writing and background work best; worn stone carving or shadowed lontar is far harder. Treat the output as a draft you still need to check, not a final reading.

## Typing on a Phone

Everything above works on touchscreens. The site can also be installed as an app from your browser menu ("Add to Home Screen"), so the converter and keyboard keep working offline. Android users who want a native app can see the <a href="/blog/aplikasi-android-aksara-bali-rilis-baru">Aksara Bali Android app</a> article.

## Once You Have Typed It

- **Copy** — the output is Unicode text, ready for WhatsApp, Word, or social media
- **Download** — save it as a text file
- **PNG image** — export as word art on a transparent background, safe for design apps
- **Reverse mode** — paste Balinese script to read it back in Latin letters

If the pasted text shows as boxes (□□□), the receiving device has no Balinese font — the text itself is fine. Follow the <a href="/blog/cara-instal-font-aksara-bali">font installation guide</a>, or send it as an image.

## Quick Questions

**Do I need to install a keyboard layout?** No. Everything runs in the browser.

**Can I type directly in script instead of Latin?** Yes, with the keyboard on the <a href="/practice">practice page</a>.

**How do I write pepet?** Use the ᭂ key on that keyboard; the Latin converter writes taling for "e".

**How do I read existing Balinese script?** Use reverse mode in the converter, or drop a photo into the **Baca dari foto** panel on the <a href="/">converter page</a>, which runs OCR.

## Start Typing

For fast writing, open the <a href="/">Balinese script converter</a>. To type letter by letter with full control, open the <a href="/practice">Balinese keyboard</a>. And to understand the marks you see appearing, keep the <a href="/blog/daftar-lengkap-aksara-bali">complete Balinese script chart</a> open alongside.
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
