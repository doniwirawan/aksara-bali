import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Batch 6: built on the Kamus work of 2026-11-14 — speech levels (anggah-ungguh),
// Old Balinese, words falling out of use, and how to use the dictionary.
// Every Balinese form in the tables comes from the site's own Kamus data
// (public/data/kamus-bali.json and kamus-bali-kuno.json).

const COVERS = 'https://aksarabali.doniwirawan.xyz/covers/'

const posts = [
  {
    slug: 'anggah-ungguh-basa-bali',
    title: 'Anggah-Ungguh Basa Bali: Kapan Memakai Andap, Alus Singgih, Alus Sor, dan Mider',
    title_en: 'Balinese Speech Levels: When to Use Andap, Alus Singgih, Alus Sor, and Mider',
    excerpt: 'Satu kata Indonesia bisa punya tiga atau empat padanan dalam bahasa Bali. Panduan memilih tingkatan yang tepat, dengan contoh dari kamus.',
    excerpt_en: 'One Indonesian word can have three or four Balinese equivalents. A guide to choosing the right speech level, with examples from the dictionary.',
    category: 'Linguistik',
    tags: ['anggah ungguh basa bali', 'sor singgih', 'bahasa bali alus', 'tingkatan bahasa bali'],
    image_url: COVERS + 'anggah-ungguh-basa-bali.png',
    read_time: '6 menit',
    content: `
## Satu Arti, Beberapa Kata

Dalam bahasa Indonesia, "makan" tetap "makan" siapa pun yang Anda ajak bicara. Dalam bahasa Bali tidak begitu. Kata yang dipilih bergantung pada **siapa yang dibicarakan** dan **siapa yang diajak bicara**. Sistem ini disebut *anggah-ungguhing basa*, atau sering juga *sor singgih*.

Karena itulah kamus bahasa Bali yang baik tidak cukup memberi satu padanan per kata. <a href="/translate">Kamus Aksara Bali</a> menampilkan setiap kata dalam empat kolom.

## Empat Tingkatan dalam Kamus

| Tingkatan | Dipakai untuk |
|---|---|
| **Andap** (biasa) | percakapan akrab, sesama teman sebaya, keluarga dekat |
| **Alus singgih** | menghormati orang yang dibicarakan atau diajak bicara: orang tua, guru, pendeta, tokoh |
| **Alus sor** | merendahkan diri sendiri ketika berbicara kepada orang yang dihormati |
| **Mider** | bentuk halus yang netral, bisa dipakai untuk siapa saja |

Kuncinya ada pada pasangan *singgih* dan *sor*: kata yang meninggikan orang lain, dan kata yang merendahkan diri sendiri. Keduanya halus, tetapi arahnya berlawanan.

## Contoh dari Kamus

| Indonesia | Andap | Alus singgih | Alus sor | Mider |
|---|---|---|---|---|
| makan | madaar | marayunan | — | ngajeng |
| mandi | mandus | masiram | — | — |
| nama | adan | peséngan | wasta | — |
| sakit | gelem | sungkan | sengkaon | — |
| anak | panak | oka, putra | pianak | — |
| memberi | maang | ngicén | ngwéhin | — |
| datang | teka | — | — | rauh |
| tahu | nawang | — | — | uning |
| tidak | sing | — | — | nénten |
| saya | icang | — | titiang | — |

Tanda "—" berarti kamus tidak mencatat bentuk khusus untuk tingkatan itu.

## Membaca Tabel Itu dalam Kalimat

- Kepada teman: *Icang suba madaar.* (Saya sudah makan.)
- Kepada orang yang dihormati, tentang diri sendiri: *Titiang sampun ngajeng.* Kata "saya" turun ke **titiang**, dan "makan" memakai bentuk halus yang tidak meninggikan diri.
- Menanyakan apakah seorang guru sudah makan: memakai bentuk **singgih**, karena yang dibicarakan adalah orang yang dihormati.

Kesalahan yang paling sering terjadi: memakai bentuk *singgih* untuk diri sendiri. Kedengarannya seperti memuji diri sendiri, dan itu justru tidak sopan.

## Mengapa Mesin Belum Bisa Menerjemahkan Bahasa Bali dengan Baik

Pilihan tingkatan bergantung pada hubungan antarorang. Itu informasi yang tidak ada di dalam kalimat. Karena itu <a href="/translate">bantu kalimat</a> di situs ini sengaja hanya mengganti kata per kata dan meminta Anda memilih **andap** atau **alus**. Hasilnya titik awal, bukan terjemahan jadi.

## Langkah Praktis

1. Cari katanya di <a href="/translate">Kamus Bahasa Bali</a>. Setiap tingkatan tampil dengan aksara Balinya.
2. Tentukan siapa lawan bicara dan siapa yang dibicarakan.
3. Untuk surat, undangan, atau sambutan resmi, minta penutur asli memeriksanya.

Ingin melihat bagaimana tingkatan muncul dalam salam sehari-hari? Baca <a href="/blog/ucapan-bahasa-bali-sehari-hari">ucapan bahasa Bali sehari-hari</a>.
`.trim(),
    content_en: `
## One Meaning, Several Words

In Indonesian, "makan" (to eat) stays "makan" whoever you are talking to. Balinese is different. The word you choose depends on **who is being talked about** and **who is being addressed**. The system is called *anggah-ungguhing basa*, often shortened to *sor singgih*.

That is why a useful Balinese dictionary cannot give just one equivalent per word. The <a href="/translate">Aksara Bali Kamus</a> shows every entry in four columns.

## The Four Levels in the Dictionary

| Level | Used for |
|---|---|
| **Andap** (everyday) | close, informal talk with friends of the same age and close family |
| **Alus singgih** | honouring the person spoken about or to: parents, teachers, priests, community figures |
| **Alus sor** | humbling yourself when speaking to someone you respect |
| **Mider** | a neutral polite form that suits anyone |

The key is the *singgih* / *sor* pair: words that raise the other person, and words that lower yourself. Both are polite, but they point in opposite directions.

## Examples from the Dictionary

| Indonesian | Andap | Alus singgih | Alus sor | Mider |
|---|---|---|---|---|
| makan (eat) | madaar | marayunan | — | ngajeng |
| mandi (bathe) | mandus | masiram | — | — |
| nama (name) | adan | peséngan | wasta | — |
| sakit (ill) | gelem | sungkan | sengkaon | — |
| anak (child) | panak | oka, putra | pianak | — |
| memberi (give) | maang | ngicén | ngwéhin | — |
| datang (come) | teka | — | — | rauh |
| tahu (know) | nawang | — | — | uning |
| tidak (no, not) | sing | — | — | nénten |
| saya (I) | icang | — | titiang | — |

A "—" means the dictionary records no special form for that level.

## Using the Table in a Sentence

- To a friend: *Icang suba madaar.* (I have eaten.)
- To someone you respect, about yourself: *Titiang sampun ngajeng.* "I" drops to **titiang**, and "eat" takes a polite form that does not raise the speaker.
- Asking whether a teacher has eaten: use the **singgih** form, because the person being talked about is the one you honour.

The most common mistake is using a *singgih* form for yourself. It sounds like praising yourself, which is the opposite of polite.

## Why Machines Still Struggle with Balinese

The right level depends on the relationship between people, and that information is not in the sentence. So the <a href="/translate">sentence helper</a> on this site deliberately only swaps words one by one and asks you to choose **andap** or **alus**. The result is a starting point, not a finished translation.

## In Practice

1. Look the word up in the <a href="/translate">Balinese dictionary</a>. Every level is shown with its Balinese script.
2. Decide who you are speaking to and who you are speaking about.
3. For letters, invitations, or formal speeches, have a native speaker check the wording.

To see the levels in everyday greetings, read <a href="/blog/ucapan-bahasa-bali-sehari-hari">everyday Balinese phrases</a>.
`.trim(),
  },
  {
    slug: 'bahasa-bali-kuno-prasasti',
    title: 'Bahasa Bali Kuno: Bahasa Prasasti Bali Abad ke-9 hingga ke-11',
    title_en: 'Old Balinese: The Language of Bali’s Earliest Inscriptions',
    excerpt: 'Sebelum bahasa Jawa Kuno dipakai di prasasti, raja-raja Bali menulis dalam bahasa Bali Kuno. Mengenal bahasanya, prasastinya, dan kata-katanya.',
    excerpt_en: 'Before Old Javanese took over Bali’s inscriptions, its kings wrote in Old Balinese. An introduction to the language, its inscriptions, and its words.',
    category: 'Sejarah & Budaya',
    tags: ['bahasa bali kuno', 'prasasti bali', 'prasasti blanjong', 'sejarah bahasa bali'],
    image_url: COVERS + 'bahasa-bali-kuno-prasasti.png',
    read_time: '6 menit',
    content: `
## Bahasa Bali Sebelum Bahasa Bali

Bahasa Bali yang dipakai sehari-hari sekarang punya leluhur yang tercatat dalam prasasti: **bahasa Bali Kuno**. Inilah bahasa yang dipakai raja-raja Bali untuk menuliskan aturan desa, pembebasan pajak, dan anugerah kepada pertapaan pada akhir abad ke-9 dan abad ke-10.

## Prasasti-Prasasti Tertua

Prasasti berbahasa Bali Kuno yang tertua dan berangka tahun berasal dari akhir abad ke-9. **Prasasti Sukawana A I**, bertarikh 804 Śaka (882 M), sering disebut sebagai yang paling awal. Prasasti-prasasti semacam ini umumnya dipahat pada lempeng tembaga, dan sebagian pada batu.

Yang paling terkenal mungkin **Prasasti Blanjong** di Sanur, bertarikh 835 Śaka (913 M). Pilar batu ini menyebut nama Sri Kesari Warmadewa dan ditulis dalam dua bahasa, bahasa Bali Kuno dan bahasa Sanskerta.

Sejak akhir abad ke-10 dan memasuki abad ke-11, bahasa Jawa Kuno makin banyak dipakai dalam prasasti Bali, hingga akhirnya menggantikan bahasa Bali Kuno sebagai bahasa resmi tulisan kerajaan.

## Seperti Apa Kata-katanya?

Banyak kata Bali Kuno masih terasa akrab, sebagian lagi sudah jauh berubah. Beberapa contoh dari Kamus Bahasa Bali Kuno–Indonesia:

| Bali Kuno | Arti |
|---|---|
| hayam, syap | ayam |
| wuri | belakang |
| wka | anak, putra |
| hulu | kepala |
| hru | anak panah |
| karuh | barat, bagian barat |
| wutuh | utuh |
| bnang | benang |
| tmuang | tahun |
| danu | danau |

Perhatikan *syap*: bentuk ini masih hidup dalam kata bahasa Bali sekarang untuk ayam, **siap**.

## Bahasa Bali Kuno di Kamus Ini

<a href="/translate">Kamus Bahasa Bali</a> kini punya tab **Bali Kuno** tersendiri, terpisah dari bahasa Bali sehari-hari agar keduanya tidak tercampur. Isinya diambil dari *Kamus Bahasa Bali Kuno–Indonesia* (Pusat Pembinaan dan Pengembangan Bahasa, 1985). Entri dibaca otomatis dari pindaian buku itu, dan hanya entri yang lolos pemeriksaan yang ditampilkan, jadi jumlahnya memang tidak banyak.

Bahasa Bali Kuno berguna untuk membaca nama tempat, istilah dalam prasasti, atau asal-usul kata. Untuk berbicara dan menulis sekarang, gunakan bahasa Bali modern di tab pencarian biasa.

## Bacaan Terkait

- <a href="/blog/asal-usul-aksara-bali-aji-saka">Asal-usul aksara Bali dan legenda Aji Saka</a>
- <a href="/blog/lontar-naskah-kuno-bali">Lontar, naskah kuno Bali</a>
- <a href="/blog/kakawin-epik-sastra-bali-kuno">Kakawin, epik sastra Jawa Kuno di Bali</a>
`.trim(),
    content_en: `
## Balinese Before Balinese

The Balinese spoken today has an ancestor recorded in stone and copper: **Old Balinese**. It is the language Bali’s kings used, in the late 9th and the 10th century, to set down village rules, tax exemptions, and grants to hermitages.

## The Earliest Inscriptions

The oldest dated inscriptions in Old Balinese come from the late 9th century. **Sukawana A I**, dated 804 Śaka (882 CE), is often cited as the earliest. Inscriptions like these were usually engraved on copper plates, some on stone.

The best known is probably the **Blanjong pillar** in Sanur, dated 835 Śaka (913 CE). It names Sri Kesari Warmadewa and is written in two languages, Old Balinese and Sanskrit.

From the late 10th century into the 11th, Old Javanese appears more and more in Balinese inscriptions, until it replaces Old Balinese as the written language of the court.

## What Do the Words Look Like?

Many Old Balinese words still feel familiar; others have changed a great deal. Some examples from the Kamus Bahasa Bali Kuno–Indonesia:

| Old Balinese | Meaning |
|---|---|
| hayam, syap | chicken |
| wuri | behind, back |
| wka | child, son |
| hulu | head |
| hru | arrow |
| karuh | west, the western part |
| wutuh | whole, intact |
| bnang | thread |
| tmuang | year |
| danu | lake |

Notice *syap*: it lives on in today’s Balinese word for chicken, **siap**.

## Old Balinese in This Dictionary

The <a href="/translate">Balinese dictionary</a> now has its own **Old Balinese** tab, kept apart from everyday Balinese so the two are never mixed. Its entries come from the *Kamus Bahasa Bali Kuno–Indonesia* (Pusat Pembinaan dan Pengembangan Bahasa, 1985). They were read automatically from a scan of the book, and only entries that passed checking are shown, so the list is deliberately small.

Old Balinese helps with place names, inscription terms, and word origins. To speak or write today, use modern Balinese in the regular search tab.

## Further Reading

- <a href="/blog/asal-usul-aksara-bali-aji-saka">The origins of Balinese script and the Aji Saka legend</a>
- <a href="/blog/lontar-naskah-kuno-bali">Lontar palm-leaf manuscripts</a>
- <a href="/blog/kakawin-epik-sastra-bali-kuno">Kakawin, Old Javanese epic poetry in Bali</a>
`.trim(),
  },
  {
    slug: 'kata-bahasa-bali-yang-mulai-punah',
    title: 'Kata-kata Bahasa Bali yang Mulai Jarang Dipakai, dan Artinya',
    title_en: 'Balinese Words Falling Out of Use, and What They Mean',
    excerpt: 'Dampar, jelan, suklit, kawa-kawa: kata-kata yang dulu sehari-hari kini jarang terdengar. Daftar beserta artinya, dikumpulkan dari percakapan warganet dan kamus.',
    excerpt_en: 'Dampar, jelan, suklit, kawa-kawa: everyday words that are now rarely heard. A list with meanings, gathered from an online conversation and checked against dictionaries.',
    category: 'Sejarah & Budaya',
    tags: ['kata bahasa bali punah', 'kosakata bahasa bali', 'bahasa bali lama', 'kamus bahasa bali'],
    image_url: COVERS + 'kata-bahasa-bali-yang-mulai-punah.png',
    read_time: '5 menit',
    content: `
## Kata yang Tinggal di Ingatan Nenek

Sebuah utas di Threads mengajak orang Bali menyebut kata-kata bahasa Bali yang terasa akan punah. Puluhan orang membalas. Ada yang menyertakan arti, ada yang hanya menuliskan katanya sambil berkata bahwa tak ada lagi teman untuk bercakap seperti itu.

Daftar di bawah ini memuat kata-kata dari utas itu yang artinya bisa kami pastikan, entah dari penjelasan para pembalas atau dari kamus. Semuanya kini ada di <a href="/translate">Kamus Bahasa Bali</a> situs ini.

## Di Rumah

| Kata | Arti |
|---|---|
| dampar | bangku (bukan kursi) |
| jelan | pintu. *Undeb jelane*: tutup pintunya |
| damar | lampu |
| langse | tirai, gorden |
| suklit | lampu senter |
| baturai | baterai |
| sereg | kunci, anak kunci |
| cerik | handuk |

## Di Dapur

| Kata | Arti |
|---|---|
| pucung | botol |
| lumur | gelas |
| jembung | cawan |
| sidu | sudu |
| goh | campuran; lauk |
| besek | wadah anyaman bambu |
| dacin | timbangan |

## Keadaan dan Gerak

| Kata | Arti |
|---|---|
| buyutan | gemetar, tremor |
| nènggèl | menjuntai, menggantung sedikit |
| keskes | kendor (perasaan) karena takut |
| taban | tangkap dan tahan (binatang) |

## Lain-lain

| Kata | Arti |
|---|---|
| kawa-kawa | sarang laba-laba |
| kreteg | jembatan |
| potlot | pensil (sering salah ditulis "poklot") |
| nanang | bapak |

## Kata yang Belum Kami Ketahui Artinya

Beberapa kata dari utas yang sama belum bisa kami pastikan artinya, antara lain *cekot*, *klopok*, *kodang*, *meégég*, *jaler*, *siyot*, *ketekul*, dan *capil*. Kami memilih tidak menebak. Jika Anda tahu artinya, kirimkan lewat tombol **Kirim usulan kata** di <a href="/translate">halaman kamus</a>. Setiap usulan diperiksa sebelum dimasukkan.

## Mengapa Ini Penting

Kata jarang hilang karena dilarang. Kata hilang karena bendanya berganti (damar menjadi lampu listrik, dampar menjadi kursi plastik) dan karena percakapan di rumah beralih ke bahasa Indonesia. Menuliskannya, termasuk dalam <a href="/">aksara Bali</a>, adalah cara paling sederhana untuk menjaganya tetap bisa ditemukan.
`.trim(),
    content_en: `
## Words That Live in a Grandmother’s Memory

A thread on Threads asked Balinese people to name Balinese words they feel are dying out. Dozens replied. Some added meanings; others only wrote the word, saying there was no one left to talk to like that.

The list below keeps the words from that thread whose meanings we could confirm, either from the replies themselves or from a dictionary. All of them are now in this site’s <a href="/translate">Balinese dictionary</a>.

## At Home

| Word | Meaning |
|---|---|
| dampar | bench (not a chair) |
| jelan | door. *Undeb jelane*: shut the door |
| damar | lamp |
| langse | curtain |
| suklit | torch, flashlight |
| baturai | battery |
| sereg | lock, key |
| cerik | towel |

## In the Kitchen

| Word | Meaning |
|---|---|
| pucung | bottle |
| lumur | drinking glass |
| jembung | bowl |
| sidu | ladle |
| goh | mixture; side dish |
| besek | woven bamboo box |
| dacin | weighing scale |

## States and Movements

| Word | Meaning |
|---|---|
| buyutan | trembling, tremor |
| nènggèl | dangling, hanging slightly |
| keskes | slackened (of feelings) from fear |
| taban | catch and hold (an animal) |

## Others

| Word | Meaning |
|---|---|
| kawa-kawa | spider web |
| kreteg | bridge |
| potlot | pencil (often misspelt "poklot") |
| nanang | father |

## Words We Could Not Yet Confirm

Some words from the same thread we could not pin down, among them *cekot*, *klopok*, *kodang*, *meégég*, *jaler*, *siyot*, *ketekul*, and *capil*. We chose not to guess. If you know what they mean, send them through the **Submit a word** button on the <a href="/translate">dictionary page</a>. Every suggestion is checked before it goes in.

## Why It Matters

Words are rarely lost because someone bans them. They fade because the thing they named is replaced (the damar by the electric bulb, the dampar by a plastic chair) and because talk at home switches to Indonesian. Writing them down, including in <a href="/">Balinese script</a>, is the simplest way to keep them findable.
`.trim(),
  },
  {
    slug: 'cara-memakai-kamus-bahasa-bali-online',
    title: 'Cara Memakai Kamus Bahasa Bali Online: Cari Kata, Tingkatan, dan Bantu Kalimat',
    title_en: 'How to Use the Online Balinese Dictionary: Word Search, Speech Levels, and the Sentence Helper',
    excerpt: 'Panduan singkat Kamus Aksara Bali: mencari kata Indonesia atau Bali, membaca empat tingkatan bahasa, menyusun kalimat kasar, membuka tab Bali Kuno, dan melaporkan kesalahan.',
    excerpt_en: 'A short guide to the Aksara Bali Kamus: searching Indonesian or Balinese words, reading the four speech levels, roughing out a sentence, the Old Balinese tab, and reporting mistakes.',
    category: 'Panduan Belajar',
    tags: ['kamus bahasa bali online', 'kamus bali indonesia', 'translate bahasa bali', 'kamus anggah ungguh'],
    image_url: COVERS + 'cara-memakai-kamus-bahasa-bali-online.png',
    read_time: '5 menit',
    content: `
## Apa Isi Kamusnya

<a href="/translate">Kamus Bahasa Bali</a> di situs ini memuat lebih dari 5.600 entri dari tiga sumber:

- *Kamus Anggah-Ungguh Kruna Bali–Indonesia*, yang mencatat tingkatan bahasa
- *Kamus Bali–Indonesia* edisi ke-3 (Badan Pengembangan dan Pembinaan Bahasa, 2016)
- Tambahan dari komunitas, misalnya kata-kata yang mulai jarang dipakai

Setiap entri menunjukkan dari mana asalnya. Entri yang dibaca otomatis dari buku diberi keterangan, karena pembacaan otomatis bisa keliru.

## 1. Cari Kata

Ketik kata Indonesia (*rumah*) atau kata Bali (*umah*) di kotak pencarian. Hasil yang cocok persis muncul paling atas, disusul kata yang diawali huruf yang sama, lalu kata yang mengandungnya. Tanda aksen tidak berpengaruh, jadi *yeh* dan *yéh* sama-sama ketemu.

## 2. Baca Tingkatannya

Setiap hasil menampilkan bentuk **andap**, **alus singgih**, **alus sor**, dan **mider** yang tersedia, lengkap dengan aksara Bali dan tombol salin. Belum tahu bedanya? Baca <a href="/blog/anggah-ungguh-basa-bali">panduan anggah-ungguh basa Bali</a>.

## 3. Bantu Kalimat

Tab **Bantu kalimat** mengganti setiap kata dalam kalimat Indonesia dengan padanan Balinya, sesuai tingkatan yang Anda pilih (andap atau alus). Kata yang tidak ditemukan diberi garis bawah putus-putus.

Ini bukan terjemahan. Susunan kalimat bahasa Bali bisa berbeda, dan tingkatan yang tepat bergantung pada lawan bicara. Pakai hasilnya sebagai titik awal.

## 4. Tab Bali Kuno

Untuk istilah prasasti dan asal-usul kata, buka tab **Bali Kuno**. Isinya bahasa Bali Kuno, bukan bahasa sehari-hari. Baca latar belakangnya di <a href="/blog/bahasa-bali-kuno-prasasti">bahasa Bali Kuno dan prasasti</a>.

## 5. Laporkan dan Usulkan

- Ada entri yang keliru? Tekan **Laporkan** di bawah entri itu dan jelaskan kesalahannya.
- Ada kata yang belum ada? Tekan **Kirim usulan kata**. Usulan diperiksa sebelum dimasukkan.

## Untuk Pengembang

Pencarian, tingkatan, dan bantu kalimat di halaman ini juga tersedia sebagai pustaka JavaScript, **@aksara-bali/kamus**, sehingga aplikasi lain bisa memakai kamus yang sama. Datanya diambil langsung dari situs ini. Sebagian sumbernya berlisensi CC BY-NC 4.0, jadi cantumkan sumbernya dan gunakan untuk keperluan nonkomersial.
`.trim(),
    content_en: `
## What the Dictionary Holds

The <a href="/translate">Balinese dictionary</a> on this site has more than 5,600 entries from three sources:

- the *Kamus Anggah-Ungguh Kruna Bali–Indonesia*, which records speech levels
- the *Kamus Bali–Indonesia*, 3rd edition (Badan Pengembangan dan Pembinaan Bahasa, 2016)
- community additions, such as words that are falling out of use

Every entry shows where it came from. Entries read automatically from a book say so, because automatic reading can make mistakes.

## 1. Search for a Word

Type an Indonesian word (*rumah*) or a Balinese one (*umah*) in the search box. Exact matches come first, then words that start the same way, then words that contain it. Accents don’t matter, so *yeh* and *yéh* both find the same entry.

## 2. Read the Speech Levels

Each result shows whichever of **andap**, **alus singgih**, **alus sor**, and **mider** exist, each with its Balinese script and a copy button. Not sure of the difference? Read the <a href="/blog/anggah-ungguh-basa-bali">guide to Balinese speech levels</a>.

## 3. The Sentence Helper

The **Sentence helper** tab swaps every word of an Indonesian sentence for its Balinese equivalent at the level you choose (andap or alus). Words it can’t find are underlined with dots.

This is not translation. Balinese word order can differ, and the right level depends on who you are speaking to. Treat the result as a starting point.

## 4. The Old Balinese Tab

For inscription terms and word origins, open the **Old Balinese** tab. It holds Old Balinese, not the everyday language. The background is in <a href="/blog/bahasa-bali-kuno-prasasti">Old Balinese and the inscriptions</a>.

## 5. Report and Suggest

- Found a wrong entry? Tap **Report** under it and describe the problem.
- Missing a word? Tap **Submit a word**. Suggestions are checked before they go in.

## For Developers

The search, speech levels, and sentence helper on this page are also available as a JavaScript library, **@aksara-bali/kamus**, so other apps can use the same dictionary. The data is fetched from this site. Some of its sources are CC BY-NC 4.0, so credit them and keep use non-commercial.
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
