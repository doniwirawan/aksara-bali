import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Three posts targeting the transactional queries the site already gets
// impressions for in Search Console (generator / translator / translate /
// menulis online) but has no dedicated landing page for.

const posts = [
  {
    slug: 'balinese-script-generator-online',
    title: 'Balinese Script Generator & Translator: Ubah Latin ke Aksara Bali Online',
    title_en: 'Balinese Script Generator & Translator: Convert Latin to Aksara Bali Online',
    excerpt: 'Apa itu balinese script generator, bedanya dengan translator, dan cara memakainya untuk mengubah teks Latin menjadi aksara Bali secara online, gratis, dan langsung di browser.',
    excerpt_en: 'What a Balinese script generator is, how it differs from a translator, and how to use one to turn Latin text into Balinese script online — free, right in your browser.',
    category: 'Teknologi & Budaya',
    tags: ['balinese script generator', 'balinese script translator', 'aksara bali generator', 'konverter', 'online'],
    image_url: 'https://transliterasi-latin-ke-bahasa-bali.vercel.app/covers/balinese-script-generator-online.png',
    read_time: '6 menit',
    content: `
## Apa Itu Balinese Script Generator?

Balinese script generator — atau dalam bahasa Indonesia biasa disebut **konverter aksara Bali** — adalah alat yang mengubah teks yang Anda ketik dalam huruf Latin menjadi aksara Bali (ᬅᬓ᭄ᬲᬭ​ᬩᬮᬶ). Anda mengetik "bali", alat mengembalikan ᬩᬮᬶ. Tidak ada font khusus yang perlu dipasang lebih dulu, tidak ada aplikasi yang perlu diunduh, dan seluruh prosesnya berjalan di dalam browser.

Alat semacam ini bekerja pada tingkat **bunyi**, bukan arti. Ia membaca rangkaian huruf Latin, memecahnya menjadi suku kata, lalu memasangkan tiap suku kata dengan karakter aksara Bali yang sesuai dari blok Unicode U+1B00–U+1B7F. Karena itulah hasilnya berupa teks sungguhan yang bisa disalin, bukan gambar.

Anda bisa mencobanya langsung di <a href="/">halaman konverter</a> — hasilnya muncul seketika sambil Anda mengetik.

## Generator, Translator, atau Transliterator?

Ini sumber kebingungan paling umum, dan patut dijelaskan sebelum Anda kecewa dengan hasilnya.

| Istilah | Yang sebenarnya terjadi | Contoh |
|---------|------------------------|--------|
| Generator / konverter aksara | Mengubah bentuk tulisan, bunyi tetap sama | bali → ᬩᬮᬶ |
| Transliterasi | Istilah teknis untuk hal yang sama | pura → ᬧᬸᬭ |
| Translator bahasa | Mengubah arti dari satu bahasa ke bahasa lain | thank you → matur suksma |

Jadi kalau Anda mengetik "thank you" ke dalam sebuah balinese script generator, hasilnya bukan ucapan terima kasih dalam bahasa Bali — melainkan bunyi "thank you" yang ditulis dengan aksara Bali. Untuk mendapatkan ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ, Anda perlu dua langkah:

1. Terjemahkan dulu artinya ke bahasa Bali: *thank you* → *matur suksma*
2. Baru konversikan bentuk tulisannya: *matur suksma* → ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ

Langkah pertama membutuhkan kamus atau penutur bahasa Bali. Langkah kedua itulah yang dikerjakan generator secara otomatis.

## Cara Memakai Generator Aksara Bali

1. Buka <a href="/">halaman utama konverter</a>.
2. Ketik atau tempelkan teks Latin Anda di kolom kiri. Tulislah sesuai bunyi — "suksma", bukan "sooksma".
3. Aksara Bali langsung muncul di kolom kanan, huruf demi huruf, tanpa perlu menekan tombol apa pun.
4. Gunakan tombol **Salin** untuk menyalin hasilnya, atau **Unduh** untuk menyimpannya sebagai berkas teks.

Ada juga **mode terbalik** untuk arah sebaliknya: tempelkan aksara Bali, dan alat akan membacakannya kembali dalam huruf Latin. Berguna kalau Anda menemukan tulisan aksara Bali di internet dan ingin tahu cara membacanya.

## Contoh Hasil Konversi

| Latin | Aksara Bali | Keterangan |
|-------|------------|-----------|
| bali | ᬩᬮᬶ | dua suku kata sederhana |
| pura | ᬧᬸᬭ | vokal u ditulis di bawah aksara |
| dewa | ᬤᬾᬯ | vokal e ditulis di kiri aksara |
| matur suksma | ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ | terima kasih |
| rahajeng semeng | ᬭᬳᬚᬾᬂ​ᬲᬾᬫᬾᬂ | selamat pagi |
| om swastyastu | ᬑᬫ᭄​ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ | salam pembuka Hindu Bali |
| canang sari | ᬘᬦᬂ​ᬲᬭᬶ | nama sesajen harian |
| wayan | ᬯᬬᬦ᭄ | nama anak pertama |

Perhatikan tanda kecil ᭄ (adeg-adeg) pada "wayan" dan "matur". Tanda itu mematikan vokal /a/ bawaan sebuah aksara, sehingga ᬦ dibaca "n" dan bukan "na".

## Kenapa Hasil Generator Bisa Berbeda-beda

Tidak semua generator memberi hasil yang persis sama untuk kata yang sama. Perbedaannya biasanya berasal dari empat hal:

- **Aksara murda untuk kata Sansekerta.** Kata seperti *dharma* atau *Wisnu* idealnya ditulis dengan aksara murda — versi khusus beberapa konsonan untuk bunyi retroflex Sansekerta. Konverter di situs ini mengenali ratusan kata Sansekerta umum dan memilih bentuk murda-nya secara otomatis.
- **Ekuivalensi V = W.** Dalam tradisi Bali, bunyi /v/ direalisasikan sebagai /w/: *Vishnu* ditulis *Wisnu* (ᬯᬶᬲ᭄ᬦᬸ). Alat yang tidak menangani ini akan menghasilkan tulisan yang janggal.
- **Gugus konsonan (gantungan).** Ketika dua konsonan bertemu tanpa vokal, konsonan kedua digantung di bawah yang pertama. Aturan penggabungannya cukup rumit dan jadi pembeda kualitas antar-alat.
- **Bunyi ng dan h di akhir kata.** Keduanya punya tanda sendiri — cecek (ᬂ) dan bisah (ᬄ) — bukan aksara penuh.

## Menyimpan Hasilnya

Setelah teks aksara Bali muncul, ada beberapa cara membawanya keluar dari halaman:

- **Salin** — menyalin teks Unicode asli, siap ditempel ke WhatsApp, Word, atau media sosial.
- **Unduh** — menyimpan hasilnya sebagai berkas teks.
- **Gambar word-art** — mengubah hasil menjadi karya huruf dan mengunduhnya sebagai PNG berlatar transparan. Ini pilihan teraman untuk desain, karena gambar tampil sama di perangkat mana pun.
- **Bagikan** — mengirim hasil lewat menu berbagi bawaan ponsel.
- **Dengarkan** — memutar pelafalan teks Latin-nya lewat text-to-speech, membantu Anda mengecek apakah ejaan yang Anda ketik sudah sesuai bunyi.

## Untuk Tato, Undangan, dan Desain: Periksa Dulu

Generator memberi Anda titik awal yang baik, bukan hasil akhir yang sakral. Sebelum sebuah tulisan dicetak di undangan, dipahat, apalagi ditato permanen:

1. **Periksa artinya, bukan hanya bentuknya.** Kalimat bahasa Inggris yang ditulis dengan aksara Bali tetaplah kalimat bahasa Inggris — indah dilihat, tetapi tidak bermakna apa-apa bagi pembaca Bali.
2. **Mintalah verifikasi.** Guru bahasa Bali, pemangku, atau komunitas aksara Bali di media sosial umumnya senang membantu memeriksa satu-dua baris tulisan.
3. **Hindari mencampur kata suci tanpa konteks.** Sebagian aksara dan simbol punya kedudukan sakral dalam upacara Hindu Bali, dan tidak lazim dipakai sebagai hiasan.

## Kesalahan yang Sering Terjadi

- **Hasilnya berupa kotak-kotak (□□□).** Perangkat Anda belum punya font aksara Bali. Ini masalah tampilan, bukan konversi — teksnya sendiri sudah benar. Lihat panduan <a href="/blog/cara-instal-font-aksara-bali">cara instal font aksara Bali</a>.
- **Mengetik "v".** Ketik "w" saja; keduanya diperlakukan sama, tetapi ejaan Bali yang lazim memakai w.
- **Menyalin teks panjang sekaligus.** Untuk teks panjang, konversikan per paragraf agar mudah diperiksa.
- **Menganggap hasilnya pasti benar.** Nama asing, singkatan, dan istilah teknis paling sering meleset karena tidak punya padanan bunyi dalam bahasa Bali.

## Pertanyaan Singkat

**Apakah gratis?** Ya, seluruh konverter di situs ini bisa dipakai tanpa biaya dan tanpa akun.

**Apakah butuh internet?** Untuk pemakaian pertama, ya. Setelah itu situs ini bisa dipasang sebagai aplikasi (PWA) dan konversinya tetap berjalan saat offline.

**Apakah hasilnya bisa disalin ke aplikasi lain?** Bisa. Hasilnya teks Unicode standar, bukan gambar — selama aplikasi tujuan punya font aksara Bali, tampilannya akan normal.

**Bisakah membaca aksara Bali dari foto?** Bisa. Di halaman <a href="/">konverter</a> ada panel **Baca dari foto** — unggah atau potret tulisannya, dan OCR akan mengenali aksaranya.

## Coba Sendiri

Cara tercepat memahami cara kerja sebuah balinese script generator adalah mencobanya. Buka <a href="/">konverter aksara Bali</a>, ketik nama Anda, dan lihat bagaimana tiap suku kata berubah bentuk. Kalau setelah itu Anda ingin bisa menulis tanpa bantuan alat, lanjutkan ke <a href="/practice">halaman latihan</a> — ada kuis berjenjang, papan ketik aksara Bali, dan kanvas menulis di sana.
`.trim(),
    content_en: `
## What Is a Balinese Script Generator?

A Balinese script generator — also called an Aksara Bali converter — is a tool that turns text you type in Latin letters into Balinese script (ᬅᬓ᭄ᬲᬭ​ᬩᬮᬶ). You type "bali", it returns ᬩᬮᬶ. No font to install first, no app to download, and the whole thing runs inside your browser.

Tools like this work at the level of **sound**, not meaning. They read the Latin letters, split them into syllables, and match each syllable to the right character from the Unicode block U+1B00–U+1B7F. That is why the output is real, selectable text rather than an image.

You can try it right now on the <a href="/">converter page</a> — results appear as you type.

## Generator, Translator, or Transliterator?

This is the most common source of disappointment, so it is worth settling first.

| Term | What actually happens | Example |
|------|----------------------|---------|
| Generator / script converter | Changes the writing system, keeps the sound | bali → ᬩᬮᬶ |
| Transliteration | The technical name for the same thing | pura → ᬧᬸᬭ |
| Language translator | Changes the meaning from one language to another | thank you → matur suksma |

So if you type "thank you" into a Balinese script generator, you do not get the Balinese phrase for gratitude — you get the sound of "thank you" spelled in Balinese characters. To arrive at ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ you need two steps:

1. Translate the meaning into Balinese: *thank you* → *matur suksma*
2. Then convert the writing: *matur suksma* → ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ

Step one needs a dictionary or a Balinese speaker. Step two is what the generator automates.

## How to Use the Generator

1. Open the <a href="/">main converter page</a>.
2. Type or paste your Latin text into the left box. Spell it the way it sounds — "suksma", not "sooksma".
3. Balinese script appears in the right box instantly, letter by letter. There is no button to press.
4. Use **Copy** to grab the result, or **Download** to save it as a text file.

There is also a **reverse mode** for the other direction: paste Balinese script and the tool reads it back in Latin letters. Handy when you find Balinese writing online and want to know how it is pronounced.

## Sample Conversions

| Latin | Balinese script | Note |
|-------|----------------|------|
| bali | ᬩᬮᬶ | two simple syllables |
| pura | ᬧᬸᬭ | the u vowel sits below the letter |
| dewa | ᬤᬾᬯ | the e vowel sits to the left |
| matur suksma | ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ | thank you |
| rahajeng semeng | ᬭᬳᬚᬾᬂ​ᬲᬾᬫᬾᬂ | good morning |
| om swastyastu | ᬑᬫ᭄​ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ | Balinese Hindu greeting |
| canang sari | ᬘᬦᬂ​ᬲᬭᬶ | the daily palm-leaf offering |
| wayan | ᬯᬬᬦ᭄ | name given to a firstborn child |

Notice the small ᭄ (adeg-adeg) in "wayan" and "matur". It kills the inherent /a/ vowel of a letter, so ᬦ reads as "n" instead of "na".

## Why Generators Disagree With Each Other

Two tools can return different output for the same word. The differences usually come from four places:

- **Murda letters for Sanskrit words.** Words like *dharma* or *Wisnu* should ideally use murda letters — special forms of certain consonants for Sanskrit retroflex sounds. The converter on this site recognises hundreds of common Sanskrit words and picks the murda form automatically.
- **The V = W equivalence.** In Balinese tradition the /v/ sound is realised as /w/: *Vishnu* is written *Wisnu* (ᬯᬶᬲ᭄ᬦᬸ). A tool that ignores this produces awkward spellings.
- **Consonant clusters (gantungan).** When two consonants meet with no vowel between them, the second one hangs beneath the first. The stacking rules are intricate, and this is where tool quality shows.
- **Final ng and h.** Both have dedicated marks — cecek (ᬂ) and bisah (ᬄ) — rather than full letters.

## Getting the Result Out

Once the Balinese text appears, there are several ways to take it with you:

- **Copy** — copies the raw Unicode text, ready to paste into WhatsApp, Word, or social media.
- **Download** — saves the result as a text file.
- **Word-art image** — turns the result into letter art and downloads it as a transparent PNG. This is the safest option for design work, because an image looks identical on every device.
- **Share** — sends the result through your phone's native share sheet.
- **Listen** — plays the Latin text through text-to-speech, which helps you check whether your spelling matches the intended sound.

## For Tattoos, Invitations, and Design: Check First

A generator gives you a solid starting point, not a finished sacred text. Before anything is printed on an invitation, carved, or tattooed permanently:

1. **Check the meaning, not just the shapes.** An English sentence written in Balinese characters is still an English sentence — beautiful to look at, but meaningless to a Balinese reader.
2. **Get it verified.** Balinese language teachers, temple priests, and script communities on social media are generally happy to check a line or two.
3. **Do not mix in sacred words without context.** Some characters and symbols hold ritual status in Balinese Hinduism and are not conventionally used as decoration.

## Common Mistakes

- **The output shows as boxes (□□□).** Your device has no Balinese font. That is a display problem, not a conversion problem — the underlying text is already correct. See the guide on <a href="/blog/cara-instal-font-aksara-bali">installing a Balinese script font</a>.
- **Typing "v".** Just type "w". Both are treated the same, but w matches conventional Balinese spelling.
- **Pasting very long text at once.** For long passages, convert one paragraph at a time so you can check the output.
- **Assuming the output is always right.** Foreign names, abbreviations, and technical terms go wrong most often, because they have no Balinese sound equivalent.

## Quick Questions

**Is it free?** Yes. Every converter on this site works without payment and without an account.

**Do I need internet?** For the first visit, yes. After that you can install the site as an app (PWA) and conversion keeps working offline.

**Can I paste the result into other apps?** Yes. The output is standard Unicode text, not an image — as long as the destination app has a Balinese font, it will render normally.

**Can it read Balinese script from a photo?** Yes. The <a href="/">converter page</a> has a **Baca dari foto** (read from photo) panel — upload or snap the writing and OCR recognises the characters.

## Try It Yourself

The fastest way to understand a Balinese script generator is to use one. Open the <a href="/">Balinese script converter</a>, type your name, and watch each syllable change shape. If you then want to write without relying on a tool, head to the <a href="/practice">practice page</a> — there is a leveled quiz, a Balinese keyboard, and a writing canvas waiting there.
`.trim(),
  },

  {
    slug: 'translate-latin-ke-aksara-bali',
    title: 'Translate Latin ke Aksara Bali: Panduan Lengkap Konversi Online Gratis',
    title_en: 'Translate Latin to Aksara Bali: A Complete Guide to Free Online Conversion',
    excerpt: 'Cara translate latin ke aksara Bali secara online: langkah-langkahnya, aturan dasar yang perlu dipahami, contoh kata dan kalimat, serta cara membalik aksara Bali kembali ke Latin.',
    excerpt_en: 'How to translate Latin text to Balinese script online: the steps, the rules worth knowing, worked examples, and how to turn Balinese script back into Latin.',
    category: 'Panduan Belajar',
    tags: ['translate latin ke aksara bali', 'latin ke aksara bali', 'translate aksara bali', 'aksara bali online'],
    image_url: 'https://transliterasi-latin-ke-bahasa-bali.vercel.app/covers/translate-latin-ke-aksara-bali.png',
    read_time: '7 menit',
    content: `
## Translate Latin ke Aksara Bali: Mulai dari Sini

Kalau yang Anda cari adalah cara mengubah tulisan biasa menjadi aksara Bali, jawabannya singkat: buka <a href="/">konverter aksara Bali</a>, ketik teksnya, dan hasilnya muncul saat itu juga. Gratis, tanpa akun, dan berjalan di browser ponsel maupun komputer.

Sisa artikel ini menjelaskan bagian yang lebih menentukan: bagaimana agar hasilnya benar-benar tepat, dan kapan hasil otomatis perlu diperiksa ulang.

## Satu Catatan Istilah

Yang dilakukan alat ini secara teknis adalah **transliterasi** — mengganti sistem tulisan, bukan menerjemahkan arti. Kalimat "saya lapar" akan menjadi tulisan aksara Bali yang tetap berbunyi "saya lapar", bukan padanan bahasa Balinya (*tiang seduk*). Kalau Anda ingin hasil yang benar-benar berbahasa Bali, terjemahkan dulu kalimatnya, baru konversikan tulisannya. Penjelasan lebih panjang ada di artikel <a href="/blog/balinese-script-generator-online">generator dan translator aksara Bali</a>.

## Empat Langkah Konversi

1. **Tulis sesuai bunyi.** Aksara Bali mengikuti bunyi, bukan ejaan baku bahasa Indonesia. Tulis "suksma", "rahajeng", "sekar" — apa adanya.
2. **Tempelkan ke kolom kiri** di halaman konverter. Boleh satu kata, satu kalimat, atau satu paragraf.
3. **Baca hasilnya di kolom kanan.** Konversi berjalan real-time; tidak ada tombol yang perlu ditekan.
4. **Salin, unduh, atau bagikan** hasilnya lewat tombol di bawah kolom hasil.

## Aturan Dasar yang Membuat Hasil Masuk Akal

Aksara Bali bukan alfabet seperti Latin, melainkan **abugida**: setiap aksara konsonan sudah membawa vokal /a/ di dalamnya.

- ᬓ dibaca **ka**, bukan "k"
- Untuk mengubah vokalnya, ditambahkan tanda vokal (pangangge)
- Untuk menghilangkan vokalnya, ditambahkan adeg-adeg (᭄)

Tanda vokal yang paling sering muncul:

| Bunyi | Tanda | Letak | Contoh |
|-------|-------|-------|--------|
| -i | ᬶ (ulu) | di atas | ᬩᬶ (bi) |
| -u | ᬸ (suku) | di bawah | ᬓᬸ (ku) |
| -e | ᬾ (taleng) | di kiri | ᬧᬾ (pe) |
| -o | ᭀ (taleng tedung) | mengapit | ᬓᭀ (ko) |
| -a | (bawaan) | — | ᬓ (ka) |

Dua bunyi akhir punya tanda khusus dan bukan aksara penuh: **-ng** ditulis dengan cecek (ᬂ) dan **-h** ditulis dengan bisah (ᬄ). Itu sebabnya "sayang" hanya butuh tiga bagian: ᬲ + ᬬ + ᬂ = ᬲᬬᬂ.

Pembahasan lengkap tanda vokal ada di artikel <a href="/blog/pangangge-tanda-vokal-aksara-bali">pangangge</a>.

## Contoh Kata dan Kalimat

| Latin | Aksara Bali |
|-------|------------|
| bali | ᬩᬮᬶ |
| guru | ᬕᬸᬭᬸ |
| buku | ᬩᬸᬓᬸ |
| sekolah | ᬲᬾᬓᭀᬮᬳ᭄ |
| desa adat | ᬤᬾᬲ​ᬅᬤᬢ᭄ |
| jalan raya | ᬚᬮᬦ᭄​ᬭᬬ |
| selamat datang | ᬲᬾᬮᬫᬢ᭄​ᬤᬢᬂ |
| melajah aksara bali | ᬫᬾᬮᬚᬳ᭄​ᬅᬓ᭄ᬲᬭ​ᬩᬮᬶ |
| om swastyastu | ᬑᬫ᭄​ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ |
| matur suksma | ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ |

Angka juga punya aksaranya sendiri: 2026 menjadi ᭒᭐᭒᭖.

## Arah Sebaliknya: Translate Aksara Bali ke Latin

Sama seringnya, orang justru menemukan tulisan aksara Bali — di papan nama, undangan, atau unggahan media sosial — dan ingin tahu bunyinya. Ada dua jalan:

- **Mode terbalik di konverter.** Aktifkan mode terbalik, tempelkan teks aksara Bali, dan alat akan menuliskannya kembali dalam huruf Latin.
- **Baca dari foto.** Kalau tulisannya berupa gambar dan tidak bisa disalin, buka panel **Baca dari foto** di <a href="/">halaman konverter</a>. Seret gambarnya ke sana, pilih berkas, atau ambil foto langsung dengan kamera; OCR akan mengenali aksaranya lalu membacakannya dalam huruf Latin. Hasilnya sangat bergantung pada ketajaman foto dan keteraturan bentuk hurufnya.

## Lima Tips Agar Hasilnya Lebih Akurat

1. **Pakai "w", bukan "v".** Tradisi Bali merealisasikan bunyi /v/ sebagai /w/: *Veda* ditulis *Weda* (ᬯᬾᬤ).
2. **Perhatikan kata Sansekerta.** Kata seperti *dharma*, *Wisnu*, atau *Saraswati* idealnya memakai aksara murda. Konverter di situs ini mengenali ratusan kata Sansekerta umum dan menerapkannya otomatis — lihat penjelasan <a href="/blog/aksara-murda-huruf-kapital-bali">aksara murda</a>.
3. **Hati-hati dengan nama asing.** "Jennifer" atau "Christopher" tidak punya padanan bunyi yang rapi dalam bahasa Bali. Hasilnya tetap terbaca, tetapi sering terasa dipaksakan — sesuaikan ejaannya sampai bunyinya mendekati.
4. **Konversikan per bagian.** Untuk teks panjang, kerjakan per kalimat atau per paragraf agar mudah diperiksa dan diperbaiki.
5. **Uji dengan telinga.** Tombol pelafalan pada konverter membacakan teks Latin Anda. Kalau yang terdengar tidak sesuai maksud Anda, ejaannya yang perlu diperbaiki lebih dulu — bukan aksaranya.

## Kapan Hasil Otomatis Perlu Diperiksa Manusia

Konversi otomatis sangat andal untuk kata dan kalimat sehari-hari. Tetapi ada situasi yang sebaiknya diperiksa penutur atau guru bahasa Bali sebelum dipakai:

- Teks upacara, mantra, dan kutipan lontar — konteks keagamaannya menuntut ketepatan yang melampaui pencocokan bunyi
- Tulisan yang akan dicetak permanen: undangan, papan nama, prasasti, tato
- Kutipan sastra Jawa Kuno dan Kawi, yang punya konvensi ejaan tersendiri
- Nama orang, terutama gelar dan nama kehormatan

## Supaya Tidak Selamanya Bergantung pada Alat

Konverter memang mempercepat pekerjaan, tetapi membaca aksara Bali sendiri jauh lebih memuaskan — dan hanya butuh beberapa minggu untuk sampai ke tahap dasar.

- Mulai dari 18 aksara dasar lewat panduan <a href="/blog/belajar-hanacaraka-panduan-lengkap">hanacaraka</a>
- Lanjutkan ke tanda vokal dan gantungan
- Uji hafalan Anda dengan kuis berjenjang dan kanvas menulis di <a href="/practice">halaman latihan</a>

Cara belajar yang paling efektif justru menggabungkan keduanya: tulis dulu dugaan Anda dengan tangan, lalu bandingkan dengan hasil konverter.

## Pertanyaan Singkat

**Apakah alat ini gratis?** Ya, sepenuhnya, tanpa pendaftaran.

**Apakah bisa dipakai di ponsel?** Bisa. Situs ini juga bisa dipasang sebagai aplikasi dan tetap berfungsi tanpa internet.

**Apakah hasilnya berupa gambar?** Bukan — hasilnya teks Unicode yang bisa disalin dan ditempel. Kalau perangkat penerima belum punya font aksara Bali, tulisan akan tampil sebagai kotak; ikuti panduan <a href="/blog/cara-instal-font-aksara-bali">instal font</a> untuk mengatasinya.

**Bisakah saya menulis langsung dengan aksara Bali tanpa mengetik Latin?** Bisa, lewat papan ketik aksara Bali di <a href="/practice">halaman latihan</a>.
`.trim(),
    content_en: `
## Translating Latin to Balinese Script: Start Here

If all you want is to turn ordinary text into Balinese script, the answer is short: open the <a href="/">Balinese script converter</a>, type your text, and the result appears instantly. It is free, needs no account, and runs in the browser on phones and desktops alike.

The rest of this guide covers the part that actually decides quality: how to make the output correct, and when automatic conversion deserves a second pair of eyes.

## A Note on Terminology

What the tool does is technically **transliteration** — swapping writing systems, not translating meaning. The sentence "I am hungry" becomes Balinese script that still reads "I am hungry", not its Balinese equivalent (*tiang seduk*). If you want genuinely Balinese wording, translate the sentence first, then convert the script. There is a longer explanation in the article on <a href="/blog/balinese-script-generator-online">Balinese script generators and translators</a>.

## Four Steps

1. **Spell it the way it sounds.** Balinese script follows sound, not English or Indonesian orthography. Write "suksma", "rahajeng", "sekar" as they are pronounced.
2. **Paste it into the left box** on the converter page. A word, a sentence, or a paragraph all work.
3. **Read the result on the right.** Conversion is real-time; there is no button to press.
4. **Copy, download, or share** the output using the buttons below the result box.

## The Rules That Make the Output Make Sense

Balinese is not an alphabet like Latin — it is an **abugida**: every consonant already carries an /a/ vowel inside it.

- ᬓ reads **ka**, not "k"
- To change the vowel, you add a vowel sign (pangangge)
- To remove the vowel, you add adeg-adeg (᭄)

The vowel signs you will meet most often:

| Sound | Sign | Position | Example |
|-------|------|----------|---------|
| -i | ᬶ (ulu) | above | ᬩᬶ (bi) |
| -u | ᬸ (suku) | below | ᬓᬸ (ku) |
| -e | ᬾ (taleng) | left | ᬧᬾ (pe) |
| -o | ᭀ (taleng tedung) | both sides | ᬓᭀ (ko) |
| -a | (inherent) | — | ᬓ (ka) |

Two final sounds get their own marks rather than full letters: **-ng** is written with cecek (ᬂ) and **-h** with bisah (ᬄ). That is why "sayang" needs only three pieces: ᬲ + ᬬ + ᬂ = ᬲᬬᬂ.

The vowel signs are covered in full in the <a href="/blog/pangangge-tanda-vokal-aksara-bali">pangangge</a> article.

## Worked Examples

| Latin | Balinese script |
|-------|----------------|
| bali | ᬩᬮᬶ |
| guru | ᬕᬸᬭᬸ |
| buku | ᬩᬸᬓᬸ |
| sekolah | ᬲᬾᬓᭀᬮᬳ᭄ |
| desa adat | ᬤᬾᬲ​ᬅᬤᬢ᭄ |
| jalan raya | ᬚᬮᬦ᭄​ᬭᬬ |
| selamat datang | ᬲᬾᬮᬫᬢ᭄​ᬤᬢᬂ |
| melajah aksara bali | ᬫᬾᬮᬚᬳ᭄​ᬅᬓ᭄ᬲᬭ​ᬩᬮᬶ |
| om swastyastu | ᬑᬫ᭄​ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ |
| matur suksma | ᬫᬢᬸᬭ᭄​ᬲᬸᬓ᭄ᬲ᭄ᬫ |

Numbers have their own digits too: 2026 becomes ᭒᭐᭒᭖.

## The Other Direction: Balinese Script Back to Latin

Just as often, people come across Balinese writing — on a street sign, an invitation, a social media post — and want to know how it sounds. Two routes:

- **Reverse mode in the converter.** Switch it on, paste the Balinese text, and the tool spells it back out in Latin letters.
- **Read from a photo.** If the writing is an image and cannot be copied, open the **Baca dari foto** (read from photo) panel on the <a href="/">converter page</a>. Drag an image in, pick a file, or take a photo with your camera; OCR recognises the characters and reads them back in Latin. Results depend heavily on how sharp the photo is and how regular the lettering.

## Five Tips for More Accurate Output

1. **Use "w", not "v".** Balinese tradition realises the /v/ sound as /w/: *Veda* is written *Weda* (ᬯᬾᬤ).
2. **Watch for Sanskrit words.** Words such as *dharma*, *Wisnu*, or *Saraswati* should ideally use murda letters. This site's converter recognises hundreds of common Sanskrit words and applies them automatically — see the article on <a href="/blog/aksara-murda-huruf-kapital-bali">murda letters</a>.
3. **Be careful with foreign names.** "Jennifer" or "Christopher" have no clean Balinese sound equivalent. The output is still readable but often feels forced — adjust the spelling until the sound is close.
4. **Convert in chunks.** For long text, work sentence by sentence or paragraph by paragraph so you can check as you go.
5. **Test it by ear.** The pronunciation button reads your Latin text aloud. If what you hear is not what you meant, fix the spelling first — the script is not the problem.

## When a Human Should Check the Output

Automatic conversion is dependable for everyday words and sentences. Some cases still deserve review by a Balinese speaker or teacher before use:

- Ritual texts, mantras, and lontar quotations, where religious context demands more than sound matching
- Anything printed permanently: invitations, signage, inscriptions, tattoos
- Old Javanese and Kawi literary quotations, which follow their own spelling conventions
- Personal names, especially titles and honorifics

## So You Do Not Depend on the Tool Forever

A converter speeds up the work, but reading Balinese script yourself is far more rewarding — and basic fluency takes only a few weeks.

- Start with the 18 base letters in the <a href="/blog/belajar-hanacaraka-panduan-lengkap">hanacaraka guide</a>
- Move on to vowel signs and consonant stacking
- Test your recall with the leveled quiz and the writing canvas on the <a href="/practice">practice page</a>

The most effective study routine actually combines both: write your own guess by hand first, then compare it against the converter.

## Quick Questions

**Is the tool free?** Yes, completely, with no sign-up.

**Does it work on a phone?** It does. The site can also be installed as an app and keeps working without internet.

**Is the output an image?** No — it is Unicode text you can copy and paste. If the receiving device has no Balinese font, the text shows as boxes; the <a href="/blog/cara-instal-font-aksara-bali">font installation guide</a> fixes that.

**Can I type directly in Balinese script instead of Latin?** Yes, using the Balinese keyboard on the <a href="/practice">practice page</a>.
`.trim(),
  },

  {
    slug: 'menulis-aksara-bali-online',
    title: 'Menulis Aksara Bali Online: Ketik, Salin, dan Bagikan Tanpa Instal Aplikasi',
    title_en: 'Writing Balinese Script Online: Type, Copy, and Share Without Installing Anything',
    excerpt: 'Tiga cara menulis aksara Bali online — konverter, papan ketik virtual, dan kanvas tulis tangan — plus cara menyalin hasilnya ke WhatsApp, Instagram, dan aplikasi desain.',
    excerpt_en: 'Three ways to write Balinese script online — converter, virtual keyboard, and handwriting canvas — plus how to copy the result into WhatsApp, Instagram, and design apps.',
    category: 'Teknologi & Budaya',
    tags: ['menulis aksara bali online', 'salin antuk aksara bali', 'papan ketik aksara bali', 'aksara bali online'],
    image_url: 'https://transliterasi-latin-ke-bahasa-bali.vercel.app/covers/menulis-aksara-bali-online.png',
    read_time: '6 menit',
    content: `
## Menulis Aksara Bali Tanpa Instal Apa-apa

Dulu, menulis aksara Bali di komputer berarti mengunduh font khusus, memasang keyboard layout, dan berharap hasilnya tidak berantakan saat dipindahkan ke aplikasi lain. Sekarang seluruh prosesnya bisa dikerjakan di dalam browser — di ponsel sekalipun.

Ada tiga cara, dan masing-masing cocok untuk kebutuhan yang berbeda.

| Cara | Cocok untuk | Halaman |
|------|------------|---------|
| Ketik Latin, ubah otomatis | Menulis cepat, teks panjang | Konverter |
| Papan ketik aksara Bali | Menulis langsung dalam aksara | Latihan |
| Kanvas tulis tangan | Melatih bentuk dan urutan goresan | Latihan |

## 1. Ketik Latin, Biarkan Alat Menyalinnya

Ini cara tercepat. Anda mengetik seperti biasa di <a href="/">halaman konverter</a>, dan aksara Bali muncul di sebelahnya sambil Anda mengetik. Tidak ada tombol konversi, tidak ada jeda.

Dalam bahasa Bali, kebutuhan ini biasa disebut *salin antuk aksara Bali* — menyalin tulisan ke dalam aksara Bali:

**Sane mangkin, semeton prasida nyalin tulisan Latin antuk aksara Bali langsung ring browser, nenten perlu ngunduh aplikasi.**

(Terjemahan: sekarang, Anda bisa menyalin tulisan Latin ke dalam aksara Bali langsung di browser, tanpa perlu mengunduh aplikasi.)

Kalimat "salin antuk aksara bali" sendiri, kalau dikonversikan, menjadi: ᬲᬮᬶᬦ᭄​ᬅᬦ᭄ᬢᬸᬓ᭄​ᬅᬓ᭄ᬲᬭ​ᬩᬮᬶ

Cara ini paling nyaman untuk teks panjang: caption media sosial, teks undangan, judul poster, atau tugas sekolah.

## 2. Papan Ketik Aksara Bali Virtual

Kalau Anda sudah mengenal bentuk aksaranya dan ingin menulis langsung — tanpa lewat huruf Latin — gunakan papan ketik aksara Bali di <a href="/practice">halaman latihan</a>. Papan ketik ini menampilkan aksara dasar, tanda vokal, dan adeg-adeg sebagai tombol yang bisa diketuk.

Kelebihannya: Anda mengendalikan setiap keputusan penulisan, termasuk kapan memakai gantungan dan aksara mana yang dipilih untuk bunyi yang mirip. Untuk teks upacara atau kutipan lontar, kontrol semacam ini penting — konversi otomatis mengambil keputusan itu untuk Anda.

## 3. Kanvas Menulis Tangan

Menulis dengan tangan mengaktifkan memori yang berbeda dari sekadar mengetik. Kanvas menulis di <a href="/practice">halaman latihan</a> memungkinkan Anda menggambar aksara dengan tetikus, jari di layar sentuh, atau bahkan gerakan tangan di depan kamera. Ada juga mode layar penuh supaya bidang gambarnya lega.

Kanvas ini untuk berlatih, bukan menghasilkan teks yang bisa disalin. Untuk teks yang bisa ditempel ke aplikasi lain, pakai cara pertama atau kedua.

## Menyalin Hasil ke WhatsApp, Instagram, dan Canva

Hasil konverter berupa **teks Unicode**, bukan gambar. Artinya bisa disalin dan ditempel ke mana saja, dan tetap bisa dicari serta diedit. Tetapi ada satu syarat: perangkat penerima harus punya font aksara Bali.

- **WhatsApp dan Telegram** — umumnya tampil normal di Android modern dan iOS; sebagian perangkat lama menampilkan kotak.
- **Instagram dan TikTok** — bergantung pada font aplikasi. Untuk keperluan visual, lebih aman memakai gambar.
- **Canva, Photoshop, dan aplikasi desain** — Anda perlu memasang font aksara Bali seperti Noto Sans Balinese terlebih dahulu, kalau tidak teksnya akan tampil sebagai kotak.
- **Cara paling aman** — gunakan fitur word-art di konverter untuk mengunduh hasilnya sebagai PNG berlatar transparan. Gambar tampil identik di perangkat mana pun, meskipun tidak bisa lagi diedit sebagai teks.

## Kenapa Aksara Bali Tampil Kotak-kotak

Kotak kecil (□□□) berarti teksnya sudah benar, tetapi perangkat tidak punya font untuk menggambarnya. Ini bukan kesalahan konversi. Situs ini memuat fontnya sendiri, sehingga tampilan di halaman konverter selalu benar — masalahnya baru muncul setelah teks ditempel ke aplikasi lain.

Solusinya ada dua: pasang font aksara Bali di perangkat penerima (lihat <a href="/blog/cara-instal-font-aksara-bali">panduan instal font</a>), atau kirim hasilnya sebagai gambar.

## Menulis Aksara Bali Saat Offline

Halaman ini bisa dipasang sebagai aplikasi (PWA) lewat menu browser: "Tambahkan ke layar utama" di Android atau "Add to Home Screen" di iOS. Setelah terpasang, konverternya tetap berjalan tanpa internet — berguna di ruang kelas atau lokasi dengan sinyal terbatas.

Untuk pengguna Android yang ingin aplikasi asli lengkap dengan kuis dan referensi aksara, tersedia juga aplikasinya — lihat artikel <a href="/blog/aplikasi-android-aksara-bali-rilis-baru">aplikasi Android Aksara Bali</a>.

## Sebelum Dicetak: Periksa Dulu

Menulis online membuat prosesnya cepat, dan justru karena itu mudah lolos tanpa diperiksa. Untuk tulisan yang akan dicetak — undangan, spanduk, papan nama, plakat, apalagi tato — mintalah guru bahasa Bali atau penutur asli memeriksanya lebih dulu. Kesalahan satu tanda vokal cukup untuk mengubah kata menjadi kata lain.

Untuk teks yang berkaitan dengan upacara, tambahan kehati-hatian layak diberikan: sebagian aksara dan rerajahan punya kedudukan sakral dalam tradisi Hindu Bali dan tidak lazim dipakai sekadar sebagai hiasan.

## Pertanyaan Singkat

**Perlukah membuat akun?** Tidak. Konverter, papan ketik, dan kanvas bisa langsung dipakai.

**Apakah bisa dipakai di ponsel?** Bisa, ketiganya dirancang untuk layar sentuh.

**Bagaimana menulis angka Bali?** Ketik angka biasa di konverter; 2026 menjadi ᭒᭐᭒᭖.

**Bagaimana membaca aksara Bali yang saya temukan di papan nama?** Foto tulisannya, lalu unggah ke panel **Baca dari foto** di <a href="/">konverter</a> — atau ketik ulang dengan papan ketik lalu pakai mode terbalik.

## Mulai Menulis

Pilih cara yang sesuai kebutuhan Anda hari ini: <a href="/">konverter</a> untuk menulis cepat, <a href="/practice">papan ketik dan kanvas</a> untuk berlatih. Keduanya gratis, dan keduanya berjalan langsung di browser Anda.
`.trim(),
    content_en: `
## Writing Balinese Script With Nothing Installed

Writing Balinese script on a computer used to mean downloading a font, installing a keyboard layout, and hoping the result survived being moved into another app. Today the whole thing happens inside the browser — on a phone, too.

There are three routes, each suited to something different.

| Route | Best for | Page |
|-------|----------|------|
| Type Latin, convert automatically | Fast writing, long text | Converter |
| Balinese script keyboard | Writing directly in script | Practice |
| Handwriting canvas | Learning shapes and stroke order | Practice |

## 1. Type Latin and Let the Tool Transcribe It

This is the fastest route. You type normally on the <a href="/">converter page</a> and Balinese script appears beside it as you go. No convert button, no waiting.

In Balinese, this is called *salin antuk aksara Bali* — transcribing writing into Balinese script:

**Sane mangkin, semeton prasida nyalin tulisan Latin antuk aksara Bali langsung ring browser, nenten perlu ngunduh aplikasi.**

(Translation: you can now transcribe Latin writing into Balinese script directly in the browser, with no app to download.)

The phrase "salin antuk aksara bali" itself, converted, comes out as: ᬲᬮᬶᬦ᭄​ᬅᬦ᭄ᬢᬸᬓ᭄​ᬅᬓ᭄ᬲᬭ​ᬩᬮᬶ

This route is the most comfortable for longer text: social captions, invitation wording, poster headlines, or school assignments.

## 2. The Virtual Balinese Keyboard

If you already know the letter shapes and want to write directly — without going through Latin — use the Balinese keyboard on the <a href="/practice">practice page</a>. It lays out the base letters, vowel signs, and adeg-adeg as tappable keys.

The advantage is control: every spelling decision stays yours, including when to stack consonants and which letter to pick for similar sounds. For ritual text or lontar quotations that control matters, because automatic conversion makes those choices for you.

## 3. The Handwriting Canvas

Writing by hand engages a different kind of memory than typing does. The canvas on the <a href="/practice">practice page</a> lets you draw letters with a mouse, a fingertip on a touchscreen, or even hand gestures in front of your camera. There is a fullscreen mode when you want more room.

The canvas is for practice, not for producing copyable text. When you need text you can paste elsewhere, use route one or two.

## Getting the Result into WhatsApp, Instagram, and Canva

Converter output is **Unicode text**, not an image. That means it can be pasted anywhere, and it stays searchable and editable. One condition applies: the receiving device needs a Balinese font.

- **WhatsApp and Telegram** — usually render fine on modern Android and iOS; some older devices show boxes.
- **Instagram and TikTok** — depend on the app's own fonts. For visual work, an image is safer.
- **Canva, Photoshop, and design apps** — install a Balinese font such as Noto Sans Balinese first, or the text will appear as boxes.
- **The safest route** — use the converter's word-art feature to download the result as a transparent PNG. An image looks identical everywhere, though it is no longer editable as text.

## Why Balinese Script Sometimes Shows as Boxes

Small boxes (□□□) mean the text is correct but the device has no font to draw it with. It is not a conversion error. This site loads its own font, so the converter page always displays correctly — the problem only surfaces after you paste the text somewhere else.

There are two fixes: install a Balinese font on the receiving device (see the <a href="/blog/cara-instal-font-aksara-bali">font installation guide</a>), or send the result as an image.

## Writing Balinese Script Offline

This site can be installed as an app (PWA) from your browser menu: "Add to Home Screen" on both Android and iOS. Once installed, the converter keeps working with no internet — useful in a classroom or anywhere the signal is thin.

Android users who want a full native app with quizzes and a script reference can find one too — see the article on the <a href="/blog/aplikasi-android-aksara-bali-rilis-baru">Aksara Bali Android app</a>.

## Before You Print It: Check

Writing online is fast, and that is exactly why unchecked text slips through. For anything going to print — invitations, banners, signage, plaques, and especially tattoos — ask a Balinese teacher or native speaker to review it first. A single misplaced vowel sign is enough to turn one word into another.

For anything tied to ceremony, extra care is warranted: some characters and rerajahan designs hold sacred status in Balinese Hindu tradition and are not conventionally used as decoration.

## Quick Questions

**Do I need an account?** No. The converter, keyboard, and canvas are all open to use immediately.

**Does it work on a phone?** Yes — all three are built for touchscreens.

**How do I write Balinese numerals?** Type ordinary digits into the converter; 2026 becomes ᭒᭐᭒᭖.

**How do I read Balinese script I found on a sign?** Photograph it and drop it into the **Baca dari foto** panel on the <a href="/">converter</a> — or retype it with the keyboard and use reverse mode.

## Start Writing

Pick the route that fits today's task: the <a href="/">converter</a> for writing quickly, the <a href="/practice">keyboard and canvas</a> for practising. Both are free, and both run right in your browser.
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
