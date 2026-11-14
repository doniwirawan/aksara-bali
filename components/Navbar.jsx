import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import { Moon, Sun, User, BarChart3, Menu, X, LogOut } from 'lucide-react'

const NAV_LINKS = [
  { href: '/', label: 'Konverter', labelEn: 'Converter' },
  { href: '/translate', label: 'Kamus', labelEn: 'Dictionary' },
  { href: '/practice', label: 'Latihan', labelEn: 'Practice' },
  { href: '/blog', label: 'Blog', labelEn: 'Blog' },
  { href: '/faq', label: 'FAQ', labelEn: 'FAQ' },
]

export default function Navbar({ darkMode, onToggleDarkMode, locale, onToggleLocale }) {
  const router = useRouter()
  const { user, signOut, isAdmin } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const currentPath = router.pathname
  const en = locale === 'en'

  useEffect(() => { setMenuOpen(false) }, [router.pathname])

  // Every page owns its darkMode state; the header keeps the document's
  // colour tokens in step with it.
  useEffect(() => {
    if (darkMode) document.documentElement.setAttribute('data-bs-theme', 'dark')
    else document.documentElement.removeAttribute('data-bs-theme')
  }, [darkMode])

  const isActive = (href) => {
    if (href === '/') return currentPath === '/'
    return currentPath.startsWith(href)
  }

  const handleSignOut = async () => {
    await signOut()
    setProfileOpen(false)
    router.push('/')
  }

  // Close profile dropdown when clicking outside
  useEffect(() => {
    if (!profileOpen) return
    const close = () => setProfileOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [profileOpen])

  return (
    <header className="site-header">
      <div className="thread" aria-hidden="true" />
      <div className="site-header__bar">
        <a href="/" className="site-brand" aria-label="Aksara Bali">
          <span className="site-brand__aksara" aria-hidden="true">ᬅᬓ᭄ᬱᬭ</span>
          <span className="site-brand__name">Aksara Bali</span>
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              data-track={`nav-${link.label}`}
              className={`site-nav__link${isActive(link.href) ? ' is-active' : ''}`}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {en ? link.labelEn : link.label}
            </a>
          ))}
        </nav>

        <div className="site-tools">
          {onToggleLocale && (
            <button
              onClick={onToggleLocale}
              className="site-tool"
              title="Switch language"
              aria-label="Toggle language"
            >
              {locale === 'id' ? 'EN' : 'ID'}
            </button>
          )}

          <button
            onClick={onToggleDarkMode}
            className="site-tool"
            title={darkMode ? 'Light mode' : 'Dark mode'}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <div className="site-profile">
              <button
                onClick={e => { e.stopPropagation(); setProfileOpen(!profileOpen) }}
                className={`site-avatar${isAdmin ? ' is-admin' : ''}`}
                title={user.email}
                aria-label="User profile"
                aria-expanded={profileOpen}
              >
                {user.email?.[0]?.toUpperCase() ?? '?'}
              </button>
              {profileOpen && (
                <div className="site-menu" onClick={e => e.stopPropagation()}>
                  <div className="site-menu__who">
                    <div className="site-menu__email">{user.email}</div>
                    {isAdmin && <div className="site-menu__role">Admin</div>}
                  </div>
                  <a href="/dashboard" className="site-menu__item">
                    <User size={15} /> Dashboard Saya
                  </a>
                  {isAdmin && (
                    <a href="/admin" className="site-menu__item">
                      <BarChart3 size={15} /> Dashboard Admin
                    </a>
                  )}
                  <button onClick={handleSignOut} className="site-menu__item is-danger">
                    <LogOut size={15} /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/auth/login" className="site-login">Masuk</a>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="site-tool site-burger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="site-drawer">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              data-track={`nav-${link.label}`}
              className={`site-drawer__link${isActive(link.href) ? ' is-active' : ''}`}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {en ? link.labelEn : link.label}
            </a>
          ))}
          <div className="site-drawer__account">
            {user ? (
              <>
                <div className="site-drawer__email">{user.email}</div>
                <a href="/dashboard" className="site-drawer__link">Dashboard Saya</a>
                {isAdmin && <a href="/admin" className="site-drawer__link">Dashboard Admin</a>}
                <button onClick={handleSignOut} className="site-drawer__link is-danger">Keluar</button>
              </>
            ) : (
              <a href="/auth/login" className="site-drawer__link">Masuk / Daftar</a>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
