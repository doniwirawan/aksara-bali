import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

// Unsplash images: always use for blog posts
const UNSPLASH_IMAGES = {
  'mengenal-aksara-bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  'cara-belajar-aksara-bali': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80',
  'aksara-bali-dan-bahasa-sansekerta': 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1200&q=80',
  'lontar-naskah-kuno-bali': 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80',
  'perbedaan-aksara-bali-jawa-latin': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
  'upaya-pelestarian-aksara-bali-digital': 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80',
}

const BLOG_CONTENT = {
  'mengenal-aksara-bali': {
    title: 'Mengenal Aksara Bali: Warisan Budaya yang Perlu Dilestarikan',
    description: 'Aksara Bali adalah sistem tulisan tradisional yang digunakan masyarakat Bali sejak berabad-abad lalu. Pelajari sejarah, struktur, dan cara membacanya.',
    date: '2026-03-15',
    category: 'Sejarah & Budaya',
    readTime: '6 menit',
    tags: ['aksara bali', 'sejarah', 'budaya', 'script'],
    imageUrl: UNSPLASH_IMAGES['mengenal-aksara-bali'],
    content: `
## Apa Itu Aksara Bali?

Aksara Bali (bahasa Inggris: *Balinese script*) adalah sistem tulisan tradisional yang digunakan oleh masyarakat Bali, Indonesia. Aksara ini termasuk dalam keluarga aksara Brahmi — salah satu kelompok aksara tertua di dunia yang berasal dari India — dan berkembang melalui tradisi aksara Kawi yang digunakan di Jawa dan Bali sejak abad ke-9 Masehi.

Secara teknis, aksara Bali adalah **abugida** atau alfabet silabis — setiap karakter dasar merepresentasikan sebuah konsonan yang secara inheren mengandung vokal /a/. Vokal lain ditulis dengan tanda tambahan (pangangge) yang ditempatkan di atas, bawah, atau di sekitar konsonan dasar.

## Sejarah Perkembangan Aksara Bali

### Akar Brahmi dan Kawi

Aksara Bali berakar dari aksara Brahmi yang dibawa oleh para pedagang dan brahmana dari India ke Nusantara sekitar abad ke-1 hingga ke-3 Masehi. Di Jawa dan Bali, aksara Brahmi berkembang menjadi aksara **Pallawa**, kemudian **Kawi** (bahasa Jawa Kuno), yang menjadi cikal bakal aksara Bali modern.

Prasasti tertua dalam aksara Bali diperkirakan berasal dari abad ke-10–11 Masehi, ditemukan di berbagai situs arkeologi di Bali.

### Era Majapahit dan Pengaruh Hindu

Pengaruh Kerajaan Majapahit (abad ke-13–15) memperkuat penggunaan aksara Bali dalam konteks religius dan administratif. Setelah runtuhnya Majapahit pada akhir abad ke-15 dan meluasnya Islam di Jawa, banyak seniman, pendeta, dan cendekiawan Hindu-Bali mengungsi ke Bali, membawa serta tradisi penulisan pada daun lontar.

### Aksara Bali di Era Modern

Pada abad ke-20, penggunaan aksara Bali mulai menurun seiring dengan diperkenalkannya aksara Latin oleh pemerintah kolonial Belanda. Namun, gerakan pelestarian mulai bangkit sejak era kemerdekaan Indonesia. Pemerintah Bali kini mewajibkan pengajaran aksara Bali di sekolah dasar dan menengah melalui kurikulum muatan lokal.

Pada tahun 2006, Unicode Consortium memasukkan aksara Bali ke dalam standar Unicode (U+1B00–U+1B7F), memungkinkan aksara ini digunakan di perangkat digital modern.

## Struktur Aksara Bali

### Aksara Wianjana (Konsonan)

Aksara Bali memiliki 47 karakter konsonan dasar, dikelompokkan dalam urutan tradisional yang disebut **Hanacaraka**:

| Kelompok | Aksara |
|----------|--------|
| Voiceless stops | Ka, Ca, Tha, Ta, Pa |
| Voiced stops | Ga, Ja, Dha, Da, Ba |
| Nasals | Nga, Nya, Nna, Na, Ma |
| Semivowels | Ya, Ra, La, Wa |
| Sibilants | Sha, Ssa, Sa |
| Aspirate | Ha |

### Aksara Suara (Vokal Mandiri)

Terdapat 8 vokal mandiri: A (ᬅ), Ā (ᬆ), I (ᬇ), Ī (ᬈ), U (ᬉ), Ū (ᬊ), E (ᬏ), O (ᬑ). Vokal mandiri digunakan di awal kata atau setelah vokal lain.

### Pangangge (Tanda Vokal)

Ketika vokal mengikuti konsonan, digunakan tanda vokal (pangangge) yang menempel pada konsonan. Tanda ini berbeda tergantung pada posisinya (atas, bawah, kiri, atau kanan konsonan).

### Adeg-adeg (᭄)

Karakter khusus yang disebut **adeg-adeg** atau **virama** digunakan untuk "membunuh" vokal inheren dari sebuah konsonan, sehingga konsonan tersebut tampak tanpa vokal — berguna untuk menulis gugus konsonan (*gantungan*).

## Penggunaan Tradisional

Aksara Bali secara historis digunakan untuk:

1. **Naskah lontar** — Teks-teks keagamaan, sastra, medis (*usada*), dan astronomi (*wariga*) ditulis pada daun lontar (*Borassus flabellifer*).
2. **Prasasti** — Dokumen resmi kerajaan dipahat pada batu atau lempengan tembaga.
3. **Upacara keagamaan** — Aksara Bali masih digunakan dalam mantra, rerajahan (yantra), dan teks-teks upacara Hindu Bali.
4. **Papan nama** — Di Bali, banyak papan nama jalan, kantor pemerintah, dan pura menggunakan aksara Bali berdampingan dengan aksara Latin.

## Aksara Bali dalam Kehidupan Modern

Meskipun penggunaannya sehari-hari telah menurun, aksara Bali mengalami kebangkitan di era digital:

- **Keyboard aksara Bali** tersedia untuk Android dan iOS
- **Font Unicode** seperti *Noto Sans Balinese* memungkinkan tampilan aksara Bali di semua platform modern
- **Gerakan pelestarian** aktif di komunitas Bali, termasuk lomba menulis aksara Bali dan festival budaya
- **Institusi akademik** seperti Universitas Udayana dan STBA Saraswati memiliki program khusus untuk kajian aksara Bali

## Kesimpulan

Aksara Bali bukan sekadar sistem penulisan — ia adalah cerminan identitas budaya, spiritualitas, dan sejarah panjang masyarakat Bali. Di tengah derasnya arus globalisasi, upaya pelestarian aksara ini bukan hanya tugas para akademisi, tetapi tanggung jawab kita semua sebagai bagian dari komunitas yang menghargai keragaman budaya manusia.
    `,
  },

  'cara-belajar-aksara-bali': {
    title: 'Cara Belajar Aksara Bali untuk Pemula: Panduan Lengkap',
    description: 'Panduan langkah demi langkah untuk mempelajari aksara Bali dari nol. Mulai dari aksara dasar hanacaraka, tanda baca, hingga menulis kata pertama Anda.',
    date: '2026-03-10',
    category: 'Panduan Belajar',
    readTime: '8 menit',
    tags: ['belajar', 'pemula', 'hanacaraka', 'tutorial'],
    imageUrl: UNSPLASH_IMAGES['cara-belajar-aksara-bali'],
    content: `
## Mengapa Belajar Aksara Bali?

Mempelajari aksara Bali bukan sekadar menguasai sistem tulisan — ini adalah cara untuk terhubung lebih dalam dengan budaya Bali yang kaya, membaca teks-teks keagamaan Hindu Bali, dan berkontribusi pada pelestarian warisan leluhur.

Kabar baiknya: aksara Bali memiliki aturan yang konsisten dan logis. Dengan metode yang tepat, Anda dapat mengenali dan membaca aksara dasar dalam hitungan minggu.

## Langkah 1: Kenali Sistem Aksara Bali

Sebelum mulai menghafal, pahami bagaimana aksara Bali bekerja:

- Aksara Bali adalah **abugida** — setiap konsonan membawa vokal /a/ secara default
- Menulis "ka" cukup dengan satu karakter: **ᬓ**
- Untuk menulis "ki", tambahkan tanda vokal /i/: **ᬓᬶ**
- Untuk menulis "k" saja (tanpa vokal), tambahkan **adeg-adeg** (᭄): **ᬓ᭄**

## Langkah 2: Pelajari Urutan Hanacaraka

Urutan konsonan tradisional aksara Bali dikenal sebagai **Hanacaraka** — sebuah akronim dari kata-kata dalam bait puisi Jawa Kuno. Urutan ini membantu menghafal 20 konsonan utama:

**Ha Na Ca Ra Ka** (ᬳ ᬦ ᬘ ᬭ ᬓ)
**Da Ta Sa Wa La** (ᬤ ᬢ ᬲ ᬯ ᬮ)
**Ma Ga Ba Nga Pa** (ᬫ ᬕ ᬩ ᬗ ᬧ)
**Ja Ya Nya ṇa Ta** (ᬚ ᬬ ᬜ ᬡ ᬢ)

Saran: Hafal 5 aksara per hari sambil menulis berulang-ulang. Dalam 4 hari, Anda sudah menguasai 20 aksara utama.

## Langkah 3: Kuasai Tanda Vokal (Pangangge)

Setelah menguasai konsonan, pelajari tanda vokal:

| Latin | Tanda | Posisi |
|-------|-------|--------|
| -a | (bawaan) | — |
| -ā / -aa | ᬵ (taling) | kanan |
| -i | ᬶ (ulu) | atas |
| -ī / -ii | ᬷ (ulu sari) | atas |
| -u | ᬸ (suku) | bawah |
| -ū / -uu | ᬹ (suku ilut) | bawah |
| -e | ᬾ (taleng) | kiri |
| -o | ᭀ (taleng tedung) | kiri+kanan |

**Contoh latihan:**
- ba + ᬶ = bi (ᬩᬶ)
- ka + ᬸ = ku (ᬓᬸ)
- pa + ᬾ = pe (ᬧᬾ)

## Langkah 4: Tulis Kata-Kata Pertama Anda

Mulailah dengan kata-kata sederhana 2–3 suku kata:

| Latin | Aksara Bali | Arti |
|-------|------------|------|
| bali | ᬩᬮᬶ | Bali |
| dewa | ᬤᬾᬯ | dewa |
| pura | ᬧᬸᬭ | pura/kuil |
| api | ᬅᬧᬶ | api |
| suka | ᬲᬸᬓ | suka |

## Langkah 5: Pahami Gugus Konsonan (Gantungan)

Ketika dua konsonan bertemu tanpa vokal di antaranya, konsonan kedua dituliskan dalam bentuk khusus yang disebut **gantungan** (digantungkan di bawah konsonan pertama). Ini adalah aspek aksara Bali yang paling rumit dan membutuhkan latihan ekstra.

Contoh: **surya** (ᬲᬸᬭ᭄ᬬ) — "r" dalam gugus "rya" ditulis menggunakan adeg-adeg.

## Langkah 6: Tambahkan Aksara Murda (untuk Sansekerta)

Kata-kata yang berasal dari bahasa Sansekerta ditulis dengan aksara **murda** — versi khusus beberapa konsonan yang menunjukkan pelafalan retroflex (bibir ditekuk ke langit-langit). Ini penting untuk teks keagamaan.

## Tips Belajar yang Efektif

1. **Gunakan aplikasi digital** — Konverter aksara Bali online memungkinkan Anda melihat konversi Latin ke aksara Bali secara real-time.
2. **Tulis dengan tangan** — Menulis manual memperkuat memori motorik. Gunakan buku latihan atau kertas bergaris.
3. **Baca papan nama** — Di Bali, banyak papan nama menggunakan aksara Bali. Jadikan perjalanan sebagai kesempatan belajar.
4. **Bergabung dengan komunitas** — Ikuti komunitas belajar aksara Bali di media sosial atau forum budaya.
5. **Konsistensi** — 15–20 menit setiap hari lebih efektif daripada belajar sekaligus dalam satu sesi panjang.

## Sumber Belajar

- **Kamus Bali–Indonesia** (Pusat Bahasa, Kemendikbud)
- **Buku Ajar Bahasa Bali** untuk SD dan SMP (Dinas Pendidikan Provinsi Bali)
- **Gedong Kirtya** — Perpustakaan lontar di Singaraja, Bali
- **Universitas Udayana, Bali** — Program studi Bahasa dan Sastra Bali
    `,
  },

  'aksara-bali-dan-bahasa-sansekerta': {
    title: 'Hubungan Aksara Bali dan Bahasa Sansekerta',
    description: 'Aksara Bali memiliki akar yang dalam pada bahasa Sansekerta. Temukan bagaimana pengaruh Hindu-Bali membentuk sistem penulisan yang unik ini.',
    date: '2026-03-05',
    category: 'Linguistik',
    readTime: '7 menit',
    tags: ['sansekerta', 'linguistik', 'hindu', 'bali'],
    imageUrl: UNSPLASH_IMAGES['aksara-bali-dan-bahasa-sansekerta'],
    content: `
## Bahasa Sansekerta dan Pengaruhnya pada Aksara Bali

Bahasa Sansekerta (*Sanskrit*) adalah bahasa klasik Indo-Arya yang berfungsi sebagai bahasa liturgi dan sastra bagi agama Hindu, Buddha, dan Jain. Di Bali, Sansekerta bukan sekadar bahasa kuno — ia adalah fondasi dari vocabulari religius, sastra, dan sistem tulisan yang digunakan hingga hari ini.

## Jalur Transmisi: Dari India ke Bali

Aksara Bali tidak langsung berasal dari India. Ia melewati serangkaian transformasi:

1. **Brahmi** (abad ke-3 SM) → aksara induk dari sebagian besar aksara Asia Selatan dan Tenggara
2. **Grantha** → varian Brahmi yang digunakan khusus untuk teks Sansekerta di India Selatan
3. **Pallawa** → turunan Brahmi/Grantha yang digunakan di Asia Tenggara, abad ke-4–8 M
4. **Kawi** → aksara yang berkembang di Jawa, abad ke-8–15 M, digunakan untuk teks Sansekerta dan Jawa Kuno
5. **Aksara Bali** → turunan Kawi yang berkembang di Bali dari abad ke-10 M

## Aksara Murda: Penanda Sansekerta

Salah satu pengaruh Sansekerta yang paling nyata dalam aksara Bali adalah **aksara murda** — satu set konsonan khusus yang merepresentasikan bunyi retroflex (ṭa, ḍa, ṇa, dll.) yang ada dalam Sansekerta tetapi tidak ada dalam bahasa Bali sehari-hari.

Konsonan retroflex ini ditulis dengan karakter berbeda:
- ṭa (ᬝ) vs. ta (ᬢ)
- ḍha (ᬠ) vs. dha (ᬤ)
- ṇa (ᬡ) vs. na (ᬦ)

Ketika menulis kata-kata Sansekerta seperti *dharma* (ᬥᬭ᭄ᬫ) atau *Krishna* (ᬓᬺᬱ᭄ᬡ), aksara murda digunakan untuk menjaga keakuratan fonologis.

## Kosakata Sansekerta dalam Budaya Bali

Bahasa Bali menyerap ribuan kata dari bahasa Sansekerta, terutama dalam domain:

**Keagamaan:**
- *pura* (kuil) dari Sansekerta *pura* (kota, tempat)
- *dharma* (kebenaran, kewajiban) — langsung dari Sansekerta
- *yoga* (penyatuan) — langsung dari Sansekerta
- *mantra* (doa/formula sakral) — langsung dari Sansekerta

**Astronomi dan Kalender:**
- *Surya* (matahari), *Candra* (bulan), *Bumi* (bumi)
- *Soma, Mangala, Buda, Wrespati, Sukra, Saniscara* — nama hari berdasarkan nama planet Sansekerta

**Nama Orang dan Gelar:**
- *Agung, Alit, Wayan, Made* — nama Bali yang memiliki kandungan Sansekerta
- *Ida, Cokorda, Anak Agung* — gelar bangsawan dari tradisi Hindu Bali

## V=W: Ekuivalensi Unik dalam Aksara Bali

Salah satu fitur linguistik yang menarik adalah ekuivalensi V dan W dalam tradisi aksara Bali. Bahasa Sansekerta memiliki bunyi /v/ yang dalam bahasa Bali direalisasikan sebagai /w/. Akibatnya:

- *Vishnu* → *Wisnu* (ᬯᬶᬱ᭄ᬡᬸ)
- *Veda* → *Weda* (ᬯᬾᬤ)
- *Varuna* → *Waruna*

Konverter aksara Bali modern harus memperhitungkan ekuivalensi ini untuk menghasilkan transliterasi yang akurat.

## Aksara Bali sebagai Jembatan Sastra

Ratusan teks Sansekerta klasik ditulis ulang dan ditafsirkan kembali dalam tradisi lontar Bali, termasuk:

- *Ramayana* dan *Mahabharata* dalam adaptasi Bali (*Kakawin*)
- *Bhagavad Gita* dan berbagai Upanishad
- Teks medis Sansekerta yang diadaptasi dalam *Usada* (pengobatan tradisional Bali)
- Teks astronomi dalam *Wariga* (kalender tradisional Bali)

Para cendekiawan (*pandita*) di Bali hingga hari ini mempelajari Sansekerta untuk dapat membaca dan menafsirkan teks-teks suci ini.

## Pentingnya Memahami Koneksi Ini

Pemahaman tentang hubungan aksara Bali–Sansekerta penting untuk:

1. **Transliterasi yang akurat** — Kata-kata Sansekerta memerlukan aksara murda yang tepat
2. **Kajian akademis** — Membaca naskah lontar yang mengandung kutipan Sansekerta
3. **Pemeliharaan upacara** — Mantra dan doa dalam bahasa Sansekerta harus diucapkan dengan benar
4. **Apresiasi budaya** — Memahami kedalaman filosofis di balik istilah-istilah yang digunakan sehari-hari

Aksara Bali, dengan segala kekayaan pengaruh Sansekertanya, adalah bukti nyata dari dialog peradaban yang berlangsung selama berabad-abad antara India dan Nusantara.
    `,
  },

  'lontar-naskah-kuno-bali': {
    title: 'Lontar: Naskah Kuno Bali dan Perannya dalam Melestarikan Budaya',
    description: 'Lontar adalah daun palem yang digunakan sebagai media tulisan tradisional Bali. Pelajari bagaimana naskah kuno ini menyimpan kearifan dan pengetahuan leluhur.',
    date: '2026-02-28',
    category: 'Naskah Kuno',
    readTime: '5 menit',
    tags: ['lontar', 'naskah kuno', 'budaya', 'preservasi'],
    imageUrl: UNSPLASH_IMAGES['lontar-naskah-kuno-bali'],
    content: `
## Apa Itu Lontar?

**Lontar** adalah naskah tradisional yang ditulis pada daun palem siwalan (*Borassus flabellifer*), yang juga dikenal sebagai palmyra palm. Istilah "lontar" sendiri berasal dari bahasa Sansekerta *tāla* (pohon palem) yang mengalami perubahan bunyi dalam bahasa Jawa Kuno menjadi *tal*, lalu *ron tal* (daun tal), dan akhirnya *lontar*.

Selama berabad-abad, lontar menjadi media utama untuk mendokumentasikan pengetahuan, sastra, hukum, dan ajaran keagamaan di Bali, Jawa, Lombok, dan Nusa Tenggara Barat.

## Proses Pembuatan Lontar

### Bahan dan Persiapan

Daun lontar yang dipilih adalah daun palem yang telah cukup tua dan kering. Prosesnya:

1. Daun dipotong dan direbus selama beberapa jam
2. Setelah dikeringkan, daun dipres dan dipotong menjadi lembaran panjang (biasanya 3–5 cm × 30–60 cm)
3. Lembaran diampelas hingga halus dan rata
4. Tepi daun dilobang untuk diikat dengan tali

### Teknik Penulisan

Aksara Bali dipahatkan menggunakan **pengutik** — alat tajam dari baja atau bambu yang menyerupai pisau kecil. Huruf-huruf diukir ke dalam permukaan daun, bukan ditulis di atasnya. Setelah diukir, permukaan lontar dilumuri jelaga atau tinta berbasis minyak sehingga huruf menjadi terlihat.

## Isi dan Kategori Naskah Lontar

Naskah lontar Bali mencakup berbagai bidang:

| Kategori | Konten |
|----------|--------|
| **Kakawin** | Puisi epik dalam bahasa Jawa Kuno, adaptasi Mahabharata dan Ramayana |
| **Kidung** | Puisi berbahasa Jawa Tengahan |
| **Geguritan** | Puisi berbahasa Bali |
| **Usada** | Pengobatan tradisional dan resep herbal |
| **Wariga** | Astrologi dan kalender tradisional Bali |
| **Tutur** | Ajaran filosofis dan teologi Hindu Bali |
| **Awig-awig** | Hukum adat dan peraturan desa |
| **Babad** | Kronik dan silsilah kerajaan |

## Penyimpanan dan Pelestarian Lontar

### Tantangan Konservasi

Lontar rentan terhadap:
- **Kelembapan tinggi** — Bali memiliki iklim tropis yang lembap
- **Serangga** — Terutama rayap dan kumbang bubuk buku
- **Jamur** — Dapat merusak permukaan tulisan
- **Kerapuhan** — Daun mengering dan retak seiring waktu

### Upaya Pelestarian Modern

**Gedong Kirtya** di Singaraja (didirikan 1928) adalah perpustakaan lontar pertama di Indonesia, menyimpan lebih dari 3.000 judul naskah. Lembaga ini melakukan:
- Digitalisasi naskah menggunakan kamera resolusi tinggi
- Alih aksara (transliterasi) ke dalam aksara Latin
- Terjemahan ke dalam bahasa Indonesia dan Inggris

**Museum Bali** di Denpasar dan berbagai *gedong* (penyimpanan lontar) di pura-pura besar juga menyimpan koleksi lontar yang signifikan.

**Bayudha Project** dan berbagai inisiatif digital berusaha membuat konten lontar dapat diakses secara online melalui database dan repositori digital.

## Lontar dalam Kehidupan Spiritual Bali

Berbeda dengan di tempat lain, di Bali lontar bukan sekadar artefak museum. Banyak keluarga *pandita* (pendeta Hindu Bali) masih menyimpan lontar pusaka yang diwariskan turun-temurun dan dibacakan dalam konteks ritual tertentu.

*Pemangku* (pendeta desa) menggunakan lontar *wariga* untuk menentukan hari-hari baik dalam kalender Hindu Bali, yang hingga kini masih sangat berpengaruh dalam kehidupan sehari-hari masyarakat Bali.

## Signifikansi Global

UNESCO mengakui pentingnya pelestarian naskah-naskah Nusantara, termasuk lontar Bali. Dalam **Memory of the World Programme** UNESCO, beberapa koleksi naskah kuno Asia Tenggara telah diakui sebagai warisan dokumenter dunia.

Keunikan lontar Bali terletak pada kesinambungan tradisi penulisannya — tidak seperti banyak tradisi naskah kuno yang telah punah, tradisi lontar di Bali masih hidup, dengan beberapa pengrajin dan *pemangku* yang masih memproduksi lontar baru untuk keperluan upacara.
    `,
  },

  'perbedaan-aksara-bali-jawa-latin': {
    title: 'Perbedaan Aksara Bali, Jawa, dan Latin: Panduan Perbandingan',
    description: 'Aksara Bali dan Jawa memiliki asal-usul yang sama namun berkembang secara berbeda. Bandingkan keduanya dengan aksara Latin yang kita gunakan sehari-hari.',
    date: '2026-02-20',
    category: 'Linguistik',
    readTime: '9 menit',
    tags: ['perbandingan', 'aksara jawa', 'linguistik'],
    imageUrl: UNSPLASH_IMAGES['perbedaan-aksara-bali-jawa-latin'],
    content: `
## Tiga Sistem Aksara, Satu Kepulauan

Indonesia adalah salah satu negara dengan kekayaan sistem penulisan yang luar biasa. Di antara ratusan bahasa daerah, beberapa memiliki aksara tradisional sendiri. Aksara Bali dan aksara Jawa adalah dua yang paling signifikan, sementara aksara Latin kini mendominasi penggunaan sehari-hari.

## Asal-Usul yang Sama, Jalur yang Berbeda

Baik aksara Bali maupun aksara Jawa berasal dari **aksara Kawi** — sistem penulisan yang berkembang di Jawa sekitar abad ke-8–9 M dan merupakan turunan dari aksara Pallawa India.

**Aksara Jawa (Hanacaraka):**
- Berkembang di Jawa Tengah dan Timur
- Dipengaruhi oleh budaya keraton Mataram dan Majapahit
- Bentuk huruf yang lebih kotak/angulir dalam penulisan modern

**Aksara Bali:**
- Berkembang di Bali, dengan pengaruh dari Hindu Bali
- Mempertahankan lebih banyak elemen dari aksara Kawi kuno
- Bentuk huruf yang lebih bulat dan ornamental

## Perbandingan Teknis

### 1. Urutan Aksara

Keduanya menggunakan urutan **Hanacaraka** (Ha-Na-Ca-Ra-Ka...), yang berasal dari sebuah bait puisi Jawa Kuno dengan narasi yang sama. Ini menunjukkan asal-usul bersama yang kuat.

### 2. Jumlah Karakter

| Aspek | Aksara Bali | Aksara Jawa |
|-------|------------|------------|
| Konsonan dasar | 47 | 20 (dasar) + 8 (mahaprana) |
| Karakter Unicode | 128 (U+1B00–U+1B7F) | 91 (U+A980–U+A9DF) |
| Vokal mandiri | 8 | 11 |

### 3. Gugus Konsonan

Kedua aksara menggunakan mekanisme **pasangan** (Jawa) atau **gantungan** (Bali) untuk menulis gugus konsonan — konsonan kedua ditulis dalam bentuk yang lebih kecil dan ditempatkan di bawah konsonan pertama. Mekanisme ini merupakan warisan langsung dari aksara Brahmi India.

### 4. Spasi Kata

Baik aksara Bali maupun Jawa tradisional **tidak menggunakan spasi** antar kata (scriptio continua) — sebuah fitur yang juga dimiliki oleh aksara Brahmi dan berbeda dari tradisi Latin.

### 5. Tanda Baca

Aksara Bali memiliki sistem tanda baca yang lebih kaya:
- **Carik** (᭟) — koma/jeda pendek
- **Carik Pamungkah** — tanda awal teks
- **Pama** — titik/jeda panjang
- **Windu** (ᭀ) — tanda bulat untuk awalan

## Aksara Latin: Pendatang Modern

Aksara Latin dibawa ke Indonesia oleh VOC (Vereenigde Oost-Indische Compagnie) pada abad ke-17 dan menjadi standar penulisan resmi sejak era kolonial Belanda. Perbedaan mendasarnya:

| Aspek | Aksara Bali/Jawa | Aksara Latin |
|-------|-----------------|-------------|
| Tipe | Abugida (silabis) | Alfabet |
| Vokal | Tanda tambahan | Huruf terpisah |
| Arah | Kiri ke kanan | Kiri ke kanan |
| Spasi | Tradisional: tidak ada | Ada |
| Kapital | Tidak ada | Ada |

## Saling Pengaruh dalam Era Modern

Menariknya, ketika aksara Bali dan Jawa ditransliterasikan ke dalam Latin, diperlukan konvensi khusus:

- Bunyi **ng** cukup dua huruf dalam Latin, tetapi satu karakter (ᬗ) dalam aksara Bali
- Bunyi retroflex Sansekerta (*ṭ, ḍ, ṇ*) memerlukan tanda diakritik dalam Latin, tetapi memiliki karakter sendiri dalam aksara Bali
- Ekuivalensi V=W — unik untuk tradisi Bali

## Mengapa Keduanya Harus Dilestarikan?

Dari perspektif linguistik, kedua aksara ini menyimpan informasi tentang:
1. **Rekonstruksi bahasa proto-Melayu** — Pola perubahan bunyi antar bahasa
2. **Sejarah kontak bahasa** — Bukti interaksi antara Bali, Jawa, dan India
3. **Kosakata arkaik** — Kata-kata yang sudah tidak digunakan dalam bahasa modern

Dari perspektif budaya, keduanya adalah **identitas** — cara sebuah komunitas mengekspresikan dirinya sendiri dalam bentuk yang dapat dibaca oleh generasi mendatang.

## Masa Depan

Dengan standardisasi Unicode dan berkembangnya font serta keyboard digital untuk aksara Bali (misalnya *Noto Sans Balinese*) dan aksara Jawa (*Noto Sans Javanese*), kedua aksara ini kini memiliki peluang lebih besar untuk digunakan di platform digital dan diwariskan kepada generasi berikutnya.
    `,
  },

  'upaya-pelestarian-aksara-bali-digital': {
    title: 'Pelestarian Aksara Bali di Era Digital: Tantangan dan Peluang',
    description: 'Di era digital, aksara Bali menghadapi tantangan baru sekaligus peluang besar. Bagaimana teknologi dapat membantu melestarikan warisan budaya ini?',
    date: '2026-02-15',
    category: 'Teknologi & Budaya',
    readTime: '6 menit',
    tags: ['digital', 'pelestarian', 'teknologi', 'unicode'],
    imageUrl: UNSPLASH_IMAGES['upaya-pelestarian-aksara-bali-digital'],
    content: `
## Era Digital: Ancaman dan Peluang bagi Aksara Bali

Di satu sisi, era digital mengancam keberadaan aksara Bali: smartphone, media sosial, dan komunikasi sehari-hari hampir seluruhnya menggunakan aksara Latin. Di sisi lain, teknologi digital membuka peluang pelestarian yang belum pernah ada sebelumnya — mulai dari standardisasi Unicode hingga aplikasi pembelajaran berbasis AI.

## Tonggak Penting: Unicode 5.0 (2006)

Langkah paling signifikan dalam pelestarian digital aksara Bali adalah masuknya aksara Bali ke dalam **Unicode Standard versi 5.0** pada tahun 2006, menempati blok U+1B00–U+1B7F (128 karakter).

Sebelumnya, aksara Bali hanya dapat ditampilkan menggunakan font custom yang tidak kompatibel antar platform. Dengan Unicode, aksara Bali kini dapat:

- Ditampilkan di semua sistem operasi modern (Windows, macOS, Linux, Android, iOS)
- Digunakan dalam dokumen, email, dan halaman web
- Disimpan dan diproses oleh database dan mesin pencari
- Dicari dan diindeks oleh Google dan mesin pencari lainnya

Font **Noto Sans Balinese** dari Google Fonts menjadi referensi utama untuk tampilan aksara Bali di perangkat digital.

## Tantangan Teknis yang Masih Ada

Meskipun Unicode telah tersedia, beberapa tantangan teknis masih belum sepenuhnya terpecahkan:

### 1. Complex Script Rendering

Aksara Bali adalah *complex script* — urutan karakter Unicode tidak selalu sesuai dengan urutan visual yang tampil. Mesin rendering teks (*shaping engine*) seperti **HarfBuzz** diperlukan untuk menampilkan aksara Bali dengan benar, termasuk:
- Penempatan tanda vokal di posisi yang tepat
- Penggabungan konsonan dalam gugus (*gantungan*)
- Interaksi antara adeg-adeg dan konsonan berikutnya

### 2. Input Method

Keyboard aksara Bali belum tersedia secara bawaan di sebagian besar sistem operasi. Pengguna harus menginstal IME (Input Method Editor) pihak ketiga atau menggunakan aplikasi konverter.

### 3. Font Dukungan Terbatas

Hanya sedikit font yang mendukung aksara Bali dengan lengkap: Noto Sans Balinese, Vimala, dan beberapa font akademik. Font populer seperti Arial atau Times New Roman tidak mendukung aksara Bali.

## Inisiatif Digital yang Menjanjikan

### Konverter dan Aplikasi

- **Web-based converter** — Alat konversi Latin ke aksara Bali secara real-time, seperti yang ada di aksarabali.id
- **Keyboard mobile** — Keyboard aksara Bali untuk Android dan iOS memungkinkan pengguna mengetik aksara Bali di smartphone
- **OCR aksara Bali** — Penelitian untuk optical character recognition (OCR) aksara Bali sedang aktif dikembangkan oleh beberapa universitas

### Digitalisasi Naskah

- **Balinese Manuscript Project** — Proyek kolaborasi antara perpustakaan di Bali dan institusi internasional untuk mendigitalisasi koleksi lontar
- **British Library** memiliki koleksi digital naskah Bali yang dapat diakses online
- **KITLV** (Leiden, Belanda) menyimpan dan mendigitalisasi koleksi manuskrip Bali dari era kolonial

### Platform Pendidikan

- **YouTube** — Puluhan saluran mengajarkan aksara Bali dalam format video
- **Duolingo-style apps** — Beberapa aplikasi belajar bahasa Bali mulai dikembangkan
- **Kurikulum digital** — Dinas Pendidikan Bali mengintegrasikan aksara Bali dalam platform e-learning

## Peran Komunitas dalam Pelestarian Digital

Komunitas online memainkan peran penting:

- **Media sosial** — Postingan berbahasa Bali dengan aksara Bali semakin populer di Instagram dan TikTok
- **Wikipedia** — Artikel Wikipedia dalam bahasa Bali (*ban.wikipedia.org*) telah berkembang signifikan
- **Open source** — Proyek font dan keyboard aksara Bali bersifat open source, memungkinkan kontribusi dari komunitas global

## Rekomendasi untuk Masa Depan

1. **Standardisasi keyboard** — Mendorong integrasi keyboard aksara Bali secara bawaan di Android/iOS melalui kerja sama dengan Google dan Apple
2. **Corpus digital** — Membangun corpus teks digital aksara Bali untuk melatih model bahasa dan mesin penerjemah
3. **Pengajaran berbasis game** — Mengembangkan game edukasi yang mengajarkan aksara Bali kepada anak-anak
4. **Regulasi signage** — Memperkuat kebijakan penggunaan aksara Bali di papan nama publik untuk meningkatkan eksposur
5. **Kolaborasi akademik** — Mendorong penelitian interdisipliner antara linguistik, ilmu komputer, dan studi budaya

Teknologi bukan ancaman bagi aksara Bali — ia adalah alat. Tantangannya adalah bagaimana kita menggunakannya dengan bijak untuk mewariskan kekayaan ini kepada generasi mendatang.
    `,
  },
}

