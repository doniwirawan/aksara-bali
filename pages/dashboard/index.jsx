import Head from 'next/head'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'
import { authedFetch } from '../../utils/supabase'
import {
  Zap, Target, FileText, HelpCircle, BarChart3, Wrench, PenLine, Users,
  TrendingUp, Trophy, Flame, Ruler, Rocket, Lightbulb, CalendarDays, BookOpen,
} from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import PageTour from '../../components/PageTour'

const DASHBOARD_TOUR = [
  { title: { id: 'Dashboard kamu 📊', en: 'Your dashboard 📊' },
    desc: { id: 'Semua progres belajarmu terkumpul di sini. Yuk lihat sekilas isinya.', en: 'All your learning progress lives here. Here’s a quick look around.' } },
  { element: '[data-tour="dash-profile"]',
    title: { id: 'Akunmu', en: 'Your account' },
    desc: { id: 'Info akun dan tombol keluar ada di kartu ini.', en: 'Your account info and the sign-out button live on this card.' } },
  { element: '[data-tour="dash-stats"]',
    title: { id: 'Statistik belajar', en: 'Learning stats' },
    desc: { id: 'Jumlah konversi, sesi kuis, akurasi, streak, dan latihan menulismu — semuanya diperbarui otomatis tiap kamu berlatih.', en: 'Your conversions, quiz sessions, accuracy, streak, and writing practice — all updated automatically as you practice.' } },
  { element: '[data-tour="dash-links"]',
    title: { id: 'Lompat cepat', en: 'Jump around' },
    desc: { id: 'Akses cepat ke konverter, latihan, blog, dan FAQ dari sini.', en: 'Quick access to the converter, practice, blog, and FAQ from here.' } },
]

