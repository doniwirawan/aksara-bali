import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
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
        background: 'var(--ground)', fontFamily: 'var(--font-sans)',
      }}>
        <div style={{
          padding: '40px', borderRadius: 0, background: 'var(--surface)',
          border: '1px solid var(--line)', width: '360px',
          boxShadow: 'none',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <a href="/" className="site-brand__aksara" style={{ fontSize: 34, textDecoration: 'none', display: 'inline-block', marginBottom: 8 }} aria-label="Aksara Bali">ᬅᬓ᭄ᬱᬭ</a>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px' }}>Reset Password</h1>
            <p style={{ color: 'var(--mute)', fontSize: '13px', margin: 0 }}>Masukkan password baru Anda</p>
          </div>

          {done ? (
            <div style={{
              padding: '16px', borderRadius: 0, background: 'var(--ok-tint)',
              border: '1px solid var(--ok-tint)', color: '#166534', fontSize: '14px', lineHeight: 1.5,
            }}>
              Password berhasil diubah. Mengalihkan ke halaman masuk...
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password baru"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoFocus
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
                  placeholder="Konfirmasi password baru"
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
                {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
            <a href="/auth/login" style={{ color: 'var(--mute)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}><ArrowLeft size={14} /> Kembali ke Masuk</a>
          </p>
        </div>
      </div>
    </>
  )
}
