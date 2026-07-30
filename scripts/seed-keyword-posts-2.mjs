import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Second batch of converter-intent posts: name conversion, the full script
// chart, and everyday Balinese phrases with their script. Every Balinese
// example below was generated with utils/balineseConverter.js.

const posts = [
  {
    slug: 'nama-dalam-aksara-bali',
    title: 'Menulis Nama dalam Aksara Bali: Panduan, Contoh Nama Bali dan Nama Asing',
    title_en: 'Write Your Name in Balinese Script: A Guide with Balinese and Foreign Name Examples',
    excerpt: 'Cara menulis nama Anda dalam aksara Bali dengan benar — contoh nama Bali, nama Indonesia, dan nama asing, plus trik mengeja nama yang tidak punya padanan bunyi.',
    excerpt_en: 'How to write your name in Balinese script correctly — Balinese, Indonesian, and foreign name examples, plus how to respell names that have no Balinese sound equivalent.',
    category: 'Panduan Belajar',
    tags: ['nama dalam aksara bali', 'tulis nama aksara bali', 'balinese script name', 'konverter'],
    image_url: 'https://transliterasi-latin-ke-bahasa-bali.vercel.app/covers/nama-dalam-aksara-bali.png',
    read_time: '6 menit',
    content: `
## Menulis Nama: Alasan Orang Pertama Kali Mencari Aksara Bali

Menulis nama sendiri hampir selalu menjadi hal pertama yang dicoba orang ketika menemukan konverter aksara Bali — untuk bio media sosial, hadiah, undangan, desain kaus, atau sekadar penasaran. Prosesnya memang cepat: ketik nama Anda di <a href="/">halaman konverter</a>, dan aksaranya muncul saat itu juga.

Yang membuat hasilnya bagus atau janggal adalah **ejaannya**, bukan alatnya. Artikel ini menjelaskan cara mengeja nama supaya hasilnya benar-benar terbaca oleh orang Bali.

## Prinsip Utama: Aksara Bali Menulis Bunyi

Aksara Bali tidak menyalin huruf, melainkan bunyi. Nama Anda akan ditulis sesuai cara ia diucapkan, bukan cara ia dieja dalam huruf Latin. Karena itu:

- Huruf yang tidak dibunyikan akan hilang
- Huruf yang tidak ada dalam bahasa Bali perlu diganti bunyi terdekat
- Satu suku kata Latin bisa menjadi satu aksara utuh

Aturan praktisnya: ucapkan nama Anda pelan-pelan, lalu tulis apa yang terdengar.

## Contoh Nama Bali

Nama-nama Bali paling mudah dikonversi karena bunyinya memang berasal dari bahasa yang sama.

| Nama | Aksara Bali |
|------|------------|
| wayan | ᬯᬬᬦ᭄ |
| made | ᬫᬤᬾ |
| nyoman | ᬦ᭄ᬬᭀᬫᬦ᭄ |
| ketut | ᬓᬾᬢᬸᬢ᭄ |
| putu | ᬧᬸᬢᬸ |
| kadek | ᬓᬤᬾᬓ᭄ |
| komang | ᬓᭀᬫᬂ |
| gede | ᬕᬾᬤᬾ |
| luh | ᬮᬸᬳ᭄ |
| ayu | ᬅᬬᬸ |
| dewa | ᬤᬾᬯ |
| ida bagus | ᬇᬤ​ᬩᬕᬸᬲ᭄ |
| anak agung | ᬅᬦᬓ᭄​ᬅᬕᬸᬂ |

Perhatikan bagaimana bunyi akhir berubah bentuk: "komang" berakhir dengan cecek (ᬂ) untuk bunyi -ng, sementara "luh" berakhir dengan bisah untuk bunyi -h, dan "wayan" memakai adeg-adeg (᭄) untuk mematikan vokal terakhir.

## Contoh Nama Indonesia

| Nama | Aksara Bali |
|------|------------|
| budi | ᬩᬸᬤᬶ |
| siti | ᬲᬶᬢᬶ |
| rina | ᬭᬶᬦ |
| agus | ᬅᬕᬸᬲ᭄ |
| dewi | ᬤᬾᬯᬶ |
| sari | ᬲᬭᬶ |
| andi | ᬅᬦ᭄ᬤᬶ |
| maya | ᬫᬬ |
| yudi | ᬬᬸᬤᬶ |
| lestari | ᬮᬾᬲ᭄ᬢᬭᬶ |

## Nama Asing: Eja Ulang Dulu

Di sinilah hasil konversi paling sering terasa aneh. Bahasa Bali tidak punya beberapa bunyi yang lazim dalam nama Barat, dan gugus huruf seperti *ch*, *th*, atau *ph* tidak berperilaku seperti dugaan Anda.

Solusinya sederhana: **eja ulang nama Anda secara fonetis sebelum dikonversi.**

| Nama asli | Eja sebagai | Aksara Bali |
|-----------|------------|------------|
| Thomas | tomas | ᬢᭀᬫᬲ᭄ |
| Sofia | sopia | ᬲᭀᬧᬶ |
| Maria | mariya | ᬫᬭᬶᬬ |
| Olivia | oliwiya | ᬑᬮᬶᬯᬶᬬ |
| Daniel | daniyel | ᬤᬦᬶᬬᬾᬮ᭄ |
| Christopher | kristoper | ᬓ᭄ᬭᬶᬲ᭄ᬢᭀᬧᬾᬭ᭄ |
| Kevin | kevin | ᬓᬾᬯᬶᬦ᭄ |
| Sarah | sarah | ᬲᬭᬳ᭄ |

Empat pedoman yang menyelesaikan sebagian besar kasus:

1. **Bunyi f dan v** — Bahasa Bali tidak memakai f; gantilah dengan **p**. Fitri menjadi *pitri*, Sofia menjadi *sopia*. Untuk v, gunakan **w** (Vina → *wina*).
2. **Gugus th, ch, ph** — Tulis bunyi sebenarnya: Thomas → *tomas*, Christina → *kristina*, Philip → *pilip*.
3. **Dua vokal berdampingan** — Sisipkan **y** atau **w** di antaranya: Maria → *mariya*, Diana → *diyana*. Tanpa itu, alat akan menyisipkan vokal mandiri di tengah kata dan hasilnya terlihat terpotong.
4. **Huruf ganda dan huruf bisu** — Jennifer → *jenifer*, Anne → *an*.

## Cara Cepat Mengeceknya

Konverter punya tombol pelafalan yang membacakan teks Latin yang Anda ketik. Kalau yang terdengar sudah mirip cara nama Anda diucapkan, ejaan Anda sudah tepat untuk dikonversi. Kalau belum, perbaiki ejaannya — bukan aksaranya.

Untuk memastikan hasil akhirnya, salin aksara Bali tadi ke kolom sebaliknya dengan **mode terbalik**. Kalau bacaannya kembali mendekati nama Anda, konversinya konsisten.

## Menyimpan Nama Anda sebagai Gambar

Untuk dipakai di media sosial atau desain, teks Unicode berisiko tampil sebagai kotak di perangkat yang tidak punya font aksara Bali. Konverter menyediakan tampilan word-art yang bisa diunduh sebagai PNG berlatar transparan — aman dipakai di Canva, Instagram, atau untuk dicetak. Kalau Anda tetap ingin bentuk teks, pastikan perangkat penerima sudah memasang font; lihat <a href="/blog/cara-instal-font-aksara-bali">panduan instal font aksara Bali</a>.

## Sebelum Ditato atau Dicetak

Nama adalah hal paling pribadi yang bisa Anda tulis, dan kesalahan satu tanda vokal mengubah bunyinya. Sebelum permanen:

1. Bandingkan hasilnya dengan <a href="/blog/daftar-lengkap-aksara-bali">daftar lengkap aksara Bali</a> — cocokkan setiap aksara satu per satu.
2. Mintakan pemeriksaan kepada guru bahasa Bali atau penutur asli.
3. Kalau nama Anda mengandung gelar keagamaan atau nama dewa, tanyakan konteks pemakaiannya lebih dulu — sebagian nama punya kedudukan khusus dalam tradisi Hindu Bali.

## Coba Sekarang

Buka <a href="/">konverter aksara Bali</a> dan ketik nama Anda. Kalau hasilnya terlihat janggal, kembali ke bagian eja ulang di atas — sembilan dari sepuluh kasus selesai hanya dengan mengubah ejaannya. Ingin bisa menulisnya dengan tangan? Latih bentuk aksaranya di <a href="/practice">halaman latihan</a>.
`.trim(),
    content_en: `
## Writing a Name: Why Most People Look Up Balinese Script

Writing your own name is almost always the first thing people try when they find a Balinese script converter — for a social bio, a gift, an invitation, a shirt design, or plain curiosity. The mechanics are quick: type your name on the <a href="/">converter page</a> and the script appears instantly.

What makes the result good or awkward is the **spelling**, not the tool. This guide covers how to spell a name so the output actually reads correctly to a Balinese reader.

## The Core Principle: Balinese Script Writes Sound

Balinese script does not copy letters, it captures sounds. Your name is written the way it is pronounced, not the way it is spelled in Latin letters. Which means:

- Silent letters disappear
- Sounds that do not exist in Balinese need their nearest equivalent
- One Latin syllable can become a single complete character

The practical rule: say your name slowly, then write what you hear.

## Balinese Name Examples

Balinese names convert most cleanly, because the sounds come from the same language.

| Name | Balinese script |
|------|----------------|
| wayan | ᬯᬬᬦ᭄ |
| made | ᬫᬤᬾ |
| nyoman | ᬦ᭄ᬬᭀᬫᬦ᭄ |
| ketut | ᬓᬾᬢᬸᬢ᭄ |
| putu | ᬧᬸᬢᬸ |
| kadek | ᬓᬤᬾᬓ᭄ |
| komang | ᬓᭀᬫᬂ |
| gede | ᬕᬾᬤᬾ |
| luh | ᬮᬸᬳ᭄ |
| ayu | ᬅᬬᬸ |
| dewa | ᬤᬾᬯ |
| ida bagus | ᬇᬤ​ᬩᬕᬸᬲ᭄ |
| anak agung | ᬅᬦᬓ᭄​ᬅᬕᬸᬂ |

Notice how the final sounds change shape: "komang" ends in cecek (ᬂ) for the -ng sound, "luh" ends in bisah for -h, and "wayan" uses adeg-adeg (᭄) to kill the final vowel.

## Indonesian Name Examples

| Name | Balinese script |
|------|----------------|
| budi | ᬩᬸᬤᬶ |
| siti | ᬲᬶᬢᬶ |
| rina | ᬭᬶᬦ |
| agus | ᬅᬕᬸᬲ᭄ |
| dewi | ᬤᬾᬯᬶ |
| sari | ᬲᬭᬶ |
| andi | ᬅᬦ᭄ᬤᬶ |
| maya | ᬫᬬ |
| yudi | ᬬᬸᬤᬶ |
| lestari | ᬮᬾᬲ᭄ᬢᬭᬶ |

## Foreign Names: Respell Them First

This is where output most often looks strange. Balinese lacks several sounds common in Western names, and letter clusters like *ch*, *th*, or *ph* do not behave the way you would expect.

The fix is simple: **respell your name phonetically before converting it.**

| Original | Spell it as | Balinese script |
|----------|------------|----------------|
| Thomas | tomas | ᬢᭀᬫᬲ᭄ |
| Sofia | sopia | ᬲᭀᬧᬶ |
| Maria | mariya | ᬫᬭᬶᬬ |
| Olivia | oliwiya | ᬑᬮᬶᬯᬶᬬ |
| Daniel | daniyel | ᬤᬦᬶᬬᬾᬮ᭄ |
| Christopher | kristoper | ᬓ᭄ᬭᬶᬲ᭄ᬢᭀᬧᬾᬭ᭄ |
| Kevin | kevin | ᬓᬾᬯᬶᬦ᭄ |
| Sarah | sarah | ᬲᬭᬳ᭄ |

Four guidelines cover most cases:

1. **The f and v sounds** — Balinese does not use f; substitute **p**. Fitri becomes *pitri*, Sofia becomes *sopia*. For v, use **w** (Vina → *wina*).
2. **The th, ch, ph clusters** — Write the actual sound: Thomas → *tomas*, Christina → *kristina*, Philip → *pilip*.
3. **Two vowels side by side** — Slip a **y** or **w** between them: Maria → *mariya*, Diana → *diyana*. Without it, the tool inserts a standalone vowel character mid-word and the result looks broken.
4. **Doubled and silent letters** — Jennifer → *jenifer*, Anne → *an*.

## A Fast Way to Check

The converter has a pronunciation button that reads your Latin text aloud. If what you hear resembles how your name is actually said, your spelling is ready to convert. If not, fix the spelling — not the script.

To confirm the final result, paste the Balinese output back through **reverse mode**. If it reads back close to your name, the conversion is consistent.

## Saving Your Name as an Image

For social media or design work, Unicode text risks showing as boxes on devices without a Balinese font. The converter offers a word-art view you can download as a transparent PNG — safe for Canva, Instagram, or printing. If you want real text instead, make sure the receiving device has the font installed; see the <a href="/blog/cara-instal-font-aksara-bali">Balinese font installation guide</a>.

## Before You Tattoo or Print It

A name is the most personal thing you can write, and one misplaced vowel sign changes how it sounds. Before anything permanent:

1. Compare the output against the <a href="/blog/daftar-lengkap-aksara-bali">complete Balinese script chart</a> — match each character one by one.
2. Have a Balinese teacher or native speaker check it.
3. If your name contains a religious title or a deity's name, ask about appropriate use first — some names carry particular standing in Balinese Hindu tradition.

## Try It Now

Open the <a href="/">Balinese script converter</a> and type your name. If it looks odd, go back to the respelling section above — nine cases out of ten are solved by changing the spelling alone. Want to write it by hand? Practise the letter shapes on the <a href="/practice">practice page</a>.
`.trim(),
  },

  {
    slug: 'daftar-lengkap-aksara-bali',
    title: 'Daftar Lengkap Aksara Bali: Tabel Aksara, Vokal, Angka, dan Tanda Baca',
    title_en: 'Complete Balinese Script Chart: Letters, Vowels, Numerals, and Punctuation',
    excerpt: 'Tabel referensi aksara Bali lengkap: 18 aksara dasar hanacaraka, vokal mandiri, pangangge, angka Bali, dan tanda baca — beserta padanan Latinnya.',
    excerpt_en: 'A complete Balinese script reference chart: the 18 hanacaraka base letters, independent vowels, vowel signs, Balinese numerals, and punctuation, with Latin equivalents.',
    category: 'Panduan Belajar',
    tags: ['daftar aksara bali', 'tabel aksara bali', 'balinese alphabet', 'hanacaraka', 'referensi'],
    image_url: 'https://transliterasi-latin-ke-bahasa-bali.vercel.app/covers/daftar-lengkap-aksara-bali.png',
    read_time: '7 menit',
    content: `
## Referensi Cepat Aksara Bali

Halaman ini adalah tabel rujukan — simpan atau tandai untuk dibuka saat Anda sedang menulis, membaca papan nama, atau memeriksa hasil konversi. Setiap aksara ditampilkan bersama padanan Latinnya.

Kalau Anda hanya ingin mengubah teks dengan cepat, gunakan <a href="/">konverter aksara Bali</a>. Kalau Anda ingin memahami apa yang Anda lihat, mulailah dari sini.

## 18 Aksara Dasar (Hanacaraka)

Aksara Bali disusun dalam urutan tradisional yang disebut hanacaraka. Setiap aksara sudah membawa vokal /a/ di dalamnya — ᬓ dibaca "ka", bukan "k".

| Latin | Aksara | Latin | Aksara |
|-------|--------|-------|--------|
| ha | ᬳ | ma | ᬫ |
| na | ᬦ | ga | ᬕ |
| ca | ᬘ | ba | ᬩ |
| ra | ᬭ | nga | ᬗ |
| ka | ᬓ | pa | ᬧ |
| da | ᬤ | ja | ᬚ |
| ta | ᬢ | ya | ᬬ |
| sa | ᬲ | nya | ᬜ |
| wa | ᬯ | | |
| la | ᬮ | | |

Delapan belas aksara ini menutupi hampir seluruh kebutuhan menulis bahasa Bali sehari-hari. Panduan menghafalnya ada di artikel <a href="/blog/belajar-hanacaraka-panduan-lengkap">hanacaraka</a>.

## Aksara Suara (Vokal Mandiri)

Vokal mandiri dipakai ketika sebuah kata diawali vokal — misalnya "api" (ᬅᬧᬶ) atau "umah" (ᬉᬫᬳ᭄).

| Latin | Aksara |
|-------|--------|
| a | ᬅ |
| i | ᬇ |
| u | ᬉ |
| e | ᬏ |
| o | ᬑ |

## Pangangge Suara (Tanda Vokal)

Ketika vokal mengikuti konsonan, ia tidak ditulis sebagai aksara tersendiri melainkan sebagai tanda yang menempel. Contoh berikut memakai aksara ᬓ (ka).

| Bunyi | Nama tanda | Letak | Hasil |
|-------|-----------|-------|-------|
| ka | — (vokal bawaan) | — | ᬓ |
| ki | ulu | di atas | ᬓᬶ |
| ku | suku | di bawah | ᬓᬸ |
| ke | taleng | di kiri | ᬓᬾ |
| ko | taleng tedung | mengapit | ᬓᭀ |

Pembahasan lebih dalam beserta bentuk panjangnya ada di artikel <a href="/blog/pangangge-tanda-vokal-aksara-bali">pangangge</a>.

## Pangangge Tengenan (Konsonan Penutup)

Tiga bunyi penutup punya tanda khusus dan tidak ditulis sebagai aksara penuh. Contoh memakai ᬲ (sa).

| Bunyi | Nama tanda | Contoh | Hasil |
|-------|-----------|--------|-------|
| -ng | cecek | sang | ᬲᬂ |
| -r | surang | sar | ᬲᬃ |
| -h | bisah | sah | ᬲᬄ |

## Adeg-adeg: Mematikan Vokal

Tanda adeg-adeg (᭄) menghapus vokal /a/ bawaan sebuah aksara. Inilah yang membuat sebuah kata bisa berakhir dengan konsonan.

| Latin | Aksara | Keterangan |
|-------|--------|-----------|
| ka | ᬓ | vokal a bawaan |
| k | ᬓ᭄ | vokal dimatikan |
| sak | ᬲᬓ᭄ | penutup k di akhir kata |
| wayan | ᬯᬬᬦ᭄ | penutup n di akhir kata |

Di tengah kata, pertemuan dua konsonan ditulis dengan **gantungan** — bentuk kecil aksara kedua yang digantung di bawah aksara pertama. Contohnya terlihat pada "karya" (ᬓᬭ᭄ᬬ) dan "banjar" (ᬩᬦ᭄ᬚᬭ᭄).

## Angka Bali

Angka Bali punya karakternya sendiri dan masih dipakai pada penomoran lontar, penanggalan, serta papan nama.

| Angka | Aksara | Angka | Aksara |
|-------|--------|-------|--------|
| 0 | ᭐ | 5 | ᭕ |
| 1 | ᭑ | 6 | ᭖ |
| 2 | ᭒ | 7 | ᭗ |
| 3 | ᭓ | 8 | ᭘ |
| 4 | ᭔ | 9 | ᭙ |

Tahun 2026 ditulis ᭒᭐᭒᭖. Sejarah dan pemakaiannya dibahas di artikel <a href="/blog/angka-bali-sistem-penomoran-tradisional">angka Bali</a>.

## Tanda Baca

| Tanda | Nama | Fungsi |
|-------|------|--------|
| ᭞ | carik siki | pemisah antar bagian kalimat |
| ᭟ | carik pareren | penanda akhir kalimat |
| ᭄ | adeg-adeg | mematikan vokal |

Penulisan tradisional pada lontar tidak memakai spasi antar kata. Teks digital modern umumnya menambahkan pemisah tipis agar lebih mudah dibaca di layar.

## Aksara Murda dan Aksara Sansekerta

Selain 18 aksara dasar, ada satu set aksara tambahan yang dipakai untuk kata serapan Sansekerta — disebut **aksara murda**. Aksara ini merepresentasikan bunyi retroflex yang ada dalam Sansekerta tetapi tidak dipakai dalam percakapan Bali sehari-hari, dan muncul pada kata seperti *dharma*, *Wisnu*, atau *Saraswati*. Penjelasan lengkapnya ada di artikel <a href="/blog/aksara-murda-huruf-kapital-bali">aksara murda</a>.

Untuk penulisan sehari-hari, Anda tidak perlu menghafalnya. Konverter di situs ini mengenali ratusan kata Sansekerta umum dan memilih bentuk murda-nya secara otomatis.

## Cara Memakai Tabel Ini

1. **Membaca papan nama atau ukiran** — cari bentuk dasar aksaranya lebih dulu, baru perhatikan tanda vokal yang menempel.
2. **Memeriksa hasil konverter** — cocokkan aksara demi aksara sebelum tulisan dicetak atau ditato.
3. **Berlatih menulis** — gunakan kanvas menulis di <a href="/practice">halaman latihan</a>, lalu bandingkan dengan tabel ini.

## Kalau Aksara di Atas Tampil Kotak-kotak

Kalau tabel di halaman ini tampak berisi kotak kosong (□□□), perangkat Anda belum memiliki font aksara Bali. Ikuti <a href="/blog/cara-instal-font-aksara-bali">panduan instal font</a> — setelah terpasang, aksara Bali akan tampil normal di seluruh aplikasi.
`.trim(),
    content_en: `
## A Quick Balinese Script Reference

This page is a lookup table — bookmark it for when you are writing, reading a street sign, or checking converter output. Every character is shown with its Latin equivalent.

If you only need to convert text quickly, use the <a href="/">Balinese script converter</a>. If you want to understand what you are looking at, start here.

## The 18 Base Letters (Hanacaraka)

Balinese letters are arranged in a traditional order called hanacaraka. Each letter already carries an /a/ vowel — ᬓ reads "ka", not "k".

| Latin | Letter | Latin | Letter |
|-------|--------|-------|--------|
| ha | ᬳ | ma | ᬫ |
| na | ᬦ | ga | ᬕ |
| ca | ᬘ | ba | ᬩ |
| ra | ᬭ | nga | ᬗ |
| ka | ᬓ | pa | ᬧ |
| da | ᬤ | ja | ᬚ |
| ta | ᬢ | ya | ᬬ |
| sa | ᬲ | nya | ᬜ |
| wa | ᬯ | | |
| la | ᬮ | | |

These eighteen cover nearly all everyday written Balinese. There is a memorisation guide in the <a href="/blog/belajar-hanacaraka-panduan-lengkap">hanacaraka article</a>.

## Independent Vowels

Independent vowels are used when a word begins with a vowel — for example "api" (ᬅᬧᬶ) or "umah" (ᬉᬫᬳ᭄).

| Latin | Letter |
|-------|--------|
| a | ᬅ |
| i | ᬇ |
| u | ᬉ |
| e | ᬏ |
| o | ᬑ |

## Vowel Signs (Pangangge Suara)

When a vowel follows a consonant it is not written as its own letter but as an attached mark. The examples below use ᬓ (ka).

| Sound | Sign name | Position | Result |
|-------|-----------|----------|--------|
| ka | — (inherent vowel) | — | ᬓ |
| ki | ulu | above | ᬓᬶ |
| ku | suku | below | ᬓᬸ |
| ke | taleng | left | ᬓᬾ |
| ko | taleng tedung | both sides | ᬓᭀ |

The long forms and finer detail are covered in the <a href="/blog/pangangge-tanda-vokal-aksara-bali">pangangge article</a>.

## Final Consonant Marks (Pangangge Tengenan)

Three closing sounds have dedicated marks instead of full letters. Examples use ᬲ (sa).

| Sound | Sign name | Example | Result |
|-------|-----------|---------|--------|
| -ng | cecek | sang | ᬲᬂ |
| -r | surang | sar | ᬲᬃ |
| -h | bisah | sah | ᬲᬄ |

## Adeg-adeg: Killing the Vowel

The adeg-adeg mark (᭄) removes a letter's inherent /a/ vowel. It is what lets a word end in a consonant.

| Latin | Script | Note |
|-------|--------|------|
| ka | ᬓ | inherent a vowel |
| k | ᬓ᭄ | vowel killed |
| sak | ᬲᬓ᭄ | final k |
| wayan | ᬯᬬᬦ᭄ | final n |

Inside a word, two meeting consonants are written with **gantungan** — a small form of the second letter hung beneath the first. You can see it in "karya" (ᬓᬭ᭄ᬬ) and "banjar" (ᬩᬦ᭄ᬚᬭ᭄).

## Balinese Numerals

Balinese numerals have their own characters and still appear in lontar page numbering, calendars, and signage.

| Digit | Numeral | Digit | Numeral |
|-------|---------|-------|---------|
| 0 | ᭐ | 5 | ᭕ |
| 1 | ᭑ | 6 | ᭖ |
| 2 | ᭒ | 7 | ᭗ |
| 3 | ᭓ | 8 | ᭘ |
| 4 | ᭔ | 9 | ᭙ |

The year 2026 is written ᭒᭐᭒᭖. Their history and use are covered in the <a href="/blog/angka-bali-sistem-penomoran-tradisional">Balinese numerals article</a>.

## Punctuation

| Mark | Name | Function |
|------|------|----------|
| ᭞ | carik siki | separates clauses |
| ᭟ | carik pareren | marks the end of a sentence |
| ᭄ | adeg-adeg | kills the inherent vowel |

Traditional lontar writing uses no spaces between words. Modern digital text usually inserts a thin separator so it reads more easily on screen.

## Murda Letters and Sanskrit

Beyond the 18 base letters there is an additional set used for Sanskrit loanwords, called **aksara murda**. These represent retroflex sounds that exist in Sanskrit but are not used in everyday spoken Balinese, and they show up in words like *dharma*, *Wisnu*, or *Saraswati*. The full explanation is in the <a href="/blog/aksara-murda-huruf-kapital-bali">murda article</a>.

For everyday writing you do not need to memorise them. This site's converter recognises hundreds of common Sanskrit words and selects the murda form automatically.

## How to Use This Chart

1. **Reading signage or carving** — find the base letter shape first, then look at the attached vowel signs.
2. **Checking converter output** — match character by character before anything is printed or tattooed.
3. **Practising writing** — use the writing canvas on the <a href="/practice">practice page</a>, then compare against this chart.

## If the Characters Above Look Like Boxes

If this page's tables appear as empty boxes (□□□), your device has no Balinese font. Follow the <a href="/blog/cara-instal-font-aksara-bali">font installation guide</a> — once installed, Balinese script renders correctly across all your apps.
`.trim(),
  },

  {
    slug: 'ucapan-bahasa-bali-sehari-hari',
    title: 'Ucapan Bahasa Bali Sehari-hari Lengkap dengan Tulisan Aksaranya',
    title_en: 'Everyday Balinese Phrases, Written in Balinese Script',
    excerpt: 'Kumpulan salam dan ucapan bahasa Bali yang paling sering dipakai — dari om swastyastu hingga matur suksma — lengkap dengan tulisan aksara Bali dan cara memakainya.',
    excerpt_en: 'The most-used Balinese greetings and everyday phrases — from om swastyastu to matur suksma — with their Balinese script and notes on when to use them.',
    category: 'Panduan Belajar',
    tags: ['ucapan bahasa bali', 'salam bahasa bali', 'translate aksara bali', 'basa bali'],
    image_url: 'https://transliterasi-latin-ke-bahasa-bali.vercel.app/covers/ucapan-bahasa-bali-sehari-hari.png',
    read_time: '6 menit',
    content: `
## Kata dalam Bahasa Bali, Bukan Sekadar Aksara Bali

Banyak orang datang ke konverter aksara Bali dengan kalimat bahasa Indonesia atau Inggris, lalu heran mengapa hasilnya tidak "terasa Bali". Penyebabnya sederhana: konverter mengubah **tulisan**, bukan **bahasa**. "Terima kasih" yang dikonversi tetap berbunyi "terima kasih", hanya berganti aksara.

Kalau yang Anda inginkan adalah kalimat yang benar-benar berbahasa Bali, mulailah dari kata Balinya. Halaman ini menyediakan ucapan yang paling sering dipakai, lengkap dengan tulisan aksaranya — tinggal disalin.

## Salam dan Sapaan

| Bahasa Bali | Arti | Aksara Bali |
|------------|------|------------|
| om swastyastu | salam pembuka | ᬑᬫ᭄​ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ |
| rahajeng semeng | selamat pagi | ᬭᬳᬚᬾᬂ​ᬲᬾᬫᬾᬂ |
| rahajeng rauh | selamat datang | ᬭᬳᬚᬾᬂ​ᬭᬉᬳ᭄ |
| punapi gatra | apa kabar | ᬧᬸᬦᬧᬶ​ᬕᬢ᭄ᬭ |
| becik becik | baik-baik saja | ᬩᬾᬘᬶᬓ᭄​ᬩᬾᬘᬶᬓ᭄ |
| sane becik | yang baik | ᬲᬦᬾ​ᬩᬾᬘᬶᬓ᭄ |

**Om swastyastu** adalah salam pembuka Hindu Bali yang dipakai secara luas — di sekolah, rapat desa, hingga pembukaan acara. Padanan penutupnya adalah *om shanti shanti shanti om* (ᬑᬫ᭄​ᬰᬦ᭄ᬢᬶ​ᬰᬦ᭄ᬢᬶ​ᬰᬦ᭄ᬢᬶ​ᬑᬫ᭄).

## Terima Kasih dan Permisi

| Bahasa Bali | Arti | Aksara Bali |
|------------|------|------------|
| matur suksma | terima kasih | ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ |
| suksma | terima kasih (santai) | ᬲᬸᬓ᭄ᬲ᭄ᬫ |
| suksma mewali | sama-sama | ᬲᬸᬓ᭄ᬲ᭄ᬫ​ᬫᬾᬯᬮᬶ |
| sugra | permisi, mohon maaf | ᬲᬸᬕ᭄ᬭ |

*Matur suksma* adalah bentuk yang lebih halus dan sopan; *suksma* saja lazim dipakai antar teman sebaya. Jawabannya adalah *suksma mewali*.

## Tingkatan Bahasa: Hal yang Tidak Bisa Diabaikan

Bahasa Bali mengenal tingkatan tutur (*sor singgih*) — pilihan kata berubah menurut siapa yang diajak bicara. Kata untuk "saya" saja punya beberapa bentuk: *tiang* untuk percakapan umum yang sopan, dan bentuk yang lebih halus untuk berbicara dengan orang yang dihormati atau dalam konteks keagamaan.

Karena itu, menyalin satu daftar kata tanpa memperhatikan konteks bisa terdengar janggal — atau kurang sopan. Kalau Anda menulis untuk undangan, sambutan, atau keperluan upacara, mintalah penutur asli memeriksanya. Untuk keperluan sehari-hari, ucapan di halaman ini aman dipakai.

## Kata Sehari-hari

| Bahasa Bali | Arti | Aksara Bali |
|------------|------|------------|
| umah | rumah | ᬉᬫᬳ᭄ |
| toya | air | ᬢᭀᬬ |
| nasi | nasi | ᬦᬲᬶ |
| pasar | pasar | ᬧᬲᬭ᭄ |
| sekolah | sekolah | ᬲᬾᬓᭀᬮᬳ᭄ |
| banjar | perkumpulan warga desa | ᬩᬦ᭄ᬚᬭ᭄ |
| pura | pura | ᬧᬸᬭ |
| sekar | bunga | ᬲᬾᬓᬭ᭄ |
| bulan | bulan | ᬩᬸᬮᬦ᭄ |
| batu | batu | ᬩᬢᬸ |

## Frasa yang Sering Dipakai

| Bahasa Bali | Arti | Aksara Bali |
|------------|------|------------|
| melajah basa bali | belajar bahasa Bali | ᬫᬾᬮᬚᬳ᭄​ᬩᬲ​ᬩᬮᬶ |
| melajah aksara bali | belajar aksara Bali | ᬫᬾᬮᬚᬳ᭄​ᬅᬓ᭄ᬲᬭ​ᬩᬮᬶ |
| matur suksma pisan | terima kasih banyak | ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ​ᬧᬶᬲᬦ᭄ |

## Cara Memakai Daftar Ini

1. **Salin langsung.** Aksara pada tabel di atas adalah teks Unicode — sorot, salin, tempel ke mana pun Anda butuhkan.
2. **Ubah sendiri.** Untuk kata yang tidak ada di sini, ketik kata Balinya di <a href="/">konverter aksara Bali</a> dan aksaranya akan muncul seketika.
3. **Periksa bunyinya.** Tombol pelafalan pada konverter membantu memastikan ejaan Anda sesuai bunyi yang dimaksud.

## Kalau Tulisannya Tampil Kotak-kotak

Kotak kosong (□□□) berarti perangkat Anda belum punya font aksara Bali — teksnya sendiri sudah benar. Pasang fontnya lewat <a href="/blog/cara-instal-font-aksara-bali">panduan ini</a>, atau ekspor tulisan sebagai gambar PNG dari konverter kalau tujuannya untuk desain.

## Lanjut Belajar

Ucapan hafalan membawa Anda cukup jauh, tetapi membaca aksaranya sendiri jauh lebih memuaskan. Mulailah dari <a href="/blog/daftar-lengkap-aksara-bali">daftar lengkap aksara Bali</a>, lalu uji hafalan Anda lewat kuis dan papan ketik di <a href="/practice">halaman latihan</a>. Untuk menulis nama sendiri, ada panduannya di artikel <a href="/blog/nama-dalam-aksara-bali">menulis nama dalam aksara Bali</a>.
`.trim(),
    content_en: `
## Balinese Words, Not Just Balinese Letters

Many people arrive at a Balinese script converter with an English or Indonesian sentence and wonder why the result does not feel Balinese. The reason is simple: a converter changes the **writing**, not the **language**. "Thank you" converted still reads "thank you" — only the characters change.

If you want wording that is genuinely Balinese, you have to start from the Balinese words. This page collects the phrases people use most, together with their script — ready to copy.

## Greetings

| Balinese | Meaning | Balinese script |
|----------|---------|----------------|
| om swastyastu | opening greeting | ᬑᬫ᭄​ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ |
| rahajeng semeng | good morning | ᬭᬳᬚᬾᬂ​ᬲᬾᬫᬾᬂ |
| rahajeng rauh | welcome | ᬭᬳᬚᬾᬂ​ᬭᬉᬳ᭄ |
| punapi gatra | how are you | ᬧᬸᬦᬧᬶ​ᬕᬢ᭄ᬭ |
| becik becik | I am well | ᬩᬾᬘᬶᬓ᭄​ᬩᬾᬘᬶᬓ᭄ |
| sane becik | the good one | ᬲᬦᬾ​ᬩᬾᬘᬶᬓ᭄ |

**Om swastyastu** is the Balinese Hindu opening greeting, used widely — in schools, village meetings, and at the start of events. Its closing counterpart is *om shanti shanti shanti om* (ᬑᬫ᭄​ᬰᬦ᭄ᬢᬶ​ᬰᬦ᭄ᬢᬶ​ᬰᬦ᭄ᬢᬶ​ᬑᬫ᭄).

## Thanks and Apologies

| Balinese | Meaning | Balinese script |
|----------|---------|----------------|
| matur suksma | thank you | ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ |
| suksma | thanks (casual) | ᬲᬸᬓ᭄ᬲ᭄ᬫ |
| suksma mewali | you are welcome | ᬲᬸᬓ᭄ᬲ᭄ᬫ​ᬫᬾᬯᬮᬶ |
| sugra | excuse me, sorry | ᬲᬸᬕ᭄ᬭ |

*Matur suksma* is the more polite, refined form; plain *suksma* is common between peers. The reply is *suksma mewali*.

## Speech Levels: Something You Cannot Skip

Balinese has speech levels (*sor singgih*) — word choice shifts depending on who you are addressing. Even the word for "I" has several forms: *tiang* for ordinary polite conversation, and more refined forms when speaking to someone of higher standing or in a religious setting.

Because of that, copying a word list without regard for context can sound off — or impolite. If you are writing for an invitation, a speech, or a ceremony, ask a native speaker to review it. For everyday use, the phrases on this page are safe.

## Everyday Words

| Balinese | Meaning | Balinese script |
|----------|---------|----------------|
| umah | house | ᬉᬫᬳ᭄ |
| toya | water | ᬢᭀᬬ |
| nasi | rice | ᬦᬲᬶ |
| pasar | market | ᬧᬲᬭ᭄ |
| sekolah | school | ᬲᬾᬓᭀᬮᬳ᭄ |
| banjar | village community association | ᬩᬦ᭄ᬚᬭ᭄ |
| pura | temple | ᬧᬸᬭ |
| sekar | flower | ᬲᬾᬓᬭ᭄ |
| bulan | moon | ᬩᬸᬮᬦ᭄ |
| batu | stone | ᬩᬢᬸ |

## Common Phrases

| Balinese | Meaning | Balinese script |
|----------|---------|----------------|
| melajah basa bali | learning the Balinese language | ᬫᬾᬮᬚᬳ᭄​ᬩᬲ​ᬩᬮᬶ |
| melajah aksara bali | learning Balinese script | ᬫᬾᬮᬚᬳ᭄​ᬅᬓ᭄ᬲᬭ​ᬩᬮᬶ |
| matur suksma pisan | thank you very much | ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ​ᬧᬶᬲᬦ᭄ |

## How to Use This List

1. **Copy it directly.** The script in the tables above is Unicode text — select, copy, paste wherever you need it.
2. **Convert your own.** For words not listed here, type the Balinese word into the <a href="/">converter</a> and the script appears instantly.
3. **Check the sound.** The converter's pronunciation button helps confirm your spelling matches the intended sound.

## If the Script Shows as Boxes

Empty boxes (□□□) mean your device lacks a Balinese font — the text itself is correct. Install the font using <a href="/blog/cara-instal-font-aksara-bali">this guide</a>, or export the writing as a PNG from the converter if it is for design work.

## Keep Going

Memorised phrases take you a fair distance, but reading the script yourself is far more satisfying. Start with the <a href="/blog/daftar-lengkap-aksara-bali">complete Balinese script chart</a>, then test yourself with the quiz and keyboard on the <a href="/practice">practice page</a>. To write your own name, there is a guide in <a href="/blog/nama-dalam-aksara-bali">writing your name in Balinese script</a>.
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