export async function getServerSideProps({ params }) {
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  const normalizePost = (d) => ({
    title: d.title,
    titleEn: d.title_en || d.title,
    description: d.excerpt || '',
    descriptionEn: d.excerpt_en || d.excerpt || '',
    date: d.created_at ? d.created_at.split('T')[0] : '',
    category: d.category,
    readTime: d.read_time || '5 menit',
    tags: Array.isArray(d.tags) ? d.tags : [],
    imageUrl: d.image_url || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    imageCredit: d.image_credit || '',
    imageCreditUrl: d.image_credit_url || '',
    content: d.content || '',
    contentEn: d.content_en || '',
  })

  if (data) {
    const post = normalizePost(data)

    // Fetch 3 related posts: same category first, then any, excluding current slug
    let { data: related } = await supabase
      .from('blog_posts')
      .select('slug, title, title_en, excerpt, excerpt_en, image_url, category, read_time, created_at')
      .eq('published', true)
      .eq('category', data.category)
      .neq('slug', params.slug)
      .limit(3)

    if (!related || related.length < 3) {
      const { data: more } = await supabase
        .from('blog_posts')
        .select('slug, title, title_en, excerpt, excerpt_en, image_url, category, read_time, created_at')
        .eq('published', true)
        .neq('slug', params.slug)
        .neq('category', data.category)
        .limit(3 - (related?.length || 0))
      related = [...(related || []), ...(more || [])]
    }

    const relatedPosts = (related || []).map(r => ({
      slug: r.slug,
      title: r.title,
      titleEn: r.title_en || r.title,
      excerpt: r.excerpt || '',
      excerptEn: r.excerpt_en || r.excerpt || '',
      imageUrl: r.image_url || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80',
      category: r.category,
      readTime: r.read_time || '5 menit',
    }))

    return { props: { post, slug: params.slug, relatedPosts } }
  }

  // Fallback to hardcoded content
  const hardcoded = BLOG_CONTENT[params.slug]
  if (hardcoded) return { props: { post: hardcoded, slug: params.slug, relatedPosts: [] } }

  return { notFound: true }
}

