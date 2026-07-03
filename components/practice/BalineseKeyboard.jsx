import React, { useState } from 'react'
import { Space, Delete, Trash2, Info, Grid3x3, Keyboard as KeyboardIcon } from 'lucide-react'

const KEYBOARD_LAYOUT = {
  consonants: [
    // Hanacaraka order
    { char: 'ᬳ', label: 'Ha', latin: 'ha' },
    { char: 'ᬦ', label: 'Na', latin: 'na' },
    { char: 'ᬘ', label: 'Ca', latin: 'ca' },
    { char: 'ᬭ', label: 'Ra', latin: 'ra' },
    { char: 'ᬓ', label: 'Ka', latin: 'ka' },
    { char: 'ᬤ', label: 'Da', latin: 'da' },
    { char: 'ᬢ', label: 'Ta', latin: 'ta' },
    { char: 'ᬲ', label: 'Sa', latin: 'sa' },
    { char: 'ᬯ', label: 'Wa', latin: 'wa' },
    { char: 'ᬮ', label: 'La', latin: 'la' },
    { char: 'ᬫ', label: 'Ma', latin: 'ma' },
    { char: 'ᬕ', label: 'Ga', latin: 'ga' },
    { char: 'ᬩ', label: 'Ba', latin: 'ba' },
    { char: 'ᬗ', label: 'Nga', latin: 'nga' },
    { char: 'ᬧ', label: 'Pa', latin: 'pa' },
    { char: 'ᬚ', label: 'Ja', latin: 'ja' },
    { char: 'ᬬ', label: 'Ya', latin: 'ya' },
    { char: 'ᬜ', label: 'Nya', latin: 'nya' },
    { char: 'ᬡ', label: 'Nna', latin: 'nna' },
    { char: 'ᬝ', label: 'Tha', latin: 'tha' },
    // Extra consonants
    { char: 'ᬔ', label: 'Kha', latin: 'kha' },
    { char: 'ᬖ', label: 'Gha', latin: 'gha' },
    { char: 'ᬙ', label: 'Cha', latin: 'cha' },
    { char: 'ᬛ', label: 'Jha', latin: 'jha' },
    { char: 'ᬟ', label: 'Dha', latin: 'dha' },
    { char: 'ᬨ', label: 'Pha', latin: 'pha' },
    { char: 'ᬪ', label: 'Bha', latin: 'bha' },
    { char: 'ᬰ', label: 'Sha', latin: 'sha' },
    { char: 'ᬱ', label: 'Ssa', latin: 'ssa' },
  ],
  vowels: [
    { char: 'ᬅ', label: 'A', latin: 'a' },
    { char: 'ᬆ', label: 'Ā', latin: 'aa' },
    { char: 'ᬇ', label: 'I', latin: 'i' },
    { char: 'ᬈ', label: 'Ī', latin: 'ii' },
    { char: 'ᬉ', label: 'U', latin: 'u' },
    { char: 'ᬊ', label: 'Ū', latin: 'uu' },
    { char: 'ᬏ', label: 'E', latin: 'e' },
    { char: 'ᬑ', label: 'O', latin: 'o' },
  ],
  numbers: [
    { char: '᭐', label: '0' },
    { char: '᭑', label: '1' },
    { char: '᭒', label: '2' },
    { char: '᭓', label: '3' },
    { char: '᭔', label: '4' },
    { char: '᭕', label: '5' },
    { char: '᭖', label: '6' },
    { char: '᭗', label: '7' },
    { char: '᭘', label: '8' },
    { char: '᭙', label: '9' },
  ],
}

// Pangangge (vowel marks + syllable-final signs) — always visible so you can
// tap a consonant then its vowel mark without switching tabs.
const PANGANGGE = [
  { char: 'ᬶ', label: 'i' },
  { char: 'ᬸ', label: 'u' },
  { char: 'ᬾ', label: 'e' },
  { char: 'ᭀ', label: 'o' },
  { char: 'ᬵ', label: 'ā' },
  { char: 'ᬷ', label: 'ī' },
  { char: 'ᬹ', label: 'ū' },
  { char: 'ᭂ', label: 'ə' },
  { char: '᭄', label: 'adeg' },
  { char: 'ᬂ', label: 'ng' },
  { char: 'ᬄ', label: 'h' },
]

// QWERTY layout mapped to base aksara. Keys without a Balinese equivalent
// (q, f, z, x) are shown dimmed so the familiar layout stays intact.
const QWERTY_ROWS = [
  [['q', null], ['w', 'ᬯ'], ['e', 'ᬏ'], ['r', 'ᬭ'], ['t', 'ᬢ'], ['y', 'ᬬ'], ['u', 'ᬉ'], ['i', 'ᬇ'], ['o', 'ᬑ'], ['p', 'ᬧ']],
  [['a', 'ᬅ'], ['s', 'ᬲ'], ['d', 'ᬤ'], ['f', null], ['g', 'ᬕ'], ['h', 'ᬳ'], ['j', 'ᬚ'], ['k', 'ᬓ'], ['l', 'ᬮ']],
  [['z', null], ['x', null], ['c', 'ᬘ'], ['v', 'ᬯ'], ['b', 'ᬩ'], ['n', 'ᬦ'], ['m', 'ᬫ']],
]

