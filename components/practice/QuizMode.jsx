import React, { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { convertLatinToBalinese, QUIZ_WORDS } from '../../utils/balineseConverter'
import { Check, ArrowLeft, Lock, BookOpen, Keyboard, Trophy, RotateCcw, CheckCircle, XCircle, Volume2, VolumeX, PenLine } from 'lucide-react'
import BalineseKeyboard from './BalineseKeyboard'
import { playCorrect, playWrong, playComplete, sfxEnabled, setSfxEnabled } from '../../utils/sfx'

// Canvas answer mode for the writing quiz (webcam/MediaPipe → browser-only).
const HandGestureCanvas = dynamic(() => import('./HandGestureCanvas'), {
  ssr: false,
  loading: () => <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>…</div>,
})

const PASS = 70
const STORAGE_KEY = 'aksara_quiz_best'

// Duolingo-style track: a gentle start, then themed units (filtered by word
// category), then difficulty-based boss levels at the end. `diffs` and `cats`
// are both optional filters — omitted means "any".
const LEVELS = [
  { name: 'Pemula', sub: { id: 'Kenali dasar aksara.', en: 'Learn the basics.' }, diffs: ['easy'], count: 8 },
  { name: 'Hewan & Makanan', sub: { id: 'Kata seputar hewan dan makanan.', en: 'Animal and food words.' }, cats: ['Hewan', 'Makanan'], count: 10 },
  { name: 'Alam & Tempat', sub: { id: 'Alam dan tempat-tempat di Bali.', en: 'Nature and places in Bali.' }, cats: ['Alam', 'Tempat'], count: 10 },
  { name: 'Keluarga & Tubuh', sub: { id: 'Keluarga dan anggota tubuh.', en: 'Family and body parts.' }, cats: ['Keluarga', 'Tubuh'], count: 10 },
  { name: 'Warna & Angka', sub: { id: 'Warna dan angka dalam bahasa Bali.', en: 'Colors and numbers.' }, cats: ['Warna', 'Angka'], count: 10 },
  { name: 'Kerja & Sifat', sub: { id: 'Kata kerja dan kata sifat sehari-hari.', en: 'Everyday verbs and adjectives.' }, cats: ['Kata kerja', 'Sifat'], count: 10 },
  { name: 'Waktu & Wewaran', sub: { id: 'Kata waktu dan nama-nama hari.', en: 'Time words and day names.' }, cats: ['Waktu'], count: 10 },
  { name: 'Budaya', sub: { id: 'Seni dan budaya Bali.', en: 'Balinese arts and culture.' }, cats: ['Budaya'], count: 10 },
  { name: 'Agama', sub: { id: 'Upacara dan istilah keagamaan.', en: 'Ceremonies and religious terms.' }, cats: ['Agama'], count: 10 },
  { name: 'Filosofi & Sastra', sub: { id: 'Filosofi hidup dan sastra Bali.', en: 'Philosophy and literature.' }, cats: ['Filosofi', 'Sastra'], count: 10 },
  { name: 'Master', sub: { id: 'Tes ketajaman pemahaman.', en: 'Sharpen your mastery.' }, diffs: ['hard'], count: 12 },
  { name: 'GrandMaster', sub: { id: 'Buktikan kamu sang master.', en: 'Prove you are the master.' }, count: 15 },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const norm = (s) => s.replace(/​/g, '').trim()

export default function QuizMode({ darkMode, locale }) {
  const lang = locale === 'en' ? 'en' : 'id'
  const tr = {
    id: {
      title: 'Quiz', subtitle: 'Taklukkan tiap level untuk membuka tingkat berikutnya.',
      reading: 'Membaca', typing: 'Menulis',
      hintRead: 'Lihat aksara, pilih bacaan Latin yang benar.',
      hintType: 'Lihat kata Latin, tulis aksaranya dengan papan aksara.',
      score: 'Score', correct: 'Benar', wrong: 'Salah',
      question: 'Soal', whichAksara: 'Aksara apa ini?', writeFor: 'Tulis aksara untuk:',
      typeHint: 'Ketik aksara di sini…', check: 'Periksa', next: 'Lanjut', seeResult: 'Lihat hasil',
      correctMsg: 'Benar!', notQuite: 'Belum tepat', answer: 'Jawaban:',
      retry: 'Ulangi', detail: 'Lihat Detail',
      allDoneTitle: 'Selamat, Kamu Berhasil Menaklukkan Semua Level dengan Luar Biasa!',
      allDoneBody: 'Kamu telah berhasil menyelesaikan semua level! Tantangan selesai, tapi kamu bisa terus berlatih untuk mengasah kemampuanmu. Terima kasih sudah terus berprestasi!',
      passTitle: (n) => `Hebat! Level ${n} selesai!`,
      passBody: (s) => `Skor kamu ${s}. Level berikutnya sudah terbuka — lanjutkan tantanganmu!`,
      failTitle: 'Belum lulus — coba lagi ya!',
      failBody: `Kamu butuh skor minimal ${PASS} untuk membuka level berikutnya. Ayo ulangi!`,
    },
    en: {
      title: 'Quiz', subtitle: 'Conquer each level to unlock the next.',
      reading: 'Reading', typing: 'Writing',
      hintRead: 'See the aksara, pick the correct Latin reading.',
      hintType: 'See the Latin word, write the aksara with the keyboard.',
      score: 'Score', correct: 'Correct', wrong: 'Wrong',
      question: 'Q', whichAksara: 'Which aksara is this?', writeFor: 'Write the aksara for:',
      typeHint: 'Type the aksara here…', check: 'Check', next: 'Next', seeResult: 'See result',
      correctMsg: 'Correct!', notQuite: 'Not quite', answer: 'Answer:',
      retry: 'Retry', detail: 'See Details',
      allDoneTitle: 'Congratulations, you conquered every level brilliantly!',
      allDoneBody: 'You finished all levels! The challenge is done, but keep practising to sharpen your skills. Thanks for keeping it up!',
      passTitle: (n) => `Great! Level ${n} done!`,
      passBody: (s) => `Your score is ${s}. The next level is unlocked — keep going!`,
      failTitle: 'Not passed — try again!',
      failBody: `You need at least ${PASS} to unlock the next level. Give it another go!`,
    },
  }
  const t = tr[lang]

  const [mode, setMode] = useState('reading')
  const [best, setBest] = useState({})
  const [active, setActive] = useState(null)

  const [queue, setQueue] = useState([])
  const [idx, setIdx] = useState(0)
  const [correct, setCorrect] = useState(0)

  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(null)

  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [lastCorrect, setLastCorrect] = useState(false)
  const [writeMethod, setWriteMethod] = useState('type') // 'type' | 'draw'

  const [result, setResult] = useState(null) // {correct, score, wrong, passed, allDone, levelName}
  const [soundOn, setSoundOn] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setBest(JSON.parse(raw))
    } catch { /* ignore */ }
    setSoundOn(sfxEnabled())
  }, [])

  const toggleSound = () => {
    const next = !soundOn
    setSoundOn(next)
    setSfxEnabled(next)
  }

  const saveBest = (next) => {
    setBest(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  const unlocked = (i) => i === 0 || (best[i - 1] || 0) >= PASS

  const buildOptions = useCallback((q) => {
    const others = shuffle(QUIZ_WORDS.map(w => w.latin).filter(l => l !== q.latin))
    setOptions(shuffle([q.latin, ...others.slice(0, 3)]))
  }, [])

  const startLevel = useCallback((i) => {
    const lv = LEVELS[i]
    const pool = shuffle(QUIZ_WORDS.filter(w =>
      (!lv.diffs || lv.diffs.includes(w.difficulty)) &&
      (!lv.cats || lv.cats.includes(w.category))
    ))
    const q = pool.slice(0, LEVELS[i].count)
    setActive(i); setQueue(q); setIdx(0); setCorrect(0)
    setSelected(null); setInput(''); setChecked(false)
    if (q.length) buildOptions(q[0])
  }, [buildOptions])

  const answered = mode === 'reading' ? selected !== null : checked

  const answerReading = (latin) => {
    if (selected !== null) return
    setSelected(latin)
    const ok = latin === queue[idx].latin
    setLastCorrect(ok)
    if (ok) { setCorrect(c => c + 1); playCorrect() } else playWrong()
  }

  const checkTyping = () => {
    if (checked) return
    const ok = norm(input) === norm(convertLatinToBalinese(queue[idx].latin))
    setChecked(true); setLastCorrect(ok)
    if (ok) { setCorrect(c => c + 1); playCorrect() } else playWrong()
  }

  // The drawing canvas auto-grades and only fires this when the aksara is right.
  const onDrawSolved = () => {
    if (checked) return
    setChecked(true); setLastCorrect(true); setCorrect(c => c + 1); playCorrect()
  }

  const finish = () => {
    const total = queue.length
    const score = total === 0 ? 0 : Math.round((correct / total) * 100)
    const next = { ...best }
    if (score > (next[active] || 0)) next[active] = score
    saveBest(next)
    const allDone = LEVELS.every((_, i) => (next[i] || 0) >= PASS)
    const passed = score >= PASS
    if (passed) playComplete(); else playWrong()
    setResult({
      correct, score, wrong: total - correct,
      passed, allDone, levelName: LEVELS[active].name,
    })
  }

  const next = () => {
    if (idx + 1 >= queue.length) { finish(); return }
    const ni = idx + 1
    setIdx(ni); setSelected(null); setInput(''); setChecked(false)
    buildOptions(queue[ni])
  }

  const closeResult = (replay) => {
    const lvl = active
    setResult(null)
    if (replay) startLevel(lvl)
    else setActive(null)
  }

  // ── Theme tokens ──
  const textColor = darkMode ? '#e0e0e0' : '#1a1a1a'
  const cardBg = darkMode ? '#1e1e2e' : '#ffffff'
  const border = darkMode ? '#333' : '#e0e0e0'
  const muted = darkMode ? '#888' : '#666'
  const blue = '#0d6efd'
  const green = '#16a34a'
  const red = '#dc2626'

  // ── Level list ──
  if (active === null) {
    return (
      <div style={{ color: textColor, maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <h2 style={{ flex: 1, fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>{t.title}</h2>
          <button onClick={toggleSound} title={soundOn ? 'Mute' : 'Unmute'} aria-label="Toggle sounds"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, display: 'inline-flex', padding: 4, marginTop: 4 }}>
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
        <p style={{ color: muted, fontSize: 14, margin: '0 0 16px' }}>{t.subtitle}</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 8 }}>
          {[['reading', BookOpen, t.reading], ['typing', Keyboard, t.typing]].map(([m, Icon, label], k) => (
            <button key={m} onClick={() => setMode(m)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px',
              border: `1px solid ${mode === m ? blue : border}`,
              borderRadius: k === 0 ? '10px 0 0 10px' : '0 10px 10px 0',
              background: mode === m ? blue : cardBg, color: mode === m ? '#fff' : muted,
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
            }}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: muted, fontSize: 12, margin: '0 0 18px' }}>
          {mode === 'reading' ? t.hintRead : t.hintType}
        </p>

        {LEVELS.map((lv, i) => {
          const open = unlocked(i)
          const b = best[i] || 0
          return (
            <button key={lv.name} onClick={() => open && startLevel(i)} disabled={!open} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
              padding: 16, marginBottom: 12, borderRadius: 14, background: cardBg,
              border: `1px solid ${border}`, cursor: open ? 'pointer' : 'default', opacity: open ? 1 : 0.6,
            }}>
              <span style={{
                width: 44, height: 44, flexShrink: 0, borderRadius: 12,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: open ? 'rgba(13,110,253,0.12)' : (darkMode ? '#2a2a3a' : '#ededf0'),
                color: open ? blue : muted, fontWeight: 800, fontSize: 18,
              }}>
                {open ? i + 1 : <Lock size={20} />}
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: 16, fontWeight: 700, color: textColor }}>{lv.name}</span>
                <span style={{ display: 'block', fontSize: 12, color: muted }}>{lv.sub[lang]}</span>
              </span>
              <span style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: 11, color: muted }}>{t.score}</span>
                <span style={{ display: 'block', fontSize: 18, fontWeight: 800, color: b >= PASS ? green : textColor }}>{b}</span>
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  // ── Playing ──
  const lv = LEVELS[active]
  const q = queue[idx]
  const progress = ((idx + 1) / queue.length) * 100

  return (
    <div style={{ color: textColor, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <button onClick={() => setActive(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textColor, padding: 0, display: 'inline-flex' }}>
          <ArrowLeft size={22} />
        </button>
        <span style={{ flex: 1, fontWeight: 800, fontSize: 16 }}>{lv.name}</span>
        <button onClick={toggleSound} title={soundOn ? 'Mute' : 'Unmute'} aria-label="Toggle sounds"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, display: 'inline-flex', padding: 4 }}>
          {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <span style={{ color: blue, fontWeight: 700 }}>{t.correct}: {correct}</span>
      </div>

      <div style={{ height: 6, borderRadius: 3, background: border, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: blue, transition: 'width 0.3s' }} />
      </div>

      <div style={{ fontSize: 13, color: muted, marginBottom: 12 }}>
        {t.question} {idx + 1}/{queue.length} · {mode === 'reading' ? t.whichAksara : t.writeFor}
      </div>

      {mode === 'reading' ? (
        <>
          <div style={{ padding: '28px 16px', borderRadius: 16, background: cardBg, border: `1px solid ${border}`, textAlign: 'center', marginBottom: 20 }}>
            <span style={{ fontFamily: '"Noto Sans Balinese", serif', fontSize: 52, color: textColor, whiteSpace: 'nowrap' }}>
              {convertLatinToBalinese(q.latin)}
            </span>
          </div>
          {options.map(opt => {
            let bg = cardBg, fg = textColor, bd = border
            if (selected !== null) {
              if (opt === q.latin) { bg = darkMode ? '#0d2d1f' : '#dcfce7'; fg = green; bd = green }
              else if (opt === selected) { bg = darkMode ? '#2d0a0a' : '#fee2e2'; fg = red; bd = red }
            }
            return (
              <button key={opt} onClick={() => answerReading(opt)} style={{
                width: '100%', textAlign: 'left', padding: '16px', marginBottom: 10, borderRadius: 12,
                background: bg, color: fg, border: `1px solid ${bd}`, cursor: 'pointer', fontSize: 16, fontWeight: 600,
              }}>{opt}</button>
            )
          })}
        </>
      ) : (
        <>
          <div style={{ padding: '20px 16px', borderRadius: 16, background: cardBg, border: `1px solid ${border}`, textAlign: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: textColor }}>{q.latin}</div>
            {q.meaning && <div style={{ fontSize: 13, color: muted, marginTop: 4 }}>{q.meaning}</div>}
          </div>

          {/* Answer method: type with the keyboard, or draw the aksara by hand */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            {[['type', Keyboard, lang === 'en' ? 'Type' : 'Ketik'], ['draw', PenLine, lang === 'en' ? 'Draw' : 'Gambar']].map(([m, Icon, label], k) => (
              <button key={m} onClick={() => !checked && setWriteMethod(m)} disabled={checked} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 18px',
                border: `1px solid ${writeMethod === m ? blue : border}`,
                borderRadius: k === 0 ? '10px 0 0 10px' : '0 10px 10px 0',
                background: writeMethod === m ? blue : cardBg, color: writeMethod === m ? '#fff' : muted,
                cursor: checked ? 'default' : 'pointer', fontSize: 13, fontWeight: 600,
              }}><Icon size={15} /> {label}</button>
            ))}
          </div>

          {writeMethod === 'type' ? (
            <>
              <div style={{ minHeight: 60, padding: '14px 16px', marginBottom: 12, borderRadius: 12, border: `1px solid ${border}`, background: darkMode ? '#1a1a2e' : '#f8f9ff' }}>
                <span style={{ fontFamily: '"Noto Sans Balinese", serif', fontSize: 28, color: textColor }}>
                  {input || <span style={{ color: muted, fontSize: 15, fontFamily: 'system-ui' }}>{t.typeHint}</span>}
                </span>
              </div>
              <div style={{ padding: 14, borderRadius: 12, border: `1px solid ${border}`, background: darkMode ? '#161622' : '#fafafa', marginBottom: 14 }}>
                <BalineseKeyboard
                  onKeyPress={(c) => !checked && setInput(p => p + c)}
                  onBackspace={() => !checked && setInput(p => { const a = [...p]; a.pop(); return a.join('') })}
                  onSpace={() => !checked && setInput(p => p + '​')}
                  onClear={() => !checked && setInput('')}
                  darkMode={darkMode}
                  locale={locale}
                />
              </div>
              {!checked && (
                <button onClick={checkTyping} disabled={!norm(input)} style={{
                  width: '100%', padding: 14, borderRadius: 10, marginBottom: 8,
                  background: norm(input) ? blue : (darkMode ? '#333' : '#e0e0e0'),
                  color: norm(input) ? '#fff' : muted, border: 'none', cursor: norm(input) ? 'pointer' : 'default',
                  fontSize: 15, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}><Check size={16} /> {t.check}</button>
              )}
            </>
          ) : (
            <div key={q.latin} style={{ marginBottom: 8, pointerEvents: checked ? 'none' : 'auto', opacity: checked ? 0.7 : 1 }}>
              <HandGestureCanvas
                darkMode={darkMode}
                locale={locale}
                quizMode
                referenceText={q.latin}
                referenceBalinese={convertLatinToBalinese(q.latin)}
                onSolved={onDrawSolved}
              />
            </div>
          )}
        </>
      )}

      {/* Duolingo-style feedback bar — slides up from the bottom after each answer */}
      {answered && !result && (
        <>
          <div style={{ height: 104 }} />
          <div style={{
            position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 900,
            background: lastCorrect ? (darkMode ? '#0d2d1f' : '#d7f5e3') : (darkMode ? '#2d0a0a' : '#ffe3e3'),
            borderTop: `2px solid ${lastCorrect ? green : red}`,
            boxShadow: '0 -6px 24px rgba(0,0,0,0.14)',
            animation: 'aksaraSlideUp 0.22s ease-out',
          }}>
            <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, flexShrink: 0, borderRadius: '50%',
                background: lastCorrect ? green : red, color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {lastCorrect ? <CheckCircle size={26} /> : <XCircle size={26} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: lastCorrect ? green : red }}>
                  {lastCorrect ? t.correctMsg : t.notQuite}
                </div>
                {/* In writing mode always show the correct aksara (right or wrong) so
                    you can compare your writing; in reading mode only reveal on a miss. */}
                {(mode !== 'reading' || !lastCorrect) && (
                  <div style={{ fontSize: 14, color: textColor, marginTop: 2 }}>
                    {t.answer}{' '}
                    {mode === 'reading'
                      ? <b>{q.latin}</b>
                      : <span style={{ fontFamily: '"Noto Sans Balinese", serif', fontSize: 20 }}>{convertLatinToBalinese(q.latin)}</span>}
                  </div>
                )}
                {q.meaning && (
                  <div style={{ fontSize: 13, color: textColor, opacity: 0.8, marginTop: 2 }}>{q.meaning}</div>
                )}
              </div>
              <button onClick={next} style={{
                flexShrink: 0, padding: '12px 24px', borderRadius: 12,
                background: lastCorrect ? green : red, color: '#fff', border: 'none',
                cursor: 'pointer', fontSize: 15, fontWeight: 800,
              }}>{idx + 1 >= queue.length ? t.seeResult : t.next}</button>
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes aksaraSlideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>

      {result && (
        <ResultModal t={t} result={result} darkMode={darkMode} onClose={closeResult} />
      )}
    </div>
  )
}

function ResultModal({ t, result, darkMode, onClose }) {
  const { correct, score, wrong, passed, allDone, levelName } = result
  const textColor = darkMode ? '#e0e0e0' : '#1a1a1a'
  const cardBg = darkMode ? '#1e1e2e' : '#ffffff'
  const muted = darkMode ? '#888' : '#666'
  const title = allDone ? t.allDoneTitle : passed ? t.passTitle(levelName) : t.failTitle
  const body = allDone ? t.allDoneBody : passed ? t.passBody(score) : t.failBody

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 1000 }}>
      <div style={{ maxWidth: 380, width: '100%', background: cardBg, borderRadius: 20, padding: 24, textAlign: 'center', color: textColor }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.3, margin: '0 0 16px' }}>{title}</h3>
        {passed ? <Trophy size={64} color="#f59e0b" /> : <RotateCcw size={64} color={muted} />}
        <p style={{ fontSize: 13, color: muted, lineHeight: 1.4, margin: '16px 0 20px' }}>{body}</p>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: 22 }}>
          {[[CheckCircle, '#16a34a', correct, t.correct], [Trophy, '#f59e0b', score, t.score], [XCircle, '#dc2626', wrong, t.wrong]].map(([Icon, color, val, label], k) => (
            <div key={k}>
              <Icon size={22} color={color} />
              <div style={{ fontSize: 18, fontWeight: 800, color: textColor }}>{val}</div>
              <div style={{ fontSize: 11, color: muted }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => onClose(true)} style={{ flex: 1, padding: 12, borderRadius: 10, background: 'transparent', color: textColor, border: `1px solid ${darkMode ? '#444' : '#ccc'}`, cursor: 'pointer', fontWeight: 600 }}>{t.retry}</button>
          <button onClick={() => onClose(false)} style={{ flex: 1, padding: 12, borderRadius: 10, background: '#0d6efd', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>{t.detail}</button>
        </div>
      </div>
    </div>
  )
}
