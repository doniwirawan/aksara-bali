import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Password tidak cocok'); return }
    if (password.length < 6) { setError('Password minimal 6 karakter'); return }
    setLoading(true)
    const { error: err } = await signUp(email, password)
    setLoading(false)
    if (err) {
      setError(err.message)
      return
    }
    setMessage('Akun berhasil dibuat! Cek email Anda untuk konfirmasi, lalu masuk.')
  }

  return (
    <>
      <Head>
        <title>Daftar — Aksara Bali</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f5f5f0', fontFamily: 'system-ui, sans-serif',
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
            <h1 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px' }}>Buat Akun</h1>
            <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Aksara Bali Converter</p>
          </div>

          {message ? (
            <div style={{ padding: '16px', borderRadius: '10px', background: '#d1fae5', color: '#065f46', fontSize: '14px', lineHeight: 1.5 }}>
              {message}
              <div style={{ marginTop: '12px' }}>
                <a href="/auth/login" style={{ color: '#0d6efd', fontWeight: '600' }}>Masuk sekarang →</a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister}>
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
              <input
                type="password"
                placeholder="Password (min. 6 karakter)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '10px',
                  border: '1px solid #e0e0d8', fontSize: '15px',
                  marginBottom: '10px', boxSizing: 'border-box', outline: 'none',
                }}
              />
              <input
                type="password"
                placeholder="Konfirmasi password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '10px',
                  border: `1px solid ${error ? '#ef4444' : '#e0e0d8'}`, fontSize: '15px',
                  marginBottom: '12px', boxSizing: 'border-box', outline: 'none',
                }}
              />
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
                {loading ? 'Memuat...' : 'Daftar'}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#666' }}>
            Sudah punya akun?{' '}
            <a href="/auth/login" style={{ color: '#0d6efd', textDecoration: 'none', fontWeight: '600' }}>
              Masuk
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
