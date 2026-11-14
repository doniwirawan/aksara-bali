import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error: err } = await signIn(email, password)
    setLoading(false)
    if (err) {
      setError(err.message)
      return
    }
    // Whether this account is an admin is the server's to answer — checking it
    // here would inline the admin address into the public bundle.
    let admin = false
    try {
      const token = data?.session?.access_token
      if (token) {
        const res = await fetch('/api/admin-check/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) admin = (await res.json()).admin === true
      }
    } catch { /* not an admin, then */ }
    router.push(admin ? '/admin' : '/')
  }

  return (
    <>
      <Head>
        <title>Masuk — Aksara Bali</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--ground)', fontFamily: 'var(--font-sans)',
      }}>
        <div style={{
          padding: '40px', borderRadius: 0, background: 'var(--surface)',
          border: '1px solid var(--line)', width: '360px',
          boxShadow: 'none',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <a href="/" className="site-brand__aksara" style={{ fontSize: 34, textDecoration: 'none', display: 'inline-block', marginBottom: 8 }} aria-label="Aksara Bali">ᬅᬓ᭄ᬱᬭ</a>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px' }}>Masuk</h1>
            <p style={{ color: 'var(--mute)', fontSize: '13px', margin: 0 }}>Aksara Bali Converter</p>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 0,
                border: '1px solid var(--line)', fontSize: '15px', marginBottom: '10px',
                boxSizing: 'border-box', outline: 'none',
              }}
            />
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 44px 12px 14px', borderRadius: 0,
                  border: `1px solid ${error ? 'var(--danger)' : 'var(--line)'}`, fontSize: '15px',
                  boxSizing: 'border-box', outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                style={{
                  position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mute)',
                  display: 'flex', alignItems: 'center', padding: '4px',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: '13px', margin: '0 0 10px' }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px', borderRadius: 0,
                background: loading ? 'var(--line)' : 'var(--accent)', color: '#fff',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '15px', fontWeight: '600',
              }}
            >
              {loading ? 'Memuat...' : 'Masuk'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '13px' }}>
            <a href="/auth/forgot-password" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Lupa password?
            </a>
          </p>
          <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px', color: 'var(--mute)' }}>
            Belum punya akun?{' '}
            <a href="/auth/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>
              Daftar
            </a>
          </p>
          <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px' }}>
            <a href="/" style={{ color: 'var(--mute)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}><ArrowLeft size={14} /> Kembali ke Beranda</a>
          </p>
        </div>
      </div>
    </>
  )
}
