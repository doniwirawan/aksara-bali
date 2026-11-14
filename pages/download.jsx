import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Download, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useEmailGate } from '../components/EmailGate'

const REPO = 'doniwirawan/aksara-bali'
const RELEASES = `https://github.com/${REPO}/releases/latest`
const PLAY = 'https://play.google.com/apps/internaltest/4700728977787153239'

// The newest GitHub release, read at build time and refreshed hourly, so the
// buttons always point at the real APK files without editing this page.
export async function getStaticProps() {
  let release = null
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'aksarabali-site' },
    })
    if (res.ok) {
      const r = await res.json()
      const apks = (r.assets || []).filter(a => a.name.endsWith('.apk'))
      const pick = (test) => apks.find(test) || null
      const asset = (a) => a && { name: a.name, url: a.browser_download_url, mb: +(a.size / 1048576).toFixed(1) }
      release = {
        tag: r.tag_name,
        version: (r.tag_name || '').replace(/^v/, ''),
        date: (r.published_at || '').slice(0, 10),
        url: r.html_url,
        // aksara-bali-vX.Y.Z.apk is 64-bit (arm64); the -armeabi-v7a one also installs on old 32-bit phones
        main: asset(pick(a => !/armeabi|x86/.test(a.name))),
        legacy: asset(pick(a => /armeabi-v7a/.test(a.name))),
        notes: (r.body || '').split('\n')
          .filter(l => /^\s*[-*]\s+/.test(l) && !/\.apk/i.test(l))
          .map(l => l.replace(/^\s*[-*]\s+/, '').replace(/\*\*/g, '').replace(/`/g, '').replace(/^\p{Extended_Pictographic}️?\s*/u, '').trim())
          .filter(Boolean).slice(0, 8),
      }
    }
  } catch { /* fall back to the releases page */ }
  return { props: { release }, revalidate: 3600 }
}

const T = {
  id: {
    title: 'Unduh Aplikasi Aksara Bali',
    lede: 'Konverter, kuis, dan latihan menulis aksara Bali di ponsel Android. Berjalan penuh tanpa internet.',
    version: (v, d) => `Versi ${v}${d ? ` · dirilis ${d}` : ''}`,
    main: 'Unduh APK',
    mainHint: 'Untuk hampir semua ponsel Android sekarang (64-bit).',
    legacy: 'Ponsel lama',
    legacyHint: 'Untuk ponsel Android 32-bit yang lebih lama. Juga bisa dipasang di ponsel baru.',
    play: 'Gabung uji coba di Google Play',
    playHint: 'Aplikasi sedang dalam uji tertutup di Google Play. Gabung untuk mendapat pembaruan otomatis dari Play Store.',
    news: 'Yang baru',
    allReleases: 'Semua rilis di GitHub',
    installTitle: 'Cara memasang APK',
    steps: [
      'Tekan Unduh APK dan tunggu berkas selesai terunduh.',
      'Buka berkasnya dari notifikasi atau folder Unduhan.',
      'Jika Android meminta, izinkan pemasangan dari sumber ini (browser atau pengelola berkas).',
      'Tekan Pasang. Setelah itu aplikasi memberi tahu jika ada versi baru.',
    ],
    safe: 'Berkas diunduh langsung dari rilis resmi di GitHub, ditandatangani dengan kunci yang sama untuk setiap versi.',
    fallback: 'Daftar rilis tidak bisa dimuat sekarang. Unduh dari halaman rilis GitHub.',
  },
  en: {
    title: 'Download the Aksara Bali App',
    lede: 'The Balinese script converter, quizzes and writing practice on your Android phone. Works fully offline.',
    version: (v, d) => `Version ${v}${d ? ` · released ${d}` : ''}`,
    main: 'Download APK',
    mainHint: 'For almost every Android phone today (64-bit).',
    legacy: 'Older phones',
    legacyHint: 'For older 32-bit Android phones. Also installs on newer ones.',
    play: 'Join the Google Play test',
    playHint: 'The app is in closed testing on Google Play. Join to get automatic updates from the Play Store.',
    news: 'What’s new',
    allReleases: 'All releases on GitHub',
    installTitle: 'How to install the APK',
    steps: [
      'Tap Download APK and wait for the file to finish downloading.',
      'Open it from the notification or your Downloads folder.',
      'If Android asks, allow installs from this source (your browser or file manager).',
      'Tap Install. The app will tell you when a new version is out.',
    ],
    safe: 'Files come straight from the official GitHub release, signed with the same key for every version.',
    fallback: 'The release list could not be loaded right now. Download from the GitHub releases page.',
  },
}

export default function DownloadPage({ locale, setLocale, release }) {
  const [darkMode, setDarkMode] = useState(false)
  const { requireEmail } = useEmailGate()
  useEffect(() => {
    try { const saved = localStorage.getItem('aksara-dark-mode'); if (saved !== null) setDarkMode(saved === 'true') } catch {}
  }, [])
  const lang = locale === 'en' ? 'en' : 'id'
  const t = T[lang]

  // Downloads ask for an email first (it feeds the Play tester list), then start the file.
  const gated = (source) => async (e) => {
    e.preventDefault()
    const href = e.currentTarget.href
    if (!await requireEmail(source)) return
    window.location.href = href
  }

  return (
    <>
      <Head>
        <title>{t.title} — Aksara Bali</title>
        <meta name="description" content={t.lede} />
        <link key="canonical" rel="canonical" href="https://aksarabali.doniwirawan.xyz/download/" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--ground)', color: 'var(--ink)' }}>
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => { const n = !darkMode; setDarkMode(n); try { localStorage.setItem('aksara-dark-mode', n) } catch {} }}
          locale={locale || 'id'}
          onToggleLocale={() => setLocale && setLocale(locale === 'id' ? 'en' : 'id')}
        />

        <main className="page">
          <div className="page-head">
            <h1 className="page-title">{t.title}</h1>
            <p className="page-lede">{t.lede}</p>
          </div>

          <section className="dl">
            <div className="dl__main">
              <img src="/icons/icon.svg" alt="" width="88" height="88" className="dl__icon" />
              <div>
                <div className="dl__name">Aksara Bali</div>
                <div className="dl__meta">
                  {release ? t.version(release.version, release.date) : 'Android'}
                </div>
              </div>
            </div>

            {release?.main ? (
              <div className="dl__buttons">
                <div>
                  <a href={release.main.url} onClick={gated('apk-download-page')} data-track="download-apk-main" className="cta cta--red dl__cta">
                    <Download size={18} /> {t.main} · {release.main.mb} MB
                  </a>
                  <p className="dl__hint">{t.mainHint}</p>
                </div>
                {release.legacy && (
                  <div>
                    <a href={release.legacy.url} onClick={gated('apk-download-page-legacy')} data-track="download-apk-legacy" className="cta dl__cta dl__cta--ghost">
                      <Download size={18} /> {t.legacy} · {release.legacy.mb} MB
                    </a>
                    <p className="dl__hint">{t.legacyHint}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="dl__buttons">
                <div>
                  <a href={RELEASES} target="_blank" rel="noopener noreferrer" className="cta cta--red dl__cta">
                    <Download size={18} /> {t.main}
                  </a>
                  <p className="dl__hint">{t.fallback}</p>
                </div>
              </div>
            )}

            <p className="dl__safe"><ShieldCheck size={16} /> {t.safe}</p>
          </section>

          <div className="dl__grid">
            <section className="panel" style={{ marginTop: 0 }}>
              <div className="panel__head"><h2 className="panel__title">{t.installTitle}</h2></div>
              <ol className="dl__steps">
                {t.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </section>

            <section className="panel" style={{ marginTop: 0 }}>
              <div className="panel__head"><h2 className="panel__title">{t.news}</h2></div>
              <div className="panel__body">
                {release?.notes?.length ? (
                  <ul className="dl__notes">{release.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
                ) : null}
                <a href={release?.url || RELEASES} target="_blank" rel="noopener noreferrer" className="dl__link">
                  {t.allReleases} <ArrowRight size={14} />
                </a>
              </div>
            </section>
          </div>

          <section className="app-band">
            <div>
              <h2 className="app-band__title">{t.play}</h2>
              <p>{t.playHint}</p>
            </div>
            <div className="app-band__ctas">
              <a href={PLAY} target="_blank" rel="noopener noreferrer" data-track="download-play" className="cta cta--ghost">
                <Smartphone size={18} /> Google Play
              </a>
            </div>
          </section>
        </main>

        <Footer darkMode={darkMode} locale={locale} />
      </div>
    </>
  )
}
