import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
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
        background: 'var(--surface-2)', fontFamily: 'var(--font-sans)',
      }}>
        <div style={{
          padding: '40px', borderRadius: 0, background: 'var(--surface)',
          border: '1px solid var(--line)', width: '360px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <a href="/" className="site-brand__aksara" style={{ fontSize: 34, textDecoration: 'none', display: 'inline-block', marginBottom: 8 }} aria-label="Aksara Bali">ᬅᬓ᭄ᬱᬭ</a>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px' }}>Buat Akun</h1>
            <p style={{ color: 'var(--mute)', fontSize: '13px', margin: 0 }}>Aksara Bali Converter</p>
          </div>

          {message ? (
            <div style={{ padding: '16px', borderRadius: 0, background: '#d1fae5', color: '#065f46', fontSize: '14px', lineHeight: 1.5 }}>
              {message}
              <div style={{ marginTop: '12px' }}>
                <a href="/auth/login" style={{ color: 'var(--accent)', fontWeight: '600' }}>Masuk sekarang →</a>
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
                  width: '100%', padding: '12px 14px', borderRadius: 0,
                  border: '1px solid var(--line)', fontSize: '15px', marginBottom: '10px',
                  boxSizing: 'border-box', outline: 'none',
                }}
              />
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min. 6 karakter)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '12px 44px 12px 14px', borderRadius: 0,
                    border: '1px solid var(--line)', fontSize: '15px',
                    boxSizing: 'border-box', outline: 'none',
                  }}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mute)', display: 'flex', alignItems: 'center', padding: '4px' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Konfirmasi password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '12px 44px 12px 14px', borderRadius: 0,
                    border: `1px solid ${error ? 'var(--danger)' : 'var(--line)'}`, fontSize: '15px',
                    boxSizing: 'border-box', outline: 'none',
                  }}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} aria-label={showConfirm ? 'Sembunyikan password' : 'Tampilkan password'} style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mute)', display: 'flex', alignItems: 'center', padding: '4px' }}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
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
                {loading ? 'Memuat...' : 'Daftar'}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--mute)' }}>
            Sudah punya akun?{' '}
            <a href="/auth/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>
              Masuk
            </a>
          </p>
          <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px' }}>
            <a href="/" style={{ color: 'var(--mute)', textDecoration: 'none' }}>← Kembali ke Beranda</a>
          </p>
        </div>
      </div>
    </>
  )
}
