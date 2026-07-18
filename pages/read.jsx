import Head from 'next/head'
import { useState, useEffect, useCallback } from 'react'
import { ScanText, Copy, Check } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import OcrPanel from '../components/OcrPanel'

const BALINESE_FONT = '"Noto Sans Balinese", serif'

const T = {
  id: {
    title: 'Baca Aksara Bali dari Foto',
    subtitle: 'Unggah atau potret tulisan aksara Bali — hasilnya dibaca dan diubah ke Latin, langsung di browser.',
    balinese: 'Aksara Bali terbaca',
    latin: 'Hasil Latin',
    confidence: 'Keyakinan',
    copy: 'Salin',
    copied: 'Tersalin!',
    empty: 'Tidak ada aksara yang terbaca. Coba foto yang lebih jelas atau lebih dekat.',
    tipTitle: 'Tips hasil terbaik',
    tips: [
      'Gunakan foto tulisan cetak yang jelas dan lurus.',
      'Cahaya merata, tanpa bayangan atau pantulan.',
      'Potong agar hanya berisi baris aksara.',
    ],
  },
  en: {
    title: 'Read Aksara Bali from a Photo',
    subtitle: 'Upload or snap Balinese script — it gets recognised and transliterated to Latin, right in your browser.',
    balinese: 'Recognised Balinese',
    latin: 'Latin result',
    confidence: 'Confidence',
    copy: 'Copy',
    copied: 'Copied!',
    empty: 'No script was recognised. Try a clearer or closer photo.',
    tipTitle: 'Tips for best results',
    tips: [
      'Use a clear, straight photo of printed script.',
      'Even lighting, no shadows or glare.',
      'Crop tight to the line(s) of script.',
    ],
  },
}

export default function ReadPage({ locale, setLocale }) {
  const t = T[locale] || T.en
  const [darkMode, setDarkMode] = useState(false)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState('')

  useEffect(() => {
    try {
      if (localStorage.getItem('aksara-dark-mode') === 'true') setDarkMode(true)
    } catch { /* ignore */ }
  }, [])

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev
      try {
        localStorage.setItem('aksara-dark-mode', String(next))
        if (next) document.documentElement.setAttribute('data-bs-theme', 'dark')
        else document.documentElement.removeAttribute('data-bs-theme')
      } catch { /* ignore */ }
      return next
    })
  }, [])

  const copy = useCallback(async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(''), 1500)
    } catch { /* ignore */ }
  }, [])

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const border = darkMode ? '#2a2a3e' : '#e8e8e0'
  const textColor = darkMode ? '#e8e8e8' : '#1a1a1a'
  const muted = darkMode ? '#9aa' : '#666'

  return (
    <>
      <Head>
        <title>{locale === 'id' ? 'Baca Aksara Bali dari Foto — OCR' : 'Read Aksara Bali from Photo — OCR'}</title>
        <meta name="description" content={t.subtitle} />
      </Head>

      <div className={`min-vh-100 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`} style={{ minHeight: '100vh' }}>
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          locale={locale}
          onToggleLocale={() => setLocale(locale === 'id' ? 'en' : 'id')}
        />

        <main style={{ maxWidth: 760, margin: '0 auto', padding: '28px 16px 48px', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 16, background: '#0d6efd', marginBottom: 12 }}>
              <ScanText size={30} color="#fff" />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: textColor, margin: '0 0 6px' }}>{t.title}</h1>
            <p style={{ fontSize: 14, color: muted, margin: 0 }}>{t.subtitle}</p>
          </div>

          <OcrPanel locale={locale} darkMode={darkMode} onResult={setResult} />

          {result && (
            result.balinese ? (
              <div style={{ marginTop: 20, display: 'grid', gap: 14 }}>
                <ResultCard
                  label={t.balinese}
                  onCopy={() => copy(result.balinese, 'bali')}
                  copied={copied === 'bali'}
                  copyLabel={t.copy} copiedLabel={t.copied}
                  cardBg={cardBg} border={border} muted={muted}
                >
                  <div style={{ fontFamily: BALINESE_FONT, fontSize: 30, lineHeight: 1.7, color: textColor, wordBreak: 'break-word' }}>
                    {result.balinese}
                  </div>
                </ResultCard>

                <ResultCard
                  label={`${t.latin}  ·  ${t.confidence} ${result.confidence}%`}
                  onCopy={() => copy(result.latin, 'latin')}
                  copied={copied === 'latin'}
                  copyLabel={t.copy} copiedLabel={t.copied}
                  cardBg={cardBg} border={border} muted={muted}
                >
                  <div style={{ fontSize: 18, lineHeight: 1.6, color: textColor, wordBreak: 'break-word' }}>
                    {result.latin}
                  </div>
                </ResultCard>
              </div>
            ) : (
              <div style={{ marginTop: 18, fontSize: 13, color: muted, textAlign: 'center' }}>{t.empty}</div>
            )
          )}

          <div style={{ marginTop: 32, background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: textColor, marginBottom: 8 }}>{t.tipTitle}</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: muted, lineHeight: 1.7 }}>
              {t.tips.map((tip) => <li key={tip}>{tip}</li>)}
            </ul>
          </div>
        </main>

        <Footer darkMode={darkMode} locale={locale} />
      </div>
    </>
  )
}

function ResultCard({ label, children, onCopy, copied, copyLabel, copiedLabel, cardBg, border, muted }) {
  return (
    <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</span>
        <button onClick={onCopy} className="btn btn-sm btn-link p-0" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: copied ? '#198754' : '#0d6efd', textDecoration: 'none' }}>
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      {children}
    </div>
  )
}