const TAB_LABELS = ['Aksara', 'Suara', 'Angka']
const TAB_KEYS = ['consonants', 'vowels', 'numbers']
const TAB_SUBTITLES = ['Consonants', 'Vowels', 'Numbers']

export default function BalineseKeyboard({ onKeyPress, onBackspace, onSpace, onClear, darkMode, locale }) {
  const lang = locale === 'en' ? 'en' : 'id'
  const kbLabels = {
    id: { space: 'Spasi', del: 'Hapus', clear: 'Bersihkan', pangangge: 'Pangangge', gridMode: 'Aksara', qwertyMode: 'QWERTY',
      l0: 'Klik aksara untuk mengetik. Konsonan diikuti tanda vokal (pangangge) membentuk suku kata.',
      l1: 'Huruf suara mandiri — digunakan di awal kata atau setelah vokal.',
      l3: 'Angka Bali — klik untuk memasukkan angka dalam aksara Bali.',
      lq: 'Tata letak QWERTY — tiap tombol memasukkan aksara dasarnya. Gunakan pangangge untuk vokal.',
    },
    en: { space: 'Space', del: 'Delete', clear: 'Clear', pangangge: 'Pangangge', gridMode: 'Aksara', qwertyMode: 'QWERTY',
      l0: 'Click a character to type. Consonant + vowel mark (pangangge) forms a syllable.',
      l1: 'Independent vowels — used at the start of a word or after a vowel.',
      l3: 'Balinese numerals — click to insert numbers in Balinese script.',
      lq: 'QWERTY layout — each key inserts its base aksara. Use the pangangge row for vowels.',
    },
  }
  const kb = kbLabels[lang]
  const [mode, setMode] = useState('grid') // 'grid' (aksara tabs) | 'qwerty'
  const [activeTab, setActiveTab] = useState(0)

  const currentKeys = KEYBOARD_LAYOUT[TAB_KEYS[activeTab]]

  const keyBg = darkMode ? '#2d2d2d' : '#f8f9fa'
  const keyBorder = darkMode ? '#444' : '#dee2e6'
  const keyHover = darkMode ? '#3d3d3d' : '#e9ecef'
  const inkColor = darkMode ? '#e8e8e8' : '#1a1a1a'
  const subColor = darkMode ? '#888' : '#888'
  const accent = '#0d6efd'

  const keyHoverOn = (e) => { e.currentTarget.style.background = keyHover; e.currentTarget.style.borderColor = accent }
  const keyHoverOff = (e) => { e.currentTarget.style.background = keyBg; e.currentTarget.style.borderColor = keyBorder }

  // A single aksara key (glyph + small latin label).
  const glyphKey = (char, label, key) => (
    <button
      key={key}
      onClick={() => onKeyPress(char)}
      title={label}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '10px 6px 8px', borderRadius: '8px', border: `1px solid ${keyBorder}`,
        background: keyBg, cursor: 'pointer', transition: 'all 0.1s', minHeight: '60px', gap: '3px',
      }}
      onMouseEnter={keyHoverOn}
      onMouseLeave={keyHoverOff}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.95)' }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      <span style={{ fontFamily: '"Noto Sans Balinese", serif', fontSize: '22px', lineHeight: 1, color: inkColor }}>{char}</span>
      <span style={{ fontSize: '10px', color: subColor, fontWeight: '500', letterSpacing: '0.3px', textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
    </button>
  )

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Mode toggle: Aksara grid vs QWERTY */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        {[['grid', Grid3x3, kb.gridMode], ['qwerty', KeyboardIcon, kb.qwertyMode]].map(([m, Icon, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px',
              fontWeight: mode === m ? '600' : '400',
              border: `1px solid ${mode === m ? accent : keyBorder}`,
              background: mode === m ? accent : 'transparent',
              color: mode === m ? '#fff' : (darkMode ? '#ccc' : '#555'),
              transition: 'all 0.15s',
            }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Pangangge row — above the consonants, kept on a single line */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: subColor, fontWeight: 600, marginBottom: '4px', letterSpacing: '0.3px' }}>
          {kb.pangangge}
        </div>
        <div style={{ display: 'flex', gap: '5px', overflowX: 'auto' }}>
          {PANGANGGE.map(({ char, label }) => (
            <button
              key={char}
              onClick={() => onKeyPress(char)}
              title={label}
              style={{
                flex: '1 0 40px', minWidth: '40px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '6px 2px', borderRadius: '8px', border: `1px solid ${keyBorder}`,
                background: darkMode ? '#20283a' : '#eef4ff', cursor: 'pointer', transition: 'all 0.1s', minHeight: '48px', gap: '2px',
              }}
              onMouseEnter={keyHoverOn}
              onMouseLeave={e => { e.currentTarget.style.background = darkMode ? '#20283a' : '#eef4ff'; e.currentTarget.style.borderColor = keyBorder }}
            >
              <span style={{ fontFamily: '"Noto Sans Balinese", serif', fontSize: '20px', lineHeight: 1, color: inkColor }}>{'◌' + char}</span>
              <span style={{ fontSize: '10px', color: subColor, fontWeight: '500' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {mode === 'grid' ? (
        <>
          {/* Sub-tabs (pangangge is now a persistent row below, not a tab) */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {TAB_LABELS.map((label, idx) => (
              <button
                key={label}
                onClick={() => setActiveTab(idx)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px',
                  fontWeight: activeTab === idx ? '600' : '400',
                  background: activeTab === idx ? accent : keyBg,
                  color: activeTab === idx ? '#fff' : (darkMode ? '#ccc' : '#555'),
                  transition: 'all 0.15s',
                  boxShadow: activeTab === idx ? '0 2px 6px rgba(13,110,253,0.3)' : 'none',
                }}
              >
                {label}
                <span style={{ fontSize: '11px', opacity: 0.7, marginLeft: '4px' }}>{TAB_SUBTITLES[idx]}</span>
              </button>
            ))}
          </div>

          {/* Keys grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: activeTab === 2 ? 'repeat(5, 1fr)' : 'repeat(auto-fill, minmax(72px, 1fr))',
            gap: '6px', marginBottom: '10px',
          }}>
            {currentKeys.map((key) => glyphKey(key.char, key.label, key.char + key.label))}
          </div>
        </>
      ) : (
        /* QWERTY layout */
        <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {QWERTY_ROWS.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: '5px', justifyContent: 'center', paddingLeft: ri === 1 ? '16px' : ri === 2 ? '32px' : 0 }}>
              {row.map(([letter, char]) => (
                <button
                  key={letter}
                  onClick={() => char && onKeyPress(char)}
                  disabled={!char}
                  title={letter}
                  style={{
                    flex: '1 1 0', minWidth: 0, maxWidth: '56px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '8px 2px 6px', borderRadius: '8px', border: `1px solid ${keyBorder}`,
                    background: keyBg, cursor: char ? 'pointer' : 'default', opacity: char ? 1 : 0.4,
                    transition: 'all 0.1s', minHeight: '52px', gap: '2px',
                  }}
                  onMouseEnter={e => { if (char) keyHoverOn(e) }}
                  onMouseLeave={e => { if (char) keyHoverOff(e) }}
                  onMouseDown={e => { if (char) e.currentTarget.style.transform = 'scale(0.95)' }}
                  onMouseUp={e => { if (char) e.currentTarget.style.transform = 'scale(1)' }}
                >
                  <span style={{ fontFamily: '"Noto Sans Balinese", serif', fontSize: '20px', lineHeight: 1, color: inkColor, minHeight: '20px' }}>{char || ''}</span>
                  <span style={{ fontSize: '11px', color: subColor, fontWeight: '600', textTransform: 'uppercase' }}>{letter}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Control keys */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onSpace?.()}
          style={{ flex: 2, padding: '10px', borderRadius: '8px', border: `1px solid ${keyBorder}`, background: keyBg, cursor: 'pointer', fontSize: '13px', color: darkMode ? '#aaa' : '#666', minWidth: '80px' }}
          onMouseEnter={e => e.currentTarget.style.background = keyHover}
          onMouseLeave={e => e.currentTarget.style.background = keyBg}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Space size={15} /> {kb.space}</span>
        </button>
        <button
          onClick={() => onBackspace?.()}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${keyBorder}`, background: keyBg, cursor: 'pointer', fontSize: '13px', color: darkMode ? '#aaa' : '#666', minWidth: '70px' }}
          onMouseEnter={e => e.currentTarget.style.background = keyHover}
          onMouseLeave={e => e.currentTarget.style.background = keyBg}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Delete size={15} /> {kb.del}</span>
        </button>
        <button
          onClick={() => onClear?.()}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #dc3545', background: 'transparent', cursor: 'pointer', fontSize: '13px', color: '#dc3545', minWidth: '70px' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#dc3545'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#dc3545' }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Trash2 size={15} /> {kb.clear}</span>
        </button>
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '10px', padding: '8px 12px', borderRadius: '6px',
        background: darkMode ? '#1a2840' : '#f0f4ff', fontSize: '12px',
        color: darkMode ? '#8aabdc' : '#4a6fa5', display: 'flex', alignItems: 'flex-start', gap: '8px',
      }}>
        <Info size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
        <span>
          {mode === 'qwerty' ? kb.lq
            : activeTab === 0 ? kb.l0
            : activeTab === 1 ? kb.l1
            : kb.l3}
        </span>
      </div>
    </div>
  )
}
