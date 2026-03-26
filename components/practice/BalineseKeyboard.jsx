import React, { useState } from 'react'

const KEYBOARD_LAYOUT = {
  consonants: [
    // Hanacaraka order
    { char: '\u1B33', label: 'Ha', latin: 'ha' },
    { char: '\u1B26', label: 'Na', latin: 'na' },
    { char: '\u1B18', label: 'Ca', latin: 'ca' },
    { char: '\u1B2D', label: 'Ra', latin: 'ra' },
    { char: '\u1B13', label: 'Ka', latin: 'ka' },
    { char: '\u1B24', label: 'Da', latin: 'da' },
    { char: '\u1B22', label: 'Ta', latin: 'ta' },
    { char: '\u1B32', label: 'Sa', latin: 'sa' },
    { char: '\u1B2F', label: 'Wa', latin: 'wa' },
    { char: '\u1B2E', label: 'La', latin: 'la' },
    { char: '\u1B2B', label: 'Ma', latin: 'ma' },
    { char: '\u1B15', label: 'Ga', latin: 'ga' },
    { char: '\u1B29', label: 'Ba', latin: 'ba' },
    { char: '\u1B17', label: 'Nga', latin: 'nga' },
    { char: '\u1B27', label: 'Pa', latin: 'pa' },
    { char: '\u1B1A', label: 'Ja', latin: 'ja' },
    { char: '\u1B2C', label: 'Ya', latin: 'ya' },
    { char: '\u1B1C', label: 'Nya', latin: 'nya' },
    { char: '\u1B21', label: 'Nna', latin: 'nna' },
    { char: '\u1B1D', label: 'Tha', latin: 'tha' },
    // Extra consonants
    { char: '\u1B14', label: 'Kha', latin: 'kha' },
    { char: '\u1B16', label: 'Gha', latin: 'gha' },
    { char: '\u1B19', label: 'Cha', latin: 'cha' },
    { char: '\u1B1B', label: 'Jha', latin: 'jha' },
    { char: '\u1B1F', label: 'Dha', latin: 'dha' },
    { char: '\u1B28', label: 'Pha', latin: 'pha' },
    { char: '\u1B2A', label: 'Bha', latin: 'bha' },
    { char: '\u1B30', label: 'Sha', latin: 'sha' },
    { char: '\u1B31', label: 'Ssa', latin: 'ssa' },
  ],
  vowels: [
    { char: '\u1B05', label: 'A', latin: 'a' },
    { char: '\u1B06', label: 'Ā', latin: 'aa' },
    { char: '\u1B07', label: 'I', latin: 'i' },
    { char: '\u1B08', label: 'Ī', latin: 'ii' },
    { char: '\u1B09', label: 'U', latin: 'u' },
    { char: '\u1B0A', label: 'Ū', latin: 'uu' },
    { char: '\u1B0F', label: 'E', latin: 'e' },
    { char: '\u1B11', label: 'O', latin: 'o' },
  ],
  diacritics: [
    { char: '\u1B35', label: 'Taling (ā)', latin: '-ā', hint: 'vowel mark aa' },
    { char: '\u1B36', label: 'Ulu (i)', latin: '-i', hint: 'vowel mark i' },
    { char: '\u1B37', label: 'Ulu Sari (ī)', latin: '-ī', hint: 'vowel mark ii' },
    { char: '\u1B38', label: 'Suku (u)', latin: '-u', hint: 'vowel mark u' },
    { char: '\u1B39', label: 'Suku Ilut (ū)', latin: '-ū', hint: 'vowel mark uu' },
    { char: '\u1B3E', label: 'Taleng (e)', latin: '-e', hint: 'vowel mark e' },
    { char: '\u1B40', label: 'Taleng Tedung (o)', latin: '-o', hint: 'vowel mark o' },
    { char: '\u1B42', label: 'Pepet (ə)', latin: '-ə', hint: 'pepet/schwa' },
    { char: '\u1B44', label: 'Adeg-adeg', latin: '◌', hint: 'virama/killer stroke' },
    { char: '\u1B34', label: 'Cecek', latin: 'ng', hint: 'anusvara/nasal' },
    { char: '\u1B04', label: 'Bisah', latin: 'h', hint: 'visarga' },
  ],
  numbers: [
    { char: '\u1B50', label: '0' },
    { char: '\u1B51', label: '1' },
    { char: '\u1B52', label: '2' },
    { char: '\u1B53', label: '3' },
    { char: '\u1B54', label: '4' },
    { char: '\u1B55', label: '5' },
    { char: '\u1B56', label: '6' },
    { char: '\u1B57', label: '7' },
    { char: '\u1B58', label: '8' },
    { char: '\u1B59', label: '9' },
  ],
}

const TAB_LABELS = ['Aksara', 'Suara', 'Pangangge', 'Angka']
const TAB_KEYS = ['consonants', 'vowels', 'diacritics', 'numbers']
const TAB_SUBTITLES = ['Consonants', 'Vowels', 'Diacritical Marks', 'Numbers']

