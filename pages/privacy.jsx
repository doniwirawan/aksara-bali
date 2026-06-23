import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PrivacyPage({ locale, setLocale }) {
  const [darkMode, setDarkMode] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem('aksara-dark-mode')
    if (saved !== null) setDarkMode(saved === 'true')
  }, [])

  const lang = locale === 'en' ? 'en' : 'id'
  const bg = darkMode ? '#0f0f1a' : '#f5f5f0'
  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textColor = darkMode ? '#e8e8e8' : '#1a1a1a'
  const mutedColor = darkMode ? '#9aa' : '#555'
  const borderColor = darkMode ? '#2a2a3e' : '#e0e0d8'

  const updated = lang === 'en' ? 'Last updated: 23 June 2026' : 'Terakhir diperbarui: 23 Juni 2026'

  const sections = lang === 'en' ? [
    ['Overview', 'Aksara Bali Converter ("the app") is a free educational tool for converting and learning Balinese script. This policy explains what we collect and how we use it. Most features work without an account.'],
    ['Information we collect', 'Account (optional): if you sign up, we store your email address and an encrypted password via Supabase Auth. Usage data: we log conversion, quiz, and writing-practice events, and basic analytics (page views and button clicks) to improve the app. These are tied to your account only when you are logged in; otherwise they are anonymous. We do not collect your name, location, or contacts.'],
    ['How we use it', 'To provide the converter and practice features, to show you your personal learning stats when logged in, and to understand aggregate usage so we can improve the product. We do not sell your data or use it for advertising.'],
    ['Third-party services', 'Supabase (database & authentication), Vercel (hosting), Google Fonts (Noto Sans Balinese & Inter), and Unsplash (blog imagery). These providers process data only to deliver their service. Blog photos are attributed per the Unsplash guidelines.'],
    ['Cookies & local storage', 'We use your browser\'s local storage to remember preferences (dark mode, language) and your login session. We do not use third-party advertising cookies.'],
    ['Data retention & your rights', 'You can request deletion of your account and associated data at any time by contacting us. Deleting your account removes your personal stats; anonymous aggregate counts may remain.'],
    ['Children', 'The app is suitable for general audiences and is not directed at children under 13. We do not knowingly collect data from children under 13.'],
    ['Changes', 'We may update this policy; material changes will be reflected by the “last updated” date above.'],
    ['Contact', 'Questions about privacy: GitHub https://github.com/doniwirawan or LinkedIn https://www.linkedin.com/in/doniwirawan/.'],
  ] : [
    ['Ringkasan', 'Aksara Bali Converter ("aplikasi") adalah alat edukasi gratis untuk mengonversi dan mempelajari aksara Bali. Kebijakan ini menjelaskan data apa yang kami kumpulkan dan bagaimana penggunaannya. Sebagian besar fitur dapat digunakan tanpa akun.'],
    ['Informasi yang kami kumpulkan', 'Akun (opsional): jika Anda mendaftar, kami menyimpan alamat email dan kata sandi terenkripsi melalui Supabase Auth. Data penggunaan: kami mencatat aktivitas konversi, kuis, dan latihan menulis, serta analitik dasar (kunjungan halaman dan klik tombol) untuk meningkatkan aplikasi. Data ini terkait dengan akun Anda hanya saat Anda masuk; selain itu bersifat anonim. Kami tidak mengumpulkan nama, lokasi, atau kontak Anda.'],
    ['Bagaimana kami menggunakannya', 'Untuk menyediakan fitur konverter dan latihan, menampilkan statistik belajar pribadi Anda saat masuk, serta memahami penggunaan agregat agar dapat meningkatkan produk. Kami tidak menjual data Anda atau menggunakannya untuk iklan.'],
    ['Layanan pihak ketiga', 'Supabase (database & autentikasi), Vercel (hosting), Google Fonts (Noto Sans Balinese & Inter), dan Unsplash (gambar blog). Penyedia ini memproses data hanya untuk menjalankan layanannya. Foto blog diatribusikan sesuai pedoman Unsplash.'],
    ['Cookie & penyimpanan lokal', 'Kami menggunakan local storage peramban untuk mengingat preferensi (mode gelap, bahasa) dan sesi login Anda. Kami tidak menggunakan cookie iklan pihak ketiga.'],
    ['Penyimpanan data & hak Anda', 'Anda dapat meminta penghapusan akun dan data terkait kapan saja dengan menghubungi kami. Menghapus akun akan menghapus statistik pribadi Anda; hitungan agregat anonim mungkin tetap ada.'],
    ['Anak-anak', 'Aplikasi ini untuk umum dan tidak ditujukan bagi anak di bawah 13 tahun. Kami tidak dengan sengaja mengumpulkan data dari anak di bawah 13 tahun.'],
    ['Perubahan', 'Kami dapat memperbarui kebijakan ini; perubahan penting tercermin pada tanggal "terakhir diperbarui" di atas.'],
    ['Kontak', 'Pertanyaan tentang privasi: GitHub https://github.com/doniwirawan atau LinkedIn https://www.linkedin.com/in/doniwirawan/.'],
  ]

  const title = lang === 'en' ? 'Privacy Policy' : 'Kebijakan Privasi'

  return (
    <>
      <Head>
        <title>{title} — Aksara Bali</title>
        <meta name="description" content={lang === 'en' ? 'Privacy policy for the Aksara Bali Converter app.' : 'Kebijakan privasi untuk aplikasi Aksara Bali Converter.'} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://aksarabali.doniwirawan.xyz/privacy" />
      </Head>

      <div style={{ minHeight: '100vh', background: bg, color: textColor, fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => { const n = !darkMode; setDarkMode(n); localStorage.setItem('aksara-dark-mode', n) }}
          locale={locale || 'id'}
          onToggleLocale={() => setLocale && setLocale(locale === 'id' ? 'en' : 'id')}
        />

        <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 16px 80px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: '700', margin: '0 0 6px' }}>{title}</h1>
          <p style={{ color: mutedColor, fontSize: '13px', margin: '0 0 28px' }}>{updated}</p>

          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '14px', padding: '28px' }}>
            {sections.map(([heading, body], i) => (
              <section key={i} style={{ marginBottom: i === sections.length - 1 ? 0 : '22px' }}>
                <h2 style={{ fontSize: '17px', fontWeight: '600', margin: '0 0 8px' }}>{heading}</h2>
                <p style={{ color: mutedColor, fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{body}</p>
              </section>
            ))}
          </div>
        </main>

        <Footer darkMode={darkMode} locale={locale || 'id'} />
      </div>
    </>
  )
}
