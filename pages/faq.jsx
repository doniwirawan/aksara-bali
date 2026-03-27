import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const FAQ_DATA = [
  {
    category: 'Tentang Aksara Bali',
    questions: [
      {
        q: 'Apa itu aksara Bali?',
        a: 'Aksara Bali adalah sistem tulisan tradisional yang digunakan oleh masyarakat Bali, Indonesia. Ia termasuk dalam keluarga aksara Brahmi yang berasal dari India dan berkembang melalui aksara Kawi. Aksara Bali adalah abugida — setiap konsonan dasar mengandung vokal /a/ secara inheren, dan vokal lain ditulis dengan tanda tambahan (pangangge).',
      },
      {
        q: 'Berapa banyak huruf/aksara dalam aksara Bali?',
        a: 'Aksara Bali memiliki 47 konsonan dasar (aksara wianjana) dan 8 vokal mandiri (aksara suara). Selain itu, terdapat berbagai tanda vokal (pangangge), tanda baca khusus, dan karakter angka Bali. Total dalam standar Unicode, aksara Bali menempati 128 karakter (blok U+1B00–U+1B7F).',
      },
      {
        q: 'Dari mana asal aksara Bali?',
        a: 'Aksara Bali berasal dari aksara Brahmi India melalui jalur: Brahmi → Pallawa → Kawi → Aksara Bali. Aksara Kawi digunakan di Jawa dan Bali sejak abad ke-8–9 Masehi, dan aksara Bali berkembang sebagai turunannya dari sekitar abad ke-10 Masehi.',
      },
      {
        q: 'Apakah aksara Bali masih digunakan?',
        a: 'Ya. Aksara Bali masih digunakan dalam konteks keagamaan Hindu Bali (mantra, upacara), papan nama di Bali, media pembelajaran di sekolah, dan oleh komunitas pelestari budaya. Pemerintah Provinsi Bali mewajibkan pengajaran aksara Bali di sekolah dasar dan menengah melalui kurikulum muatan lokal.',
      },
      {
        q: 'Bagaimana cara membaca aksara Bali?',
        a: 'Aksara Bali dibaca dari kiri ke kanan. Setiap karakter konsonan dasar dibaca dengan vokal /a/ (misalnya, ᬓ = "ka"). Vokal lain ditambahkan melalui tanda vokal: ᬓᬶ = "ki", ᬓᬸ = "ku", ᬓᬾ = "ke", ᬓᭀ = "ko". Ketika konsonan tidak memiliki vokal, digunakan adeg-adeg (᭄): ᬓ᭄ = "k".',
      },
    ],
  },
  {
    category: 'Cara Menggunakan Konverter',
    questions: [
      {
        q: 'Bagaimana cara mengkonversi teks Latin ke aksara Bali?',
        a: 'Ketik teks dalam aksara Latin di kolom kiri konverter. Konversi terjadi secara real-time — hasil aksara Bali langsung muncul di kolom kanan. Alat ini mendukung deteksi otomatis kata-kata Sansekerta dan menerapkan aksara murda yang sesuai.',
      },
      {
        q: 'Apakah konverter mendukung bahasa Sansekerta?',
        a: 'Ya. Konverter memiliki database lebih dari 100 kata Sansekerta umum yang digunakan dalam konteks Hindu Bali (nama dewa, konsep filosofi, kitab suci, dll.). Kata-kata Sansekerta secara otomatis dideteksi dan ditulis dengan aksara murda yang tepat.',
      },
      {
        q: 'Apa itu ekuivalensi V=W dalam aksara Bali?',
        a: 'Dalam tradisi aksara Bali, bunyi /v/ dan /w/ dianggap setara. Kata-kata Sansekerta yang menggunakan "V" dalam bahasa Indonesia modern sering ditulis dengan "W" dalam konteks Bali — contoh: Vishnu → Wisnu, Veda → Weda. Konverter secara otomatis menangani kedua bentuk penulisan ini.',
      },
      {
        q: 'Apakah konverter bisa digunakan secara offline?',
        a: 'Ya. Konverter ini adalah Progressive Web App (PWA) yang dapat diinstal di perangkat Anda. Setelah diinstal, semua fungsi konversi dasar tersedia tanpa koneksi internet karena data diproses sepenuhnya di perangkat Anda (tidak dikirim ke server).',
      },
      {
        q: 'Bagaimana cara menyimpan hasil konversi?',
        a: 'Anda dapat mengklik tombol "Salin" untuk menyalin hasil aksara Bali ke clipboard, atau tombol "Unduh" untuk menyimpan sebagai file teks (.txt). File yang diunduh dapat dibuka di aplikasi pengolah kata yang mendukung font Unicode.',
      },
    ],
  },
  {
    category: 'Belajar Aksara Bali',
    questions: [
      {
        q: 'Berapa lama waktu yang dibutuhkan untuk belajar aksara Bali?',
        a: 'Dengan latihan konsisten 15–20 menit per hari, Anda dapat mengenali 20 aksara dasar (hanacaraka) dalam 1–2 minggu. Untuk membaca teks sederhana dengan lancar, dibutuhkan sekitar 1–3 bulan. Penguasaan penuh termasuk tanda vokal, gugus konsonan, dan aksara murda memerlukan 6 bulan hingga 1 tahun.',
      },
      {
        q: 'Apa urutan aksara Bali yang harus dipelajari pertama?',
        a: 'Mulailah dengan 20 konsonan utama dalam urutan Hanacaraka: Ha-Na-Ca-Ra-Ka / Da-Ta-Sa-Wa-La / Ma-Ga-Ba-Nga-Pa / Ja-Ya-Nya-Nna-Ta. Kemudian pelajari tanda vokal (i, u, e, o, aa), lalu adeg-adeg, dan terakhir aksara-aksara tambahan.',
      },
      {
        q: 'Di mana bisa belajar aksara Bali secara online?',
        a: 'Tersedia berbagai sumber online: (1) Gunakan fitur Latihan di aksarabali.id untuk kuis interaktif dan papan ketik aksara Bali. (2) Cari tutorial di YouTube dengan kata kunci "belajar aksara Bali". (3) Buku Ajar Bahasa Bali dari Dinas Pendidikan Bali tersedia di toko buku online. (4) Forum komunitas di media sosial (Facebook, Telegram) untuk sesama pelajar aksara Bali.',
      },
      {
        q: 'Apakah aksara Bali sama dengan aksara Jawa?',
        a: 'Tidak sama, tetapi memiliki asal-usul yang sama (dari aksara Kawi). Keduanya menggunakan urutan Hanacaraka dan memiliki mekanisme gugus konsonan yang serupa. Namun, bentuk huruf, beberapa karakter tambahan, dan sistem tanda baca berbeda. Aksara Bali memiliki lebih banyak karakter aksara murda untuk kata-kata Sansekerta dibanding aksara Jawa modern.',
      },
    ],
  },
  {
    category: 'Teknis & Digital',
    questions: [
      {
        q: 'Apa font yang tepat untuk menampilkan aksara Bali?',
        a: 'Font yang merekomendasikan untuk aksara Bali adalah: (1) Noto Sans Balinese — gratis dari Google Fonts, coverage terlengkap; (2) Vimala — font khusus aksara Bali; (3) Bali Simbar — dikembangkan oleh komunitas Bali. Pastikan perangkat Anda menggunakan sistem operasi yang mendukung rendering complex scripts (semua OS modern mendukung ini).',
      },
      {
        q: 'Mengapa aksara Bali tidak tampil dengan benar di komputer saya?',
        a: 'Ada beberapa kemungkinan penyebab: (1) Font yang digunakan tidak mendukung aksara Bali — instal Noto Sans Balinese; (2) Browser atau aplikasi tidak mendukung complex script rendering — gunakan Chrome, Firefox, atau Edge terbaru; (3) Teks disalin tidak lengkap — pastikan semua karakter Unicode tersalin.',
      },
      {
        q: 'Di blok Unicode mana aksara Bali berada?',
        a: 'Aksara Bali berada di blok Unicode U+1B00 hingga U+1B7F (128 karakter), ditambahkan dalam Unicode 5.0 pada tahun 2006. Blok ini mencakup konsonan, vokal mandiri, tanda vokal, tanda baca khusus, angka Bali, dan karakter tambahan.',
      },
      {
        q: 'Apakah ada keyboard aksara Bali untuk smartphone?',
        a: 'Ya. Untuk Android: cari "Bali Keyboard" atau "Aksara Bali Keyboard" di Google Play Store. Untuk iOS: tersedia beberapa keyboard pihak ketiga di App Store. Alternatif lainnya adalah menggunakan konverter aksara Bali di browser mobile dan menyalin hasilnya.',
      },
    ],
  },
  {
    category: 'Budaya & Sejarah',
    questions: [
      {
        q: 'Apa itu lontar dan hubungannya dengan aksara Bali?',
        a: 'Lontar adalah daun palem siwalan (Borassus flabellifer) yang digunakan sebagai media penulisan tradisional di Bali. Aksara Bali dipahatkan pada lontar menggunakan alat tajam (pengutik). Naskah lontar Bali menyimpan berbagai pengetahuan: teks keagamaan, sastra, pengobatan tradisional (usada), astrologi (wariga), dan hukum adat (awig-awig).',
      },
      {
        q: 'Apakah aksara Bali diakui secara resmi?',
        a: 'Ya. Aksara Bali diakui oleh Pemerintah Provinsi Bali melalui Peraturan Daerah yang mewajibkan penggunaannya dalam papan nama pemerintahan dan pengajarannya di sekolah. Secara internasional, aksara Bali telah distandardisasi dalam Unicode oleh Unicode Consortium sejak 2006.',
      },
      {
        q: 'Apa hubungan aksara Bali dengan agama Hindu?',
        a: 'Aksara Bali sangat erat kaitannya dengan agama Hindu Bali (Agama Hindu Dharma). Aksara ini digunakan untuk menulis mantra, doa, dan teks-teks suci dalam upacara keagamaan. Beberapa aksara memiliki makna sakral — aksara Ongkara (ᬒ), misalnya, merepresentasikan suara suci "Om" dalam tradisi Hindu.',
      },
      {
        q: 'Berapa banyak naskah lontar Bali yang masih ada?',
        a: 'Diperkirakan terdapat puluhan ribu naskah lontar Bali yang tersebar di berbagai lokasi: perpustakaan di Bali (Gedong Kirtya di Singaraja memiliki lebih dari 3.000 judul), museum, pura, keluarga pandita, dan koleksi di luar negeri (Belanda, Inggris, Australia). Banyak naskah masih belum dikatalogkan atau didigitalisasi.',
      },
    ],
  },
]

