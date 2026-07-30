import Head from 'next/head'
import { useState, useEffect, useMemo, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Search, Copy, Check, BookOpen, ExternalLink, Info } from 'lucide-react'
import { convertLatinToBalinese } from '../utils/balineseConverter'

const BASE = 'https://aksarabali.doniwirawan.xyz'

// Speech-level columns as they appear in the source dictionary.
const LEVELS = [
  { key: 'a', id: 'Andap', en: 'Andap (everyday)', hint: { id: 'ragam biasa', en: 'ordinary register' } },
  { key: 's', id: 'Alus singgih', en: 'Alus singgih', hint: { id: 'menghormati lawan bicara', en: 'honouring the person addressed' } },
  { key: 'o', id: 'Alus sor', en: 'Alus sor', hint: { id: 'merendahkan diri sendiri', en: 'humbling oneself' } },
  { key: 'm', id: 'Mider', en: 'Mider', hint: { id: 'dipakai di semua ragam', en: 'used across registers' } },
]

const T = {
  id: {
    title: 'Kamus Bahasa Bali',
    subtitle: 'Cari kata bahasa Indonesia atau bahasa Bali, lihat padanannya menurut tingkatan bahasa, lengkap dengan aksara Bali.',
    placeholder: 'Ketik kata, misalnya "rumah" atau "umah"...',
    resultsFor: (n, q) => `${n} hasil untuk "${q}"`,
    empty: 'Kata itu belum ada di kamus ini. Coba kata dasarnya, atau cari di BASAbali Wiki.',
    start: 'Mulai mengetik untuk mencari kata.',
    loading: 'Memuat kamus...',
    indonesian: 'Indonesia',
    copy: 'Salin aksara',
    copied: 'Tersalin',
    levelsTitle: 'Tentang tingkatan bahasa',
    levelsBody: 'Bahasa Bali mengenal anggah-ungguh basa: pilihan kata berubah menurut siapa yang diajak bicara. Kamus ini menampilkan bentuk andap (biasa), alus singgih, alus sor, dan mider bila tersedia. Pilih yang sesuai konteks — bukan sekadar yang pertama muncul.',
    sourceTitle: 'Sumber dan rujukan lain',
    sourceBody: 'Data kamus diambil dari Kamus Anggah-Ungguh Kruna Bali–Indonesia. Untuk pencarian yang lebih luas, kamus komunitas, dan contoh kalimat, gunakan rujukan berikut:',
    convNote: 'Ingin mengubah tulisan Latin menjadi aksara Bali? Gunakan',
    convLink: 'konverter aksara Bali',
    tabWord: 'Cari kata',
    tabSentence: 'Bantu kalimat',
    sentencePlaceholder: 'Tulis kalimat bahasa Indonesia, misalnya "saya belajar aksara bali di rumah"...',
    sentenceWarn: 'Ini penggantian kata per kata, bukan terjemahan. Urutan kata bahasa Bali bisa berbeda, dan pilihan kata bergantung pada lawan bicara. Pakai hasilnya sebagai titik awal, lalu periksa bersama penutur asli.',
    levelPick: 'Ragam bahasa',
    levelAndap: 'Andap (biasa)',
    levelAlus: 'Alus (hormat)',
    resultBali: 'Bahasa Bali (kata per kata)',
    resultScript: 'Aksara Bali',
    unmatched: 'Kata bergaris bawah belum ada di kamus dan dibiarkan apa adanya.',
    sentenceStart: 'Tulis kalimat untuk melihat padanan katanya.',
    disclaimer: 'Kamus ini disusun otomatis dari sumber cetak, jadi mungkin ada salah baca. Untuk keperluan resmi, cetak, atau upacara, mintalah pemeriksaan penutur asli.',
  },
  en: {
    title: 'Balinese Dictionary',
    subtitle: 'Search an Indonesian or Balinese word and see its equivalents by speech level, together with Balinese script.',
    placeholder: 'Type a word, e.g. "rumah" or "umah"...',
    resultsFor: (n, q) => `${n} results for "${q}"`,
    empty: 'That word is not in this dictionary yet. Try its root form, or search BASAbali Wiki.',
    start: 'Start typing to search.',
    loading: 'Loading dictionary...',
    indonesian: 'Indonesian',
    copy: 'Copy script',
    copied: 'Copied',
    levelsTitle: 'About speech levels',
    levelsBody: 'Balinese has anggah-ungguh basa: word choice changes with who you are speaking to. This dictionary shows the andap (everyday), alus singgih, alus sor, and mider forms where they exist. Pick the one that fits the situation, not simply the first one listed.',
    sourceTitle: 'Sources and further reference',
    sourceBody: 'Entries come from the Kamus Anggah-Ungguh Kruna Bali–Indonesia. For broader search, community dictionaries, and example sentences, use these:',
    convNote: 'Want to turn Latin text into Balinese script? Use the',
    convLink: 'Balinese script converter',
    tabWord: 'Word search',
    tabSentence: 'Sentence helper',
    sentencePlaceholder: 'Write an Indonesian sentence, e.g. "saya belajar aksara bali di rumah"...',
    sentenceWarn: 'This is word-by-word substitution, not translation. Balinese word order can differ, and word choice depends on who you are addressing. Treat the result as a starting point and check it with a native speaker.',
    levelPick: 'Register',
    levelAndap: 'Andap (everyday)',
    levelAlus: 'Alus (respectful)',
    resultBali: 'Balinese (word by word)',
    resultScript: 'Balinese script',
    unmatched: 'Underlined words are not in the dictionary and were left as they are.',
    sentenceStart: 'Write a sentence to see the word equivalents.',
    disclaimer: 'This dictionary was parsed automatically from a printed source, so misreadings are possible. For official, printed, or ceremonial use, have a native speaker check it.',
  },
}

