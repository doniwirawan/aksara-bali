import { Github, Bug, Linkedin, Download, Smartphone, Heart } from 'lucide-react'
import { useEmailGate } from './EmailGate'

export default function Footer({ darkMode, locale }) {
  const { requireEmail } = useEmailGate()
  const id = locale === 'id'

  // The APK is gated: collect an email, then send them to the release page.
  const handleApkClick = async (e) => {
    e.preventDefault()
    const href = e.currentTarget.href
    if (!await requireEmail('apk-footer')) return
    if (!window.open(href, '_blank', 'noopener')) window.location.href = href
  }

  const NAV_LINKS = [
    { href: '/', label: id ? 'Konverter' : 'Converter' },
    { href: '/translate', label: id ? 'Kamus' : 'Dictionary' },
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
    <footer className="site-footer">
      <div className="thread" aria-hidden="true" />
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <div className="site-footer__mark">
              <span className="site-brand__aksara" aria-hidden="true">ᬅᬓ᭄ᬱᬭ ᬩᬮᬶ</span>
              <span className="site-footer__name">Aksara Bali</span>
            </div>
            <p>
              {id
                ? 'Alat edukasi gratis untuk melestarikan aksara Bali tradisional dengan teknologi modern.'
                : 'Free educational tool to preserve traditional Balinese script with modern technology.'}
            </p>
            <div className="site-footer__apps">
              <a
                href="https://play.google.com/apps/internaltest/4700728977787153239"
                target="_blank"
                rel="noopener noreferrer"
                data-track="footer-play-store"
                className="site-footer__app is-primary"
              >
                <Smartphone size={16} /> {id ? 'Dapatkan di Google Play' : 'Get it on Google Play'}
              </a>
              <a
                href="https://github.com/doniwirawan/aksara-bali/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                data-track="footer-download-apk"
                onClick={handleApkClick}
                className="site-footer__app"
              >
                <Download size={16} /> {id ? 'Unduh APK' : 'Download APK'}
              </a>
            </div>
          </div>

          <div>
            <h2 className="site-footer__head">{id ? 'Halaman' : 'Pages'}</h2>
            <ul className="site-footer__list">
              {NAV_LINKS.map(link => (
                <li key={link.href}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="site-footer__head">{id ? 'Sumber Daya' : 'Resources'}</h2>
            <ul className="site-footer__list">
              {RESOURCES.map(r => (
                <li key={r.href}><a href={r.href} target="_blank" rel="noopener noreferrer">{r.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="site-footer__head">{id ? 'Kontak' : 'Contact'}</h2>
            <ul className="site-footer__list">
              <li>
                <a href="https://github.com/doniwirawan/aksara-bali" target="_blank" rel="noopener noreferrer">
                  <Github size={15} /> {id ? 'Kode Sumber' : 'Source Code'}
                </a>
              </li>
              <li>
                <a href="https://github.com/doniwirawan/aksara-bali/issues" target="_blank" rel="noopener noreferrer">
                  <Bug size={15} /> {id ? 'Laporkan Bug' : 'Report Bug'}
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/doniwirawan/" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={15} /> Developer
                </a>
              </li>
              <li>
                <a href="https://ko-fi.com/L7T7234BJ2" target="_blank" rel="noopener noreferrer" data-track="footer-kofi">
                  {id ? 'Dukung di Ko-fi' : 'Support on Ko-fi'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <small>
            © {new Date().getFullYear()} Doni Wirawan · <a href="https://polyformproject.org/licenses/noncommercial/1.0.0" target="_blank" rel="noopener noreferrer">PolyForm Noncommercial License</a> ·{' '}
            {id ? 'Terinspirasi dari ' : 'Inspired by '}
            <a href="https://github.com/bennylin/transliterasijawa" target="_blank" rel="noopener noreferrer">
              transliterasijawa
            </a>
            {id ? ' oleh bennylin' : ' by bennylin'}
          </small>
          <small className="site-footer__legal">
            <a href="/privacy">{id ? 'Privasi' : 'Privacy'}</a>
            <a href="/terms">{id ? 'Ketentuan' : 'Terms'}</a>
            <span className="site-footer__made">{id ? 'Dibuat dengan' : 'Made with'} <Heart size={12} fill="currentColor" aria-label={id ? 'cinta' : 'love'} /> {id ? 'untuk Bali' : 'for Bali'}</span>
            <span className="site-footer__build">
              v{process.env.NEXT_PUBLIC_APP_VERSION} · {process.env.NEXT_PUBLIC_BUILD_REF}
            </span>
          </small>
        </div>

        {/* AI disclosure — deliberately quiet: small, low-contrast, and last on
            the page, but real text so it is readable and crawlable. */}
        <p className="site-footer__ai">
          {id
            ? 'Situs ini sebagian besar dijalankan secara otomatis dengan bantuan AI — isi, terjemahan, dan pemeliharaannya disusun dengan AI lalu diperiksa secara berkala. Kata dan aksara Bali sebaiknya tetap diperiksa bersama guru atau penutur asli sebelum dipakai untuk keperluan resmi, cetak, atau upacara.'
            : 'This site is largely automated with AI — its content, translations, and upkeep are AI-generated and reviewed over time. Balinese wording and script should still be checked with a teacher or native speaker before use in anything official, printed, or ceremonial.'}
        </p>
      </div>
    </footer>
  )
}
