import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { isAdminEmail } from '../../utils/admin'

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
    if (isAdminEmail(data?.user?.email)) {
      router.push('/admin')
    } else {
      router.push('/')
    }
  }

  return (
    <>
      <Head>
        <title>Masuk — Aksara Bali</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f5f5f0', fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <div style={{
          padding: '40px', borderRadius: '16px', background: '#fff',
          border: '1px solid #e0e0d8', width: '360px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <a href="/">
              <img src="/icons/android-chrome-192x192.png" alt="Aksara Bali" width="56" height="56"
                style={{ borderRadius: '12px', marginBottom: '12px', display: 'inline-block' }} />
            </a>
            <h1 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px' }}>Masuk</h1>
            <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Aksara Bali Converter</p>
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
                width: '100%', padding: '12px 14px', borderRadius: '10px',
                border: '1px solid #e0e0d8', fontSize: '15px', marginBottom: '10px',
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
                  width: '100%', padding: '12px 44px 12px 14px', borderRadius: '10px',
                  border: `1px solid ${error ? '#ef4444' : '#e0e0d8'}`, fontSize: '15px',
                  boxSizing: 'border-box', outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                style={{
                  position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#888',
                  display: 'flex', alignItems: 'center', padding: '4px',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 10px' }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                background: loading ? '#94b8fd' : '#0d6efd', color: '#fff',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '15px', fontWeight: '600',
              }}
            >
              {loading ? 'Memuat...' : 'Masuk'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '13px' }}>
            <a href="/auth/forgot-password" style={{ color: '#0d6efd', textDecoration: 'none' }}>
              Lupa password?
            </a>
          </p>
          <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px', color: '#666' }}>
            Belum punya akun?{' '}
            <a href="/auth/register" style={{ color: '#0d6efd', textDecoration: 'none', fontWeight: '600' }}>
              Daftar
            </a>
          </p>
          <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px' }}>
            <a href="/" style={{ color: '#888', textDecoration: 'none' }}>← Kembali ke Beranda</a>
          </p>
        </div>
      </div>
    </>
  )
}
