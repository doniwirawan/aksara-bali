import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Two calendar/ceremony posts. Factual breakdowns follow the Komunitas
// Wikimedia Denpasar infographics on Wikimedia Commons (CC BY-SA 4.0), credited
// in the articles. Balinese terms were run through utils/balineseConverter.js
// after the nga fix, so "galungan" and "ngembak" render correctly.

const COVERS = 'https://aksarabali.doniwirawan.xyz/covers/'

const posts = [
  {
    slug: 'kelengkapan-penjor-galungan',
    title: 'Kelengkapan Penjor Galungan dan Makna Setiap Bagiannya',
    title_en: 'The Parts of a Galungan Penjor and What Each One Means',
    excerpt: 'Bagian-bagian penjor Galungan — sampian, kober, cili, tamiang, tebu, nyuh, plawa, sanggah, hingga lamak — beserta maknanya dan penulisan namanya dalam aksara Bali.',
    excerpt_en: 'The parts of a Galungan penjor — sampian, kober, cili, tamiang, tebu, nyuh, plawa, sanggah, lamak — with their meanings and their names in Balinese script.',
    category: 'Sejarah & Budaya',
    tags: ['penjor', 'galungan', 'budaya bali', 'aksara bali'],
    image_url: COVERS + 'kelengkapan-penjor-galungan.png',
    read_time: '6 menit',
    content: `
## Penjor Bukan Sekadar Hiasan

Menjelang Galungan, jalan-jalan di Bali dipenuhi **penjor** — bambu tinggi melengkung yang dihias janur dan hasil bumi. Bagi pengunjung, penjor terlihat seperti dekorasi hari raya. Bagi masyarakat Bali, setiap bagiannya punya nama dan makna sendiri, dan disusun mengikuti aturan.

Halaman ini merangkum bagian-bagiannya beserta penulisan namanya dalam aksara Bali.

## Bagian-bagian Penjor dan Maknanya

| Bagian | Keterangan | Perlambang |
|--------|-----------|-----------|
| sampian penjor | rangkaian janur di ujung penjor | Sang Hyang Parama Siwa |
| jaja gina dan jaja uli | jajanan yang digantung | Sang Hyang Brahma |
| kober putih kuning | bendera kecil berlukis padma dan omkara | Sang Hyang Iswara |
| cili atau gegantungan | hiasan berbentuk sosok yang digantung | Sang Hyang Widyadari |
| tamiang | hiasan bundar menyerupai perisai | penolak adharma |
| ubag-abig | hiasan janur yang menjuntai | Sang Hyang Rare Angon |
| tebu | batang tebu yang diikatkan | Sang Hyang Sambu |
| pala bungkah dan pala gantung | umbi-umbian dan buah-buahan | Sang Hyang Wisnu |
| nyuh | kelapa | Sang Hyang Rudra |
| busung dan ambu | daun kelapa dan daun enau | Sang Hyang Mahadewa |
| plawa | dedaunan | Sang Hyang Sangkara |
| sanggah ardha candra | tempat sesaji berbentuk bulan sabit | Sang Hyang Siwa |
| banten | sesaji yang dihaturkan | Sang Hyang Sadha Siwa |
| lamak | anyaman panjang penghias sanggah | Sang Hyang Tribuana |
| tiing | bambu sebagai tiang penjor | Sang Hyang Mahesora |

Susunan itu memperlihatkan satu gagasan yang berulang: penjor adalah gunung yang dilambangkan — hasil bumi dari kaki hingga puncaknya dipersembahkan sebagai ucapan syukur.

## Nama Bagian dalam Aksara Bali

| Latin | Aksara Bali |
|-------|------------|
| penjor | ᬧᬾᬦ᭄ᬚᭀᬭ᭄ |
| galungan | ᬕᬮᬸᬗᬦ᭄ |
| kuningan | ᬓᬸᬦᬶᬗᬦ᭄ |
| kober | ᬓᭀᬩᬾᬭ᭄ |
| cili | ᬘᬶᬮᬶ |
| gegantungan | ᬕᬾᬕᬦ᭄ᬢᬸᬗᬦ᭄ |
| tebu | ᬢᬾᬩᬸ |
| nyuh | ᬦ᭄ᬬᬸᬳ᭄ |
| busung | ᬩᬸᬲᬸᬂ |
| ambu | ᬅᬫ᭄ᬩᬸ |
| plawa | ᬧ᭄ᬮᬯ |
| sanggah | ᬲᬂᬕᬳ᭄ |
| banten | ᬩᬦ᭄ᬢᬾᬦ᭄ |
| lamak | ᬮᬫᬓ᭄ |
| jaja uli | ᬚᬚ​ᬉᬮᬶ |

Untuk istilah lain, ketikkan kata Balinya di <a href="/">konverter aksara Bali</a>, atau cari padanannya di <a href="/translate">kamus bahasa Bali</a>.

## Kapan Penjor Dipasang

Penjor Galungan umumnya dipasang pada **Penampahan Galungan**, sehari sebelum Galungan, dan berdiri hingga rangkaian hari raya berakhir. Galungan berulang setiap 210 hari mengikuti perhitungan kalender Bali, lalu ditutup oleh **Kuningan** sepuluh hari kemudian.

## Etika Sederhana bagi Pengunjung

- Penjor berdiri di depan rumah sebagai bagian dari persembahan, bukan properti foto — memotretnya boleh, menyentuh atau memindahkannya sebaiknya tidak.
- Sesaji di bawah penjor jangan dilangkahi atau diinjak.
- Kalau ingin memasang penjor sendiri, tanyakan tata caranya kepada warga setempat; susunannya mengikuti aturan, bukan selera desain.

## Bacaan Lanjutan

Peran aksara dalam upacara dibahas di artikel <a href="/blog/upacara-keagamaan-aksara-bali">aksara Bali dalam upacara keagamaan</a>, sementara aksara dan simbol bertuah dibahas di <a href="/blog/rerajahan-seni-sakral-aksara-bali">rerajahan</a>. Rangkaian hari raya lain ada di artikel <a href="/blog/rangkaian-hari-raya-nyepi">rangkaian Hari Raya Nyepi</a>.

Rincian bagian penjor pada artikel ini mengikuti infografik *Eteh-eteh Penjor Galungan* karya Eka Setyawan yang diterbitkan Komunitas Wikimedia Denpasar di Wikimedia Commons (CC BY-SA 4.0). Penyebutan bagian dan maknanya dapat berbeda antar desa adat — tradisi Bali memang beragam menurut *desa, kala, patra*.
`.trim(),
    content_en: `
## A Penjor Is Not Just Decoration

In the run-up to Galungan, Balinese roads fill with **penjor** — tall curved bamboo poles dressed in young coconut leaf and harvest produce. To a visitor they look like festive decoration. To Balinese households, every part has its own name and meaning, and the assembly follows rules.

This page summarises the parts, along with how their names are written in Balinese script.

## The Parts and Their Meanings

| Part | What it is | Symbolises |
|------|-----------|-----------|
| sampian penjor | the woven leaf ornament at the tip | Sang Hyang Parama Siwa |
| jaja gina and jaja uli | traditional cakes hung on the pole | Sang Hyang Brahma |
| kober putih kuning | a small white-and-yellow flag bearing padma and omkara | Sang Hyang Iswara |
| cili or gegantungan | a hanging figure ornament | Sang Hyang Widyadari |
| tamiang | a round shield-like ornament | a repeller of adharma |
| ubag-abig | trailing leaf decoration | Sang Hyang Rare Angon |
| tebu | a length of sugarcane | Sang Hyang Sambu |
| pala bungkah and pala gantung | tubers and fruit | Sang Hyang Wisnu |
| nyuh | coconut | Sang Hyang Rudra |
| busung and ambu | coconut and sugar-palm leaves | Sang Hyang Mahadewa |
| plawa | foliage | Sang Hyang Sangkara |
| sanggah ardha candra | the crescent-shaped offering shrine | Sang Hyang Siwa |
| banten | the offerings presented | Sang Hyang Sadha Siwa |
| lamak | the long woven hanging dressing the shrine | Sang Hyang Tribuana |
| tiing | the bamboo pole itself | Sang Hyang Mahesora |

One idea repeats through the whole structure: a penjor stands for a mountain, with the earth's produce from base to tip offered in thanks.

## The Names in Balinese Script

| Latin | Balinese script |
|-------|----------------|
| penjor | ᬧᬾᬦ᭄ᬚᭀᬭ᭄ |
| galungan | ᬕᬮᬸᬗᬦ᭄ |
| kuningan | ᬓᬸᬦᬶᬗᬦ᭄ |
| kober | ᬓᭀᬩᬾᬭ᭄ |
| cili | ᬘᬶᬮᬶ |
| gegantungan | ᬕᬾᬕᬦ᭄ᬢᬸᬗᬦ᭄ |
| tebu | ᬢᬾᬩᬸ |
| nyuh | ᬦ᭄ᬬᬸᬳ᭄ |
| busung | ᬩᬸᬲᬸᬂ |
| ambu | ᬅᬫ᭄ᬩᬸ |
| plawa | ᬧ᭄ᬮᬯ |
| sanggah | ᬲᬂᬕᬳ᭄ |
| banten | ᬩᬦ᭄ᬢᬾᬦ᭄ |
| lamak | ᬮᬫᬓ᭄ |
| jaja uli | ᬚᬚ​ᬉᬮᬶ |

For other terms, type the Balinese word into the <a href="/">converter</a>, or look it up in the <a href="/translate">Balinese dictionary</a>.

## When Penjor Go Up

Galungan penjor are usually raised on **Penampahan Galungan**, the day before Galungan, and stand until the festival period closes. Galungan recurs every 210 days on the Balinese calendar, and is closed by **Kuningan** ten days later.

## Simple Etiquette for Visitors

- A penjor stands outside a house as part of an offering, not as a photo prop — photographing is fine, touching or moving it is not.
- Never step over or on the offerings placed at its base.
- If you want to raise one yourself, ask local residents how; the assembly follows rules rather than design taste.

## Further Reading

The role of script in ceremony is covered in <a href="/blog/upacara-keagamaan-aksara-bali">Balinese script in religious ceremony</a>, and potent letter-and-symbol art in <a href="/blog/rerajahan-seni-sakral-aksara-bali">rerajahan</a>. Another festival sequence is covered in <a href="/blog/rangkaian-hari-raya-nyepi">the Nyepi sequence</a>.

The breakdown here follows the infographic *Eteh-eteh Penjor Galungan* by Eka Setyawan, published by Komunitas Wikimedia Denpasar on Wikimedia Commons (CC BY-SA 4.0). Names and meanings vary between village communities — Balinese tradition is deliberately local, following *desa, kala, patra*.
`.trim(),
  },

  {
    slug: 'rangkaian-hari-raya-nyepi',
    title: 'Rangkaian Hari Raya Nyepi: Melasti, Pangrupukan, Nyepi, dan Ngembak Geni',
    title_en: 'The Nyepi Sequence: Melasti, Pangrupukan, Nyepi, and Ngembak Geni',
    excerpt: 'Urutan rangkaian Hari Raya Nyepi dari Melasti hingga Ngembak Geni, isi Catur Brata Penyepian, dan penulisan istilahnya dalam aksara Bali.',
    excerpt_en: 'The Nyepi sequence from Melasti to Ngembak Geni, what Catur Brata Penyepian involves, and the terms written in Balinese script.',
    category: 'Sejarah & Budaya',
    tags: ['nyepi', 'melasti', 'ngembak geni', 'hari raya bali', 'aksara bali'],
    image_url: COVERS + 'rangkaian-hari-raya-nyepi.png',
    read_time: '6 menit',
    content: `
## Nyepi Adalah Rangkaian, Bukan Satu Hari

Nyepi menandai **Tahun Baru Saka** bagi umat Hindu Bali, dan hari puncaknya dijalani dalam keheningan total selama 24 jam. Tetapi Nyepi tidak berdiri sendiri: ia bagian dari rangkaian upacara beberapa hari, masing-masing dengan tujuannya sendiri.

## Urutan Rangkaiannya

| Tahap | Waktu | Isi |
|-------|-------|-----|
| Melasti | sekitar 3–4 hari sebelum Nyepi | prosesi penyucian diri dan pratima ke laut, danau, sungai, atau mata air |
| Pangrupukan | sehari sebelum Nyepi | upacara mecaru, menyebar nasi tawur, dan mengarak ogoh-ogoh sebagai simbolisasi Bhuta Kala |
| Nyepi | hari puncak | keheningan total selama 24 jam, tanpa kegiatan sama sekali |
| Ngembak Geni | sehari setelah Nyepi | aktivitas kembali normal; umat saling berkunjung dan mempererat persaudaraan |

Rangkaian ini bergerak dari **membersihkan**, lalu **menetralkan**, lalu **hening**, lalu **memulai kembali** — urutan yang paling masuk akal dibaca sebagai satu kesatuan.

## Catur Brata Penyepian

Pada hari Nyepi, umat Hindu Bali menjalankan empat pantangan:

| Brata | Artinya |
|-------|--------|
| amati geni | tidak menyalakan api, termasuk menahan hawa nafsu |
| amati karya | tidak bekerja |
| amati lelungan | tidak bepergian |
| amati lelanguan | tidak menikmati hiburan |

Selama 24 jam itu bandara ditutup, jalan-jalan kosong, dan lampu dipadamkan. Bagi pengunjung yang sedang berada di Bali, aturan ini juga berlaku — termasuk tetap berada di dalam penginapan.

## Istilahnya dalam Aksara Bali

| Latin | Aksara Bali |
|-------|------------|
| nyepi | ᬦ᭄ᬬᬾᬧᬶ |
| melasti | ᬫᬾᬮᬲ᭄ᬢᬶ |
| pangrupukan | ᬧᬂᬭᬸᬧᬸᬓᬦ᭄ |
| ngembak geni | ᬗᬾᬫ᭄ᬩᬓ᭄​ᬕᬾᬦᬶ |
| tawur kesanga | ᬢᬯᬸᬭ᭄​ᬓᬾᬲᬗ |
| ogoh-ogoh | ᬑᬕᭀᬳ᭄-ᬑᬕᭀᬳ᭄ |
| amati geni | ᬅᬫᬢᬶ​ᬕᬾᬦᬶ |
| amati karya | ᬅᬫᬢᬶ​ᬓᬭ᭄ᬬ |
| amati lelungan | ᬅᬫᬢᬶ​ᬮᬾᬮᬸᬗᬦ᭄ |
| tahun baru saka | ᬢᬳᬸᬦ᭄​ᬩᬭᬸ​ᬲᬓ |

Untuk istilah lain, ketikkan kata Balinya di <a href="/">konverter aksara Bali</a> atau cari di <a href="/translate">kamus bahasa Bali</a>.

## Kenapa Keheningan Itu Penting

Nyepi dijalani sebagai perenungan diri dan penyucian batin, serta upaya menjaga keseimbangan antara manusia dan alam semesta. Satu hari tanpa api, kerja, perjalanan, dan hiburan memberi jeda yang tidak diberikan hari-hari lain — dan memberi pulau itu sendiri satu hari untuk beristirahat.

## Catatan untuk Pengunjung

- Rencanakan penerbangan di luar tanggal Nyepi; bandara tutup penuh selama 24 jam.
- Siapkan makanan dan kebutuhan sehari sebelumnya, karena toko dan restoran tutup.
- Ikuti arahan **pecalang**, petugas keamanan adat yang berjaga selama Nyepi.
- Menonton pawai ogoh-ogoh pada malam Pangrupukan umumnya terbuka untuk umum — tanyakan lebih dulu kepada warga setempat soal tempat dan waktunya.

## Bacaan Lanjutan

Peran aksara Bali dalam upacara dibahas di artikel <a href="/blog/upacara-keagamaan-aksara-bali">aksara Bali dalam upacara keagamaan</a>, dan hari raya lain di artikel <a href="/blog/kelengkapan-penjor-galungan">kelengkapan penjor Galungan</a>.

Ringkasan rangkaian pada artikel ini mengikuti infografik *Mengenal Rangkaian Hari Raya Nyepi* dari Komunitas Wikimedia Denpasar (Wikimedia Commons, CC BY-SA 4.0). Pelaksanaannya dapat berbeda antar desa adat sesuai *desa, kala, patra*.
`.trim(),
    content_en: `
## Nyepi Is a Sequence, Not a Single Day

Nyepi marks the **Saka New Year** for Balinese Hindus, and its central day is spent in total silence for 24 hours. But Nyepi does not stand alone: it belongs to a sequence of ceremonies spread over several days, each with its own purpose.

## The Sequence

| Stage | When | What happens |
|-------|------|-------------|
| Melasti | about 3–4 days before Nyepi | a purification procession to the sea, a lake, a river, or a spring |
| Pangrupukan | the day before Nyepi | the mecaru rite, scattering of tawur rice, and ogoh-ogoh parades representing Bhuta Kala |
| Nyepi | the main day | total silence for 24 hours, with no activity at all |
| Ngembak Geni | the day after Nyepi | normal life resumes; people visit one another and renew ties |

The sequence moves from **cleansing**, to **neutralising**, to **stillness**, to **beginning again** — an arc that makes most sense read as a whole.

## Catur Brata Penyepian

On Nyepi itself, four restraints are observed:

| Brata | Meaning |
|-------|---------|
| amati geni | no fire or light, including restraint of desire |
| amati karya | no work |
| amati lelungan | no travel |
| amati lelanguan | no entertainment |

For those 24 hours the airport closes, the roads empty, and lights stay off. Visitors in Bali are expected to observe the rules too, including staying inside their accommodation.

## The Terms in Balinese Script

| Latin | Balinese script |
|-------|----------------|
| nyepi | ᬦ᭄ᬬᬾᬧᬶ |
| melasti | ᬫᬾᬮᬲ᭄ᬢᬶ |
| pangrupukan | ᬧᬂᬭᬸᬧᬸᬓᬦ᭄ |
| ngembak geni | ᬗᬾᬫ᭄ᬩᬓ᭄​ᬕᬾᬦᬶ |
| tawur kesanga | ᬢᬯᬸᬭ᭄​ᬓᬾᬲᬗ |
| ogoh-ogoh | ᬑᬕᭀᬳ᭄-ᬑᬕᭀᬳ᭄ |
| amati geni | ᬅᬫᬢᬶ​ᬕᬾᬦᬶ |
| amati karya | ᬅᬫᬢᬶ​ᬓᬭ᭄ᬬ |
| amati lelungan | ᬅᬫᬢᬶ​ᬮᬾᬮᬸᬗᬦ᭄ |
| tahun baru saka | ᬢᬳᬸᬦ᭄​ᬩᬭᬸ​ᬲᬓ |

For other terms, type the Balinese word into the <a href="/">converter</a> or search the <a href="/translate">Balinese dictionary</a>.

## Why the Silence Matters

Nyepi is kept as self-reflection and inner cleansing, and as an effort to hold the balance between people and the wider world. A day without fire, work, travel, or entertainment creates a pause no other day offers — and gives the island itself a day of rest.

## Notes for Visitors

- Plan flights around Nyepi; the airport closes completely for 24 hours.
- Buy food and supplies the day before, as shops and restaurants shut.
- Follow the direction of **pecalang**, the customary security officers on duty during Nyepi.
- Ogoh-ogoh parades on Pangrupukan night are generally open to the public — ask locals about time and place.

## Further Reading

The role of Balinese script in ceremony is covered in <a href="/blog/upacara-keagamaan-aksara-bali">Balinese script in religious ceremony</a>, and another festival in <a href="/blog/kelengkapan-penjor-galungan">the parts of a Galungan penjor</a>.

The summary here follows the infographic *Mengenal Rangkaian Hari Raya Nyepi* by Komunitas Wikimedia Denpasar (Wikimedia Commons, CC BY-SA 4.0). Observance varies between village communities according to *desa, kala, patra*.
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
