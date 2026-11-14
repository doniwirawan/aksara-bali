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
        background: 'var(--surface-2)', fontFamily: 'var(--font-sans)',
      }}>
        <div style={{
          padding: '40px', borderRadius: 0, background: 'var(--surface)',
          border: '1px solid var(--line)', width: '360px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <a href="/" className="site-brand__aksara" style={{ fontSize: 34, textDecoration: 'none', display: 'inline-block', marginBottom: 8 }} aria-label="Aksara Bali">ᬅᬓ᭄ᬱᬭ</a>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px' }}>Lupa Password</h1>
            <p style={{ color: 'var(--mute)', fontSize: '13px', margin: 0 }}>
              Masukkan email Anda untuk menerima tautan reset
            </p>
          </div>

          {sent ? (
            <div style={{
              padding: '16px', borderRadius: 0, background: 'var(--ok-tint)',
              border: '1px solid var(--ok-tint)', color: '#166534', fontSize: '14px', lineHeight: 1.5,
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
                  width: '100%', padding: '12px 14px', borderRadius: 0,
                  border: `1px solid ${error ? 'var(--danger)' : 'var(--line)'}`, fontSize: '15px',
                  marginBottom: '12px', boxSizing: 'border-box', outline: 'none',
                }}
              />
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
                {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
            <a href="/auth/login" style={{ color: 'var(--mute)', textDecoration: 'none' }}>← Kembali ke Masuk</a>
          </p>
        </div>
      </div>
    </>
  )
}
