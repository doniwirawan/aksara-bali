import { useState, useEffect, useCallback, useRef } from 'react'
import Head from 'next/head'
import { supabase } from '../../utils/supabase'

const ADMIN_EMAIL = 'doniwirawan166@gmail.com'

const BLOG_CATEGORIES = ['Sejarah & Budaya', 'Panduan Belajar', 'Linguistik', 'Naskah Kuno', 'Teknologi & Budaya', 'Umum']
const FAQ_CATEGORIES = ['Tentang Aksara Bali', 'Cara Menggunakan Konverter', 'Fitur Latihan', 'Teknis & Kompatibilitas', 'Budaya & Sejarah', 'Umum']

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

const EMPTY_POST = { slug: '', title: '', title_en: '', excerpt: '', excerpt_en: '', content: '', content_en: '', category: 'Umum', tags: '', image_url: '', published: false, read_time: '5 menit' }
const EMPTY_FAQ = { category: 'Umum', question: '', answer: '', sort_order: 0, published: true }

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('stats')

  // Stats
  const [stats, setStats] = useState(null)
  const [quizStats, setQuizStats] = useState(null)
  const [writingStats, setWritingStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)

  // Blog
  const [blogPosts, setBlogPosts] = useState([])
  const [blogLoading, setBlogLoading] = useState(false)
  const [blogForm, setBlogForm] = useState(EMPTY_POST)
  const [editingBlog, setEditingBlog] = useState(null) // id or null
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [blogSaving, setBlogSaving] = useState(false)

  // FAQ
  const [faqItems, setFaqItems] = useState([])
  const [faqLoading, setFaqLoading] = useState(false)
  const [faqForm, setFaqForm] = useState(EMPTY_FAQ)
  const [editingFaq, setEditingFaq] = useState(null)
  const [showFaqForm, setShowFaqForm] = useState(false)
  const [faqSaving, setFaqSaving] = useState(false)

  // Unsplash picker
  const [showPicker, setShowPicker] = useState(false)
  const [pickerQuery, setPickerQuery] = useState('')
  const [pickerPhotos, setPickerPhotos] = useState([])
  const [pickerLoading, setPickerLoading] = useState(false)
  const pickerPage = useRef(1)

  const [sessionToken, setSessionToken] = useState('')
  const adminHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionToken}` }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email === ADMIN_EMAIL) {
        setAuthenticated(true)
        setSessionToken(session.access_token)
      }
    })
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError('Email atau password salah'); return }
    if (data.user?.email !== ADMIN_EMAIL) {
      await supabase.auth.signOut()
      setError('Akun ini bukan admin')
      return
    }
    setAuthenticated(true)
    setSessionToken(data.session.access_token)
  }

  // ─── Stats ────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const [c, q, w] = await Promise.all([
        fetch('/api/conversions'), fetch('/api/quiz-results'), fetch('/api/writing-checks'),
      ])
      if (c.ok) setStats(await c.json())
      if (q.ok) setQuizStats(await q.json())
      if (w.ok) setWritingStats(await w.json())
    } catch (e) { console.error(e) }
    setStatsLoading(false)
  }, [])

  // ─── Blog ─────────────────────────────────────────────────
  const fetchBlog = useCallback(async () => {
    setBlogLoading(true)
    const res = await fetch('/api/blog-posts', { headers: adminHeaders })
    if (res.ok) setBlogPosts(await res.json())
    setBlogLoading(false)
  }, [])

  const saveBlog = async (e) => {
    e.preventDefault()
    setBlogSaving(true)
    const payload = {
      ...blogForm,
      tags: blogForm.tags ? blogForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }
    const method = editingBlog ? 'PUT' : 'POST'
    if (editingBlog) payload.id = editingBlog
    const res = await fetch('/api/blog-posts', { method, headers: adminHeaders, body: JSON.stringify(payload) })
    if (res.ok) {
      setShowBlogForm(false)
      setEditingBlog(null)
      setBlogForm(EMPTY_POST)
      fetchBlog()
    } else {
      const err = await res.json()
      alert('Error: ' + err.error)
    }
    setBlogSaving(false)
  }

  const editBlog = (post) => {
    setBlogForm({ ...post, tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || '') })
    setEditingBlog(post.id)
    setShowBlogForm(true)
  }

  const deleteBlog = async (id) => {
    if (!confirm('Hapus artikel ini?')) return
    await fetch('/api/blog-posts', { method: 'DELETE', headers: adminHeaders, body: JSON.stringify({ id }) })
    fetchBlog()
  }

  const toggleBlogPublish = async (post) => {
    await fetch('/api/blog-posts', { method: 'PUT', headers: adminHeaders, body: JSON.stringify({ id: post.id, published: !post.published }) })
    fetchBlog()
  }

  // ─── FAQ ──────────────────────────────────────────────────
  const fetchFaq = useCallback(async () => {
    setFaqLoading(true)
    const res = await fetch('/api/faq-items', { headers: adminHeaders })
    if (res.ok) setFaqItems(await res.json())
    setFaqLoading(false)
  }, [])

  const saveFaq = async (e) => {
    e.preventDefault()
    setFaqSaving(true)
    const method = editingFaq ? 'PUT' : 'POST'
    const payload = editingFaq ? { ...faqForm, id: editingFaq } : faqForm
    const res = await fetch('/api/faq-items', { method, headers: adminHeaders, body: JSON.stringify(payload) })
    if (res.ok) {
      setShowFaqForm(false)
      setEditingFaq(null)
      setFaqForm(EMPTY_FAQ)
      fetchFaq()
    } else {
      const err = await res.json()
      alert('Error: ' + err.error)
    }
    setFaqSaving(false)
  }

  const editFaq = (item) => { setFaqForm(item); setEditingFaq(item.id); setShowFaqForm(true) }

  const deleteFaq = async (id) => {
    if (!confirm('Hapus FAQ ini?')) return
    await fetch('/api/faq-items', { method: 'DELETE', headers: adminHeaders, body: JSON.stringify({ id }) })
    fetchFaq()
  }

  // ─── Unsplash Picker ──────────────────────────────────────
  const searchUnsplash = useCallback(async (q = '', page = 1) => {
    setPickerLoading(true)
    const query = q || pickerQuery || 'bali temple culture'
    const res = await fetch(`/api/unsplash-search?query=${encodeURIComponent(query)}&page=${page}&per_page=12`)
    if (res.ok) {
      const data = await res.json()
      setPickerPhotos(prev => page === 1 ? data.photos : [...prev, ...data.photos])
    }
    setPickerLoading(false)
  }, [pickerQuery])

  const openPicker = () => {
    setShowPicker(true)
    pickerPage.current = 1
    if (pickerPhotos.length === 0) searchUnsplash('bali', 1)
  }

  const loadMorePhotos = () => {
    pickerPage.current += 1
    searchUnsplash(pickerQuery || 'bali', pickerPage.current)
  }

  const selectPhoto = (photo) => {
    setBlogForm(f => ({ ...f, image_url: photo.url }))
    setShowPicker(false)
  }

  useEffect(() => {
    if (!authenticated) return
    fetchStats()
  }, [authenticated, fetchStats])

  useEffect(() => {
    if (!authenticated) return
    if (activeTab === 'blog') fetchBlog()
    if (activeTab === 'faq') fetchFaq()
  }, [activeTab, authenticated])

  // ─── Styles ───────────────────────────────────────────────
  const s = {
    card: { background: '#fff', borderRadius: '14px', border: '1px solid #e0e0d8', padding: '20px', marginBottom: '16px' },
    input: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e0e0d8', fontSize: '14px', boxSizing: 'border-box', outline: 'none', fontFamily: 'system-ui, sans-serif' },
    textarea: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e0e0d8', fontSize: '13px', boxSizing: 'border-box', outline: 'none', fontFamily: 'monospace', resize: 'vertical' },
    label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '4px', marginTop: '12px' },
    btn: (color = '#0d6efd') => ({ padding: '8px 16px', borderRadius: '8px', background: color, color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }),
    btnOutline: { padding: '6px 12px', borderRadius: '8px', background: 'transparent', border: '1px solid #e0e0d8', cursor: 'pointer', fontSize: '13px' },
    badge: (color) => ({ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600', background: color + '20', color }),
  }

  // ─── Login ────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <>
        <Head><title>Admin — Aksara Bali</title></Head>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f0', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ padding: '40px', borderRadius: '16px', background: '#fff', border: '1px solid #e0e0d8', width: '360px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <img src="/icons/android-chrome-192x192.png" alt="Aksara Bali" width="56" height="56" style={{ borderRadius: '12px', marginBottom: '12px', display: 'inline-block' }} />
              <h1 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px' }}>Admin Dashboard</h1>
              <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Aksara Bali Converter</p>
            </div>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Email admin" value={email} onChange={e => setEmail(e.target.value)} autoFocus required style={{ ...s.input, marginBottom: '10px' }} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ ...s.input, border: `1px solid ${error ? '#ef4444' : '#e0e0d8'}`, marginBottom: '12px' }} />
              {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 10px' }}>{error}</p>}
              <button type="submit" style={{ ...s.btn(), width: '100%', padding: '12px', fontSize: '15px' }}>Masuk</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px' }}>
              <a href="/" style={{ color: '#888', textDecoration: 'none' }}>← Ke Aplikasi</a>
            </p>
          </div>
        </div>
      </>
    )
  }

  const TABS = [
    { key: 'stats', label: '📊 Statistik' },
    { key: 'blog', label: '✍️ Blog' },
    { key: 'faq', label: '❓ FAQ' },
  ]

  return (
    <>
      <Head><title>Admin Dashboard — Aksara Bali</title></Head>
      <div style={{ minHeight: '100vh', background: '#f5f5f0', fontFamily: 'system-ui, sans-serif' }}>

        {/* Header */}
        <header style={{ background: '#fff', borderBottom: '1px solid #e0e0d8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/icons/android-chrome-192x192.png" alt="Aksara Bali" width="32" height="32" style={{ borderRadius: '8px' }} />
            <span style={{ fontWeight: '700', fontSize: '15px' }}>Aksara Bali — Admin</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>{ADMIN_EMAIL}</span>
            <a href="/" style={{ color: '#0d6efd', fontSize: '13px', textDecoration: 'none' }}>← Ke Aplikasi</a>
            <button onClick={() => { sessionStorage.removeItem('admin-auth'); setAuthenticated(false) }} style={s.btnOutline}>Keluar</button>
          </div>
        </header>

        {/* Tabs */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e0e0d8', padding: '0 24px', display: 'flex', gap: '4px' }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: '14px', fontWeight: activeTab === tab.key ? '600' : '400',
              color: activeTab === tab.key ? '#0d6efd' : '#666',
              borderBottom: activeTab === tab.key ? '2px solid #0d6efd' : '2px solid transparent',
            }}>{tab.label}</button>
          ))}
        </div>

        <main style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>

          {/* ── STATS TAB ── */}
          {activeTab === 'stats' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Statistik Penggunaan</h2>
                <button onClick={fetchStats} disabled={statsLoading} style={s.btnOutline}>{statsLoading ? '⏳ Memuat...' : '🔄 Perbarui'}</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                {[
                  { label: 'Total Konversi', value: stats?.total ?? '—', icon: '⚡', color: '#0d6efd' },
                  { label: 'Sesi Kuis', value: quizStats?.totalSessions ?? '—', icon: '🎯', color: '#198754' },
                  { label: 'Akurasi Kuis', value: quizStats?.avgAccuracy != null ? `${quizStats.avgAccuracy}%` : '—', icon: '📊', color: '#fd7e14' },
                  { label: 'Streak Terbaik', value: quizStats?.bestStreak ?? '—', icon: '🔥', color: '#dc3545' },
                  { label: 'Cek Tulisan', value: writingStats?.total ?? '—', icon: '✍️', color: '#6f42c1' },
                  { label: 'Lulus Tulis', value: writingStats?.passed != null ? `${writingStats.passed}/${writingStats.total}` : '—', icon: '✅', color: '#20c997' },
                ].map(card => (
                  <div key={card.label} style={s.card}>
                    <div style={{ fontSize: '24px', marginBottom: '6px' }}>{card.icon}</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: card.color }}>{card.value}</div>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{card.label}</div>
                  </div>
                ))}
              </div>
              {quizStats?.recentSessions?.length > 0 && (
                <div style={s.card}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 14px' }}>Sesi Kuis Terbaru</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr>{['Skor', 'Total', 'Akurasi', 'Streak', 'Tingkat'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #f0f0f0', color: '#888', fontWeight: '500' }}>{h}</th>
                        ))}</tr>
                      </thead>
                      <tbody>
                        {quizStats.recentSessions.map((s2, i) => (
                          <tr key={i}>
                            <td style={{ padding: '8px 12px', borderBottom: '1px solid #f8f8f8', color: '#0d6efd', fontWeight: '600' }}>{s2.score}</td>
                            <td style={{ padding: '8px 12px', borderBottom: '1px solid #f8f8f8' }}>{s2.total}</td>
                            <td style={{ padding: '8px 12px', borderBottom: '1px solid #f8f8f8' }}><span style={{ color: s2.accuracy >= 80 ? '#22c55e' : s2.accuracy >= 60 ? '#f59e0b' : '#ef4444', fontWeight: '600' }}>{s2.accuracy}%</span></td>
                            <td style={{ padding: '8px 12px', borderBottom: '1px solid #f8f8f8' }}>{s2.max_streak} 🔥</td>
                            <td style={{ padding: '8px 12px', borderBottom: '1px solid #f8f8f8', textTransform: 'capitalize' }}>{s2.difficulty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <div style={{ ...s.card, background: '#f0f4ff', border: '1px solid #c5d8fc' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 10px', color: '#1e40af' }}>📋 Setup Supabase</h3>
                <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 8px' }}>Jalankan <code>supabase-schema.sql</code> di Supabase SQL Editor untuk membuat semua tabel (termasuk blog_posts dan faq_items).</p>
                <p style={{ fontSize: '13px', color: '#374151', margin: 0 }}>Set env vars: <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, <code>SUPABASE_SERVICE_ROLE_KEY</code>, <code>NEXT_PUBLIC_ADMIN_EMAIL</code>, <code>NEXT_PUBLIC_ADMIN_PASSWORD</code></p>
              </div>
            </>
          )}

          {/* ── BLOG TAB ── */}
          {activeTab === 'blog' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Kelola Blog</h2>
                <button onClick={() => { setBlogForm(EMPTY_POST); setEditingBlog(null); setShowBlogForm(true) }} style={s.btn()}>+ Artikel Baru</button>
              </div>

              {showBlogForm && (
                <div style={{ ...s.card, border: '1px solid #0d6efd40' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>{editingBlog ? 'Edit Artikel' : 'Artikel Baru'}</h3>
                    <button onClick={() => { setShowBlogForm(false); setEditingBlog(null) }} style={s.btnOutline}>✕ Tutup</button>
                  </div>
                  <form onSubmit={saveBlog}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={s.label}>Judul (ID) *</label>
                        <input style={s.input} value={blogForm.title} onChange={e => setBlogForm(f => ({ ...f, title: e.target.value, slug: f.slug || slugify(e.target.value) }))} required placeholder="Judul artikel dalam Bahasa Indonesia" />
                      </div>
                      <div>
                        <label style={s.label}>Judul (EN)</label>
                        <input style={s.input} value={blogForm.title_en} onChange={e => setBlogForm(f => ({ ...f, title_en: e.target.value }))} placeholder="English title (optional)" />
                      </div>
                    </div>

                    <label style={s.label}>Slug (URL) *</label>
                    <input style={s.input} value={blogForm.slug} onChange={e => setBlogForm(f => ({ ...f, slug: e.target.value }))} required placeholder="url-friendly-slug" />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={s.label}>Kategori</label>
                        <select style={s.input} value={blogForm.category} onChange={e => setBlogForm(f => ({ ...f, category: e.target.value }))}>
                          {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={s.label}>Waktu Baca</label>
                        <input style={s.input} value={blogForm.read_time} onChange={e => setBlogForm(f => ({ ...f, read_time: e.target.value }))} placeholder="5 menit" />
                      </div>
                      <div>
                        <label style={s.label}>Status</label>
                        <select style={s.input} value={blogForm.published ? 'true' : 'false'} onChange={e => setBlogForm(f => ({ ...f, published: e.target.value === 'true' }))}>
                          <option value="false">Draft</option>
                          <option value="true">Dipublikasikan</option>
                        </select>
                      </div>
                    </div>

                    <label style={s.label}>Tags (pisah koma)</label>
                    <input style={s.input} value={blogForm.tags} onChange={e => setBlogForm(f => ({ ...f, tags: e.target.value }))} placeholder="aksara bali, budaya, sejarah" />

                    <label style={s.label}>Foto Artikel (Unsplash)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input style={{ ...s.input, flex: 1 }} value={blogForm.image_url} onChange={e => setBlogForm(f => ({ ...f, image_url: e.target.value }))} placeholder="Pilih foto di bawah atau paste URL..." />
                      <button type="button" onClick={openPicker} style={{ ...s.btn('#198754'), whiteSpace: 'nowrap', padding: '10px 14px' }}>
                        🏝 Cari Foto Bali
                      </button>
                    </div>
                    {blogForm.image_url && (
                      <img src={blogForm.image_url} alt="preview" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px', marginTop: '8px' }} onError={e => e.target.style.display = 'none'} />
                    )}

                    {/* Unsplash Picker Modal */}
                    {showPicker && (
                      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                        <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '760px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e0e0d8', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span style={{ fontWeight: '700', fontSize: '15px', flexShrink: 0 }}>🏝 Foto Bali</span>
                            <input
                              style={{ ...s.input, flex: 1 }}
                              placeholder="Cari: temple, rice terrace, lontar, ceremony..."
                              value={pickerQuery}
                              onChange={e => setPickerQuery(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') { pickerPage.current = 1; searchUnsplash(e.target.value, 1) } }}
                            />
                            <button type="button" onClick={() => { pickerPage.current = 1; searchUnsplash(pickerQuery, 1) }} style={s.btn()}>Cari</button>
                            <button type="button" onClick={() => setShowPicker(false)} style={{ ...s.btnOutline, flexShrink: 0 }}>✕</button>
                          </div>
                          <div style={{ overflowY: 'auto', padding: '16px' }}>
                            {pickerLoading && pickerPhotos.length === 0 ? (
                              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Memuat foto Bali...</div>
                            ) : pickerPhotos.length === 0 ? (
                              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                                <p>Tidak ada foto. Pastikan <code>UNSPLASH_ACCESS_KEY</code> sudah diset di Vercel env vars.</p>
                              </div>
                            ) : (
                              <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                                  {pickerPhotos.map(photo => (
                                    <div key={photo.id} onClick={() => selectPhoto(photo)} style={{ cursor: 'pointer', borderRadius: '10px', overflow: 'hidden', aspectRatio: '16/10', position: 'relative', border: '2px solid transparent', transition: 'all 0.15s' }}
                                      onMouseEnter={e => { e.currentTarget.style.border = '2px solid #0d6efd'; e.currentTarget.style.transform = 'scale(1.02)' }}
                                      onMouseLeave={e => { e.currentTarget.style.border = '2px solid transparent'; e.currentTarget.style.transform = 'scale(1)' }}
                                    >
                                      <img src={photo.thumb} alt={photo.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.5))', padding: '16px 6px 4px', fontSize: '10px', color: '#fff' }}>
                                        {photo.author}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                  <button type="button" onClick={loadMorePhotos} disabled={pickerLoading} style={s.btnOutline}>
                                    {pickerLoading ? 'Memuat...' : 'Muat lebih banyak'}
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <label style={s.label}>Ringkasan (ID)</label>
                    <textarea style={{ ...s.textarea, height: '70px' }} value={blogForm.excerpt} onChange={e => setBlogForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Deskripsi singkat artikel..." />

                    <label style={s.label}>Ringkasan (EN)</label>
                    <textarea style={{ ...s.textarea, height: '70px' }} value={blogForm.excerpt_en} onChange={e => setBlogForm(f => ({ ...f, excerpt_en: e.target.value }))} placeholder="Short description in English..." />

                    <label style={s.label}>Konten (Markdown — ID) *</label>
                    <textarea style={{ ...s.textarea, height: '280px' }} value={blogForm.content} onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))} required placeholder="## Judul Bagian&#10;&#10;Isi artikel dalam Markdown...&#10;&#10;- Poin 1&#10;- Poin 2" />

                    <label style={s.label}>Konten (Markdown — EN)</label>
                    <textarea style={{ ...s.textarea, height: '160px' }} value={blogForm.content_en} onChange={e => setBlogForm(f => ({ ...f, content_en: e.target.value }))} placeholder="## Section Title&#10;&#10;Article content in English Markdown..." />

                    <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                      <button type="submit" disabled={blogSaving} style={s.btn()}>{blogSaving ? 'Menyimpan...' : editingBlog ? 'Simpan Perubahan' : 'Buat Artikel'}</button>
                      <button type="button" onClick={() => { setShowBlogForm(false); setEditingBlog(null) }} style={s.btnOutline}>Batal</button>
                    </div>
                  </form>
                </div>
              )}

              {blogLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Memuat...</div>
              ) : blogPosts.length === 0 ? (
                <div style={{ ...s.card, textAlign: 'center', padding: '48px 20px', color: '#888' }}>
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>✍️</div>
                  <p style={{ margin: 0 }}>Belum ada artikel. Klik <b>+ Artikel Baru</b> untuk mulai menulis.</p>
                </div>
              ) : (
                <div>
                  {blogPosts.map(post => (
                    <div key={post.id} style={{ ...s.card, display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      {post.image_url && (
                        <img src={post.image_url} alt={post.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={s.badge(post.published ? '#198754' : '#888')}>{post.published ? 'Dipublikasikan' : 'Draft'}</span>
                          <span style={s.badge('#0d6efd')}>{post.category}</span>
                        </div>
                        <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.title}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>/{post.slug} · {post.read_time}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button onClick={() => toggleBlogPublish(post)} style={{ ...s.btnOutline, fontSize: '12px' }}>{post.published ? 'Sembunyikan' : 'Publikasikan'}</button>
                        <button onClick={() => editBlog(post)} style={{ ...s.btn('#fd7e14'), padding: '6px 12px' }}>Edit</button>
                        <button onClick={() => deleteBlog(post.id)} style={{ ...s.btn('#dc3545'), padding: '6px 12px' }}>Hapus</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── FAQ TAB ── */}
          {activeTab === 'faq' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Kelola FAQ</h2>
                <button onClick={() => { setFaqForm(EMPTY_FAQ); setEditingFaq(null); setShowFaqForm(true) }} style={s.btn()}>+ Pertanyaan Baru</button>
              </div>

              {showFaqForm && (
                <div style={{ ...s.card, border: '1px solid #0d6efd40', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>{editingFaq ? 'Edit FAQ' : 'FAQ Baru'}</h3>
                    <button onClick={() => { setShowFaqForm(false); setEditingFaq(null) }} style={s.btnOutline}>✕ Tutup</button>
                  </div>
                  <form onSubmit={saveFaq}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={s.label}>Kategori</label>
                        <select style={s.input} value={faqForm.category} onChange={e => setFaqForm(f => ({ ...f, category: e.target.value }))}>
                          {FAQ_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={s.label}>Urutan</label>
                        <input type="number" style={s.input} value={faqForm.sort_order} onChange={e => setFaqForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
                      </div>
                    </div>
                    <label style={s.label}>Pertanyaan *</label>
                    <input style={s.input} value={faqForm.question} onChange={e => setFaqForm(f => ({ ...f, question: e.target.value }))} required placeholder="Apa itu aksara Bali?" />
                    <label style={s.label}>Jawaban *</label>
                    <textarea style={{ ...s.textarea, height: '120px' }} value={faqForm.answer} onChange={e => setFaqForm(f => ({ ...f, answer: e.target.value }))} required placeholder="Jawaban lengkap..." />
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={faqForm.published} onChange={e => setFaqForm(f => ({ ...f, published: e.target.checked }))} />
                        Tampilkan di FAQ
                      </label>
                    </div>
                    <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                      <button type="submit" disabled={faqSaving} style={s.btn()}>{faqSaving ? 'Menyimpan...' : editingFaq ? 'Simpan' : 'Tambah FAQ'}</button>
                      <button type="button" onClick={() => { setShowFaqForm(false); setEditingFaq(null) }} style={s.btnOutline}>Batal</button>
                    </div>
                  </form>
                </div>
              )}

              {faqLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Memuat...</div>
              ) : faqItems.length === 0 ? (
                <div style={{ ...s.card, textAlign: 'center', padding: '48px 20px', color: '#888' }}>
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>❓</div>
                  <p style={{ margin: 0 }}>Belum ada FAQ dari database. Klik <b>+ Pertanyaan Baru</b> untuk menambah.</p>
                  <p style={{ fontSize: '13px', margin: '8px 0 0', color: '#aaa' }}>FAQ statis dari halaman /faq tetap tampil.</p>
                </div>
              ) : (
                <div>
                  {faqItems.map(item => (
                    <div key={item.id} style={{ ...s.card, display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={s.badge(item.published ? '#198754' : '#888')}>{item.published ? 'Ditampilkan' : 'Disembunyikan'}</span>
                          <span style={s.badge('#6f42c1')}>{item.category}</span>
                          <span style={{ fontSize: '11px', color: '#aaa' }}>#{item.sort_order}</span>
                        </div>
                        <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{item.question}</div>
                        <div style={{ fontSize: '13px', color: '#666', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.answer}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button onClick={() => editFaq(item)} style={{ ...s.btn('#fd7e14'), padding: '6px 12px' }}>Edit</button>
                        <button onClick={() => deleteFaq(item.id)} style={{ ...s.btn('#dc3545'), padding: '6px 12px' }}>Hapus</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </main>
      </div>
    </>
  )
}
