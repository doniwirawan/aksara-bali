import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { href: '/', label: 'Konverter', labelEn: 'Converter', icon: '⚡' },
  { href: '/practice', label: 'Latihan', labelEn: 'Practice', icon: '🎯' },
  { href: '/blog', label: 'Blog', labelEn: 'Blog', icon: '📝' },
  { href: '/faq', label: 'FAQ', labelEn: 'FAQ', icon: '❓' },
]

export default function Navbar({ darkMode, onToggleDarkMode, locale, onToggleLocale }) {
  const router = useRouter()
  const { user, signOut, isAdmin } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const currentPath = router.pathname

  const bg = darkMode ? '#12121e' : '#ffffff'
  const borderColor = darkMode ? '#2a2a3e' : '#e8e8e0'
  const textColor = darkMode ? '#e8e8e8' : '#1a1a1a'
  const mutedColor = darkMode ? '#888' : '#666'

  useEffect(() => { setMenuOpen(false) }, [router.pathname])

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
    <header style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: bg,
      borderBottom: `1px solid ${borderColor}`,
      boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 16px',
        display: 'flex', alignItems: 'center', height: '56px', gap: '8px',
      }}>
        {/* Logo */}
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <img src="/icons/android-chrome-192x192.png" alt="Aksara Bali" width="36" height="36" style={{ borderRadius: '8px', display: 'block' }} />
          <div>
            <span style={{ fontWeight: '700', fontSize: '15px', color: textColor, display: 'block', lineHeight: 1.1 }}>
              Aksara Bali
            </span>
            <span style={{ fontSize: '10px', color: mutedColor, letterSpacing: '0.5px' }}>
              CONVERTER
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: '2px', marginLeft: '16px', flex: 1 }} aria-label="Main navigation">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: isActive(link.href) ? '600' : '400',
                background: isActive(link.href) ? (darkMode ? '#1e3a6e' : '#e8f0fe') : 'transparent',
                color: isActive(link.href) ? '#0d6efd' : mutedColor,
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!isActive(link.href)) e.currentTarget.style.background = darkMode ? '#252535' : '#f5f5f5' }}
              onMouseLeave={e => { if (!isActive(link.href)) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: '14px' }}>{link.icon}</span>
              <span className="nav-label">{locale === 'en' ? link.labelEn : link.label}</span>
            </a>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Language toggle */}
          {onToggleLocale && (
            <button
              onClick={onToggleLocale}
              style={{
                padding: '5px 10px', borderRadius: '16px',
                border: `1px solid ${borderColor}`, background: 'transparent',
                cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                color: mutedColor, transition: 'all 0.15s',
              }}
              title="Switch language"
              aria-label="Toggle language"
            >
              {locale === 'id' ? '🇬🇧 EN' : '🇮🇩 ID'}
            </button>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDarkMode}
            style={{
              padding: '6px 10px', borderRadius: '16px',
              border: `1px solid ${borderColor}`, background: 'transparent',
              cursor: 'pointer', fontSize: '16px', lineHeight: 1,
              transition: 'all 0.15s',
            }}
            title={darkMode ? 'Light mode' : 'Dark mode'}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Profile / Login */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={e => { e.stopPropagation(); setProfileOpen(!profileOpen) }}
                style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: isAdmin ? '#0d6efd' : '#6f42c1',
                  border: 'none', cursor: 'pointer', fontSize: '14px',
                  color: '#fff', fontWeight: '700', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
                title={user.email}
                aria-label="User profile"
              >
                {user.email?.[0]?.toUpperCase() ?? '?'}
              </button>
              {profileOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '42px',
                  background: bg, border: `1px solid ${borderColor}`,
                  borderRadius: '12px', padding: '8px',
                  minWidth: '180px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  zIndex: 300,
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: `1px solid ${borderColor}`, marginBottom: '4px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: textColor, wordBreak: 'break-all' }}>{user.email}</div>
                    {isAdmin && <div style={{ fontSize: '11px', color: '#0d6efd', marginTop: '2px' }}>Admin</div>}
                  </div>
                  {isAdmin && (
                    <a href="/admin" style={{ display: 'block', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', color: textColor, textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = darkMode ? '#252535' : '#f5f5f5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      📊 Dashboard Admin
                    </a>
                  )}
                  <button
                    onClick={handleSignOut}
                    style={{
                      width: '100%', padding: '8px 12px', borderRadius: '8px',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      fontSize: '13px', color: '#ef4444', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = darkMode ? '#252535' : '#f5f5f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/auth/login"
              style={{
                padding: '6px 14px', borderRadius: '16px',
                border: `1px solid ${borderColor}`, background: 'transparent',
                textDecoration: 'none', fontSize: '13px', fontWeight: '600',
                color: '#0d6efd', transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              Masuk
            </a>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              padding: '6px 8px', borderRadius: '8px',
              border: `1px solid ${borderColor}`, background: 'transparent',
              cursor: 'pointer', fontSize: '18px', lineHeight: 1,
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          borderTop: `1px solid ${borderColor}`,
          background: bg,
          padding: '8px 16px 16px',
        }}>
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 8px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: isActive(link.href) ? '600' : '400',
                color: isActive(link.href) ? '#0d6efd' : textColor,
                background: isActive(link.href) ? (darkMode ? '#1e3a6e' : '#e8f0fe') : 'transparent',
                marginBottom: '4px',
              }}
            >
              <span>{link.icon}</span>
              <span>{locale === 'en' ? link.labelEn : link.label}</span>
            </a>
          ))}
          <div style={{ paddingTop: '8px', borderTop: `1px solid ${borderColor}` }}>
            {user ? (
              <div>
                <div style={{ fontSize: '12px', color: mutedColor, padding: '4px 8px', marginBottom: '4px' }}>{user.email}</div>
                {isAdmin && <a href="/admin" style={{ display: 'block', padding: '10px 8px', color: '#0d6efd', textDecoration: 'none', fontSize: '14px' }}>📊 Dashboard Admin</a>}
                <button onClick={handleSignOut} style={{ width: '100%', padding: '10px 8px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#ef4444', textAlign: 'left' }}>
                  Keluar
                </button>
              </div>
            ) : (
              <a href="/auth/login" style={{ display: 'block', padding: '10px 8px', color: '#0d6efd', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                Masuk / Daftar
              </a>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .nav-label { display: none; }
          .mobile-menu-btn { display: block !important; }
          nav { display: none !important; }
        }
        @media (min-width: 641px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  )
}
