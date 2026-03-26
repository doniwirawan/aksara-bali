import Head from 'next/head'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import BalineseKeyboard from '../components/practice/BalineseKeyboard'
import QuizMode from '../components/practice/QuizMode'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { convertLatinToBalinese, QUIZ_WORDS } from '../utils/balineseConverter'

// HandGestureCanvas uses webcam + MediaPipe (browser-only)
const HandGestureCanvas = dynamic(
  () => import('../components/practice/HandGestureCanvas'),
  { ssr: false, loading: () => <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>Memuat kanvas...</div> }
)

const TABS_ID = [
  { key: 'quiz', label: '🎯 Kuis' },
  { key: 'write', label: '✍️ Tulis' },
  { key: 'keyboard', label: '⌨️ Papan Ketik' },
]
const TABS_EN = [
  { key: 'quiz', label: '🎯 Quiz' },
  { key: 'write', label: '✍️ Write' },
  { key: 'keyboard', label: '⌨️ Keyboard' },
]

// Pick a random practice word for the writing canvas
const PRACTICE_WORDS = QUIZ_WORDS.filter(w => w.difficulty === 'easy').slice(0, 8)

export default function PracticePage({ locale, setLocale }) {
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('quiz')
  const [freeText, setFreeText] = useState('')
  const [practiceWordIdx, setPracticeWordIdx] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('aksara-dark-mode')
    if (saved !== null) setDarkMode(saved === 'true')
  }, [])

  const bg = darkMode ? '#0f0f1a' : '#f5f5f0'
  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textColor = darkMode ? '#e8e8e8' : '#1a1a1a'
  const borderColor = darkMode ? '#2a2a3e' : '#e0e0d8'
  const mutedColor = darkMode ? '#888' : '#666'
  const tabActiveBg = '#0d6efd'

  const lang = locale === 'en' ? 'en' : 'id'
  const TABS = lang === 'en' ? TABS_EN : TABS_ID
  const pt = {
    id: {
      title: 'Latihan Aksara Bali', subtitle: 'Kuis interaktif, kanvas menulis, dan papan ketik aksara Bali',
      canvasTitle: 'Kanvas Menulis', canvasSub: 'Gambar aksara Bali dengan mouse, sentuhan, atau gerakan tangan',
      practiceLabel: 'Kata latihan:', changeWord: 'Ganti kata 🔀', refSheet: '📋 Daftar aksara referensi',
      kbTitle: 'Papan Ketik Aksara Bali', kbSub: 'Ketik bebas menggunakan papan ketik aksara Bali',
      kbPlaceholder: 'Mulai mengetik...', copyBtn: '📋 Salin',
      kbTip: '💡 Tips: Konsonan + tanda vokal = suku kata. Gunakan Adeg-adeg (᭄) untuk mengakhiri konsonan tanpa vokal. Buka tab Pangangge untuk tanda baca.',
    },
    en: {
      title: 'Balinese Script Practice', subtitle: 'Interactive quiz, writing canvas, and Balinese keyboard',
      canvasTitle: 'Writing Canvas', canvasSub: 'Draw Balinese script with mouse, touch, or hand gestures',
      practiceLabel: 'Practice word:', changeWord: 'Change word 🔀', refSheet: '📋 Reference sheet',
      kbTitle: 'Balinese Script Keyboard', kbSub: 'Type freely using the Balinese script keyboard',
      kbPlaceholder: 'Start typing...', copyBtn: '📋 Copy',
      kbTip: '💡 Tip: Consonant + vowel mark = syllable. Use Adeg-adeg (᭄) to end a consonant without a vowel. Open the Pangangge tab for diacritical marks.',
    },
  }[lang]

  const currentPracticeWord = PRACTICE_WORDS[practiceWordIdx % PRACTICE_WORDS.length]

  // Free keyboard typing state
  const handleKeyPress = (char) => setFreeText(prev => prev + char)
  const handleBackspace = () => setFreeText(prev => { const a = [...prev]; a.pop(); return a.join('') })
  const handleSpace = () => setFreeText(prev => prev + '\u200B')
  const handleClear = () => setFreeText('')

  return (
    <>
      <Head>
        <title>{lang === 'en' ? 'Balinese Script Practice — Quiz, Write & Keyboard' : 'Latihan Aksara Bali — Kuis, Tulis & Papan Ketik'}</title>
        <meta name="description" content={lang === 'en' ? 'Practice Balinese script with an interactive quiz, drawing canvas with hand gesture detection, and a custom Balinese keyboard.' : 'Latih menulis aksara Bali dengan kuis interaktif, kanvas gambar dengan deteksi gerakan tangan, dan papan ketik aksara Bali khusus.'} />
        <meta name="keywords" content="latihan aksara bali, kuis aksara bali, belajar aksara bali, papan ketik bali, balinese script practice" />
        <meta property="og:title" content="Latihan Aksara Bali — Kuis & Papan Ketik" />
        <meta property="og:description" content="Latih menulis aksara Bali dengan kuis, kanvas menggambar, dan papan ketik interaktif." />
        <link rel="canonical" href="https://aksarabali.id/practice" />
      </Head>

      <div style={{ minHeight: '100vh', background: bg, color: textColor, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => { const n = !darkMode; setDarkMode(n); localStorage.setItem('aksara-dark-mode', n) }}
          locale={locale || 'id'}
          onToggleLocale={() => setLocale && setLocale(locale === 'id' ? 'en' : 'id')}
        />

        <main style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
          {/* Page title */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px', color: textColor }}>
              {pt.title}
            </h1>
            <p style={{ color: mutedColor, margin: 0, fontSize: '15px' }}>
              {pt.subtitle}
            </p>
          </div>

          {/* Tab navigation */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '24px',
                  border: `2px solid ${activeTab === tab.key ? tabActiveBg : borderColor}`,
                  background: activeTab === tab.key ? tabActiveBg : 'transparent',
                  color: activeTab === tab.key ? '#fff' : textColor,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.key ? '600' : '400',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>

            {/* QUIZ TAB */}
            {activeTab === 'quiz' && (
              <QuizMode darkMode={darkMode} locale={locale} />
            )}

            {/* WRITING CANVAS TAB */}
            {activeTab === 'write' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '600' }}>{pt.canvasTitle}</h2>
                    <p style={{ margin: 0, fontSize: '13px', color: mutedColor }}>
                      {pt.canvasSub}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: mutedColor }}>{pt.practiceLabel}</span>
                    <button
                      onClick={() => setPracticeWordIdx(prev => (prev + 1) % PRACTICE_WORDS.length)}
                      style={{
                        padding: '6px 14px', borderRadius: '20px',
                        border: `1px solid ${borderColor}`, background: 'transparent',
                        cursor: 'pointer', fontSize: '13px', color: textColor,
                      }}
                    >
                      {pt.changeWord}
                    </button>
                  </div>
                </div>

                <HandGestureCanvas
                  darkMode={darkMode}
                  locale={locale}
                  referenceText={currentPracticeWord?.latin}
                  referenceBalinese={convertLatinToBalinese(currentPracticeWord?.latin || '')}
                />

                {/* Reference sheet */}
                <details style={{ marginTop: '20px' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '13px', color: '#0d6efd', fontWeight: '500', padding: '8px 0' }}>
                    {pt.refSheet}
                  </summary>
                  <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '8px' }}>
                    {[
                      { b: '\u1B33', l: 'Ha' }, { b: '\u1B26', l: 'Na' }, { b: '\u1B18', l: 'Ca' },
                      { b: '\u1B2D', l: 'Ra' }, { b: '\u1B13', l: 'Ka' }, { b: '\u1B24', l: 'Da' },
                      { b: '\u1B22', l: 'Ta' }, { b: '\u1B32', l: 'Sa' }, { b: '\u1B2F', l: 'Wa' },
                      { b: '\u1B2E', l: 'La' }, { b: '\u1B2B', l: 'Ma' }, { b: '\u1B15', l: 'Ga' },
                      { b: '\u1B29', l: 'Ba' }, { b: '\u1B17', l: 'Nga' }, { b: '\u1B27', l: 'Pa' },
                      { b: '\u1B1A', l: 'Ja' }, { b: '\u1B2C', l: 'Ya' }, { b: '\u1B1C', l: 'Nya' },
                    ].map(({ b, l }) => (
                      <div key={l} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: darkMode ? '#252535' : '#fafafa' }}>
                        <div style={{ fontFamily: '"Noto Sans Balinese", serif', fontSize: '24px' }}>{b}</div>
                        <div style={{ fontSize: '11px', color: mutedColor }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}

            {/* KEYBOARD TAB */}
            {activeTab === 'keyboard' && (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '600' }}>{pt.kbTitle}</h2>
                  <p style={{ margin: 0, fontSize: '13px', color: mutedColor }}>
                    {pt.kbSub}
                  </p>
                </div>

                {/* Output area */}
                <div style={{
                  minHeight: '90px',
                  padding: '16px 20px',
                  marginBottom: '16px',
                  borderRadius: '12px',
                  border: `2px solid ${borderColor}`,
                  background: darkMode ? '#0f0f1a' : '#f8f9ff',
                  position: 'relative',
                }}>
                  {freeText ? (
                    <span style={{ fontFamily: '"Noto Sans Balinese", serif', fontSize: '32px', lineHeight: 1.8, color: textColor }}>
                      {freeText}
                    </span>
                  ) : (
                    <span style={{ fontSize: '14px', color: mutedColor, fontStyle: 'italic' }}>
                      {pt.kbPlaceholder}
                    </span>
                  )}
                  {freeText && (
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(freeText)
                      }}
                      style={{
                        position: 'absolute', top: '12px', right: '12px',
                        padding: '4px 10px', borderRadius: '6px', border: `1px solid ${borderColor}`,
                        background: 'transparent', cursor: 'pointer', fontSize: '12px', color: mutedColor,
                      }}
                      title={pt.copyBtn}
                    >
                      {pt.copyBtn}
                    </button>
                  )}
                </div>

                <BalineseKeyboard
                  onKeyPress={handleKeyPress}
                  onBackspace={handleBackspace}
                  onSpace={handleSpace}
                  onClear={handleClear}
                  darkMode={darkMode}
                  locale={locale}
                />

                {/* Tip */}
                <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: darkMode ? '#1a2840' : '#f0f4ff', fontSize: '13px', color: darkMode ? '#8aabdc' : '#4a6fa5' }}>
                  {pt.kbTip}
                </div>
              </div>
            )}
          </div>

        </main>
        <Footer darkMode={darkMode} locale={locale || 'id'} />
      </div>
    </>
  )
}
