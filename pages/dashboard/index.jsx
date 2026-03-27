import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function UserDashboard({ locale, setLocale }) {
  const router = useRouter()
  const { user, loading, signOut, isAdmin } = useAuth()
  const [darkMode, setDarkMode] = useState(false)
  const [stats, setStats] = useState(null)
  const [quizStats, setQuizStats] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('aksara-dark-mode')
    if (saved !== null) setDarkMode(saved === 'true')
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    Promise.all([fetch('/api/conversions'), fetch('/api/quiz-results')]).then(async ([c, q]) => {
      if (c.ok) setStats(await c.json())
      if (q.ok) setQuizStats(await q.json())
    }).catch(() => {})
  }, [user])

  const bg = darkMode ? '#0f0f1a' : '#f5f5f0'
  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textColor = darkMode ? '#e8e8e8' : '#1a1a1a'
  const borderColor = darkMode ? '#2a2a3e' : '#e0e0d8'
  const mutedColor = darkMode ? '#888' : '#666'

  if (loading || !user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg }}>
      <div style={{ color: mutedColor, fontSize: '15px' }}>Memuat...</div>
    </div>
  )

  const joinedDate = user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'
  const avatarLetter = user.email?.[0]?.toUpperCase() ?? '?'

  const QUICK_LINKS = [
    { href: '/', icon: '⚡', label: 'Konverter', desc: 'Latin → Aksara Bali', color: '#0d6efd' },
    { href: '/practice', icon: '🎯', label: 'Latihan', desc: 'Kuis & menulis', color: '#198754' },
    { href: '/blog', icon: '📝', label: 'Blog', desc: 'Artikel budaya Bali', color: '#6f42c1' },
    { href: '/faq', icon: '❓', label: 'FAQ', desc: 'Pertanyaan umum', color: '#fd7e14' },
  ]

  return (
    <>
      <Head>
        <title>Dashboard — Aksara Bali</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{ minHeight: '100vh', background: bg, color: textColor, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => { const n = !darkMode; setDarkMode(n); localStorage.setItem('aksara-dark-mode', n) }}
          locale={locale || 'id'}
          onToggleLocale={() => setLocale && setLocale(locale === 'id' ? 'en' : 'id')}
        />

        <main style={{ maxWidth: 900, margin: '0 auto', padding: '36px 16px 80px' }}>

          {/* Profile card */}
          <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '28px', marginBottom: '24px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: isAdmin ? 'linear-gradient(135deg,#0d6efd,#6f42c1)' : 'linear-gradient(135deg,#198754,#20c997)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '30px', fontWeight: '700', color: '#fff', flexShrink: 0,
            }}>
              {avatarLetter}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>{user.email}</h1>
                {isAdmin && (
                  <span style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '10px', background: '#0d6efd20', color: '#0d6efd', fontWeight: '700' }}>ADMIN</span>
                )}
              </div>
              <div style={{ fontSize: '13px', color: mutedColor }}>Bergabung: {joinedDate}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {isAdmin && (
                <a href="/admin" style={{ padding: '8px 16px', borderRadius: '10px', background: '#0d6efd', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                  📊 Admin Dashboard
                </a>
              )}
              <button onClick={async () => { await signOut(); router.push('/') }} style={{ padding: '8px 16px', borderRadius: '10px', border: `1px solid ${borderColor}`, background: 'transparent', cursor: 'pointer', fontSize: '13px', color: mutedColor }}>
                Keluar
              </button>
            </div>
          </div>

          {/* Community stats */}
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 14px' }}>📈 Statistik Komunitas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '28px' }}>
            {[
              { label: 'Total Konversi', value: stats?.total ?? '—', icon: '⚡', color: '#0d6efd' },
              { label: 'Sesi Kuis', value: quizStats?.totalSessions ?? '—', icon: '🎯', color: '#198754' },
              { label: 'Akurasi Rata-rata', value: quizStats?.avgAccuracy != null ? `${quizStats.avgAccuracy}%` : '—', icon: '🏆', color: '#fd7e14' },
              { label: 'Streak Terbaik', value: quizStats?.bestStreak ?? '—', icon: '🔥', color: '#dc3545' },
            ].map(c => (
              <div key={c.label} style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`, padding: '16px' }}>
                <div style={{ fontSize: '22px', marginBottom: '4px' }}>{c.icon}</div>
                <div style={{ fontSize: '22px', fontWeight: '700', color: c.color }}>{c.value}</div>
                <div style={{ fontSize: '11px', color: mutedColor, marginTop: '2px' }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 14px' }}>🚀 Fitur</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '28px' }}>
            {QUICK_LINKS.map(link => (
              <a key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`,
                  padding: '20px 16px', cursor: 'pointer', transition: 'box-shadow 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>{link.icon}</div>
                  <div style={{ fontWeight: '600', fontSize: '15px', color: link.color, marginBottom: '4px' }}>{link.label}</div>
                  <div style={{ fontSize: '12px', color: mutedColor }}>{link.desc}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Learning tips */}
          <div style={{ background: cardBg, borderRadius: '14px', border: `1px solid ${borderColor}`, padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 14px' }}>💡 Tips Belajar Aksara Bali</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {[
                { icon: '📅', tip: 'Belajar 15–20 menit setiap hari lebih efektif daripada belajar panjang sekaligus.' },
                { icon: '🎯', tip: 'Mulai dengan kuis mode Mudah, lalu naikkan kesulitan secara bertahap.' },
                { icon: '✍️', tip: 'Gunakan fitur Tulis untuk melatih memori motorik aksara Bali.' },
                { icon: '📖', tip: 'Baca blog untuk memahami konteks budaya dan sejarah di balik aksara Bali.' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', padding: '12px', borderRadius: '10px', background: darkMode ? '#252535' : '#f8f8f8' }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{t.icon}</span>
                  <span style={{ fontSize: '13px', color: mutedColor, lineHeight: 1.5 }}>{t.tip}</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer darkMode={darkMode} locale={locale || 'id'} />
      </div>
    </>
  )
}