export default function UserDashboard({ locale, setLocale }) {
  const router = useRouter()
  const { user, loading, signOut, isAdmin } = useAuth()
  const [darkMode, setDarkMode] = useState(false)
  const [stats, setStats] = useState(null)
  const [quizStats, setQuizStats] = useState(null)
  const [writingStats, setWritingStats] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('aksara-dark-mode')
    if (saved !== null) setDarkMode(saved === 'true')
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading, router])

  const fetchStats = useCallback(async () => {
    if (!user) return
    // scope=me → stats for the logged-in user only
    const [c, q, w] = await Promise.all([
      authedFetch('/api/conversions?scope=me'),
      authedFetch('/api/quiz-results?scope=me'),
      authedFetch('/api/writing-checks?scope=me'),
    ]).catch(() => [])
    if (c?.ok) setStats(await c.json())
    if (q?.ok) setQuizStats(await q.json())
    if (w?.ok) setWritingStats(await w.json())
  }, [user])

  // Fetch on mount and whenever the tab regains focus
  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') fetchStats() }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [fetchStats])

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
    { href: '/', icon: Zap, label: 'Konverter', desc: 'Latin → Aksara Bali', color: '#0d6efd' },
    { href: '/practice', icon: Target, label: 'Latihan', desc: 'Kuis & menulis', color: '#198754' },
    { href: '/blog', icon: FileText, label: 'Blog', desc: 'Artikel budaya Bali', color: '#6f42c1' },
    { href: '/faq', icon: HelpCircle, label: 'FAQ', desc: 'Pertanyaan umum', color: '#fd7e14' },
  ]

  return (
    <>
      <Head>
        <title>Dashboard — Aksara Bali</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{ minHeight: '100vh', background: bg, color: textColor, fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => { const n = !darkMode; setDarkMode(n); localStorage.setItem('aksara-dark-mode', n) }}
          locale={locale || 'id'}
          onToggleLocale={() => setLocale && setLocale(locale === 'id' ? 'en' : 'id')}
        />

        <main style={{ maxWidth: 900, margin: '0 auto', padding: '36px 16px 80px' }}>

          {/* Profile card */}
          <div data-tour="dash-profile" style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '28px', marginBottom: '24px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
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
                <a href="/admin" style={{ padding: '8px 16px', borderRadius: '10px', background: '#0d6efd', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <BarChart3 size={15} /> Admin Dashboard
                </a>
              )}
              <button onClick={async () => { await signOut(); router.push('/') }} style={{ padding: '8px 16px', borderRadius: '10px', border: `1px solid ${borderColor}`, background: 'transparent', cursor: 'pointer', fontSize: '13px', color: mutedColor }}>
                {locale === 'en' ? 'Sign out' : 'Keluar'}
              </button>
              <button
                onClick={async () => {
                  const msg = locale === 'en'
                    ? 'Permanently delete your account? This cannot be undone.'
                    : 'Hapus akun Anda secara permanen? Tindakan ini tidak dapat dibatalkan.'
                  if (!window.confirm(msg)) return
                  const res = await authedFetch('/api/delete-account', { method: 'DELETE' })
                  if (res.ok) { await signOut(); router.push('/') }
                  else { alert(locale === 'en' ? 'Failed to delete account.' : 'Gagal menghapus akun.') }
                }}
                style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #ef4444', background: 'transparent', cursor: 'pointer', fontSize: '13px', color: '#ef4444' }}
              >
                {locale === 'en' ? 'Delete account' : 'Hapus Akun'}
              </button>
            </div>
          </div>

          {/* Admin section */}
          {isAdmin && (
            <div style={{ background: cardBg, borderRadius: '16px', border: '2px solid #0d6efd40', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#0d6efd', display: 'flex', alignItems: 'center', gap: '8px' }}><Wrench size={18} /> Admin Dashboard</h2>
                <a href="/admin" style={{ fontSize: '12px', color: '#0d6efd', textDecoration: 'none' }}>Buka lengkap →</a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                {[
                  { href: '/admin?tab=stats', icon: BarChart3, label: 'Statistik', desc: 'Konversi & kuis', color: '#0d6efd' },
                  { href: '/admin?tab=blog', icon: PenLine, label: 'Blog', desc: 'Kelola artikel', color: '#6f42c1' },
                  { href: '/admin?tab=faq', icon: HelpCircle, label: 'FAQ', desc: 'Kelola pertanyaan', color: '#fd7e14' },
                  { href: '/admin?tab=users', icon: Users, label: 'Pengguna', desc: 'Kelola akun', color: '#198754' },
                ].map(item => (
                  <a key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: darkMode ? '#252535' : '#f8f9ff',
                      borderRadius: '12px', border: `1px solid ${darkMode ? '#2a2a3e' : '#dde5ff'}`,
                      padding: '16px 14px', cursor: 'pointer',
                    }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(13,110,253,0.15)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <item.icon size={24} color={item.color} style={{ marginBottom: '8px' }} />
                      <div style={{ fontWeight: '600', fontSize: '13px', color: item.color, marginBottom: '3px' }}>{item.label}</div>
                      <div style={{ fontSize: '11px', color: mutedColor }}>{item.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Personal stats */}
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={18} /> Statistik Anda</h2>
          <div data-tour="dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '28px' }}>
            {[
              { label: 'Total Konversi', value: stats?.total ?? '—', icon: Zap, color: '#0d6efd' },
              { label: 'Sesi Kuis', value: quizStats?.totalSessions ?? '—', icon: Target, color: '#198754' },
              { label: 'Akurasi Kuis', value: quizStats?.avgAccuracy != null ? `${quizStats.avgAccuracy}%` : '—', icon: Trophy, color: '#fd7e14' },
              { label: 'Streak Terbaik', value: quizStats?.bestStreak ?? '—', icon: Flame, color: '#dc3545' },
              { label: 'Latihan Tulis', value: writingStats?.total ?? '—', icon: PenLine, color: '#6f42c1' },
              { label: 'Skor Tulis', value: writingStats?.avgScore != null ? `${writingStats.avgScore}%` : '—', icon: Ruler, color: '#20c997' },
            ].map(c => (
              <div key={c.label} style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`, padding: '16px' }}>
                <c.icon size={22} color={c.color} style={{ marginBottom: '6px' }} />
                <div style={{ fontSize: '22px', fontWeight: '700', color: c.color }}>{c.value}</div>
                <div style={{ fontSize: '11px', color: mutedColor, marginTop: '2px' }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Rocket size={18} /> Fitur</h2>
          <div data-tour="dash-links" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '28px' }}>
            {QUICK_LINKS.map(link => (
              <a key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`,
                  padding: '20px 16px', cursor: 'pointer', transition: 'box-shadow 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <link.icon size={28} color={link.color} style={{ marginBottom: '10px' }} />
                  <div style={{ fontWeight: '600', fontSize: '15px', color: link.color, marginBottom: '4px' }}>{link.label}</div>
                  <div style={{ fontSize: '12px', color: mutedColor }}>{link.desc}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Learning tips */}
          <div style={{ background: cardBg, borderRadius: '14px', border: `1px solid ${borderColor}`, padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Lightbulb size={18} /> Tips Belajar Aksara Bali</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {[
                { icon: CalendarDays, color: '#0d6efd', tip: 'Belajar 15–20 menit setiap hari lebih efektif daripada belajar panjang sekaligus.' },
                { icon: Target, color: '#198754', tip: 'Mulai dengan kuis mode Mudah, lalu naikkan kesulitan secara bertahap.' },
                { icon: PenLine, color: '#6f42c1', tip: 'Gunakan fitur Tulis untuk melatih memori motorik aksara Bali.' },
                { icon: BookOpen, color: '#fd7e14', tip: 'Baca blog untuk memahami konteks budaya dan sejarah di balik aksara Bali.' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', padding: '12px', borderRadius: '10px', background: darkMode ? '#252535' : '#f8f8f8' }}>
                  <t.icon size={20} color={t.color} style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '13px', color: mutedColor, lineHeight: 1.5 }}>{t.tip}</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        <PageTour pageKey="dashboard" locale={locale} steps={DASHBOARD_TOUR} />
        <Footer darkMode={darkMode} locale={locale || 'id'} />
      </div>
    </>
  )
}
