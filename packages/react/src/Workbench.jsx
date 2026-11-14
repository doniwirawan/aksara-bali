// The converter workbench: a source pane and a script pane joined by the
// braided seam. Pure markup over @aksara-bali/design's .bench classes, so the
// conversion logic, state and actions stay in the app.

const cx = (...c) => c.filter(Boolean).join(' ')

/** Two-pane frame. `pulled` replays the seam animation (pass true while output exists). */
export function Workbench({ pulled = false, className, children, ...rest }) {
  return <div className={cx('bench', pulled && 'is-pulled', className)} {...rest}>{children}</div>
}

/** The braided seam between the panes (vertical on desktop, horizontal on phones). */
export function BenchSeam() {
  return <div className="bench__seam" aria-hidden="true" />
}

/**
 * One side of the workbench. `script` paints it as the red script field.
 * `label` is the pane heading; `aside` sits at the right of the label bar.
 */
export function BenchPane({ script = false, label, labelFor, aside, className, children, ...rest }) {
  return (
    <div className={cx('bench__pane', script && 'is-script', className)} {...rest}>
      {(label || aside) && (
        <div className="bench__label">
          {labelFor ? <label htmlFor={labelFor} style={{ margin: 0 }}>{label}</label> : <span>{label}</span>}
          {aside}
        </div>
      )}
      {children}
    </div>
  )
}

/** Source textarea. `script` sets it in the script face (for reverse mode). */
export function BenchInput({ script = false, className, ...rest }) {
  return <textarea className={cx('bench__input', script && 'is-aksara', className)} spellCheck={false} autoCapitalize="none" {...rest} />
}

/**
 * Converted output. Empty output shows `placeholder`. `latin` sets Latin type
 * instead of the script face; `lang` should be the script's BCP-47 tag.
 */
export function BenchOutput({ value, placeholder, latin = false, lang, className }) {
  return (
    <div
      key={value}
      className={cx('bench__output', latin && 'is-latin', value ? 'is-fresh' : 'is-empty', className)}
      lang={value && !latin ? lang : undefined}
      aria-live="polite"
    >
      {value || placeholder}
    </div>
  )
}

/** A row of tools under the input (helper keys, chips). */
export function BenchTools({ children }) {
  return <div className="bench__tools">{children}</div>
}

/** Small square key that inserts a character, e.g. a diacritic helper. */
export function BenchKey({ children, ...rest }) {
  return <button type="button" className="bench__key" {...rest}>{children}</button>
}

/** Outlined chip button for secondary tools. `push` moves it to the row's end. */
export function BenchChip({ push = false, className, children, ...rest }) {
  return <button type="button" className={cx('bench__chip', push && 'is-push', className)} {...rest}>{children}</button>
}

/** Compact icon button for the label bar. Always give it an aria-label. */
export function BenchIcon({ children, ...rest }) {
  return <button type="button" className="bench__icon" {...rest}>{children}</button>
}

/** Action bar along the bottom of the script pane. */
export function BenchActions({ children }) {
  return <div className="bench__actions">{children}</div>
}

/** One action cell. `primary` is the light cell (use it for Copy). */
export function BenchAction({ primary = false, className, children, ...rest }) {
  return <button type="button" className={cx('bench__act', primary && 'is-primary', className)} {...rest}>{children}</button>
}

/** Outlined control in the script pane's label bar, e.g. the direction flip. */
export function BenchFlip({ children, ...rest }) {
  return <button type="button" className="bench__flip" {...rest}>{children}</button>
}