const LINKS = [
  { href: 'https://dictionary.basabali.org/', label: 'BASAbali Wiki', note: { id: 'kamus dan korpus bahasa Bali', en: 'Balinese dictionary and corpus' } },
  { href: 'https://ban.wikipedia.org/', label: 'Wikipedia Basa Bali', note: { id: 'ensiklopedia berbahasa Bali', en: 'Balinese-language encyclopedia' } },
  { href: 'https://ban.wikisource.org/', label: 'Wikisource Basa Bali', note: { id: 'naskah dan teks berbahasa Bali', en: 'Balinese texts and manuscripts' } },
  { href: 'https://www.instagram.com/banwikipedia/', label: '@banwikipedia', note: { id: 'komunitas Wikipedia Basa Bali di Instagram', en: 'the Balinese Wikipedia community on Instagram' } },
]

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()

// Word-by-word substitution for the sentence helper. Deliberately not sold as
// translation: Balinese word order and speech levels need a human.
function buildSentence(entries, text, level) {
  if (!entries) return []
  const index = new Map()
  for (const e of entries) {
    const key = norm(e.i)
    if (!key) continue
    if (!index.has(key)) index.set(key, e)
  }
  return text.split(/(\s+|[.,!?;:()"']+)/).filter(Boolean).map(token => {
    if (!/\p{L}/u.test(token)) return { token, out: token, matched: null }
    const e = index.get(norm(token))
    if (!e) return { token, out: token, matched: false }
    const order = level === 'alus' ? ['s', 'm', 'o', 'a'] : ['a', 'm', 's', 'o']
    // Entries can list alternatives ("puri, gria"); a sentence takes one.
    const pick = order.map(k => e[k]).find(Boolean)?.split(/[,/]/)[0].trim()
    return { token, out: pick || token, matched: !!pick, entry: e }
  })
}

export default function TranslatePage({ locale, setLocale }) {
  const [darkMode, setDarkMode] = useState(false)
  const [entries, setEntries] = useState(null)
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState('')
  const [mode, setMode] = useState('word')
  const [sentence, setSentence] = useState('')
  const [level, setLevel] = useState('andap')
  const lang = locale === 'en' ? 'en' : 'id'
  const t = T[lang]

  useEffect(() => {
    const saved = localStorage.getItem('aksara-dark-mode')
    if (saved !== null) setDarkMode(saved === 'true')
  }, [])

  useEffect(() => {
    fetch('/data/kamus-bali.json')
      .then(r => r.json())
      .then(d => setEntries(d.entries || []))
      .catch(() => setEntries([]))
  }, [])

  const results = useMemo(() => {
    const q = norm(query)
    if (!entries || q.length < 2) return []
    const fields = ['i', 'a', 's', 'o', 'm']
    const scored = []
    for (const e of entries) {
      let best = 0
      for (const f of fields) {
        if (!e[f]) continue
        const v = norm(e[f])
        if (v === q) best = Math.max(best, 3)
        else if (v.split(/[,/]\s*/).some(part => part.trim() === q)) best = Math.max(best, 3)
        else if (v.startsWith(q)) best = Math.max(best, 2)
        else if (v.includes(q)) best = Math.max(best, 1)
      }
      if (best) scored.push({ e, best })
    }
    return scored.sort((x, y) => y.best - x.best).slice(0, 40).map(s => s.e)
  }, [entries, query])

  const sentenceParts = useMemo(
    () => (mode === 'sentence' && sentence.trim() ? buildSentence(entries, sentence, level) : []),
    [entries, sentence, level, mode]
  )
  const sentenceBali = sentenceParts.map(p => p.out).join('')
  const sentenceScript = sentenceBali.trim() ? convertLatinToBalinese(sentenceBali) : ''

  const copy = useCallback(async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(''), 1600)
    } catch { /* clipboard unavailable */ }
  }, [])

  const bg = darkMode ? '#0f0f1a' : '#f5f5f0'
  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textColor = darkMode ? '#e8e8e8' : '#1a1a1a'
  const borderColor = darkMode ? '#2a2a3e' : '#e0e0d8'
  const mutedColor = darkMode ? '#8b8b9e' : '#666'

  const pageTitle = lang === 'en'
    ? 'Balinese Dictionary — Indonesian to Balinese with Speech Levels'
    : 'Kamus Bahasa Bali — Indonesia ke Bali dengan Tingkatan Bahasa'
  const pageDesc = lang === 'en'
    ? 'Search Indonesian or Balinese words and see andap, alus singgih, alus sor, and mider forms, each written in Balinese script.'
    : 'Cari kata bahasa Indonesia atau Bali dan lihat bentuk andap, alus singgih, alus sor, dan mider, lengkap dengan aksara Balinya.'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content="kamus bahasa bali, translate bahasa indonesia ke bahasa bali, terjemahan bahasa bali, anggah-ungguh basa, alus singgih, aksara bali" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE}/translate`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${BASE}/translate`} />
      </Head>

      <div style={{ minHeight: '100vh', background: bg, color: textColor, fontFamily: 'Inter, system-ui, sans-serif' }}>
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => { const n = !darkMode; setDarkMode(n); localStorage.setItem('aksara-dark-mode', n) }}
          locale={locale || 'id'}
          onToggleLocale={() => setLocale && setLocale(locale === 'id' ? 'en' : 'id')}
        />

        <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px 80px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>{t.title}</h1>
          <p style={{ color: mutedColor, margin: '0 0 24px', lineHeight: 1.6, fontSize: 15 }}>{t.subtitle}</p>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[['word', t.tabWord], ['sentence', t.tabSentence]].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                style={{
                  padding: '8px 16px', borderRadius: 999, fontSize: 14, cursor: 'pointer',
                  fontWeight: mode === key ? 600 : 400,
                  border: `1px solid ${mode === key ? '#0d6efd' : borderColor}`,
                  background: mode === key ? '#0d6efd' : 'transparent',
                  color: mode === key ? '#fff' : mutedColor,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === 'sentence' && (
            <div style={{ marginBottom: 28 }}>
              <textarea
                value={sentence}
                onChange={e => setSentence(e.target.value)}
                placeholder={t.sentencePlaceholder}
                rows={3}
                style={{
                  width: '100%', padding: 14, fontSize: 16, borderRadius: 12,
                  border: `1px solid ${borderColor}`, background: cardBg, color: textColor,
                  outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: mutedColor }}>{t.levelPick}:</span>
                {[['andap', t.levelAndap], ['alus', t.levelAlus]].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setLevel(key)}
                    style={{
                      padding: '5px 12px', borderRadius: 999, fontSize: 13, cursor: 'pointer',
                      border: `1px solid ${level === key ? '#0d6efd' : borderColor}`,
                      background: level === key ? '#0d6efd15' : 'transparent',
                      color: level === key ? '#0d6efd' : mutedColor,
                      fontWeight: level === key ? 600 : 400,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <p style={{
                fontSize: 12.5, lineHeight: 1.7, color: mutedColor, margin: '0 0 14px',
                padding: '10px 12px', borderRadius: 10,
                background: darkMode ? '#241d10' : '#fdf6e3',
                border: `1px solid ${darkMode ? '#3a3020' : '#efe3c2'}`,
              }}>
                {t.sentenceWarn}
              </p>

              {!sentence.trim() && <p style={{ color: mutedColor, fontSize: 14 }}>{t.sentenceStart}</p>}

              {sentence.trim() && (
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: 16 }}>
                    <div style={{ fontSize: 12, color: mutedColor, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                      {t.resultBali}
                    </div>
                    <p style={{ margin: 0, fontSize: 17, lineHeight: 1.7 }}>
                      {sentenceParts.map((p, i) => (
                        <span key={i} style={p.matched === false
                          ? { textDecoration: 'underline dotted', textUnderlineOffset: 3, opacity: 0.75 }
                          : undefined}>
                          {p.out}
                        </span>
                      ))}
                    </p>
                    <p style={{ margin: '10px 0 0', fontSize: 11.5, color: mutedColor }}>{t.unmatched}</p>
                  </div>

                  <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: mutedColor, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {t.resultScript}
                      </span>
                      <button
                        onClick={() => copy(sentenceScript, 'sentence')}
                        style={{
                          marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6,
                          fontSize: 12, padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
                          border: `1px solid ${borderColor}`, background: 'transparent', color: mutedColor,
                        }}
                      >
                        {copied === 'sentence' ? <Check size={13} /> : <Copy size={13} />}
                        {copied === 'sentence' ? t.copied : t.copy}
                      </button>
                    </div>
                    <p style={{ margin: 0, fontSize: 24, lineHeight: 1.9 }}>{sentenceScript}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === 'word' && (
          <>
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: 15, color: mutedColor }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              style={{
                width: '100%', padding: '14px 14px 14px 44px', fontSize: 16,
                borderRadius: 12, border: `1px solid ${borderColor}`,
                background: cardBg, color: textColor, outline: 'none',
              }}
            />
          </div>

          {entries === null && <p style={{ color: mutedColor }}>{t.loading}</p>}

          {entries !== null && query.trim().length < 2 && (
            <p style={{ color: mutedColor }}>{t.start}</p>
          )}

          {entries !== null && query.trim().length >= 2 && (
            <>
              <p style={{ color: mutedColor, fontSize: 13, margin: '0 0 12px' }}>
                {t.resultsFor(results.length, query.trim())}
              </p>

              {results.length === 0 && (
                <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12, padding: 20, color: mutedColor }}>
                  {t.empty}
                </div>
              )}

              <div style={{ display: 'grid', gap: 12 }}>
                {results.map((e, idx) => (
                  <div key={idx} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: 16 }}>
                    <div style={{ fontSize: 12, color: mutedColor, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                      {t.indonesian}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{e.i}</div>

                    <div style={{ display: 'grid', gap: 8 }}>
                      {LEVELS.filter(l => e[l.key]).map(l => {
                        const word = e[l.key]
                        const script = convertLatinToBalinese(word)
                        const key = `${idx}-${l.key}`
                        return (
                          <div key={l.key} style={{
                            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                            padding: '8px 10px', borderRadius: 10,
                            background: darkMode ? '#20203a' : '#f7f7f2',
                          }}>
                            <span style={{
                              fontSize: 11, fontWeight: 600, color: '#0d6efd',
                              background: '#0d6efd15', padding: '3px 8px', borderRadius: 8, whiteSpace: 'nowrap',
                            }} title={l.hint[lang]}>
                              {l[lang === 'en' ? 'en' : 'id']}
                            </span>
                            <span style={{ fontWeight: 600 }}>{word}</span>
                            <span style={{ fontSize: 22, lineHeight: 1.6 }}>{script}</span>
                            <button
                              onClick={() => copy(script, key)}
                              style={{
                                marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6,
                                fontSize: 12, padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
                                border: `1px solid ${borderColor}`, background: 'transparent', color: mutedColor,
                              }}
                            >
                              {copied === key ? <Check size={13} /> : <Copy size={13} />}
                              {copied === key ? t.copied : t.copy}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          </>
          )}

          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: 18, marginTop: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Info size={16} /> {t.levelsTitle}
            </h2>
            <p style={{ color: mutedColor, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{t.levelsBody}</p>
          </div>

          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: 18, marginTop: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={16} /> {t.sourceTitle}
            </h2>
            <p style={{ color: mutedColor, fontSize: 14, lineHeight: 1.7, margin: '0 0 12px' }}>{t.sourceBody}</p>
            <div style={{ display: 'grid', gap: 8 }}>
              {LINKS.map(l => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0d6efd', textDecoration: 'none', fontSize: 14 }}>
                  <ExternalLink size={14} />
                  <span style={{ fontWeight: 600 }}>{l.label}</span>
                  <span style={{ color: mutedColor }}>— {l.note[lang]}</span>
                </a>
              ))}
            </div>
            <p style={{ color: mutedColor, fontSize: 13, lineHeight: 1.7, margin: '14px 0 0' }}>
              {t.convNote} <a href="/" style={{ color: '#0d6efd' }}>{t.convLink}</a>.
            </p>
            <p style={{ color: mutedColor, fontSize: 12, lineHeight: 1.7, margin: '10px 0 0' }}>{t.disclaimer}</p>
          </div>
        </main>

        <Footer darkMode={darkMode} locale={locale || 'id'} />
      </div>
    </>
  )
}
