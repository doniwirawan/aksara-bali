import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Batch 7 (2026-11-14): the Balinese calendar and the holy days built on it,
// plus the provincial rule that put Balinese script on public signs.
// Script forms come from the site's converter (packages/core); only words
// whose spelling is unambiguous are shown in script. Dates follow the 210-day
// pawukon cycle from Galungan 17 Jun 2026.

const COVERS = 'https://aksarabali.doniwirawan.xyz/covers/'

const posts = [
  {
    slug: 'nama-hari-wuku-sasih-kalender-bali',
    title: 'Nama Hari, Wuku, dan Sasih dalam Kalender Bali',
    title_en: 'Days, Wuku Weeks, and Sasih Months in the Balinese Calendar',
    excerpt: 'Saptawara, pancawara, 30 wuku, dan 12 sasih: cara orang Bali menamai waktu, dan mengapa Galungan datang setiap 210 hari.',
    excerpt_en: 'Saptawara, pancawara, the 30 wuku, and the 12 sasih: how Bali names time, and why Galungan comes every 210 days.',
    category: 'Panduan Belajar',
    tags: ['kalender bali', 'nama hari bali', 'wuku', 'sasih bali', 'pawukon'],
    image_url: COVERS + 'nama-hari-wuku-sasih-kalender-bali.png',
    read_time: '6 menit',
    content: `
## Dua Kalender Sekaligus

Kalender Bali menjalankan dua hitungan bersamaan:

- **Pawukon**, siklus 210 hari yang tersusun dari minggu-minggu bernama (wuku). Hari raya seperti Galungan, Kuningan, dan Saraswati mengikuti hitungan ini, sehingga datang setiap 210 hari.
- **Sasih**, bulan-bulan berdasarkan peredaran bulan, dengan **purnama** (ᬧᬸᬭ᭄ᬦᬫ) dan **tilem** (ᬢᬶᬮᭂᬫ᭄, bulan mati) sebagai penanda. Nyepi mengikuti hitungan ini.

## Saptawara: Tujuh Hari

| Bali | Indonesia |
|---|---|
| Redite | Minggu |
| Soma | Senin |
| Anggara | Selasa |
| Buda | Rabu |
| Wraspati | Kamis |
| Sukra | Jumat |
| Saniscara | Sabtu |

## Pancawara: Lima Hari Pasaran

Berjalan bersamaan dengan saptawara: **Umanis** (ᬉᬫᬦᬶᬲ᭄), **Paing**, **Pon**, **Wage**, **Kliwon** (ᬓ᭄ᬮᬶᬯᭀᬦ᭄). Gabungan keduanya memberi nama hari seperti *Buda Kliwon* atau *Saniscara Umanis*. Karena 7 × 5 = 35, kombinasi yang sama berulang setiap 35 hari, yang dikenal sebagai **otonan** bila dihitung dari hari lahir seseorang.

## Wuku: 30 Minggu Bernama

Satu wuku berlangsung tujuh hari, dimulai Redite. Ada 30 wuku (ᬯᬸᬓᬸ), jadi 30 × 7 = 210 hari:

1. Sinta 2. Landep 3. Ukir 4. Kulantir 5. Tolu 6. Gumbreg 7. Wariga 8. Warigadean 9. Julungwangi 10. Sungsang 11. Dungulan 12. Kuningan 13. Langkir 14. Medangsia 15. Pujut 16. Pahang 17. Krulut 18. Merakih 19. Tambir 20. Medangkungan 21. Matal 22. Uye 23. Menail 24. Prangbakat 25. Bala 26. Ugu 27. Wayang 28. Klawu 29. Dukut 30. Watugunung

Contoh: **Galungan** jatuh pada Buda Kliwon wuku Dungulan, dan **Saraswati** pada Saniscara Umanis wuku Watugunung, hari terakhir siklus.

## Sasih: 12 Bulan

| Urutan | Sasih |
|---|---|
| 1 | Kasa |
| 2 | Karo |
| 3 | Katiga |
| 4 | Kapat |
| 5 | Kalima |
| 6 | Kanem |
| 7 | Kapitu |
| 8 | Kawolu |
| 9 | Kasanga |
| 10 | Kadasa |
| 11 | Destha |
| 12 | Sadha |

Nyepi jatuh sehari setelah tilem sasih Kasanga, menandai awal sasih Kadasa dan tahun baru Saka. Ceritanya ada di <a href="/blog/rangkaian-hari-raya-nyepi">rangkaian hari raya Nyepi</a>.

## Menulisnya dalam Aksara Bali

Ketik nama hari atau wuku di <a href="/">konverter aksara Bali</a>. Untuk huruf *e* pepet (seperti pada *tilem*), tulis **ě** agar tidak terbaca taling. Beberapa nama berasal dari bahasa Sanskerta dan dalam naskah tradisional memakai huruf murda; lihat <a href="/blog/aksara-murda-huruf-kapital-bali">aksara murda</a>.

## Bacaan Terkait

- <a href="/blog/galungan-kuningan-rangkaian-hari-raya">Rangkaian hari raya Galungan dan Kuningan</a>
- <a href="/blog/hari-raya-saraswati-aksara-bali">Hari Raya Saraswati</a>
`.trim(),
    content_en: `
## Two Calendars at Once

The Balinese calendar runs two counts side by side:

- **Pawukon**, a 210-day cycle made of named weeks (wuku). Holy days such as Galungan, Kuningan, and Saraswati follow it, so they come round every 210 days.
- **Sasih**, lunar months marked by **purnama** (ᬧᬸᬭ᭄ᬦᬫ, full moon) and **tilem** (ᬢᬶᬮᭂᬫ᭄, new moon). Nyepi follows this count.

## Saptawara: the Seven-Day Week

| Balinese | English |
|---|---|
| Redite | Sunday |
| Soma | Monday |
| Anggara | Tuesday |
| Buda | Wednesday |
| Wraspati | Thursday |
| Sukra | Friday |
| Saniscara | Saturday |

## Pancawara: the Five-Day Week

It runs alongside the seven-day week: **Umanis** (ᬉᬫᬦᬶᬲ᭄), **Paing**, **Pon**, **Wage**, **Kliwon** (ᬓ᭄ᬮᬶᬯᭀᬦ᭄). Together they give day names such as *Buda Kliwon* or *Saniscara Umanis*. Since 7 × 5 = 35, the same pair returns every 35 days; counted from someone's birthday, that is their **otonan**.

## Wuku: 30 Named Weeks

Each wuku lasts seven days and starts on Redite. There are 30 wuku (ᬯᬸᬓᬸ), so 30 × 7 = 210 days:

1. Sinta 2. Landep 3. Ukir 4. Kulantir 5. Tolu 6. Gumbreg 7. Wariga 8. Warigadean 9. Julungwangi 10. Sungsang 11. Dungulan 12. Kuningan 13. Langkir 14. Medangsia 15. Pujut 16. Pahang 17. Krulut 18. Merakih 19. Tambir 20. Medangkungan 21. Matal 22. Uye 23. Menail 24. Prangbakat 25. Bala 26. Ugu 27. Wayang 28. Klawu 29. Dukut 30. Watugunung

For example, **Galungan** falls on Buda Kliwon of wuku Dungulan, and **Saraswati** on Saniscara Umanis of wuku Watugunung, the last day of the cycle.

## Sasih: the 12 Months

| No. | Sasih |
|---|---|
| 1 | Kasa |
| 2 | Karo |
| 3 | Katiga |
| 4 | Kapat |
| 5 | Kalima |
| 6 | Kanem |
| 7 | Kapitu |
| 8 | Kawolu |
| 9 | Kasanga |
| 10 | Kadasa |
| 11 | Destha |
| 12 | Sadha |

Nyepi falls the day after the new moon of Kasanga, opening the month of Kadasa and the Saka new year. The full story is in <a href="/blog/rangkaian-hari-raya-nyepi">the Nyepi sequence</a>.

## Writing Them in Balinese Script

Type a day or wuku name into the <a href="/">Balinese script converter</a>. For a schwa *e* (as in *tilem*), type **ě** so it is not read as taling. Some names come from Sanskrit and use murda letters in traditional manuscripts; see <a href="/blog/aksara-murda-huruf-kapital-bali">aksara murda</a>.

## Further Reading

- <a href="/blog/galungan-kuningan-rangkaian-hari-raya">The Galungan and Kuningan sequence</a>
- <a href="/blog/hari-raya-saraswati-aksara-bali">Saraswati day</a>
`.trim(),
  },
  {
    slug: 'galungan-kuningan-rangkaian-hari-raya',
    title: 'Galungan dan Kuningan: Rangkaian Hari Raya dari Sugihan hingga Kuningan',
    title_en: 'Galungan and Kuningan: The Sequence of Holy Days from Sugihan to Kuningan',
    excerpt: 'Galungan datang setiap 210 hari pada Buda Kliwon Dungulan, dan Kuningan sepuluh hari kemudian. Urutan harinya, maknanya, dan tanggal berikutnya.',
    excerpt_en: 'Galungan comes every 210 days on Buda Kliwon Dungulan, and Kuningan ten days later. The days in order, what they mean, and the next dates.',
    category: 'Sejarah & Budaya',
    tags: ['galungan', 'kuningan', 'hari raya galungan', 'penampahan galungan', 'galungan 2027'],
    image_url: COVERS + 'galungan-kuningan-rangkaian-hari-raya.png',
    read_time: '5 menit',
    content: `
## Kemenangan Dharma

**Galungan** (ᬕᬮᬸᬗᬦ᭄) dirayakan umat Hindu Bali sebagai hari kemenangan *dharma* (kebaikan) atas *adharma*. Pada masa ini para leluhur diyakini turun mengunjungi keluarga, dan rumah-rumah dihiasi <a href="/blog/kelengkapan-penjor-galungan">penjor</a> di depan pekarangan. Sepuluh hari kemudian, **Kuningan** (ᬓᬸᬦᬶᬗᬦ᭄) menutup rangkaian ini, ketika leluhur kembali.

Karena mengikuti siklus <a href="/blog/nama-hari-wuku-sasih-kalender-bali">pawukon</a>, Galungan datang setiap 210 hari, jadi kadang dua kali dalam setahun Masehi.

## Urutan Harinya

| Hari | Jatuh pada | Kegiatan |
|---|---|---|
| Sugihan Jawa | Wraspati Wage wuku Sungsang | penyucian lingkungan dan tempat suci |
| Sugihan Bali | Sukra Kliwon wuku Sungsang | penyucian diri |
| Penyekeban | Redite Paing wuku Dungulan | memeram buah, terutama pisang, untuk banten |
| Penyajaan | Soma Pon wuku Dungulan | membuat jaja (kue) untuk banten |
| Penampahan | Anggara Wage wuku Dungulan | menyembelih babi, membuat lawar, memasang penjor |
| **Galungan** | Buda Kliwon wuku Dungulan | persembahyangan di rumah, pura keluarga, dan pura desa |
| Umanis Galungan | Wraspati Umanis wuku Dungulan | mengunjungi keluarga dan kerabat |
| **Kuningan** | Saniscara Kliwon wuku Kuningan | persembahyangan sebelum tengah hari, nasi kuning, tamiang dan endongan |

Kuningan disebut demikian karena nasi kuning yang dipersembahkan, dan karena jatuh pada wuku Kuningan. Persembahyangan biasanya selesai sebelum tengah hari.

## Tanggal Berikutnya

Dihitung dari siklus 210 hari:

- **Galungan:** Rabu, 13 Januari 2027
- **Kuningan:** Sabtu, 23 Januari 2027
- Galungan sesudahnya: Rabu, 11 Agustus 2027

Untuk acara adat, tetap cocokkan dengan kalender Bali yang dikeluarkan setempat.

## Menulis Ucapan dalam Aksara Bali

Ucapan yang umum adalah *Rahajeng Rahina Galungan lan Kuningan*. Ketik di <a href="/">konverter aksara Bali</a> untuk mendapatkan aksaranya, lalu salin ke kartu atau unggahan. Untuk desain cetak, baca <a href="/blog/aksara-bali-untuk-tato-dan-desain">aksara Bali untuk desain</a>.
`.trim(),
    content_en: `
## The Victory of Dharma

**Galungan** (ᬕᬮᬸᬗᬦ᭄) marks the victory of *dharma* (good) over *adharma* for Balinese Hindus. Ancestors are believed to come down to visit their families, and houses put up a <a href="/blog/kelengkapan-penjor-galungan">penjor</a> at the gate. Ten days later, **Kuningan** (ᬓᬸᬦᬶᬗᬦ᭄) closes the sequence as the ancestors return.

Because it follows the <a href="/blog/nama-hari-wuku-sasih-kalender-bali">pawukon</a> cycle, Galungan comes every 210 days, sometimes twice in one calendar year.

## The Days in Order

| Day | Falls on | What happens |
|---|---|---|
| Sugihan Jawa | Wraspati Wage, wuku Sungsang | purifying surroundings and shrines |
| Sugihan Bali | Sukra Kliwon, wuku Sungsang | purifying oneself |
| Penyekeban | Redite Paing, wuku Dungulan | ripening fruit, especially bananas, for offerings |
| Penyajaan | Soma Pon, wuku Dungulan | making jaja (cakes) for offerings |
| Penampahan | Anggara Wage, wuku Dungulan | slaughtering pigs, making lawar, raising the penjor |
| **Galungan** | Buda Kliwon, wuku Dungulan | prayers at home, the family temple, and village temples |
| Umanis Galungan | Wraspati Umanis, wuku Dungulan | visiting family and relatives |
| **Kuningan** | Saniscara Kliwon, wuku Kuningan | prayers before midday, yellow rice, tamiang and endongan |

Kuningan takes its name from the yellow (*kuning*) rice offered that day, and from the wuku it falls in. Prayers are usually finished before midday.

## The Next Dates

Counted on the 210-day cycle:

- **Galungan:** Wednesday 13 January 2027
- **Kuningan:** Saturday 23 January 2027
- The Galungan after that: Wednesday 11 August 2027

For ceremonies, still check against a locally issued Balinese calendar.

## Writing a Greeting in Balinese Script

A common greeting is *Rahajeng Rahina Galungan lan Kuningan*. Type it into the <a href="/">Balinese script converter</a> to get the script, then copy it into a card or post. For print design, read <a href="/blog/aksara-bali-untuk-tato-dan-desain">Balinese script for design</a>.
`.trim(),
  },
  {
    slug: 'hari-raya-saraswati-aksara-bali',
    title: 'Hari Raya Saraswati: Hari Ilmu Pengetahuan, Lontar, dan Aksara',
    title_en: 'Saraswati Day: Honouring Knowledge, Lontar, and Script',
    excerpt: 'Pada Saniscara Umanis Watugunung, buku dan lontar diberi banten. Makna Saraswati, rangkaian Banyu Pinaruh hingga Pagerwesi, dan tanggal berikutnya.',
    excerpt_en: 'On Saniscara Umanis Watugunung, books and lontar receive offerings. What Saraswati means, the days from Banyu Pinaruh to Pagerwesi, and the next date.',
    category: 'Sejarah & Budaya',
    tags: ['hari raya saraswati', 'saraswati bali', 'banyu pinaruh', 'pagerwesi', 'lontar'],
    image_url: COVERS + 'hari-raya-saraswati-aksara-bali.png',
    read_time: '5 menit',
    content: `
## Hari untuk Ilmu Pengetahuan

**Saraswati** (ᬲᬭᬲ᭄ᬯᬢᬶ) adalah hari turunnya ilmu pengetahuan, dipersembahkan kepada Dewi Saraswati. Hari ini jatuh pada **Saniscara Umanis wuku Watugunung** (ᬯᬢᬸᬕᬸᬦᬸᬂ), hari terakhir siklus <a href="/blog/nama-hari-wuku-sasih-kalender-bali">pawukon</a> 210 hari.

Bagi aksara Bali, ini hari yang istimewa. Buku, <a href="/blog/lontar-naskah-kuno-bali">lontar</a>, dan alat tulis dikumpulkan lalu diberi banten. Sekolah mengadakan persembahyangan bersama. Banyak keluarga juga memilih tidak membaca dan menulis pada hari itu, sebagai bentuk hormat kepada pengetahuan.

## Dewi Saraswati dan Lambangnya

Dewi Saraswati digambarkan membawa:

- **lontar** atau kitab, lambang ilmu pengetahuan
- **genitri** (tasbih), lambang pengetahuan yang tak pernah habis
- **wina** (alat musik petik), lambang seni dan keindahan
- **teratai**, lambang kesucian

Di dekatnya biasanya ada **angsa** dan **merak**: angsa dikatakan mampu memisahkan yang baik dari yang buruk, merak melambangkan kewibawaan.

## Rangkaian Sesudahnya

| Hari | Jatuh pada | Makna |
|---|---|---|
| **Saraswati** | Saniscara Umanis Watugunung | ilmu pengetahuan diturunkan |
| **Banyu Pinaruh** | Redite Paing Sinta | membersihkan diri di laut atau sumber air sejak pagi |
| Soma Ribek | Soma Pon Sinta | bersyukur atas pangan; beras dan lumbung diberi banten |
| Sabuh Mas | Anggara Wage Sinta | bersyukur atas harta dan perhiasan |
| **Pagerwesi** | Buda Kliwon Sinta | "pagar besi": memperteguh diri dengan pengetahuan |

Banyu Pinaruh berarti air pengetahuan. Hari itu adalah hari pertama siklus pawukon yang baru, jadi ilmu yang diterima pada Saraswati dibawa masuk ke siklus berikutnya.

## Tanggal Berikutnya

- **Saraswati:** Sabtu, 29 Mei 2027
- **Banyu Pinaruh:** Minggu, 30 Mei 2027
- **Pagerwesi:** Rabu, 2 Juni 2027

Dihitung dari siklus 210 hari. Cocokkan dengan kalender Bali setempat untuk upacara.

## Merayakan dengan Aksara

Saraswati adalah saat yang pas untuk mulai belajar aksara Bali. Mulai dari <a href="/blog/belajar-hanacaraka-panduan-lengkap">18 aksara dasar (hanacaraka)</a>, berlatih di <a href="/practice">halaman latihan</a>, atau tulis ucapan *Rahajeng Rahina Saraswati* di <a href="/">konverter</a>. Satu catatan: jika Anda termasuk yang tidak menulis pada hari Saraswati, simpan latihannya untuk Banyu Pinaruh.
`.trim(),
    content_en: `
## A Day for Knowledge

**Saraswati** (ᬲᬭᬲ᭄ᬯᬢᬶ) celebrates the descent of knowledge and is dedicated to the goddess Saraswati. It falls on **Saniscara Umanis of wuku Watugunung** (ᬯᬢᬸᬕᬸᬦᬸᬂ), the last day of the 210-day <a href="/blog/nama-hari-wuku-sasih-kalender-bali">pawukon</a> cycle.

For Balinese script it is a special day. Books, <a href="/blog/lontar-naskah-kuno-bali">lontar</a> manuscripts, and writing tools are gathered and given offerings. Schools hold prayers together. Many families also choose not to read or write that day, out of respect for knowledge.

## The Goddess and Her Symbols

Saraswati is shown holding:

- a **lontar** or book: knowledge
- a **genitri** (prayer beads): knowledge that never runs out
- a **wina** (stringed instrument): art and beauty
- a **lotus**: purity

Nearby are usually a **swan**, said to separate good from bad, and a **peacock**, for dignity.

## The Days That Follow

| Day | Falls on | Meaning |
|---|---|---|
| **Saraswati** | Saniscara Umanis, Watugunung | knowledge is given |
| **Banyu Pinaruh** | Redite Paing, Sinta | cleansing in the sea or a spring from early morning |
| Soma Ribek | Soma Pon, Sinta | gratitude for food; rice and granaries receive offerings |
| Sabuh Mas | Anggara Wage, Sinta | gratitude for wealth and jewellery |
| **Pagerwesi** | Buda Kliwon, Sinta | "iron fence": strengthening oneself with knowledge |

Banyu Pinaruh means "water of knowledge". It is the first day of the new pawukon cycle, so the knowledge received on Saraswati is carried into the next one.

## The Next Dates

- **Saraswati:** Saturday 29 May 2027
- **Banyu Pinaruh:** Sunday 30 May 2027
- **Pagerwesi:** Wednesday 2 June 2027

Counted on the 210-day cycle; check a local Balinese calendar for ceremonies.

## Celebrating with Script

Saraswati is a fitting moment to start learning Balinese script. Begin with the <a href="/blog/belajar-hanacaraka-panduan-lengkap">18 base letters (hanacaraka)</a>, practise on the <a href="/practice">practice page</a>, or write the greeting *Rahajeng Rahina Saraswati* in the <a href="/">converter</a>. One note: if you are among those who do not write on Saraswati, save the practice for Banyu Pinaruh.
`.trim(),
  },
  {
    slug: 'pergub-80-2018-aksara-bali-papan-nama',
    title: 'Aksara Bali di Papan Nama: Pergub Bali 80/2018 dan Bulan Bahasa Bali',
    title_en: 'Balinese Script on Signs: Bali Governor Regulation 80/2018 and Balinese Language Month',
    excerpt: 'Sejak 2018, papan nama kantor, sekolah, dan fasilitas umum di Bali menampilkan aksara Bali di atas huruf Latin. Apa aturannya, dan cara menghindari salah tulis.',
    excerpt_en: 'Since 2018, signs on offices, schools, and public facilities in Bali show Balinese script above Latin. What the rule says, and how to avoid spelling mistakes.',
    category: 'Teknologi & Budaya',
    tags: ['pergub 80 tahun 2018', 'papan nama aksara bali', 'bulan bahasa bali', 'perda bahasa bali'],
    image_url: COVERS + 'pergub-80-2018-aksara-bali-papan-nama.png',
    read_time: '5 menit',
    content: `
## Aturannya

Pada 2018 Provinsi Bali menetapkan **Perda Nomor 1 Tahun 2018** tentang Bahasa, Aksara, dan Sastra Bali. Pelaksanaannya diatur dalam **Peraturan Gubernur Bali Nomor 80 Tahun 2018** tentang Pelindungan dan Penggunaan Bahasa, Aksara, dan Sastra Bali serta Penyelenggaraan Bulan Bahasa Bali.

Bagian yang paling terlihat di jalan: **papan nama ditulis dengan aksara Bali di atas huruf Latin**. Ketentuan ini berlaku antara lain untuk kantor pemerintahan, sekolah, tempat suci, objek wisata, fasilitas umum, dan nama jalan, dan juga diarahkan ke lembaga swasta. Sejak itu, papan bertuliskan aksara Bali muncul dari kantor desa hingga bandara.

## Bulan Bahasa Bali

Pergub yang sama melahirkan **Bulan Bahasa Bali** (ᬩᬸᬮᬦ᭄​ᬩᬳᬲ​ᬩᬮᬶ), diselenggarakan setiap Februari sejak 2019. Isinya lomba menulis aksara di lontar, membaca dan menyurat aksara Bali, mesatua (bercerita), pidato, dan kegiatan sastra lain di sekolah, desa, dan banjar.

## Masalahnya: Salah Tulis

Papan yang dipasang cepat sering keliru. Media pernah melaporkan papan sekolah yang aksara Balinya salah, dan penelitian di sekolah-sekolah menemukan banyak kesalahan serupa. Kesalahan yang paling sering:

- **Taling dan pepet tertukar.** Huruf Latin *e* bisa dibaca é (taling) atau ě (pepet), dan aksara Bali membedakannya.
- **Nama diterjemahkan, bukan dialihaksarakan.** Papan nama menuliskan bunyi nama yang sama, bukan artinya.
- **Gugus konsonan.** Huruf mati di tengah kata harus memakai gantungan atau gempelan, bukan adeg-adeg. Lihat <a href="/blog/gantungan-gempelan-aksara-bali">gantungan dan gempelan</a>.
- **Huruf murda** untuk kata serapan Sanskerta dipakai atau dilewatkan secara tidak tepat. Lihat <a href="/blog/aksara-murda-huruf-kapital-bali">aksara murda</a>.

## Cara Membuat Papan yang Benar

1. Tulis nama dalam huruf Latin persis seperti di papan.
2. Alihaksarakan di <a href="/">konverter aksara Bali</a>. Tulis **ě** untuk pepet agar hasilnya tepat.
3. Bandingkan dengan aturan di <a href="/blog/daftar-lengkap-aksara-bali">daftar lengkap aksara Bali</a>.
4. Sebelum dicetak, minta **penyuluh bahasa Bali** di desa atau guru bahasa Bali memeriksanya. Konverter mengikuti aturan umum; ejaan baku untuk nama tertentu bisa berbeda.
5. Untuk berkas cetak, pakai font yang mendukung aksara Bali. Lihat <a href="/blog/menulis-aksara-bali-di-word-canva">aksara Bali di Word dan Canva</a>.
`.trim(),
    content_en: `
## The Rule

In 2018 the Province of Bali passed **Regional Regulation No. 1 of 2018** on the Balinese Language, Script, and Literature. It is put into practice by **Bali Governor Regulation No. 80 of 2018** on the Protection and Use of the Balinese Language, Script, and Literature and the Holding of Balinese Language Month.

The part you see on the street: **signs show Balinese script above the Latin text**. It applies to government offices, schools, temples, tourist sites, public facilities, and street names, among others, and private organisations are directed to follow it too. Since then, Balinese script signs have gone up everywhere from village offices to the airport.

## Balinese Language Month

The same regulation created **Bulan Bahasa Bali** (ᬩᬸᬮᬦ᭄​ᬩᬳᬲ​ᬩᬮᬶ), held every February since 2019. It brings contests in writing script on lontar, reading and writing Balinese script, *mesatua* (storytelling), speeches, and other literary events to schools, villages, and banjar.

## The Problem: Spelling Mistakes

Signs made in a hurry are often wrong. News outlets have reported a school sign with incorrect Balinese script, and studies in schools have found many similar errors. The most common:

- **Taling and pepet swapped.** A Latin *e* can be read é (taling) or ě (pepet), and Balinese script tells them apart.
- **Names translated instead of transliterated.** A sign spells the same name in another script; it does not translate it.
- **Consonant clusters.** A dead consonant inside a word takes a gantungan or gempelan, not adeg-adeg. See <a href="/blog/gantungan-gempelan-aksara-bali">gantungan and gempelan</a>.
- **Murda letters** for Sanskrit loanwords used or left out wrongly. See <a href="/blog/aksara-murda-huruf-kapital-bali">aksara murda</a>.

## Getting a Sign Right

1. Write the name in Latin letters exactly as it appears on the sign.
2. Transliterate it in the <a href="/">Balinese script converter</a>. Type **ě** for pepet so the result is correct.
3. Check it against the <a href="/blog/daftar-lengkap-aksara-bali">complete Balinese script chart</a>.
4. Before printing, ask the village **Balinese language extension officer** (penyuluh bahasa Bali) or a Balinese teacher to check it. The converter follows general rules; the standard spelling of a particular name can differ.
5. For print files, use a font that supports Balinese script. See <a href="/blog/menulis-aksara-bali-di-word-canva">Balinese script in Word and Canva</a>.
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