export default function BalineseKeyboard({ onKeyPress, onBackspace, onSpace, onClear, darkMode, locale }) {
  const lang = locale === 'en' ? 'en' : 'id'
  const kbLabels = {
    id: { space: '⎵ Spasi', del: '⌫ Hapus', clear: '✕ Bersihkan',
      l0: '🔤 Klik aksara untuk mengetik. Konsonan diikuti vokal membentuk suku kata.',
      l1: '🔡 Huruf suara mandiri — digunakan di awal kata atau setelah vokal.',
      l2: '◌ Tanda baca yang ditambahkan setelah konsonan untuk mengubah bunyinya.',
      l3: '🔢 Angka Bali — klik untuk memasukkan angka dalam aksara Bali.',
    },
    en: { space: '⎵ Space', del: '⌫ Delete', clear: '✕ Clear',
      l0: '🔤 Click a character to type. Consonant + vowel mark forms a syllable.',
      l1: '🔡 Independent vowels — used at the start of a word or after a vowel.',
      l2: '◌ Diacritical marks added after consonants to change their sound.',
      l3: '🔢 Balinese numerals — click to insert numbers in Balinese script.',
    },
  }
  const kb = kbLabels[lang]
  const [activeTab, setActiveTab] = useState(0)

  const currentKeys = KEYBOARD_LAYOUT[TAB_KEYS[activeTab]]

  const keyBg = darkMode ? '#2d2d2d' : '#f8f9fa'
  const keyBorder = darkMode ? '#444' : '#dee2e6'
  const keyHover = darkMode ? '#3d3d3d' : '#e9ecef'
  const tabActiveBg = '#0d6efd'

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {TAB_LABELS.map((label, idx) => (
          <button
            key={label}
            onClick={() => setActiveTab(idx)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: activeTab === idx ? '600' : '400',
              background: activeTab === idx ? tabActiveBg : keyBg,
              color: activeTab === idx ? '#fff' : (darkMode ? '#ccc' : '#555'),
              transition: 'all 0.15s',
              boxShadow: activeTab === idx ? '0 2px 6px rgba(13,110,253,0.3)' : 'none',
            }}
          >
            {label}
            <span style={{ fontSize: '11px', opacity: 0.7, marginLeft: '4px' }}>
              {TAB_SUBTITLES[idx]}
            </span>
          </button>
        ))}
      </div>

      {/* Keys grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: activeTab === 3 ? 'repeat(5, 1fr)' : 'repeat(auto-fill, minmax(72px, 1fr))',
        gap: '6px',
        marginBottom: '10px',
      }}>
        {currentKeys.map((key) => (
          <button
            key={key.char + key.label}
            onClick={() => onKeyPress(key.char)}
            title={key.hint || key.latin}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 6px 8px',
              borderRadius: '8px',
              border: `1px solid ${keyBorder}`,
              background: keyBg,
              cursor: 'pointer',
              transition: 'all 0.1s',
              minHeight: '60px',
              gap: '3px',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = keyHover; e.currentTarget.style.borderColor = '#0d6efd' }}
            onMouseLeave={e => { e.currentTarget.style.background = keyBg; e.currentTarget.style.borderColor = keyBorder }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.95)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            <span style={{
              fontFamily: '"Noto Sans Balinese", serif',
              fontSize: '22px',
              lineHeight: 1,
              color: darkMode ? '#e8e8e8' : '#1a1a1a',
            }}>
              {key.char}
            </span>
            <span style={{
              fontSize: '10px',
              color: darkMode ? '#888' : '#888',
              fontWeight: '500',
              letterSpacing: '0.3px',
              textAlign: 'center',
              lineHeight: 1.2,
            }}>
              {key.label}
            </span>
          </button>
        ))}
      </div>

      {/* Control keys */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onSpace?.()}
          style={{
            flex: 2,
            padding: '10px',
            borderRadius: '8px',
            border: `1px solid ${keyBorder}`,
            background: keyBg,
            cursor: 'pointer',
            fontSize: '13px',
            color: darkMode ? '#aaa' : '#666',
            minWidth: '80px',
          }}
          onMouseEnter={e => e.currentTarget.style.background = keyHover}
          onMouseLeave={e => e.currentTarget.style.background = keyBg}
        >
          {kb.space}
        </button>
        <button
          onClick={() => onBackspace?.()}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: `1px solid ${keyBorder}`,
            background: keyBg,
            cursor: 'pointer',
            fontSize: '13px',
            color: darkMode ? '#aaa' : '#666',
            minWidth: '70px',
          }}
          onMouseEnter={e => e.currentTarget.style.background = keyHover}
          onMouseLeave={e => e.currentTarget.style.background = keyBg}
        >
          {kb.del}
        </button>
        <button
          onClick={() => onClear?.()}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #dc3545',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#dc3545',
            minWidth: '70px',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#dc3545'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#dc3545' }}
        >
          {kb.clear}
        </button>
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '10px',
        padding: '8px 12px',
        borderRadius: '6px',
        background: darkMode ? '#1a2840' : '#f0f4ff',
        fontSize: '12px',
        color: darkMode ? '#8aabdc' : '#4a6fa5',
      }}>
        {activeTab === 0 && kb.l0}
        {activeTab === 1 && kb.l1}
        {activeTab === 2 && kb.l2}
        {activeTab === 3 && kb.l3}
      </div>
    </div>
  )
}
