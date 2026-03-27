export default function Footer({ darkMode, locale }) {
  const bg = darkMode ? '#0f0f1a' : '#f5f5f0'
  const borderColor = darkMode ? '#2a2a3e' : '#e0e0d8'
  const textColor = darkMode ? '#e8e8e8' : '#1a1a1a'
  const mutedColor = darkMode ? '#888' : '#666'
  const linkColor = darkMode ? '#93c5fd' : '#0d6efd'
  const id = locale === 'id'

  const NAV_LINKS = [
    { href: '/', label: id ? 'Konverter' : 'Converter' },
    { href: '/practice', label: id ? 'Latihan' : 'Practice' },
    { href: '/blog', label: 'Blog' },
    { href: '/faq', label: 'FAQ' },
  ]

  const RESOURCES = id ? [
    { href: 'https://id.wikipedia.org/wiki/Aksara_Bali', label: 'Aksara Bali (Wikipedia)' },
    { href: 'https://id.wikipedia.org/wiki/Bahasa_Sansekerta', label: 'Bahasa Sansekerta' },
    { href: 'https://id.wikipedia.org/wiki/Budaya_Bali', label: 'Budaya Bali' },
  ] : [
    { href: 'https://en.wikipedia.org/wiki/Balinese_script', label: 'Balinese Script (Wikipedia)' },
    { href: 'https://en.wikipedia.org/wiki/Sanskrit', label: 'Sanskrit Language' },
    { href: 'https://en.wikipedia.org/wiki/Balinese_culture', label: 'Balinese Culture' },
  ]

  return (
    <footer style={{
      borderTop: `1px solid ${borderColor}`,
      background: bg,
      fontFamily: 'system-ui, sans-serif',
      marginTop: '48px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px 24px' }}>
        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '32px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <img src="/icons/android-chrome-192x192.png" alt="Aksara Bali" width="40" height="40" style={{ borderRadius: '8px' }} />
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px', color: textColor }}>Aksara Bali</div>
                <div style={{ fontSize: '11px', color: mutedColor, letterSpacing: '0.5px' }}>CONVERTER</div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: mutedColor, lineHeight: 1.6, margin: 0 }}>
              {id
                ? 'Alat edukasi gratis untuk melestarikan aksara Bali tradisional dengan teknologi modern.'
                : 'Free educational tool to preserve traditional Balinese script with modern technology.'}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontWeight: '600', fontSize: '13px', color: textColor, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {id ? 'Halaman' : 'Pages'}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {NAV_LINKS.map(link => (
                <li key={link.href} style={{ marginBottom: '8px' }}>
                  <a href={link.href} style={{ color: mutedColor, textDecoration: 'none', fontSize: '14px' }}
                    onMouseEnter={e => e.currentTarget.style.color = linkColor}
                    onMouseLeave={e => e.currentTarget.style.color = mutedColor}
                  >{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div style={{ fontWeight: '600', fontSize: '13px', color: textColor, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {id ? 'Sumber Daya' : 'Resources'}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {RESOURCES.map(r => (
                <li key={r.href} style={{ marginBottom: '8px' }}>
                  <a href={r.href} target="_blank" rel="noopener noreferrer" style={{ color: mutedColor, textDecoration: 'none', fontSize: '14px' }}
                    onMouseEnter={e => e.currentTarget.style.color = linkColor}
                    onMouseLeave={e => e.currentTarget.style.color = mutedColor}
                  >{r.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontWeight: '600', fontSize: '13px', color: textColor, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {id ? 'Kontak' : 'Contact'}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="https://github.com/doniwirawan/aksara-bali" target="_blank" rel="noopener noreferrer"
                  style={{ color: mutedColor, textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={e => e.currentTarget.style.color = linkColor}
                  onMouseLeave={e => e.currentTarget.style.color = mutedColor}
                >
                  <span>⌨️</span> {id ? 'Kode Sumber' : 'Source Code'}
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="https://github.com/doniwirawan/aksara-bali/issues" target="_blank" rel="noopener noreferrer"
                  style={{ color: mutedColor, textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={e => e.currentTarget.style.color = linkColor}
                  onMouseLeave={e => e.currentTarget.style.color = mutedColor}
                >
                  <span>🐛</span> {id ? 'Laporkan Bug' : 'Report Bug'}
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/doniwirawan/" target="_blank" rel="noopener noreferrer"
                  style={{ color: mutedColor, textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={e => e.currentTarget.style.color = linkColor}
                  onMouseLeave={e => e.currentTarget.style.color = mutedColor}
                >
                  <span>💼</span> {id ? 'Developer' : 'Developer'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <small style={{ color: mutedColor, fontSize: '13px' }}>
            © 2025 Doni Wirawan · MIT License ·{' '}
            {id ? 'Terinspirasi dari ' : 'Inspired by '}
            <a href="https://github.com/bennylin/transliterasijawa" target="_blank" rel="noopener noreferrer" style={{ color: linkColor, textDecoration: 'none' }}>
              transliterasijawa
            </a>
            {id ? ' oleh bennylin' : ' by bennylin'}
          </small>
          <small style={{ color: mutedColor, fontSize: '13px' }}>
            {id ? 'Dibuat dengan ❤️ untuk Bali' : 'Made with ❤️ for Bali'}
          </small>
        </div>
      </div>
    </footer>
  )
}
