import { useState } from 'react'

const cx = (...c) => c.filter(Boolean).join(' ')
const pick = (label, locale) => (label && typeof label === 'object' ? label[locale] ?? label.en ?? Object.values(label)[0] : label)

/**
 * A fixed-cell grid of glyphs: charts, quiz choices, reference tables.
 *  - `items`: [{ char, label? }]
 *  - `hit`: char (or array of chars) to highlight in turmeric
 *  - `onPick(item)`: makes cells buttons
 *  - `lang`: BCP-47 tag of the script, e.g. "ban-Bali"
 */
export function GlyphGrid({ items, hit, onPick, lang, showLabels = false, columns, className }) {
  const hits = new Set([].concat(hit ?? []))
  return (
    <div className={cx('glyphs', className)} lang={lang} style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}>
      {items.map((it, i) => {
        const inner = (
          <>
            <span className="glyphs__char">{it.char}</span>
            {showLabels && it.label && <span className="glyphs__label">{it.label}</span>}
          </>
        )
        const cls = cx('glyphs__cell', hits.has(it.char) && 'is-hit')
        return onPick
          ? <button key={i} type="button" className={cls} onClick={() => onPick(it)} aria-label={it.label || it.char}>{inner}</button>
          : <span key={i} className={cls} title={it.label}>{inner}</span>
      })}
    </div>
  )
}

/**
 * On-screen script keyboard for any layout in the shape
 * { groups: [{ id, label, keys: [{ char, label }] }], marks?: { label, keys } }
 * (see BALINESE_KEYBOARD in @aksara-bali/core). Group tabs switch the main
 * grid; the marks row stays visible so a consonant can take its vowel sign.
 */
export function AksaraKeyboard({ layout, onKey, onBackspace, onSpace, lang, locale = 'en', labels = {} }) {
  const [tab, setTab] = useState(0)
  const group = layout.groups[tab]
  const t = { space: 'Space', backspace: 'Delete', ...labels }
  return (
    <div className="akb">
      <div className="akb__tabs" role="tablist">
        {layout.groups.map((g, i) => (
          <button key={g.id} type="button" role="tab" aria-selected={i === tab} className={cx('akb__tab', i === tab && 'is-on')} onClick={() => setTab(i)}>
            {pick(g.label, locale)}
          </button>
        ))}
      </div>
      <GlyphGrid items={group.keys} onPick={k => onKey?.(k.char)} lang={lang} showLabels />
      {layout.marks && (
        <div className="akb__marks">
          <span className="akb__marks-label">{pick(layout.marks.label, locale)}</span>
          <GlyphGrid items={layout.marks.keys} onPick={k => onKey?.(k.char)} lang={lang} showLabels />
        </div>
      )}
      <div className="akb__row">
        {onSpace && <button type="button" className="akb__wide" onClick={onSpace}>{t.space}</button>}
        {onBackspace && <button type="button" className="akb__wide" onClick={onBackspace}>{t.backspace}</button>}
      </div>
    </div>
  )
}
