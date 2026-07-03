import React from 'react'
import { Lightbulb, Volume2 } from 'lucide-react'
import { speak, canSpeak } from '../../utils/speak'

const BALI = '"Noto Sans Balinese", serif'

// Turn a glyph label ("nga", "ng (cecek)", "◌ (adeg-adeg)") into speakable text:
// drop the parenthetical, strip combining diacritics and the ◌ placeholder.
const reading = (label) => {
  const base = label.split('(')[0].normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/◌/g, '').trim()
  if (base) return base
  const m = label.match(/\(([^)]+)\)/)
  return m ? m[1].replace(/◌/g, '').trim() : label
}

const SECTIONS = [
  {
    titleEn: 'Aksara Wianjana', titleId: 'Aksara Wianjana',
    subEn: 'Base consonants (each carries an inherent "a")', subId: 'Konsonan dasar (membawa vokal "a")',
    big: 34,
    glyphs: [['ᬳ', 'ha'], ['ᬦ', 'na'], ['ᬘ', 'ca'], ['ᬭ', 'ra'], ['ᬓ', 'ka'], ['ᬤ', 'da'],
      ['ᬢ', 'ta'], ['ᬲ', 'sa'], ['ᬯ', 'wa'], ['ᬮ', 'la'], ['ᬫ', 'ma'], ['ᬕ', 'ga'],
      ['ᬩ', 'ba'], ['ᬗ', 'nga'], ['ᬧ', 'pa'], ['ᬚ', 'ja'], ['ᬬ', 'ya'], ['ᬜ', 'nya']],
  },
  {
    titleEn: 'Aksara Mahaprana', titleId: 'Aksara Mahaprana',
    subEn: 'Aspirated / Sanskrit consonants', subId: 'Konsonan aspirasi / Sanskerta',
    big: 34,
    glyphs: [['ᬔ', 'kha'], ['ᬖ', 'gha'], ['ᬝ', 'tha'], ['ᬟ', 'dha'], ['ᬡ', 'ṇa'],
      ['ᬧ', 'pha'], ['ᬪ', 'bha'], ['ᬰ', 'śa'], ['ᬱ', 'ṣa']],
  },
  {
    titleEn: 'Aksara Suara', titleId: 'Aksara Suara',
    subEn: 'Independent vowels', subId: 'Huruf vokal mandiri',
    big: 34,
    glyphs: [['ᬅ', 'a'], ['ᬇ', 'i'], ['ᬉ', 'u'], ['ᬏ', 'e'], ['ᬑ', 'o']],
  },
  {
    titleEn: 'Pangangge Suara', titleId: 'Pangangge Suara',
    subEn: 'Vowel signs (attach to a consonant)', subId: 'Tanda vokal (menempel pada konsonan)',
    big: 30,
    glyphs: [['◌ᬶ', 'i (ulu)'], ['◌ᬸ', 'u (suku)'], ['◌ᬾ', 'e (taleng)'], ['◌ᭀ', 'o'], ['◌ᬵ', 'ā (tedung)']],
  },
  {
    titleEn: 'Pangangge Tengenan', titleId: 'Pangangge Tengenan',
    subEn: 'Final-sound signs', subId: 'Tanda penutup suku kata',
    big: 30,
    glyphs: [['◌ᬂ', 'ng (cecek)'], ['◌ᬄ', 'h (bisah)'], ['◌᭄', '◌ (adeg-adeg)']],
  },
  {
    titleEn: 'Angka', titleId: 'Angka',
    subEn: 'Balinese numerals', subId: 'Angka Bali',
    big: 32,
    glyphs: [['᭐', '0'], ['᭑', '1'], ['᭒', '2'], ['᭓', '3'], ['᭔', '4'],
      ['᭕', '5'], ['᭖', '6'], ['᭗', '7'], ['᭘', '8'], ['᭙', '9']],
  },
]

