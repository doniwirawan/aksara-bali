import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }
    if (password !== confirm) {
      setError('Password tidak cocok.')
      return
    }
    setLoading(true)
    const { error: err } = await updatePassword(password)
    setLoading(false)
    if (err) {
      setError(err.message)
      return
    }
    setDone(true)
    setTimeout(() => router.push('/auth/login'), 2000)
  }

  return (
    <>
      <Head>
        <title>Reset Password — Aksara Bali</title>
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
            <h1 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px' }}>Reset Password</h1>
            <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Masukkan password baru Anda</p>
          </div>

          {done ? (
            <div style={{
              padding: '16px', borderRadius: '10px', background: '#f0fdf4',
              border: '1px solid #bbf7d0', color: '#166534', fontSize: '14px', lineHeight: 1.5,
            }}>
              Password berhasil diubah. Mengalihkan ke halaman masuk...
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="Password baru"
                value={password}
                onChange={e => setPassword(e.target.value)}
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
                placeholder="Konfirmasi password baru"
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
                {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
            <a href="/auth/login" style={{ color: '#888', textDecoration: 'none' }}>← Kembali ke Masuk</a>
          </p>
        </div>
      </div>
    </>
  )
}
