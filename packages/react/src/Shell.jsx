import { useState } from 'react'

const cx = (...c) => c.filter(Boolean).join(' ')

const Icon = ({ d }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true"><path d={d} /></svg>
)
const MENU = 'M4 7h16M4 12h16M4 17h16'
const CLOSE = 'M6 6l12 12M18 6L6 18'

/** The braided red-white-black rule. */
export function Thread({ className }) {
  return <div className={cx('thread', className)} aria-hidden="true" />
}

/**
 * Black site header with the thread on top.
 *  - `icon`: URL of the app icon, shown as the mark (optional)
 *  - `mark`: the script wordmark (e.g. "ᬅᬓ᭄ᬱᬭ"), shown in turmeric when there is no icon
 *  - `name`: the Latin product name
 *  - `links`: [{ href, label }], `active`: the href to highlight
 *  - `tools`: right-hand controls (language, theme, sign-in)
 * Below 860px the links move into a drawer behind a menu button.
 */
export function SiteHeader({ icon, mark, name, href = '/', links = [], active, tools, menuLabel = 'Menu' }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <Thread />
      <div className="site-header__bar">
        <a href={href} className="site-brand" aria-label={name}>
          {icon
            ? <img src={icon} alt="" width="30" height="30" className="site-brand__icon" />
            : mark && <span className="site-brand__aksara" aria-hidden="true">{mark}</span>}
          <span className="site-brand__name">{name}</span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          {links.map(l => (
            <a key={l.href} href={l.href} className={cx('site-nav__link', l.href === active && 'is-active')} aria-current={l.href === active ? 'page' : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="site-tools">
          {tools}
          {links.length > 0 && (
            <button type="button" className="site-tool site-burger" aria-label={menuLabel} aria-expanded={open} onClick={() => setOpen(o => !o)}>
              <Icon d={open ? CLOSE : MENU} />
            </button>
          )}
        </div>
      </div>
      {open && (
        <div className="site-drawer">
          {links.map(l => (
            <a key={l.href} href={l.href} className={cx('site-drawer__link', l.href === active && 'is-active')}>{l.label}</a>
          ))}
        </div>
      )}
    </header>
  )
}

/** Square outlined header control (language, theme). */
export function HeaderTool({ children, ...rest }) {
  return <button type="button" className="site-tool" {...rest}>{children}</button>
}

/** Black footer with the thread on top. Children go in the inner frame. */
export function SiteFooter({ children }) {
  return (
    <footer className="site-footer">
      <Thread />
      <div className="site-footer__inner">{children}</div>
    </footer>
  )
}

/** Page frame: max width, gutters, and the left title + right lede head. */
export function Page({ title, lede, children }) {
  return (
    <div className="page">
      {(title || lede) && (
        <div className="page-head">
          {title && <h1 className="page-title">{title}</h1>}
          {lede && <p className="page-lede">{lede}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

/** Black band with a heading, a line of copy and call-to-action links. */
export function Band({ title, children, actions }) {
  return (
    <section className="app-band">
      <div>
        <h2 className="app-band__title">{title}</h2>
        {children && <p>{children}</p>}
      </div>
      {actions && <div className="app-band__ctas">{actions}</div>}
    </section>
  )
}
