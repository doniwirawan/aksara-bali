import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Batch 5: the tattoo/design intent (high commercial value, handled with the
// caveats it deserves), the Aji Saka origin story that komangputra.com ranks
// for, and using Balinese script inside Word / Canva / Photoshop.

const COVERS = 'https://aksarabali.doniwirawan.xyz/covers/'

const posts = [
  {
    slug: 'aksara-bali-untuk-tato-dan-desain',
    title: 'Aksara Bali untuk Tato dan Desain: Panduan Sebelum Permanen',
    title_en: 'Balinese Script for Tattoos and Design: What to Check First',
    excerpt: 'Cara menyiapkan tulisan aksara Bali untuk tato, undangan, atau desain — memilih kata, memeriksa ejaan, mengekspor sebagai gambar, dan aksara yang sebaiknya tidak dipakai sebagai hiasan.',
    excerpt_en: 'How to prepare Balinese script for a tattoo, invitation, or design — choosing words, verifying spelling, exporting as an image, and which characters should not be used as decoration.',
    category: 'Teknologi & Budaya',
    tags: ['tato aksara bali', 'desain aksara bali', 'balinese script tattoo', 'font aksara bali'],
    image_url: COVERS + 'aksara-bali-untuk-tato-dan-desain.png',
    read_time: '7 menit',
    content: `
## Sebelum Tinta Menyentuh Kulit

Aksara Bali indah dipandang, dan itulah alasan banyak orang ingin memakainya untuk tato, undangan pernikahan, logo, atau cetakan. Masalahnya, kesalahan pada tulisan permanen tidak bisa diedit — dan kesalahan yang paling sering terjadi bukan soal bentuk huruf, melainkan soal **bahasa**.

Artikel ini menyusun langkah-langkah pemeriksaan sebelum tulisan Anda dicetak, dipahat, atau ditato.

## Kesalahan Nomor Satu: Menulis Bahasa Asing dengan Aksara Bali

Konverter aksara Bali mengubah **tulisan**, bukan **arti**. Kalau Anda memasukkan kalimat bahasa Inggris, hasilnya adalah kalimat bahasa Inggris yang ditulis dengan aksara Bali. Bentuknya cantik, tetapi bagi pembaca Bali kalimat itu tidak bermakna apa-apa — mereka hanya akan mengeja bunyi asing.

Urutan yang benar:

1. Tentukan arti yang Anda inginkan
2. Cari padanan katanya dalam bahasa Bali — lihat <a href="/blog/translate-bahasa-indonesia-ke-bahasa-bali">panduan translate Indonesia–Bali</a>
3. Baru ubah tulisannya di <a href="/">konverter aksara Bali</a>

## Kata yang Sering Dipilih

| Bahasa Bali | Arti | Aksara Bali |
|------------|------|------------|
| tresna | cinta | ᬢ᭄ᬭᬾᬲ᭄ᬦ |
| rahayu | selamat, sejahtera | ᬭᬳᬬᬸ |
| taksu | daya pesona dari dalam | ᬢᬓ᭄ᬲᬸ |
| bakti | pengabdian | ᬩᬓ᭄ᬢᬶ |
| sakti | berdaya, kuat | ᬲᬓ᭄ᬢᬶ |
| urip | hidup | ᬉᬭᬶᬧ᭄ |
| jiwa | jiwa | ᬚᬶᬯ |
| atma | jiwa, roh | ᬅᬢ᭄ᬫ |
| astungkara | semoga terkabul | ᬅᬲ᭄ᬢᬸᬂᬓᬭ |
| tri hita karana | tiga penyebab kesejahteraan | ᬢ᭄ᬭᬶ​ᬳᬶᬢ​ᬓᬭᬦ |
| menyama braya | persaudaraan antar sesama | ᬫᬾᬜᬫ​ᬩ᭄ᬭᬬ |
| paras paros | saling menghargai | ᬧᬭᬲ᭄​ᬧᬭᭀᬲ᭄ |

Kata pendek lebih aman daripada kalimat panjang: lebih sedikit peluang salah, dan bentuknya lebih terbaca ketika dicetak kecil.

## Aksara yang Sebaiknya Tidak Dipakai sebagai Hiasan

Tidak semua aksara Bali bersifat netral. Sebagian karakter dan rajah punya kedudukan sakral dalam tradisi Hindu Bali:

- **Aksara modre** — aksara bercorak sakral yang dipakai dalam teks keagamaan
- **Rerajahan** — gambar dan rangkaian aksara bertuah yang dibuat dengan tata cara tertentu; lihat artikel <a href="/blog/rerajahan-seni-sakral-aksara-bali">rerajahan</a>
- **Simbol dan mantra suci** — dipakai dalam upacara dan biasanya diucapkan atau dituliskan oleh orang yang berwenang

Memakainya sebagai hiasan tanpa memahami konteksnya bisa dianggap kurang pantas oleh masyarakat Bali. Kalau Anda tertarik pada makna spiritualnya, tanyakan lebih dulu kepada pemangku atau guru bahasa Bali — bukan kepada mesin pencari.

## Empat Langkah Pemeriksaan

1. **Periksa artinya.** Pastikan kata Balinya benar-benar berarti apa yang Anda maksud, bukan sekadar terdengar mirip.
2. **Periksa ejaannya.** Ketik ulang di <a href="/">konverter</a>, lalu bandingkan aksara demi aksara dengan <a href="/blog/daftar-lengkap-aksara-bali">daftar lengkap aksara Bali</a>. Perhatikan tanda vokal kecil — satu ulu atau suku yang keliru mengubah bunyinya.
3. **Uji arah baliknya.** Tempelkan hasilnya ke mode terbalik di konverter. Kalau terbaca kembali sesuai kata Anda, konversinya konsisten.
4. **Mintakan verifikasi manusia.** Guru bahasa Bali, penutur asli, atau komunitas aksara Bali. Untuk tato, langkah ini bukan pilihan tambahan.

## Menyiapkan Berkas untuk Desainer atau Seniman Tato

Jangan mengirim teks lewat aplikasi chat dan berharap tampil sama di layar mereka. Kalau perangkat mereka tidak punya font aksara Bali, tulisan Anda berubah menjadi kotak-kotak — dan yang lebih berbahaya, sebagian aplikasi menampilkan aksara secara terpisah tanpa membentuk gantungan.

Cara yang aman:

- **Kirim sebagai gambar.** Konverter bisa mengekspor hasilnya sebagai PNG berlatar transparan. Gambar tampil identik di semua perangkat.
- **Sertakan juga teks Latinnya.** Supaya penerima tahu kata apa yang dimaksud dan bisa memeriksanya sendiri.
- **Sertakan rujukan.** Tautkan <a href="/blog/daftar-lengkap-aksara-bali">daftar aksara</a> agar bentuk tiap aksara bisa dicocokkan.
- **Untuk cetak besar,** minta desainer memakai font aksara Bali asli (misalnya Noto Sans Balinese) alih-alih menjiplak bentuk dari gambar kecil.

## Kalau Aksaranya Tampil Terpisah di Aplikasi Desain

Aplikasi desain sering perlu diberi tahu bahwa teks Anda memakai aksara kompleks. Kalau gantungan tidak terbentuk atau tanda vokal salah posisi:

- Pastikan font aksara Bali sudah terpasang — lihat <a href="/blog/cara-instal-font-aksara-bali">panduan instal font</a>
- Di Photoshop, aktifkan opsi teks *Middle Eastern & South Asian* pada preferensi tipe
- Kalau tetap bermasalah, tempatkan tulisannya sebagai gambar PNG, bukan sebagai teks hidup

Penjelasan mengapa aksara bisa tampil terpisah ada di artikel <a href="/blog/gantungan-gempelan-aksara-bali">gantungan dan gempelan</a>.

## Pertanyaan Singkat

**Apakah boleh menato aksara Bali kalau saya bukan orang Bali?** Tidak ada larangan umum untuk kata-kata sehari-hari. Yang perlu dihindari adalah memakai aksara dan simbol sakral tanpa konteks. Bertanya lebih dulu adalah bentuk penghormatan yang paling sederhana.

**Bisakah nama saya ditulis dalam aksara Bali?** Bisa — caranya ada di artikel <a href="/blog/nama-dalam-aksara-bali">menulis nama dalam aksara Bali</a>.

**Bagaimana mendapatkan berkas resolusi tinggi?** Gunakan ekspor PNG dari konverter, lalu perbesar di aplikasi desain memakai font aslinya agar tetap tajam.

**Apakah hasil konverter cukup untuk langsung ditato?** Anggap itu draf. Pemeriksaan oleh penutur asli adalah langkah terakhir yang tidak boleh dilewati.
`.trim(),
    content_en: `
## Before the Ink Touches Skin

Balinese script is beautiful, which is why people want it for tattoos, wedding invitations, logos, and prints. The problem is that mistakes in permanent lettering cannot be edited — and the most common mistake is not about letter shapes at all. It is about **language**.

This guide lays out the checks worth running before anything is printed, carved, or tattooed.

## Mistake Number One: Writing a Foreign Language in Balinese Letters

A Balinese script converter changes the **writing**, not the **meaning**. Feed it an English sentence and you get an English sentence in Balinese characters. It looks lovely, but to a Balinese reader it means nothing — they will simply sound out foreign syllables.

The right order:

1. Decide the meaning you want
2. Find the Balinese wording — see the <a href="/blog/translate-bahasa-indonesia-ke-bahasa-bali">translation guide</a>
3. Only then convert the writing in the <a href="/">Balinese script converter</a>

## Words People Often Choose

| Balinese | Meaning | Balinese script |
|----------|---------|----------------|
| tresna | love | ᬢ᭄ᬭᬾᬲ᭄ᬦ |
| rahayu | safe, well | ᬭᬳᬬᬸ |
| taksu | inner charisma | ᬢᬓ᭄ᬲᬸ |
| bakti | devotion | ᬩᬓ᭄ᬢᬶ |
| sakti | powerful | ᬲᬓ᭄ᬢᬶ |
| urip | life | ᬉᬭᬶᬧ᭄ |
| jiwa | soul | ᬚᬶᬯ |
| atma | soul, spirit | ᬅᬢ᭄ᬫ |
| astungkara | may it be granted | ᬅᬲ᭄ᬢᬸᬂᬓᬭ |
| tri hita karana | the three causes of wellbeing | ᬢ᭄ᬭᬶ​ᬳᬶᬢ​ᬓᬭᬦ |
| menyama braya | kinship with others | ᬫᬾᬜᬫ​ᬩ᭄ᬭᬬ |
| paras paros | mutual respect | ᬧᬭᬲ᭄​ᬧᬭᭀᬲ᭄ |

Short words are safer than long sentences: fewer chances to go wrong, and far more legible at small sizes.

## Characters That Should Not Be Used as Decoration

Not all Balinese characters are neutral. Some hold sacred standing in Balinese Hindu tradition:

- **Aksara modre** — sacred letter forms used in religious texts
- **Rerajahan** — potent letter-and-symbol drawings made under specific conditions; see the <a href="/blog/rerajahan-seni-sakral-aksara-bali">rerajahan article</a>
- **Sacred symbols and mantras** — used in ceremony, normally written or spoken by those authorised to do so

Using them decoratively without understanding the context can read as disrespectful in Bali. If their spiritual meaning is what draws you, ask a temple priest or a Balinese teacher first — not a search engine.

## A Four-Step Check

1. **Check the meaning.** Make sure the Balinese word means what you intend, not merely something that sounds close.
2. **Check the spelling.** Retype it in the <a href="/">converter</a> and compare character by character against the <a href="/blog/daftar-lengkap-aksara-bali">complete script chart</a>. Watch the small vowel signs — one wrong ulu or suku changes the sound.
3. **Test the reverse.** Paste the result into the converter's reverse mode. If it reads back as your word, the conversion is consistent.
4. **Get human verification.** A Balinese teacher, a native speaker, or a script community. For a tattoo this is not an optional extra.

## Preparing Files for a Designer or Tattoo Artist

Do not send the text through a chat app and assume it will look the same on their screen. If their device lacks a Balinese font your writing becomes boxes — and worse, some apps show the letters separately without forming gantungan.

The safe way:

- **Send an image.** The converter exports a transparent PNG. An image looks identical everywhere.
- **Include the Latin spelling too.** So the recipient knows the word and can verify it themselves.
- **Include a reference.** Link the <a href="/blog/daftar-lengkap-aksara-bali">script chart</a> so each character can be matched.
- **For large print,** ask the designer to set it in a real Balinese font such as Noto Sans Balinese rather than tracing a small image.

## If the Script Renders Separated in Design Apps

Design software often needs telling that your text uses a complex script. If gantungan does not form or vowel signs sit in the wrong place:

- Confirm a Balinese font is installed — see the <a href="/blog/cara-instal-font-aksara-bali">font installation guide</a>
- In Photoshop, enable the *Middle Eastern & South Asian* type options in preferences
- If problems persist, place the writing as a PNG rather than live text

Why script renders separated is explained in the <a href="/blog/gantungan-gempelan-aksara-bali">gantungan and gempelan article</a>.

## Quick Questions

**Is it acceptable to tattoo Balinese script if I am not Balinese?** There is no general prohibition on everyday words. What to avoid is using sacred characters and symbols without context. Asking first is the simplest form of respect.

**Can my name be written in Balinese script?** Yes — see <a href="/blog/nama-dalam-aksara-bali">writing your name in Balinese script</a>.

**How do I get a high-resolution file?** Export the PNG from the converter, then set it in a real font in your design app so it stays sharp at size.

**Is converter output good enough to tattoo directly?** Treat it as a draft. Native-speaker review is the last step you should never skip.
`.trim(),
  },

  {
    slug: 'asal-usul-aksara-bali-aji-saka',
    title: 'Asal-usul Aksara Bali dan Legenda Aji Saka di Balik Hanacaraka',
    title_en: 'The Origins of Balinese Script and the Aji Saka Legend Behind Hanacaraka',
    excerpt: 'Dari aksara Brahmi hingga lontar Bali, dan legenda Aji Saka dengan dua abdinya yang menjelaskan mengapa urutan aksara dimulai dengan ha-na-ca-ra-ka.',
    excerpt_en: 'From Brahmi to Balinese lontar, and the Aji Saka legend of two loyal servants that explains why the letter order begins ha-na-ca-ra-ka.',
    category: 'Sejarah & Budaya',
    tags: ['asal usul aksara bali', 'aji saka', 'legenda hanacaraka', 'sejarah aksara bali'],
    image_url: COVERS + 'asal-usul-aksara-bali-aji-saka.png',
    read_time: '7 menit',
    content: `
## Dua Cara Menjawab "Dari Mana Aksara Bali Berasal?"

Pertanyaan ini punya dua jawaban yang sama benarnya. Yang pertama adalah jawaban sejarah: rangkaian panjang penurunan aksara dari India ke Nusantara. Yang kedua adalah jawaban tradisi: sebuah legenda tentang seorang raja dan dua abdinya, yang menjelaskan mengapa urutan aksaranya berbunyi *ha-na-ca-ra-ka*.

Keduanya layak diketahui, dan keduanya menjelaskan hal yang berbeda.

## Jawaban Sejarah: Perjalanan dari Brahmi

Aksara Bali termasuk keluarga **aksara Brahmi** — kelompok aksara yang menurunkan hampir seluruh sistem tulisan di Asia Selatan dan Asia Tenggara. Perjalanannya bertahap:

| Tahap | Perkiraan masa | Keterangan |
|-------|---------------|-----------|
| Brahmi | abad ke-3 SM | aksara induk di India |
| Pallawa | abad ke-4–8 M | dibawa lewat jalur perdagangan ke Nusantara |
| Kawi | abad ke-8–15 M | berkembang di Jawa, dipakai untuk Jawa Kuno dan Sansekerta |
| Aksara Bali | sejak sekitar abad ke-11 M | turunan Kawi yang berkembang dan bertahan di Bali |

Karena berasal dari tradisi tulis India, aksara Bali mewarisi strukturnya: sistem **abugida** dengan vokal /a/ bawaan, tanda vokal yang menempel, dan penyusunan konsonan menurut tempat artikulasi. Rinciannya ada di <a href="/blog/daftar-lengkap-aksara-bali">daftar lengkap aksara Bali</a>.

Warisan itu juga tampak pada kosakata: ribuan kata Bali berasal dari bahasa Sansekerta, dan sebagiannya ditulis dengan aksara khusus — lihat artikel <a href="/blog/aksara-bali-dan-bahasa-sansekerta">aksara Bali dan Sansekerta</a>.

## Jawaban Tradisi: Legenda Aji Saka

Legenda ini dituturkan di Jawa maupun Bali dengan beberapa versi. Garis besarnya sama.

Seorang tokoh bernama **Aji Saka** memiliki dua abdi yang sama-sama setia. Ketika hendak bepergian, ia menitipkan pusakanya kepada salah satu abdinya dengan pesan: jangan serahkan kepada siapa pun kecuali kepada dirinya sendiri.

Waktu berlalu. Aji Saka mengutus abdi yang lain untuk mengambil pusaka itu. Abdi yang menjaga menolak menyerahkannya — ia memegang teguh pesan yang diterimanya. Abdi yang diutus juga tidak mau kembali dengan tangan kosong — ia memegang teguh perintah yang diterimanya.

Keduanya sama-sama setia. Keduanya sama-sama sakti. Mereka bertarung, dan keduanya gugur.

Aji Saka menemukan kedua abdinya telah meninggal karena sama-sama menjalankan perintahnya. Untuk mengenang mereka, ia menyusun sebuah rangkaian aksara yang menceritakan kejadian itu — dan rangkaian itulah yang kita kenal sebagai urutan hanacaraka.

Dalam versi Bali, kedua abdi itu disebut **I Yana** dan **I Yalip**; dalam versi Jawa, **Dora** dan **Sembada**.

## Membaca Urutan Hanacaraka sebagai Kalimat

Urutan aksara dibaca sebagai kalimat bersambung, dengan pemaknaan yang lazim dituturkan seperti berikut:

| Baris | Makna yang dituturkan |
|-------|----------------------|
| ha na ca ra ka | ada dua orang abdi |
| da ta sa wa la | mereka berselisih |
| ma ga ba nga pa | keduanya sama-sama sakti |
| ja ya nya | keduanya gugur |

Versi Jawa memuat dua puluh aksara, sedangkan versi Bali yang lazim diajarkan memuat delapan belas — perbedaan yang juga tampak pada jumlah aksara dasar keduanya. Perbandingannya dibahas di artikel <a href="/blog/perbedaan-aksara-bali-jawa-latin">perbedaan aksara Bali, Jawa, dan Latin</a>.

Karena diwariskan secara lisan, rincian legenda ini berbeda-beda antar daerah dan antar penutur. Yang tetap sama adalah intinya: aksara lahir sebagai peringatan atas kesetiaan.

## Kenapa Legenda Ini Bertahan

Legenda Aji Saka melakukan sesuatu yang tidak dilakukan silsilah aksara: ia membuat urutan hafalan menjadi **cerita**. Anak-anak yang belajar hanacaraka tidak sedang menghafal daftar dua puluh bunyi acak — mereka sedang mengingat sebuah kisah.

Itulah alasan urutan hanacaraka bertahan berabad-abad, dan alasan ia tetap dipakai sampai sekarang sebagai urutan pengajaran di sekolah-sekolah di Bali. Panduan menghafalnya ada di artikel <a href="/blog/belajar-hanacaraka-panduan-lengkap">hanacaraka</a>.

## Dari Lontar ke Unicode

Selama berabad-abad aksara Bali ditulis dengan pengutik pada daun lontar — dipahat, lalu dilumuri jelaga agar hurufnya terbaca. Naskah-naskah itu menyimpan sastra, hukum adat, pengobatan, dan perhitungan kalender; pembahasannya ada di artikel <a href="/blog/lontar-naskah-kuno-bali">lontar</a>.

Babak terbarunya terjadi pada 2006, ketika aksara Bali masuk ke dalam standar Unicode pada blok U+1B00–U+1B7F. Sejak itu aksara yang dahulu dipahat pada daun bisa diketik, disalin, dicari, dan diindeks seperti teks biasa — termasuk lewat <a href="/">konverter aksara Bali</a> di situs ini.

Perjalanan dari Brahmi ke lontar hingga ke papan ketik memakan lebih dari dua ribu tahun. Bagian terakhirnya baru dimulai dua dekade lalu.
`.trim(),
    content_en: `
## Two Ways to Answer "Where Does Balinese Script Come From?"

The question has two equally true answers. The first is historical: a long chain of script descent from India into the archipelago. The second is traditional: a legend about a king and two servants, which explains why the letter order reads *ha-na-ca-ra-ka*.

Both are worth knowing, and they explain different things.

## The Historical Answer: A Journey from Brahmi

Balinese belongs to the **Brahmic** family — the group behind nearly every writing system in South and Southeast Asia. The journey was gradual:

| Stage | Approximate period | Note |
|-------|-------------------|------|
| Brahmi | 3rd century BCE | the parent script in India |
| Pallava | 4th–8th century CE | carried along trade routes into the archipelago |
| Kawi | 8th–15th century CE | developed in Java, used for Old Javanese and Sanskrit |
| Balinese | from around the 11th century CE | a Kawi descendant that developed and survived in Bali |

Coming from the Indic writing tradition, Balinese inherited its structure: an **abugida** with an inherent /a/ vowel, attached vowel signs, and consonants ordered by place of articulation. The details are in the <a href="/blog/daftar-lengkap-aksara-bali">complete script chart</a>.

That inheritance shows in vocabulary too: thousands of Balinese words come from Sanskrit, some written with dedicated letters — see <a href="/blog/aksara-bali-dan-bahasa-sansekerta">Balinese script and Sanskrit</a>.

## The Traditional Answer: The Aji Saka Legend

The legend is told in both Java and Bali, in several versions. The outline is the same.

A figure named **Aji Saka** had two equally loyal servants. Before travelling, he entrusted his heirloom weapon to one of them with an instruction: give it to no one but me.

Time passed. Aji Saka sent the other servant to fetch the heirloom. The guarding servant refused to hand it over — he held to the instruction he had been given. The sent servant refused to return empty-handed — he held to the order he had been given.

Both were loyal. Both were formidable. They fought, and both died.

Aji Saka found his two servants dead because each had followed his command. To remember them, he composed a sequence of letters telling what had happened — and that sequence is the hanacaraka order.

In the Balinese version the two servants are called **I Yana** and **I Yalip**; in the Javanese version, **Dora** and **Sembada**.

## Reading the Hanacaraka Order as a Sentence

The letter order is read as a connected sentence, commonly glossed like this:

| Line | Commonly told meaning |
|------|----------------------|
| ha na ca ra ka | there were two servants |
| da ta sa wa la | they fell into conflict |
| ma ga ba nga pa | both were equally formidable |
| ja ya nya | both of them died |

The Javanese version runs to twenty letters, while the Balinese version usually taught has eighteen — a difference that also shows in their base letter counts. The comparison is in <a href="/blog/perbedaan-aksara-bali-jawa-latin">Balinese, Javanese, and Latin scripts compared</a>.

Because it was carried orally, the legend's details vary between regions and tellers. What stays constant is the point: the letters were born as a memorial to loyalty.

## Why the Legend Survives

The Aji Saka story does something a script genealogy cannot: it turns a memorised sequence into a **narrative**. Children learning hanacaraka are not memorising twenty arbitrary sounds — they are remembering a story.

That is why the hanacaraka order has lasted for centuries, and why it is still the teaching order in Balinese schools today. There is a memorisation guide in the <a href="/blog/belajar-hanacaraka-panduan-lengkap">hanacaraka article</a>.

## From Lontar to Unicode

For centuries Balinese was written with a stylus on palm leaf — incised, then rubbed with soot so the letters could be read. Those manuscripts hold literature, customary law, medicine, and calendar reckoning; see the <a href="/blog/lontar-naskah-kuno-bali">lontar article</a>.

The most recent chapter came in 2006, when Balinese entered the Unicode Standard at block U+1B00–U+1B7F. Since then a script once incised on leaves can be typed, copied, searched, and indexed like ordinary text — including through the <a href="/">Balinese script converter</a> on this site.

The road from Brahmi to lontar to keyboard took more than two thousand years. Its final stretch began only two decades ago.
`.trim(),
  },

  {
    slug: 'menulis-aksara-bali-di-word-canva',
    title: 'Cara Menulis Aksara Bali di Word, Canva, dan Photoshop',
    title_en: 'How to Use Balinese Script in Word, Canva, and Photoshop',
    excerpt: 'Langkah memakai aksara Bali di Microsoft Word, Google Docs, Canva, Photoshop, dan PowerPoint — termasuk mengatasi huruf kotak-kotak dan aksara yang tampil terpisah.',
    excerpt_en: 'Using Balinese script in Microsoft Word, Google Docs, Canva, Photoshop, and PowerPoint — including fixes for box characters and letters that fail to stack.',
    category: 'Teknologi & Budaya',
    tags: ['aksara bali di word', 'aksara bali canva', 'font aksara bali', 'desain aksara bali'],
    image_url: COVERS + 'menulis-aksara-bali-di-word-canva.png',
    read_time: '6 menit',
    content: `
## Alur Kerjanya Selalu Sama

Aplikasi mana pun yang Anda pakai, urutannya tidak berubah:

1. **Buat teksnya** di <a href="/">konverter aksara Bali</a> dan tekan **Salin**
2. **Pasang font aksara Bali** di perangkat — misalnya Noto Sans Balinese
3. **Tempel** ke aplikasi Anda, lalu **pilih fontnya**

Langkah ketiga yang paling sering terlewat: menempelkan teks saja tidak cukup kalau font yang aktif pada dokumen tidak mendukung aksara Bali. Hasilnya kotak-kotak, padahal teksnya sudah benar.

Panduan pemasangan font untuk Windows, macOS, Android, dan iOS ada di artikel <a href="/blog/cara-instal-font-aksara-bali">cara instal font aksara Bali</a>.

## Microsoft Word

1. Pasang font aksara Bali di sistem operasi, lalu tutup dan buka kembali Word.
2. Tempel teks aksara Bali Anda.
3. Sorot teks itu, lalu pilih font aksara Bali dari daftar font.

Kalau bentuk gantungan tidak terbentuk, simpan dokumen dalam format .docx modern dan pastikan Word memakai mesin tata letak terbaru. Untuk dokumen yang akan dibagikan, sematkan fontnya lewat pengaturan penyimpanan — kalau tidak, penerima yang belum memasang font akan melihat kotak-kotak.

## Google Docs

Google Docs memakai daftar fontnya sendiri, dan font aksara Bali tidak selalu tersedia di sana. Dua pilihan:

- Cari font Balinese pada menu **More fonts** di daftar font; kalau tersedia, pilih dan terapkan.
- Kalau tidak tersedia, sisipkan tulisan Anda sebagai **gambar** PNG dari konverter.

Untuk dokumen yang akan dicetak atau dibagikan luas, gambar justru lebih aman karena tampil sama di semua perangkat.

## Canva

Canva menjalankan fontnya sendiri, sehingga menempelkan teks saja sering menghasilkan kotak-kotak. Dua cara:

- **Unggah font.** Pada paket yang mendukung unggah font, tambahkan berkas font aksara Bali ke merek Anda, lalu terapkan pada kotak teks.
- **Unggah gambar.** Ekspor tulisan Anda sebagai PNG berlatar transparan dari konverter, lalu unggah sebagai elemen. Cara ini bekerja pada semua paket dan hasilnya pasti.

## Photoshop dan Illustrator

Aplikasi Adobe perlu diberi tahu bahwa teks Anda memakai aksara kompleks:

1. Pasang font aksara Bali, lalu jalankan ulang aplikasinya.
2. Aktifkan opsi teks **Middle Eastern & South Asian** pada preferensi tipe.
3. Buat kotak teks baru, terapkan font aksara Bali, lalu tempel teksnya.

Kalau gantungan tetap tidak terbentuk atau tanda vokal salah tempat, tempatkan tulisan sebagai gambar PNG alih-alih teks hidup. Untuk cetakan besar, minta berkas vektor atau gunakan font aslinya pada ukuran akhir agar tetap tajam.

## PowerPoint dan Presentasi

Sama seperti Word: pasang font, tempel, lalu pilih fontnya. Kalau presentasi akan dijalankan di komputer lain — komputer sekolah, proyektor kantor — jangan bergantung pada font yang terpasang di sana. Sematkan fontnya, atau ganti tulisan aksara Bali dengan gambar.

## Dua Masalah yang Paling Sering Muncul

**Semua huruf jadi kotak (□□□).** Font aksara Bali belum terpasang, atau font yang aktif pada teks itu tidak mendukungnya. Teksnya sendiri sudah benar — pilih font aksara Bali pada teks tersebut.

**Aksara tampil terpisah, gantungan tidak terbentuk.** Aplikasinya tidak menerapkan penggabungan aksara kompleks. Aktifkan opsi teks yang sesuai, perbarui aplikasinya, atau pakai gambar. Penjelasan tentang gantungan ada di artikel <a href="/blog/gantungan-gempelan-aksara-bali">gantungan dan gempelan</a>.

## Kapan Sebaiknya Memakai Gambar

Teks lebih baik ketika tulisan perlu dicari, disunting, atau dibaca pembaca layar. Gambar lebih baik ketika tampilannya harus pasti:

| Situasi | Pilihan |
|---------|---------|
| Dokumen kerja, tugas sekolah | teks |
| Undangan dan poster untuk dicetak | gambar |
| Unggahan media sosial | gambar |
| Halaman web | teks, dengan font yang dimuat halaman |
| Berkas yang dikirim ke desainer | gambar + teks Latinnya |

## Pertanyaan Singkat

**Font apa yang sebaiknya dipakai?** Noto Sans Balinese adalah pilihan paling aman karena cakupannya lengkap dan tersedia bebas.

**Bagaimana mendapatkan gambar berlatar transparan?** Gunakan tampilan word-art pada <a href="/">konverter</a> dan unduh hasilnya sebagai PNG.

**Kenapa tulisan saya benar di situs ini tetapi kotak-kotak di aplikasi lain?** Situs ini memuat fontnya sendiri; aplikasi lain memakai font yang terpasang di perangkat Anda.

**Bisakah mengetik langsung di aplikasi tersebut?** Bisa kalau Anda memasang tata letak papan ketik aksara Bali, tetapi menyalin dari konverter jauh lebih cepat. Lihat <a href="/blog/cara-mengetik-aksara-bali-keyboard">cara mengetik aksara Bali di keyboard</a>.
`.trim(),
    content_en: `
## The Workflow Is Always the Same

Whichever app you use, the order does not change:

1. **Create the text** in the <a href="/">Balinese script converter</a> and press **Copy**
2. **Install a Balinese font** on your device — Noto Sans Balinese is the usual choice
3. **Paste** into your app, then **apply that font**

Step three is the one people skip: pasting alone is not enough if the font active on the document does not cover Balinese. You get boxes, even though the text itself is correct.

Installation steps for Windows, macOS, Android, and iOS are in the <a href="/blog/cara-instal-font-aksara-bali">font installation guide</a>.

## Microsoft Word

1. Install a Balinese font in the operating system, then close and reopen Word.
2. Paste your Balinese text.
3. Select it, then choose the Balinese font from the font list.

If stacked forms do not appear, save in the modern .docx format and make sure Word is using its current layout engine. For documents you will share, embed the font in the save options — otherwise recipients without the font will see boxes.

## Google Docs

Google Docs uses its own font list, and a Balinese font is not always available there. Two options:

- Look for a Balinese font under **More fonts** in the font list; apply it if present.
- If it is not available, insert your writing as a PNG **image** from the converter.

For documents that will be printed or widely shared, an image is the safer choice because it looks the same everywhere.

## Canva

Canva serves its own fonts, so pasting text often yields boxes. Two routes:

- **Upload a font.** On plans that allow font upload, add a Balinese font file to your brand kit and apply it to the text box.
- **Upload an image.** Export your writing as a transparent PNG from the converter and add it as an element. This works on every plan and the result is predictable.

## Photoshop and Illustrator

Adobe apps need telling that your text uses a complex script:

1. Install a Balinese font, then restart the app.
2. Enable the **Middle Eastern & South Asian** type options in preferences.
3. Create a new text box, apply the Balinese font, then paste.

If stacking still fails or vowel signs land in the wrong place, place the writing as a PNG rather than live text. For large print, ask for a vector file or set the real font at final size so it stays sharp.

## PowerPoint and Slides

Same as Word: install, paste, apply the font. If the deck will run on another machine — a school computer, an office projector — do not rely on that machine having the font. Embed it, or replace the Balinese text with an image.

## The Two Most Common Problems

**Everything shows as boxes (□□□).** No Balinese font is installed, or the font applied to that text does not cover the script. The text itself is fine — just apply a Balinese font to it.

**Letters appear separated and do not stack.** The app is not applying complex-script shaping. Enable the relevant type option, update the app, or use an image. Stacking is explained in the <a href="/blog/gantungan-gempelan-aksara-bali">gantungan and gempelan article</a>.

## When to Use an Image Instead

Text is better when the writing must be searchable, editable, or readable by screen readers. An image is better when appearance has to be guaranteed:

| Situation | Choice |
|-----------|--------|
| Work documents, school assignments | text |
| Invitations and posters for print | image |
| Social media posts | image |
| Web pages | text, with the font loaded by the page |
| Files sent to a designer | image + the Latin spelling |

## Quick Questions

**Which font should I use?** Noto Sans Balinese is the safest choice — full coverage and freely available.

**How do I get a transparent-background image?** Use the word-art view on the <a href="/">converter</a> and download it as a PNG.

**Why is my text fine on this site but boxed elsewhere?** This site loads its own font; other apps use whatever is installed on your device.

**Can I type directly in those apps?** You can if you install a Balinese keyboard layout, but copying from the converter is far quicker. See <a href="/blog/cara-mengetik-aksara-bali-keyboard">typing Balinese script on a keyboard</a>.
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
