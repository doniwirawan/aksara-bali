import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { convertLatinToBalinese, QUIZ_WORDS } from '../../utils/balineseConverter'
import BalineseKeyboard from './BalineseKeyboard'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const DIFFICULTY_COLORS = {
  easy: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  medium: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  hard: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
}

const DIFFICULTY_DARK = {
  easy: { bg: '#0d2d1f', text: '#34d399', border: '#065f46' },
  medium: { bg: '#2d2000', text: '#fbbf24', border: '#92400e' },
  hard: { bg: '#2d0a0a', text: '#f87171', border: '#991b1b' },
}

export default function QuizMode({ darkMode, locale }) {
  const lang = locale === 'en' ? 'en' : 'id'
  const tr = {
    id: {
      all: 'Semua', easy: 'Mudah', medium: 'Sedang', hard: 'Sulit',
      prompt: 'Tulis kata ini dalam Aksara Bali:',
      correctAnswer: 'Jawaban yang benar:', answer: 'Jawaban:',
      inputPlaceholder: 'Ketik menggunakan papan ketik di bawah...',
      checkBtn: '✓ Periksa Jawaban',
      showHint: '💡 Tampilkan', hideHint: '🙈 Sembunyikan',
      finishBtn: '🏁 Lihat Hasil', nextBtn: 'Lanjut →',
      restartTitle: 'Mulai ulang',
      doneTitle: 'Kuis Selesai!',
      msgPerfect: 'Bagus sekali! Kamu sudah mahir.',
      msgGood: 'Bagus! Terus berlatih.',
      msgKeepGoing: 'Terus berlatih untuk menjadi lebih baik.',
      score: 'Skor', accuracy: 'Akurasi', bestStreak: 'Streak Terbaik',
      weakWords: '📖 Kata yang perlu dilatih lagi:',
      restartBtn: '🔄 Mulai Lagi',
      diffEasy: 'Mudah', diffMedium: 'Sedang', diffHard: 'Sulit',
    },
    en: {
      all: 'All', easy: 'Easy', medium: 'Medium', hard: 'Hard',
      prompt: 'Write this word in Balinese Script:',
      correctAnswer: 'Correct answer:', answer: 'Answer:',
      inputPlaceholder: 'Type using the keyboard below...',
      checkBtn: '✓ Check Answer',
      showHint: '💡 Show hint', hideHint: '🙈 Hide hint',
      finishBtn: '🏁 See Results', nextBtn: 'Next →',
      restartTitle: 'Restart quiz',
      doneTitle: 'Quiz Complete!',
      msgPerfect: 'Excellent! You\'ve mastered these.',
      msgGood: 'Good job! Keep practising.',
      msgKeepGoing: 'Keep practising to improve.',
      score: 'Score', accuracy: 'Accuracy', bestStreak: 'Best Streak',
      weakWords: '📖 Words that need more practice:',
      restartBtn: '🔄 Restart',
      diffEasy: 'Easy', diffMedium: 'Medium', diffHard: 'Hard',
    },
  }
  const t = tr[lang]
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [filter, setFilter] = useState('all')
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [wrongWords, setWrongWords] = useState([])
  const [resultHistory, setResultHistory] = useState([])
  const [shuffledWords, setShuffledWords] = useState([])

  // Shuffle words on mount and on filter change
  const baseWords = useMemo(() => {
    if (filter === 'all') return QUIZ_WORDS
    return QUIZ_WORDS.filter(w => w.difficulty === filter)
  }, [filter])

  useEffect(() => {
    setShuffledWords(shuffle(baseWords))
    setCurrentIdx(0)
    setUserInput('')
    setAnswered(false)
    setShowAnswer(false)
  }, [filter])

  // Initialize on first render
  useEffect(() => {
    setShuffledWords(shuffle(QUIZ_WORDS))
  }, [])

  const filteredWords = shuffledWords.length > 0 ? shuffledWords : baseWords

  const currentWord = filteredWords[currentIdx % filteredWords.length]
  const expectedBalinese = useMemo(() => convertLatinToBalinese(currentWord.latin), [currentWord])

  const handleKeyPress = useCallback((char) => {
    if (answered) return
    setUserInput(prev => prev + char)
  }, [answered])

  const handleBackspace = useCallback(() => {
    if (answered) return
    setUserInput(prev => {
      // Properly handle multi-codepoint chars (Balinese combining chars)
      const arr = [...prev]
      arr.pop()
      return arr.join('')
    })
  }, [answered])

  const handleSpace = useCallback(() => {
    if (answered) return
    setUserInput(prev => prev + '\u200B')
  }, [answered])

  const handleClear = useCallback(() => {
    if (answered) return
    setUserInput('')
  }, [answered])

  const checkAnswer = useCallback(() => {
    if (!userInput || answered) return
    // Normalize: remove zero-width spaces for comparison
    const normalize = (s) => s.replace(/\u200B/g, '').trim()
    const isCorrect = normalize(userInput) === normalize(expectedBalinese)

    setAnswered(isCorrect ? 'correct' : 'wrong')
    setQuestionsAnswered(prev => prev + 1)
    setResultHistory(prev => [...prev, { word: currentWord, correct: isCorrect, userAnswer: userInput, expected: expectedBalinese }])

    if (isCorrect) {
      setScore(prev => prev + 1)
      const newStreak = streak + 1
      setStreak(newStreak)
      setMaxStreak(prev => Math.max(prev, newStreak))
    } else {
      setStreak(0)
      setWrongWords(prev => [...prev, currentWord])
    }
  }, [userInput, answered, expectedBalinese, streak, currentWord])

  const nextWord = useCallback(() => {
    const nextIdx = currentIdx + 1
    if (nextIdx >= filteredWords.length) {
      setQuizComplete(true)
      // Log quiz result to Supabase (fire-and-forget)
      const finalScore = score + (answered && !wrongWords.includes(currentWord) ? 0 : 0) // score already updated
      const finalAccuracy = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0
      fetch('/api/quiz-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score,
          total: filteredWords.length,
          accuracy: finalAccuracy,
          maxStreak,
          difficulty: filter,
        }),
      }).catch(() => {})
      return
    }
    setCurrentIdx(nextIdx)
    setUserInput('')
    setAnswered(false)
    setShowAnswer(false)
  }, [currentIdx, filteredWords.length])

  const restartQuiz = () => {
    setShuffledWords(shuffle(baseWords))
    setCurrentIdx(0)
    setUserInput('')
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setAnswered(false)
    setShowAnswer(false)
    setQuestionsAnswered(0)
    setQuizComplete(false)
    setWrongWords([])
    setResultHistory([])
  }

  const textColor = darkMode ? '#e0e0e0' : '#1a1a1a'
  const cardBg = darkMode ? '#1e1e2e' : '#ffffff'
  const borderColor = darkMode ? '#333' : '#e0e0e0'
  const mutedColor = darkMode ? '#888' : '#666'

  const diffColors = darkMode ? DIFFICULTY_DARK : DIFFICULTY_COLORS
  const diff = diffColors[currentWord?.difficulty] || diffColors.easy

  const accuracy = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0
  const progress = ((currentIdx) / filteredWords.length) * 100

  if (quizComplete) {
    return (
      <div style={{ color: textColor, maxWidth: 600, margin: '0 auto' }}>
        {/* Results card */}
        <div style={{ textAlign: 'center', padding: '40px 20px', borderRadius: '16px', background: cardBg, border: `1px solid ${borderColor}`, marginBottom: '24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>
            {accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👏' : '📚'}
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            {t.doneTitle}
          </h2>
          <p style={{ color: mutedColor, marginBottom: '24px' }}>
            {accuracy >= 80 ? t.msgPerfect : accuracy >= 60 ? t.msgGood : t.msgKeepGoing}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
            {[
              { label: t.score, value: `${score}/${questionsAnswered}`, icon: '✅' },
              { label: t.accuracy, value: `${accuracy}%`, icon: '🎯' },
              { label: t.bestStreak, value: maxStreak, icon: '🔥' },
            ].map(stat => (
              <div key={stat.label} style={{ padding: '16px', borderRadius: '10px', background: darkMode ? '#252535' : '#f8f9fa', border: `1px solid ${borderColor}` }}>
                <div style={{ fontSize: '24px' }}>{stat.icon}</div>
                <div style={{ fontSize: '22px', fontWeight: '700', color: '#0d6efd' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: mutedColor }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {wrongWords.length > 0 && (
            <div style={{ textAlign: 'left', padding: '16px', borderRadius: '10px', background: darkMode ? '#2d1010' : '#fff5f5', border: `1px solid ${darkMode ? '#5a1a1a' : '#fecaca'}`, marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#dc3545' }}>
                {t.weakWords}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[...new Set(wrongWords.map(w => w.latin))].map(latin => {
                  const w = QUIZ_WORDS.find(q => q.latin === latin)
                  return (
                    <span key={latin} style={{
                      padding: '4px 10px', borderRadius: '12px',
                      background: darkMode ? '#3a1a1a' : '#fee2e2',
                      fontSize: '13px', color: darkMode ? '#f87171' : '#991b1b',
                    }}>
                      {latin} → <span style={{ fontFamily: '"Noto Sans Balinese", serif' }}>{convertLatinToBalinese(latin)}</span>
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          <button
            onClick={restartQuiz}
            style={{
              padding: '12px 32px', borderRadius: '10px',
              background: '#0d6efd', color: '#fff', border: 'none',
              cursor: 'pointer', fontSize: '16px', fontWeight: '600',
            }}
          >
            {t.restartBtn}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ color: textColor }}>
      {/* Score + filter bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Score */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ padding: '4px 12px', borderRadius: '12px', background: darkMode ? '#1e3a1e' : '#d1fae5', color: '#065f46', fontSize: '13px', fontWeight: '600' }}>
            ✅ {score}
          </span>
          {streak > 1 && (
            <span style={{ padding: '4px 12px', borderRadius: '12px', background: darkMode ? '#2d1500' : '#fff3e0', color: '#e65100', fontSize: '13px', fontWeight: '600' }}>
              🔥 {streak}x
            </span>
          )}
          <span style={{ padding: '4px 12px', borderRadius: '12px', background: darkMode ? '#252535' : '#f0f0f0', color: mutedColor, fontSize: '13px' }}>
            {currentIdx + 1} / {filteredWords.length}
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Difficulty filter */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {['all', 'easy', 'medium', 'hard'].map(d => (
            <button
              key={d}
              onClick={() => { setFilter(d); setCurrentIdx(0); setUserInput(''); setAnswered(false); setShowAnswer(false) }}
              style={{
                padding: '4px 10px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                fontSize: '12px', fontWeight: filter === d ? '600' : '400',
                background: filter === d ? '#0d6efd' : (darkMode ? '#252535' : '#f0f0f0'),
                color: filter === d ? '#fff' : mutedColor,
              }}
            >
              {d === 'all' ? t.all : d === 'easy' ? t.easy : d === 'medium' ? t.medium : t.hard}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', borderRadius: '2px', background: darkMode ? '#333' : '#e0e0e0', marginBottom: '20px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: '#0d6efd', borderRadius: '2px', transition: 'width 0.3s' }} />
      </div>

      {/* Word card */}
      <div style={{ padding: '28px', borderRadius: '16px', background: cardBg, border: `1px solid ${borderColor}`, marginBottom: '16px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{
            padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '600',
            background: diff.bg, color: diff.text, border: `1px solid ${diff.border}`,
          }}>
            {currentWord.difficulty === 'easy' ? t.diffEasy : currentWord.difficulty === 'medium' ? t.diffMedium : t.diffHard}
          </span>
          <span style={{ fontSize: '11px', color: mutedColor, padding: '3px 10px', borderRadius: '10px', background: darkMode ? '#252535' : '#f0f0f0' }}>
            {currentWord.category}
          </span>
        </div>

        <div style={{ fontSize: '13px', color: mutedColor, marginBottom: '8px' }}>
          {t.prompt}
        </div>
        <div style={{ fontSize: '42px', fontWeight: '700', letterSpacing: '2px', color: '#0d6efd', marginBottom: '8px' }}>
          {currentWord.latin}
        </div>
        <div style={{ fontSize: '14px', color: mutedColor }}>
          {currentWord.meaning}
        </div>

        {showAnswer && (
          <div style={{ marginTop: '16px', padding: '12px', borderRadius: '10px', background: darkMode ? '#1a3a1a' : '#f0fff4', border: `1px solid ${darkMode ? '#2d5a2d' : '#bbf7d0'}` }}>
            <div style={{ fontSize: '12px', color: '#16a34a', marginBottom: '6px' }}>{t.correctAnswer}</div>
            <div style={{ fontFamily: '"Noto Sans Balinese", serif', fontSize: '30px', color: '#16a34a' }}>
              {expectedBalinese}
            </div>
          </div>
        )}
      </div>

      {/* User input display */}
      <div style={{
        minHeight: '70px', padding: '16px 20px', marginBottom: '14px',
        borderRadius: '12px', border: `2px solid ${answered === 'correct' ? '#22c55e' : answered === 'wrong' ? '#ef4444' : '#0d6efd'}`,
        background: answered === 'correct' ? (darkMode ? '#0d2d0d' : '#f0fff4') : answered === 'wrong' ? (darkMode ? '#2d0d0d' : '#fff5f5') : (darkMode ? '#1a1a2e' : '#f8f9ff'),
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: '"Noto Sans Balinese", serif', fontSize: '28px', color: answered === 'correct' ? '#22c55e' : answered === 'wrong' ? '#ef4444' : textColor }}>
          {userInput || <span style={{ color: mutedColor, fontSize: '16px', fontFamily: 'system-ui' }}>{t.inputPlaceholder}</span>}
        </span>
        {answered === 'correct' && <span style={{ fontSize: '24px' }}>✅</span>}
        {answered === 'wrong' && (
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '20px' }}>❌</span>
            <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{t.answer} <span style={{ fontFamily: '"Noto Sans Balinese", serif' }}>{expectedBalinese}</span></div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {!answered ? (
          <>
            <button
              onClick={checkAnswer}
              disabled={!userInput}
              style={{
                flex: 2, padding: '12px', borderRadius: '10px',
                background: userInput ? '#0d6efd' : (darkMode ? '#333' : '#e0e0e0'),
                color: userInput ? '#fff' : mutedColor,
                border: 'none', cursor: userInput ? 'pointer' : 'default',
                fontSize: '15px', fontWeight: '600', minWidth: '140px',
                transition: 'all 0.15s',
              }}
            >
              {t.checkBtn}
            </button>
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              style={{
                flex: 1, padding: '12px', borderRadius: '10px',
                background: 'transparent', color: mutedColor,
                border: `1px solid ${borderColor}`,
                cursor: 'pointer', fontSize: '14px', minWidth: '100px',
              }}
            >
              {showAnswer ? t.hideHint : t.showHint}
            </button>
          </>
        ) : (
          <button
            onClick={nextWord}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px',
              background: '#0d6efd', color: '#fff',
              border: 'none', cursor: 'pointer',
              fontSize: '15px', fontWeight: '600',
            }}
          >
            {currentIdx + 1 >= filteredWords.length ? t.finishBtn : t.nextBtn}
          </button>
        )}

        <button
          onClick={restartQuiz}
          style={{
            padding: '12px 16px', borderRadius: '10px',
            background: 'transparent', color: mutedColor,
            border: `1px solid ${borderColor}`,
            cursor: 'pointer', fontSize: '14px',
          }}
          title={t.restartTitle}
        >
          🔄
        </button>
      </div>

      {/* Keyboard */}
      <div style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: darkMode ? '#161622' : '#fafafa' }}>
        <BalineseKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onSpace={handleSpace}
          onClear={handleClear}
          darkMode={darkMode}
          locale={locale}
        />
      </div>
    </div>
  )
}
