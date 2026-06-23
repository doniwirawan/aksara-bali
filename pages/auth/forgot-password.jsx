import Head from 'next/head'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await resetPassword(email)
    setLoading(false)
    if (err) {
      setError(err.message)
      return
    }
    setSent(true)
  }

  return (
    <>
      <Head>
        <title>Lupa Password — Aksara Bali</title>
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
            <h1 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px' }}>Lupa Password</h1>
            <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
              Masukkan email Anda untuk menerima tautan reset
            </p>
          </div>

          {sent ? (
            <div style={{
              padding: '16px', borderRadius: '10px', background: '#f0fdf4',
              border: '1px solid #bbf7d0', color: '#166534', fontSize: '14px', lineHeight: 1.5,
            }}>
              Tautan reset password telah dikirim ke <strong>{email}</strong>. Silakan periksa kotak masuk
              (dan folder spam) Anda.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
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
                {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
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
