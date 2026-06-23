import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function TermsPage({ locale, setLocale }) {
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
    ['Acceptance', 'By using Aksara Bali Converter (the web app, API, and mobile app), you agree to these terms. If you do not agree, please do not use the service.'],
    ['Use of the service', 'The app is provided free of charge for educational and cultural-preservation purposes. You may use it for personal, educational, and non-commercial purposes. Do not abuse the service, attempt to disrupt it, or use it for unlawful content.'],
    ['Accounts', 'You are responsible for keeping your login credentials secure and for activity under your account. You may delete your account at any time.'],
    ['Transliteration accuracy', 'Conversions follow common Balinese script conventions with Sanskrit support, but may not be perfect for every word or context. Output is provided "as is" for learning; verify important text with an expert.'],
    ['Intellectual property', 'The Balinese script is part of shared cultural heritage. App code is released under the MIT License. Blog photographs are provided by Unsplash and remain the property of their photographers. The app name and logo belong to the author.'],
    ['API usage', 'The public API endpoints are offered for reasonable, good-faith use. We may rate-limit or change them without notice. Do not build services that overload or scrape the API abusively.'],
    ['Disclaimer & liability', 'The service is provided "as is" without warranties of any kind. To the maximum extent permitted by law, the author is not liable for any damages arising from use of the service.'],
    ['Changes', 'We may update these terms; continued use after changes constitutes acceptance. Material changes are reflected by the “last updated” date above.'],
    ['Contact', 'GitHub https://github.com/doniwirawan or LinkedIn https://www.linkedin.com/in/doniwirawan/.'],
  ] : [
    ['Penerimaan', 'Dengan menggunakan Aksara Bali Converter (aplikasi web, API, dan aplikasi seluler), Anda menyetujui ketentuan ini. Jika tidak setuju, mohon jangan menggunakan layanan ini.'],
    ['Penggunaan layanan', 'Aplikasi disediakan gratis untuk tujuan edukasi dan pelestarian budaya. Anda boleh menggunakannya untuk keperluan pribadi, pendidikan, dan non-komersial. Jangan menyalahgunakan layanan, mengganggu operasinya, atau menggunakannya untuk konten melanggar hukum.'],
    ['Akun', 'Anda bertanggung jawab menjaga keamanan kredensial login dan atas aktivitas pada akun Anda. Anda dapat menghapus akun kapan saja.'],
    ['Akurasi transliterasi', 'Konversi mengikuti konvensi umum aksara Bali dengan dukungan Sansekerta, namun mungkin tidak sempurna untuk setiap kata atau konteks. Hasil disediakan "apa adanya" untuk pembelajaran; verifikasi teks penting dengan ahli.'],
    ['Hak kekayaan intelektual', 'Aksara Bali adalah bagian dari warisan budaya bersama. Kode aplikasi dirilis di bawah Lisensi MIT. Foto blog disediakan oleh Unsplash dan tetap milik fotografernya. Nama dan logo aplikasi milik penulis.'],
    ['Penggunaan API', 'Endpoint API publik ditawarkan untuk penggunaan yang wajar dan beritikad baik. Kami dapat membatasi laju atau mengubahnya tanpa pemberitahuan. Jangan membangun layanan yang membebani atau menyalahgunakan API.'],
    ['Penafian & tanggung jawab', 'Layanan disediakan "apa adanya" tanpa jaminan apa pun. Sejauh diizinkan hukum, penulis tidak bertanggung jawab atas kerugian apa pun yang timbul dari penggunaan layanan.'],
    ['Perubahan', 'Kami dapat memperbarui ketentuan ini; penggunaan berkelanjutan setelah perubahan berarti penerimaan. Perubahan penting tercermin pada tanggal "terakhir diperbarui" di atas.'],
    ['Kontak', 'GitHub https://github.com/doniwirawan atau LinkedIn https://www.linkedin.com/in/doniwirawan/.'],
  ]

  const title = lang === 'en' ? 'Terms of Service' : 'Ketentuan Layanan'

  return (
    <>
      <Head>
        <title>{title} — Aksara Bali</title>
        <meta name="description" content={lang === 'en' ? 'Terms of service for the Aksara Bali Converter app.' : 'Ketentuan layanan untuk aplikasi Aksara Bali Converter.'} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://aksarabali.doniwirawan.xyz/terms" />
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