function renderMarkdown(content) {
  // Simple markdown renderer
  const lines = content.split('\n')
  const elements = []
  let i = 0
  let tableBuffer = []

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} style={{ fontSize: '20px', fontWeight: '700', margin: '28px 0 12px', lineHeight: 1.3 }}>{line.slice(3)}</h2>)
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} style={{ fontSize: '16px', fontWeight: '600', margin: '20px 0 8px' }}>{line.slice(4)}</h3>)
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={i} style={{ margin: '8px 0', fontWeight: '600' }}>{line.slice(2, -2)}</p>)
    } else if (line.startsWith('- ') || line.startsWith('1. ') || line.match(/^\d+\. /)) {
      const isOrdered = line.match(/^\d+\. /)
      const text = line.replace(/^[-\d]+\.? /, '')
      elements.push(
        <li key={i} style={{ margin: '4px 0', lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{
            __html: text
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/`(.*?)`/g, '<code style="background:#f0f0f0;padding:1px 5px;border-radius:3px;font-size:0.9em">$1</code>')
          }}
        />
      )
    } else if (line.startsWith('|')) {
      tableBuffer.push(line)
      // Check if next line is also a table line
      if (!lines[i + 1]?.startsWith('|')) {
        // Render table
        const rows = tableBuffer.filter(r => !r.match(/^\|[-| ]+\|$/))
        elements.push(
          <div key={i} style={{ overflowX: 'auto', margin: '16px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <tbody>
                {rows.map((row, ri) => {
                  const cells = row.split('|').filter(c => c.trim())
                  const Tag = ri === 0 ? 'th' : 'td'
                  return (
                    <tr key={ri}>
                      {cells.map((cell, ci) => (
                        <Tag key={ci} style={{
                          padding: '8px 12px', border: '1px solid #e0e0e0',
                          background: ri === 0 ? '#f0f4ff' : 'transparent',
                          fontWeight: ri === 0 ? '600' : 'normal',
                          textAlign: 'left',
                        }}>
                          {cell.trim()}
                        </Tag>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
        tableBuffer = []
      }
    } else if (line.trim() === '') {
      // Skip empty lines
    } else {
      elements.push(
        <p key={i} style={{ margin: '10px 0', lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/`(.*?)`/g, '<code style="background:#f0f0f0;padding:1px 5px;border-radius:3px;font-size:0.9em">$1</code>')
          }}
        />
      )
    }
    i++
  }

  return elements
}

export default function BlogPost({ post, slug, locale, setLocale, relatedPosts = [] }) {
  const [darkMode, setDarkMode] = useState(false)
  const lang = locale === 'en' ? 'en' : 'id'

  useEffect(() => {
    const saved = localStorage.getItem('aksara-dark-mode')
    if (saved !== null) setDarkMode(saved === 'true')
  }, [])

  const displayTitle = lang === 'en' && post.titleEn ? post.titleEn : post.title
  const displayDescription = lang === 'en' && post.descriptionEn ? post.descriptionEn : post.description
  const displayContent = lang === 'en' && post.contentEn ? post.contentEn : post.content

  const bg = darkMode ? '#0f0f1a' : '#f5f5f0'
  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textColor = darkMode ? '#e8e8e8' : '#1a1a1a'
  const borderColor = darkMode ? '#2a2a3e' : '#e0e0d8'
  const mutedColor = darkMode ? '#888' : '#666'

  const BASE = 'https://transliterasi-latin-ke-bahasa-bali.vercel.app'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', name: 'Doni Wirawan', url: `${BASE}/` },
    publisher: {
      '@type': 'Organization',
      name: 'Aksara Bali Converter',
      url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/icons/android-chrome-512x512.png` },
    },
    image: { '@type': 'ImageObject', url: post.imageUrl, width: 1200, height: 800 },
    keywords: post.tags.join(', '),
    url: `${BASE}/blog/${slug}`,
    inLanguage: 'id',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/blog/${slug}` },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: `${BASE}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE}/blog/${slug}` },
      ],
    },
  }

  return (
    <>
      <Head>
        <title>{post.title} | Blog Aksara Bali</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="800" />
        <meta property="og:url" content={`https://transliterasi-latin-ke-bahasa-bali.vercel.app/blog/${slug}`} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content="Doni Wirawan" />
        <meta property="article:tag" content={post.tags.join(',')} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <meta name="twitter:image" content={post.imageUrl} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={`https://transliterasi-latin-ke-bahasa-bali.vercel.app/blog/${slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <div style={{ minHeight: '100vh', background: bg, color: textColor, fontFamily: 'Georgia, serif' }}>
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => { const n = !darkMode; setDarkMode(n); localStorage.setItem('aksara-dark-mode', n) }}
          locale={locale || 'id'}
          onToggleLocale={() => setLocale && setLocale(locale === 'id' ? 'en' : 'id')}
        />

        <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 16px 80px' }}>
          {/* Article header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', fontFamily: 'system-ui, sans-serif' }}>
              <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', background: darkMode ? '#252535' : '#f0f0f0', color: mutedColor }}>
                {post.category}
              </span>
              {post.tags.map(tag => (
                <span key={tag} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', background: '#0d6efd15', color: '#0d6efd' }}>
                  #{tag}
                </span>
              ))}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/9', background: darkMode ? '#252535' : '#f0f0f0' }}>
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              {post.imageUrl && post.imageUrl.includes('images.unsplash.com') && (
                <p style={{ fontSize: '11px', color: mutedColor, margin: '6px 0 0', textAlign: 'right', fontFamily: 'system-ui, sans-serif' }}>
                  {post.imageCredit ? (
                    <>
                      Photo by{' '}
                      <a href={post.imageCreditUrl} target="_blank" rel="noopener noreferrer" style={{ color: mutedColor }}>
                        {post.imageCredit}
                      </a>
                      {' '}on{' '}
                    </>
                  ) : 'Photo on '}
                  <a
                    href={`https://unsplash.com?utm_source=aksara_bali&utm_medium=referral`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: mutedColor }}
                  >
                    Unsplash
                  </a>
                </p>
              )}
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 16px', lineHeight: 1.3, fontFamily: 'system-ui, sans-serif' }}>
              {displayTitle}
            </h1>

            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: mutedColor, fontFamily: 'system-ui, sans-serif' }}>
              <span>✍️ Doni Wirawan</span>
              <span>📅 {post.date}</span>
              <span>⏱ {post.readTime}</span>
            </div>
          </div>

          {/* Article content */}
          <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '32px', lineHeight: 1.8, fontSize: '16px' }}>
            {lang === 'en' && !post.contentEn && (
              <div style={{ padding: '16px', borderRadius: '10px', background: darkMode ? '#2d2000' : '#fff9e6', marginBottom: '20px', fontSize: '14px', color: '#92400e' }}>
                📝 English translation coming soon. Showing Indonesian version.
              </div>
            )}
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {renderMarkdown(displayContent)}
            </ul>
          </div>

          {/* Related articles */}
          {relatedPosts.length > 0 && (
            <div style={{ marginTop: '40px', fontFamily: 'system-ui, sans-serif' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 20px', color: textColor }}>
                {lang === 'en' ? 'Related Articles' : 'Artikel Terkait'}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                {relatedPosts.map(r => (
                  <a key={r.slug} href={`/blog/${r.slug}`} style={{ textDecoration: 'none' }}>
                    <div
                      style={{ background: cardBg, borderRadius: '14px', border: `1px solid ${borderColor}`, overflow: 'hidden', height: '100%' }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <div style={{ height: '140px', overflow: 'hidden' }}>
                        <img
                          src={r.imageUrl}
                          alt={r.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      </div>
                      <div style={{ padding: '14px' }}>
                        <span style={{ fontSize: '11px', background: '#0d6efd15', color: '#0d6efd', padding: '2px 8px', borderRadius: '8px', fontWeight: '600' }}>
                          {r.category}
                        </span>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: textColor, margin: '8px 0 4px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {lang === 'en' ? r.titleEn : r.title}
                        </div>
                        <div style={{ fontSize: '12px', color: mutedColor, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                          {lang === 'en' ? r.excerptEn : r.excerpt}
                        </div>
                        <div style={{ fontSize: '11px', color: mutedColor, marginTop: '8px' }}>⏱ {r.readTime}</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', fontFamily: 'system-ui, sans-serif' }}>
            <a href="/blog" style={{ color: '#0d6efd', textDecoration: 'none', fontSize: '14px' }}>
              ← {lang === 'en' ? 'All Articles' : 'Semua Artikel'}
            </a>
            <a href="/practice" style={{ color: '#0d6efd', textDecoration: 'none', fontSize: '14px' }}>
              {lang === 'en' ? 'Try Practice →' : 'Coba Latihan →'}
            </a>
          </div>
        </main>
        <Footer darkMode={darkMode} locale={locale || 'id'} />
      </div>
    </>
  )
}
