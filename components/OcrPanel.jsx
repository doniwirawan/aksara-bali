'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { ScanText, Upload, Camera, RefreshCw, AlertTriangle, ImageIcon } from 'lucide-react'
import { recognizeBalinese, isModelAvailable, disposeOcr } from '../utils/balineseOcr'

// Reusable "read Aksara Bali from an image" panel: pick/snap an image, run the
// in-browser OCR, and hand the result back via onResult. Rendering of the result
// is left to the caller (the /read page shows cards; the converter fills its
// reverse-mode input), so this component stays focused on capture + recognise.

const T = {
  id: {
    drop: 'Seret gambar ke sini, atau',
    choose: 'Pilih gambar',
    camera: 'Ambil foto',
    read: 'Baca aksara',
    reading: 'Membaca…',
    again: 'Baca ulang',
    errorTitle: 'Gagal membaca',
    modelMissingTitle: 'Model OCR belum terpasang',
    modelMissingBody:
      'Fitur baca-dari-foto memakai model aksara Bali khusus yang harus dilatih dulu (gratis, jalan di browser). Ikuti panduan di scripts/ocr/README.md, lalu letakkan ban.traineddata di public/tessdata/.',
  },
  en: {
    drop: 'Drag an image here, or',
    choose: 'Choose image',
    camera: 'Take photo',
    read: 'Read script',
    reading: 'Reading…',
    again: 'Read again',
    errorTitle: 'Could not read',
    modelMissingTitle: 'OCR model not installed yet',
    modelMissingBody:
      'The read-from-photo feature uses a dedicated Balinese model that must be trained first (free, runs in-browser). Follow scripts/ocr/README.md, then drop ban.traineddata into public/tessdata/.',
  },
}

export default function OcrPanel({ locale = 'en', darkMode = false, onResult }) {
  const t = T[locale] || T.en
  const [imageUrl, setImageUrl] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | reading | done | error
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [modelReady, setModelReady] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const galleryInput = useRef(null)
  const cameraInput = useRef(null)

  useEffect(() => {
    isModelAvailable().then(setModelReady)
    return () => { disposeOcr() }
  }, [])

  const pickImage = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImageUrl((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(file) })
    setImageFile(file)
    setErrorMsg('')
    setStatus('idle')
  }, [])

  const runOcr = useCallback(async () => {
    if (!imageFile) return
    setStatus('reading')
    setProgress(0)
    setErrorMsg('')
    try {
      const res = await recognizeBalinese(imageFile, { onProgress: setProgress })
      setStatus('done')
      onResult?.(res)
    } catch (err) {
      console.error('[OCR] failed:', err)
      setErrorMsg(err?.message || String(err))
      setStatus('error')
    }
  }, [imageFile, onResult])

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const border = darkMode ? '#2a2a3e' : '#e8e8e0'
  const muted = darkMode ? '#9aa' : '#666'
  const textColor = darkMode ? '#e8e8e8' : '#1a1a1a'

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {modelReady === false && (
        <div style={{ background: darkMode ? '#3a2e13' : '#fff8e6', border: `1px solid ${darkMode ? '#7a5c1e' : '#f0d98a'}`, borderRadius: 12, padding: '12px 14px', marginBottom: 12, display: 'flex', gap: 10 }}>
          <AlertTriangle size={18} color="#d9a406" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 700, color: textColor, marginBottom: 2, fontSize: 13 }}>{t.modelMissingTitle}</div>
            <div style={{ fontSize: 12, color: muted, lineHeight: 1.5 }}>{t.modelMissingBody}</div>
          </div>
        </div>
      )}

      <input ref={galleryInput} type="file" accept="image/*" hidden onChange={(e) => pickImage(e.target.files?.[0])} />
      <input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden onChange={(e) => pickImage(e.target.files?.[0])} />

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); pickImage(e.dataTransfer.files?.[0]) }}
        style={{
          background: cardBg,
          border: `2px dashed ${dragOver ? '#0d6efd' : border}`,
          borderRadius: 14,
          padding: imageUrl ? 10 : '28px 16px',
          textAlign: 'center',
          transition: 'border-color 0.15s',
        }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="preview" style={{ maxWidth: '100%', maxHeight: 280, borderRadius: 8, display: 'block', margin: '0 auto' }} />
        ) : (
          <>
            <ImageIcon size={32} color={muted} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 13, color: muted, marginBottom: 12 }}>{t.drop}</div>
          </>
        )}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: imageUrl ? 10 : 0 }}>
          <button type="button" onClick={() => galleryInput.current?.click()} className="btn btn-outline-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Upload size={14} /> {t.choose}
          </button>
          <button type="button" onClick={() => cameraInput.current?.click()} className="btn btn-outline-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Camera size={14} /> {t.camera}
          </button>
        </div>
      </div>

      {imageUrl && (
        <button
          type="button"
          onClick={runOcr}
          disabled={status === 'reading' || modelReady === false}
          className="btn btn-primary w-100 mt-2"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', fontWeight: 600 }}
        >
          {status === 'reading' ? (
            <><RefreshCw size={16} className="ocr-spin" /> {t.reading} {Math.round(progress * 100)}%</>
          ) : (
            <><ScanText size={16} /> {status === 'done' ? t.again : t.read}</>
          )}
        </button>
      )}

      {status === 'error' && (
        <div style={{ background: darkMode ? '#3a1a1a' : '#fdecea', border: `1px solid ${darkMode ? '#7a2e2e' : '#f5c2c0'}`, borderRadius: 12, padding: '12px 14px', marginTop: 12 }}>
          <div style={{ fontWeight: 700, color: '#dc3545', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <AlertTriangle size={15} /> {t.errorTitle}
          </div>
          <div style={{ fontSize: 12, color: muted, wordBreak: 'break-word' }}>{errorMsg}</div>
        </div>
      )}

      <style jsx>{`
        .ocr-spin { animation: ocr-spin 0.9s linear infinite; }
        @keyframes ocr-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