const FAQ_DATA_EN = [
  {
    category: 'About Balinese Script',
    questions: [
      { q: 'What is Balinese script?', a: 'Balinese script (Aksara Bali) is a traditional writing system used by the Balinese people of Indonesia. It belongs to the Brahmic family of scripts originating from India and developed through the Kawi script. Balinese script is an abugida — every base consonant inherently carries the vowel /a/, and other vowels are written with additional diacritical marks (pangangge).' },
      { q: 'How many characters are in Balinese script?', a: 'Balinese script has 47 base consonants (aksara wianjana) and 8 independent vowels (aksara suara). Additionally, there are various vowel marks (pangangge), special punctuation, and Balinese numerals. In the Unicode standard, Balinese script occupies 128 characters (block U+1B00–U+1B7F).' },
      { q: 'Where did Balinese script come from?', a: 'Balinese script descended from Indian Brahmi script through the chain: Brahmi → Pallawa → Kawi → Balinese. Kawi script was used in Java and Bali from the 8th–9th century CE, and Balinese script developed as its descendant from around the 10th century CE.' },
      { q: 'Is Balinese script still used today?', a: 'Yes. Balinese script is still used in Balinese Hindu religious contexts (mantras, ceremonies), signage in Bali, school curricula, and by cultural preservation communities. The Bali Provincial Government mandates Balinese script education in primary and secondary schools through local curriculum.' },
      { q: 'How do you read Balinese script?', a: 'Balinese script is read left to right. Each base consonant is read with the vowel /a/ (e.g., ᬓ = "ka"). Other vowels are added through vowel marks: ᬓᬶ = "ki", ᬓᬸ = "ku", ᬓᬾ = "ke", ᬓᭀ = "ko". When a consonant has no vowel, adeg-adeg (᭄) is used: ᬓ᭄ = "k".' },
    ],
  },
  {
    category: 'Using the Converter',
    questions: [
      { q: 'How do I convert Latin text to Balinese script?', a: 'Type text in Latin characters in the input box on the main page. The conversion to Balinese script happens automatically in real time. Use standard Indonesian spelling — the converter handles Sanskrit words and the V=W equivalency automatically.' },
      { q: 'Does the converter support Sanskrit?', a: 'Yes. The converter has a database of common Sanskrit words and automatically uses murda (capital) forms for Sanskrit letters where appropriate. It also handles retroflex consonants (ṭ, ḍ, ṇ, etc.) that occur in Sanskrit loanwords in Balinese.' },
      { q: 'What is V=W equivalency in Balinese script?', a: 'In Balinese script tradition, the letters V and W are considered equivalent. The Latin letter "v" is converted to the Balinese "wa" (ᬯ). This means words like "veda" and "weda" produce the same Balinese output. You can toggle this behaviour in the converter settings.' },
      { q: 'Can the converter be used offline?', a: 'Yes. This converter is a Progressive Web App (PWA). After your first visit, the core conversion function works offline. Install it on your home screen for the best experience — it works like a native app without needing an internet connection.' },
      { q: 'How do I save the conversion result?', a: 'Click the Copy button to copy the Balinese script text to your clipboard. You can then paste it into any application that supports the Noto Sans Balinese font. You can also take a screenshot of the result.' },
    ],
  },
  {
    category: 'Learning Balinese Script',
    questions: [
      { q: 'How long does it take to learn Balinese script?', a: 'With consistent practice of 15–20 minutes per day, you can recognise the 20 main consonants (hanacaraka) in 1–2 weeks. Reading simple text fluently takes about 1–3 months. Full mastery including vowel marks, consonant clusters, and murda forms requires 6 months to 1 year.' },
      { q: 'What order should I learn Balinese script in?', a: 'Start with the 20 main consonants in Hanacaraka order: Ha-Na-Ca-Ra-Ka / Da-Ta-Sa-Wa-La / Ma-Ga-Ba-Nga-Pa / Ja-Ya-Nya-Nna-Ta. Then learn the vowel marks (i, u, e, o, aa), then adeg-adeg, and finally the additional characters.' },
      { q: 'Where can I learn Balinese script online?', a: 'Several resources are available: (1) Use the Practice feature on this site for interactive quizzes and a Balinese keyboard. (2) Search YouTube for "belajar aksara Bali" tutorials. (3) The Bali Education Department\'s Bahasa Bali textbooks are available online. (4) Social media communities (Facebook, Telegram) of Balinese script learners.' },
      { q: 'Is Balinese script the same as Javanese script?', a: 'No, but they share common origins. Both descended from Kawi script and are therefore structurally similar abugidas. The main differences are in letter forms, some characters, and certain writing rules. A person who knows one script can often recognise aspects of the other.' },
    ],
  },
  {
    category: 'Technical & Digital',
    questions: [
      { q: 'What font should I use to display Balinese script?', a: 'The recommended font is Noto Sans Balinese by Google Fonts — it is free, open source, and provides complete coverage of all Balinese Unicode characters. This website uses it automatically. For documents, you can download it from fonts.google.com.' },
      { q: 'Why does Balinese script not display correctly on my computer?', a: 'Several possible reasons: (1) Noto Sans Balinese font is not installed. (2) The application does not support Unicode complex scripts. (3) The font rendering engine does not properly handle combining diacritical marks. Solution: Install Noto Sans Balinese and use a modern browser or text editor that supports Unicode.' },
      { q: 'Which Unicode block is Balinese script in?', a: 'Balinese script is in the Unicode block U+1B00–U+1B7F (Balinese), added in Unicode 5.0 (2006). This block contains 128 code points covering all base consonants, vowels, diacritical marks, punctuation, and Balinese numerals.' },
      { q: 'Is there a Balinese script keyboard for smartphones?', a: 'Yes. For Android: search for "Aksara Bali keyboard" on Google Play Store. For iOS: there are limited options; you can use the keyboard on this website in your mobile browser. Our Practice page also has a built-in Balinese keyboard that works on all devices.' },
    ],
  },
  {
    category: 'Culture & History',
    questions: [
      { q: 'What is a lontar and how does it relate to Balinese script?', a: 'Lontar (from Old Javanese "ron tal" = palm leaf) is the traditional writing medium made from the leaves of the lontar palm (Borassus flabellifer). Balinese script is inscribed on lontar leaves using a sharp stylus (pengrupak), then darkened with black soot. Lontar manuscripts preserve religious texts, literature, medicine (usada), and astronomy (wariga).' },
      { q: 'Is Balinese script officially recognised?', a: 'Yes. Balinese script is officially recognised by the Indonesian government as a regional script of Bali Province. It is listed in the UNESCO Intangible Cultural Heritage list. Internationally, it has been in the Unicode standard since 2006, confirming its status as a living digital writing system.' },
      { q: 'What is the relationship between Balinese script and Hinduism?', a: 'Balinese script is deeply connected to Balinese Hinduism. The script is used to write Hindu mantras, prayer texts (kekidungan), ritual literature (kakawin, kidung), and temple inscriptions. Some letters are considered sacred — for example, the letter "Om" (ᬒᬁ) is the symbol of the divine. Knowledge of the script is considered a spiritual achievement in Balinese tradition.' },
      { q: 'How many lontar manuscripts still exist?', a: 'It is estimated that tens of thousands of lontar manuscripts from Bali still exist, spread across Balinese families, temples, museums, and research institutions worldwide. Major collections are held at Gedong Kirtya in Singaraja (the largest lontar library in the world), national museums in Jakarta, and universities in the Netherlands and Germany.' },
    ],
  },
]

