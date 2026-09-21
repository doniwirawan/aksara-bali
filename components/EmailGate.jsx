'use client'
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { Mail, X } from 'lucide-react'
import { authedFetch } from '../utils/supabase'
import { trackEvent } from '../utils/analytics'

// Asks for an email before a download runs. Once someone has given theirs we
// remember it in this browser and let every later download through — re-asking
// a known address collects nothing new.
const STORAGE_KEY = 'aksara-lead-email'

const EmailGateContext = createContext(null)

// Components rendered outside the provider still work; the gate just lets
// downloads through instead of crashing.
const PASSTHROUGH = { requireEmail: () => Promise.resolve(true) }

export function useEmailGate() {
    return useContext(EmailGateContext) || PASSTHROUGH
}

export function EmailGateProvider({ children, locale = 'en' }) {
    const [source, setSource] = useState(null)   // non-null while the modal is open
    const [email, setEmail] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const resolveRef = useRef(null)

    // Returns a promise that settles true (go ahead) or false (they backed out).
    const requireEmail = useCallback((downloadSource) => {
        if (typeof window === 'undefined') return Promise.resolve(true)
        try {
            if (localStorage.getItem(STORAGE_KEY)) return Promise.resolve(true)
        } catch { /* private mode — fall through and ask */ }

        trackEvent(`email-gate-open-${downloadSource}`)
        setEmail('')
        setError('')
        setSource(downloadSource)
        return new Promise(resolve => { resolveRef.current = resolve })
    }, [])

    const settle = (allowed) => {
        setSource(null)
        setSaving(false)
        const resolve = resolveRef.current
        resolveRef.current = null
        if (resolve) resolve(allowed)
    }

    const id = locale === 'id'

    const handleSubmit = async (e) => {
        e.preventDefault()
        const value = email.trim().toLowerCase()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
            setError(id ? 'Masukkan alamat email yang valid.' : 'Enter a valid email address.')
            return
        }
        setSaving(true)
        setError('')
        try {
            const res = await authedFetch('/api/email-leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: value,
                    source,
                    locale,
                    path: window.location.pathname,
                }),
            })
            if (!res.ok) throw new Error('save failed')
        } catch {
            // Supabase unreachable. Losing one address beats blocking every
            // download on the site, so let them through.
            console.warn('[email-gate] could not save the email; letting the download through')
        }
        try { localStorage.setItem(STORAGE_KEY, value) } catch { /* ignore */ }
        trackEvent(`email-gate-submit-${source}`)
        settle(true)
    }

    return (
        <EmailGateContext.Provider value={{ requireEmail }}>
            {children}
            {source && (
                <div
                    onClick={() => settle(false)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 2000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: '#fff', borderRadius: '16px', padding: '28px', width: '100%',
                            maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => settle(false)}
                            aria-label={id ? 'Tutup' : 'Close'}
                            style={{
                                position: 'absolute', top: '12px', right: '12px', background: 'none',
                                border: 'none', cursor: 'pointer', color: '#888', padding: '4px', lineHeight: 0,
                            }}
                        >
                            <X size={18} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                            <Mail size={36} color="#0d6efd" />
                        </div>
                        <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: '700', textAlign: 'center', color: '#1a1a1a' }}>
                            {id ? 'Masukkan email untuk mengunduh' : 'Enter your email to download'}
                        </h3>
                        <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#555', textAlign: 'center', lineHeight: 1.5 }}>
                            {id
                                ? 'Unduhan langsung dimulai setelah Anda kirim. Kami hanya mengirim kabar seputar Aksara Bali — tanpa spam.'
                                : 'Your download starts right after you submit. We only send Aksara Bali updates — no spam.'}
                        </p>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder={id ? 'email@anda.com' : 'you@example.com'}
                                autoFocus
                                required
                                style={{
                                    width: '100%', padding: '11px 14px', borderRadius: '10px',
                                    border: `1px solid ${error ? '#dc3545' : '#ddd'}`, fontSize: '14px',
                                    marginBottom: error ? '6px' : '14px', outline: 'none', color: '#1a1a1a',
                                }}
                            />
                            {error && (
                                <div style={{ color: '#dc3545', fontSize: '13px', marginBottom: '12px' }}>{error}</div>
                            )}
                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    width: '100%', padding: '11px', borderRadius: '10px', border: 'none',
                                    background: saving ? '#6c9fe8' : '#0d6efd', color: '#fff', fontSize: '14px',
                                    fontWeight: '600', cursor: saving ? 'default' : 'pointer',
                                }}
                            >
                                {saving
                                    ? (id ? 'Menyimpan...' : 'Saving...')
                                    : (id ? 'Kirim & Unduh' : 'Submit & Download')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </EmailGateContext.Provider>
    )
}