export default function AksaraReference({ darkMode, locale }) {
  const id = locale !== 'en'
  const text = darkMode ? '#e8e8e8' : '#1a1a1a'
  const muted = darkMode ? '#9a9a9a' : '#666'
  const tile = darkMode ? '#252535' : '#f7f7fb'
  const cardBg = darkMode ? '#1e1e2e' : '#ffffff'
  const border = darkMode ? '#333' : '#e8e8e8'
  const accent = '#0d6efd'

  const tips = [
    ['ᬓ', id ? "Tiap konsonan sudah membawa vokal 'a' (ᬓ = ka)." : "Each consonant carries an inherent 'a' (ᬓ = ka)."],
    ['ᬓᬶ', id ? "Tambah tanda vokal untuk mengubah vokalnya (ᬓ + ◌ᬶ = ki)." : "Add a vowel sign to change the vowel (ᬓ + ◌ᬶ = ki)."],
    ['ᬓ᭄', id ? "Adeg-adeg (◌᭄) menghapus bunyi 'a' (ᬓ᭄ = k)." : "Adeg-adeg (◌᭄) removes the 'a' sound (ᬓ᭄ = k)."],
    ['ᬩᬮᬶ', id ? "Gabungkan untuk menulis kata (ᬩᬮᬶ = bali)." : "Combine them to write words (ᬩᬮᬶ = bali)."],
  ]

  return (
    <div style={{ color: text }}>
      <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 700 }}>
        {id ? 'Referensi Aksara' : 'Aksara Reference'}
      </h2>
      <p style={{ margin: '0 0 12px', fontSize: '14px', color: muted, lineHeight: 1.5 }}>
        {id
          ? 'Sistem penulisan aksara Bali lengkap — pelajari tiap huruf.'
          : 'The full Balinese writing system — learn each letter.'}
      </p>
      {canSpeak() && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px',
          padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
          color: accent, background: darkMode ? 'rgba(13,110,253,0.12)' : '#eef4ff',
        }}>
          <Volume2 size={14} /> {id ? 'Ketuk huruf mana pun untuk mendengarnya' : 'Tap any letter to hear it'}
        </div>
      )}

      {/* How it works */}
      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '14px', padding: '16px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Lightbulb size={18} color={accent} />
          <span style={{ fontSize: '15px', fontWeight: 700 }}>{id ? 'Cara membaca' : 'How it works'}</span>
        </div>
        {tips.map(([g, t], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: i === tips.length - 1 ? 0 : '10px' }}>
            <span style={{
              flexShrink: 0, width: '54px', height: '40px', borderRadius: '8px',
              background: darkMode ? 'rgba(13,110,253,0.12)' : '#eef4ff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: BALI, fontSize: '22px',
            }}>{g}</span>
            <span style={{ fontSize: '13px', lineHeight: 1.4 }}>{t}</span>
          </div>
        ))}
      </div>

      {SECTIONS.map(s => (
        <div key={s.titleEn} style={{ marginBottom: '28px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 600 }}>{id ? s.titleId : s.titleEn}</h3>
          <p style={{ margin: '0 0 14px', fontSize: '13px', color: muted }}>{id ? s.subId : s.subEn}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(78px, 1fr))', gap: '12px' }}>
            {s.glyphs.map(([g, latin]) => (
              <button key={latin} type="button" onClick={() => speak(reading(latin))}
                title={id ? 'Ketuk untuk mendengar' : 'Tap to hear'}
                style={{
                  position: 'relative', background: tile, border: `1px solid transparent`,
                  borderRadius: '16px', padding: '16px 8px', textAlign: 'center', cursor: 'pointer',
                  transition: 'transform 0.12s, border-color 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'none' }}
              >
                {canSpeak() && <Volume2 size={12} color={muted} style={{ position: 'absolute', top: 8, right: 8 }} />}
                <div style={{ fontFamily: BALI, fontSize: `${s.big}px`, lineHeight: 1.1, color: text }}>{g}</div>
                <div style={{ marginTop: '8px', fontSize: '11px', color: muted }}>{latin}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