export default function FAQPage({ locale, setLocale }) {
  const [darkMode, setDarkMode] = useState(false)
  const [openItems, setOpenItems] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const lang = locale === 'en' ? 'en' : 'id'

  useEffect(() => {
    const saved = localStorage.getItem('aksara-dark-mode')
    if (saved !== null) setDarkMode(saved === 'true')
  }, [])

  const toggleItem = (catIdx, qIdx) => {
    const key = `${catIdx}-${qIdx}`
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const activeData = lang === 'en' ? FAQ_DATA_EN : FAQ_DATA
  const allQuestions = activeData.flatMap(cat => cat.questions)
  const filtered = searchQuery
    ? allQuestions.filter(item =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null
  const ui = {
    id: { title: 'Pertanyaan yang Sering Ditanyakan', subtitle: 'Semua yang perlu Anda ketahui tentang aksara Bali dan alat konverter ini', placeholder: 'Cari pertanyaan...' },
    en: { title: 'Frequently Asked Questions', subtitle: 'Everything you need to know about Balinese script and this converter', placeholder: 'Search questions...' },
  }[lang]

  const bg = darkMode ? '#0f0f1a' : '#f5f5f0'
  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textColor = darkMode ? '#e8e8e8' : '#1a1a1a'
  const borderColor = darkMode ? '#2a2a3e' : '#e0e0d8'
  const mutedColor = darkMode ? '#888' : '#666'

  const schemaFAQ = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allQuestions.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  return (
    <>
      <Head>
        <title>{lang === 'en' ? 'FAQ — Balinese Script Frequently Asked Questions' : 'FAQ Aksara Bali — Pertanyaan yang Sering Ditanyakan'}</title>
        <meta name="description" content={lang === 'en' ? 'Complete answers to common questions about Balinese script: how to learn, using the converter, history, fonts, keyboard, and cultural preservation.' : 'Jawaban lengkap untuk pertanyaan umum tentang aksara Bali: cara belajar, menggunakan konverter, sejarah, font, keyboard, dan pelestarian budaya.'} />
        <meta name="keywords" content={lang === 'en' ? 'faq balinese script, balinese script questions, learn balinese script, balinese font, balinese history, lontar bali' : 'faq aksara bali, pertanyaan aksara bali, cara belajar aksara bali, font aksara bali, sejarah aksara bali, lontar bali'} />
        <meta property="og:title" content={lang === 'en' ? 'FAQ — Balinese Script Questions' : 'FAQ — Pertanyaan Umum tentang Aksara Bali'} />
        <meta property="og:description" content={lang === 'en' ? 'Everything you need to know about Balinese script: writing system, how to learn, digital use, and cultural preservation.' : 'Semua yang perlu Anda ketahui tentang aksara Bali: sistem penulisan, cara belajar, penggunaan digital, dan pelestarian budaya.'} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://aksarabali.id/faq" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />
      </Head>

      <div style={{ minHeight: '100vh', background: bg, color: textColor, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => { const n = !darkMode; setDarkMode(n); localStorage.setItem('aksara-dark-mode', n) }}
          locale={locale || 'id'}
          onToggleLocale={() => setLocale && setLocale(locale === 'id' ? 'en' : 'id')}
        />

        <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 16px 80px' }}>
          {/* Hero with logo */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <a href="/">
              <img src="/icons/android-chrome-192x192.png" alt="Aksara Bali" width="56" height="56"
                style={{ borderRadius: '14px', marginBottom: '12px', display: 'inline-block', boxShadow: '0 2px 12px rgba(13,110,253,0.2)' }} />
            </a>
            <h1 style={{ fontSize: '30px', fontWeight: '700', margin: '0 0 10px' }}>
              {ui.title}
            </h1>
            <p style={{ color: mutedColor, fontSize: '15px', margin: 0 }}>
              {ui.subtitle}
            </p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '32px' }}>
            <input
              type="search"
              placeholder={ui.placeholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px 12px 44px',
                borderRadius: '12px', border: `1px solid ${borderColor}`,
                background: cardBg, color: textColor, fontSize: '15px',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>🔍</span>
          </div>

          {/* Search results */}
          {filtered && (
            <div style={{ marginBottom: '32px' }}>
              <p style={{ color: mutedColor, fontSize: '13px', marginBottom: '16px' }}>
                {lang === 'en'
                  ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${searchQuery}"`
                  : `${filtered.length} hasil untuk "${searchQuery}"`
                }
              </p>
              {filtered.map((item, idx) => (
                <div key={idx} style={{ padding: '20px', borderRadius: '12px', background: cardBg, border: `1px solid ${borderColor}`, marginBottom: '12px' }}>
                  <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '10px' }}>{item.q}</div>
                  <div style={{ color: mutedColor, fontSize: '14px', lineHeight: 1.6 }}>{item.a}</div>
                </div>
              ))}
            </div>
          )}

          {/* FAQ categories */}
          {!filtered && activeData.map((cat, catIdx) => (
            <div key={catIdx} style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 14px', color: '#0d6efd' }}>
                {cat.category}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cat.questions.map((item, qIdx) => {
                  const key = `${catIdx}-${qIdx}`
                  const isOpen = !!openItems[key]
                  return (
                    <div
                      key={qIdx}
                      style={{
                        borderRadius: '12px',
                        border: `1px solid ${isOpen ? '#0d6efd' : borderColor}`,
                        background: cardBg,
                        overflow: 'hidden',
                        transition: 'border-color 0.15s',
                      }}
                    >
                      <button
                        onClick={() => toggleItem(catIdx, qIdx)}
                        style={{
                          width: '100%', padding: '16px 20px',
                          background: 'none', border: 'none', cursor: 'pointer',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          textAlign: 'left', gap: '12px',
                        }}
                      >
                        <span style={{ fontWeight: '500', fontSize: '15px', color: textColor, lineHeight: 1.4 }}>
                          {item.q}
                        </span>
                        <span style={{ color: '#0d6efd', fontSize: '20px', flexShrink: 0, transition: 'transform 0.2s', transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}>
                          +
                        </span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 20px 20px', color: mutedColor, fontSize: '14px', lineHeight: 1.7, borderTop: `1px solid ${borderColor}`, paddingTop: '16px' }}>
                          {item.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div style={{ textAlign: 'center', padding: '32px', borderRadius: '16px', background: darkMode ? '#1a2840' : '#f0f4ff', border: `1px solid ${darkMode ? '#2d5a9e' : '#c5d8fc'}`, marginTop: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎯</div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px' }}>Siap untuk mencoba?</h2>
            <p style={{ color: mutedColor, fontSize: '14px', margin: '0 0 20px' }}>
              Gunakan konverter aksara Bali, latih kemampuan Anda, atau baca artikel di blog kami.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/" style={{ padding: '10px 24px', borderRadius: '10px', background: '#0d6efd', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                Konverter
              </a>
              <a href="/practice" style={{ padding: '10px 24px', borderRadius: '10px', border: `1px solid ${borderColor}`, color: textColor, textDecoration: 'none', fontSize: '14px' }}>
                Latihan
              </a>
              <a href="/blog" style={{ padding: '10px 24px', borderRadius: '10px', border: `1px solid ${borderColor}`, color: textColor, textDecoration: 'none', fontSize: '14px' }}>
                Blog
              </a>
            </div>
          </div>
        </main>
        <Footer darkMode={darkMode} locale={locale || 'id'} />
      </div>
    </>
  )
}
