import { useState, useEffect } from 'react'
import Head from 'next/head'

// Simple password-protected admin dashboard
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'aksarabali2026'

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [quizStats, setQuizStats] = useState(null)
  const [writingStats, setWritingStats] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('admin-auth')
    if (saved === 'true') setAuthenticated(true)
  }, [])

  useEffect(() => {
    if (authenticated) fetchStats()
  }, [authenticated])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      sessionStorage.setItem('admin-auth', 'true')
      setError('')
    } else {
      setError('Password salah')
    }
  }

  const fetchStats = async () => {
    setLoading(true)
    try {
      const [convRes, quizRes, writeRes] = await Promise.all([
        fetch('/api/conversions'),
        fetch('/api/quiz-results'),
        fetch('/api/writing-checks'),
      ])
      if (convRes.ok) setStats(await convRes.json())
      if (quizRes.ok) setQuizStats(await quizRes.json())
      if (writeRes.ok) setWritingStats(await writeRes.json())
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <>
        <Head><title>Admin — Aksara Bali</title></Head>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f0', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ padding: '40px', borderRadius: '16px', background: '#fff', border: '1px solid #e0e0d8', width: '360px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span style={{ fontFamily: '"Noto Sans Balinese", serif', fontSize: '36px' }}>ᬅ</span>
              <h1 style={{ fontSize: '20px', fontWeight: '700', margin: '8px 0 4px' }}>Admin Dashboard</h1>
              <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Aksara Bali Converter</p>
            </div>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Password admin"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${error ? '#ef4444' : '#e0e0d8'}`, fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' }}
              />
              {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 10px' }}>{error}</p>}
              <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#0d6efd', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>
                Masuk
              </button>
            </form>
          </div>
        </div>
      </>
    )
  }

  const STAT_CARDS = [
    { label: 'Total Konversi', value: stats?.total ?? '—', icon: '⚡', color: '#0d6efd' },
    { label: 'Sesi Kuis', value: quizStats?.totalSessions ?? '—', icon: '🎯', color: '#198754' },
    { label: 'Rata-rata Akurasi Kuis', value: quizStats?.avgAccuracy != null ? `${quizStats.avgAccuracy}%` : '—', icon: '📊', color: '#fd7e14' },
    { label: 'Streak Terbaik', value: quizStats?.bestStreak ?? '—', icon: '🔥', color: '#dc3545' },
    { label: 'Cek Tulisan', value: writingStats?.total ?? '—', icon: '✍️', color: '#6f42c1' },
    { label: 'Lulus Tulis', value: writingStats?.passed != null ? `${writingStats.passed}/${writingStats.total}` : '—', icon: '✅', color: '#20c997' },
  ]

  return (
    <>
      <Head><title>Admin Dashboard — Aksara Bali</title></Head>
      <div style={{ minHeight: '100vh', background: '#f5f5f0', fontFamily: 'system-ui, sans-serif' }}>
        {/* Header */}
        <header style={{ background: '#fff', borderBottom: '1px solid #e0e0d8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: '"Noto Sans Balinese", serif', fontSize: '24px' }}>ᬅ</span>
            <span style={{ fontWeight: '700', fontSize: '15px' }}>Aksara Bali — Admin</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="/" style={{ color: '#0d6efd', fontSize: '13px', textDecoration: 'none' }}>← Ke Aplikasi</a>
            <button onClick={() => { sessionStorage.removeItem('admin-auth'); setAuthenticated(false) }} style={{ padding: '5px 12px', borderRadius: '8px', border: '1px solid #e0e0d8', background: 'transparent', cursor: 'pointer', fontSize: '13px', color: '#666' }}>
              Keluar
            </button>
          </div>
        </header>

        <main style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Dashboard</h1>
            <button onClick={fetchStats} disabled={loading} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e0e0d8', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>
              {loading ? '⏳ Memuat...' : '🔄 Perbarui'}
            </button>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {STAT_CARDS.map(card => (
              <div key={card.label} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e0e0d8', padding: '20px' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{card.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: card.color, marginBottom: '4px' }}>{card.value}</div>
                <div style={{ fontSize: '13px', color: '#888' }}>{card.label}</div>
              </div>
            ))}
          </div>

          {/* Recent quiz sessions */}
          {quizStats?.recentSessions?.length > 0 && (
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e0e0d8', padding: '20px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px' }}>Sesi Kuis Terbaru</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr>
                      {['Skor', 'Total', 'Akurasi', 'Max Streak', 'Tingkat'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #f0f0f0', color: '#888', fontWeight: '500', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {quizStats.recentSessions.map((s, i) => (
                      <tr key={i}>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid #f8f8f8', fontWeight: '600', color: '#0d6efd' }}>{s.score}</td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid #f8f8f8' }}>{s.total}</td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid #f8f8f8' }}>
                          <span style={{ color: s.accuracy >= 80 ? '#22c55e' : s.accuracy >= 60 ? '#f59e0b' : '#ef4444', fontWeight: '600' }}>
                            {s.accuracy}%
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid #f8f8f8' }}>{s.max_streak} 🔥</td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid #f8f8f8', textTransform: 'capitalize' }}>{s.difficulty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Setup guide */}
          <div style={{ background: '#f0f4ff', borderRadius: '14px', border: '1px solid #c5d8fc', padding: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px', color: '#1e40af' }}>📋 Setup Supabase</h2>
            <ol style={{ paddingLeft: '20px', margin: 0, fontSize: '14px', lineHeight: 2, color: '#374151' }}>
              <li>Buka <b>supabase.com</b> → project Anda → <b>SQL Editor</b></li>
              <li>Jalankan isi file <code>supabase-schema.sql</code> di root project</li>
              <li>Tambahkan environment variables di Vercel: <b>Settings → Environment Variables</b></li>
              <li>Set <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
              <li>Set <code>SUPABASE_SERVICE_ROLE_KEY</code> (server-only, tidak diawali NEXT_PUBLIC_)</li>
              <li>Deploy ulang di Vercel setelah menambahkan env vars</li>
            </ol>
          </div>
        </main>
      </div>
    </>
  )
}
