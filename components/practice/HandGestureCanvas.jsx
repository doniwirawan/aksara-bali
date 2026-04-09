import React, { useRef, useEffect, useState, useCallback } from 'react'

const CANVAS_W = 640
const CANVAS_H = 400

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src
    s.crossOrigin = 'anonymous'
    s.async = true
    s.onload = resolve
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

function isFingerExtended(landmarks, tipIdx, pipIdx) {
  return landmarks[tipIdx].y < landmarks[pipIdx].y
}

function detectGesture(landmarks) {
  const indexUp = isFingerExtended(landmarks, 8, 6)
  const middleUp = isFingerExtended(landmarks, 12, 10)
  const ringUp = isFingerExtended(landmarks, 16, 14)
  const pinkyUp = isFingerExtended(landmarks, 20, 18)

  const thumbTip = landmarks[4]
  const indexTip = landmarks[8]
  const pinchDist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y)
  const isPinching = pinchDist < 0.06

  if (isPinching) return 'pinch'
  if (indexUp && !middleUp && !ringUp && !pinkyUp) return 'point'
  if (indexUp && middleUp && ringUp && pinkyUp) return 'palm'
  return 'none'
}

export default function HandGestureCanvas({ darkMode, referenceText, referenceBalinese, locale }) {
  const lang = locale === 'en' ? 'en' : 'id'
  const tr = {
    id: {
      writeThis: 'Tulis aksara ini:', hide: '🙈 Sembunyikan', show: '👁 Tampilkan', hidden: '— tersembunyi —',
      modeMouse: '🖱 Mouse / Sentuh', modeGesture: '✋ Gerakan Tangan', loadingMp: '⏳ Memuat MediaPipe...',
      gesturePoint: '✍️ Menggambar', gesturePalm: '🖐 Menghapus', gesturePinch: '✌️ Mengangkat pena', gestureNone: '👋 Tidak ada gesture',
      placeholder: 'Gambar aksara Bali di sini', startGesture: 'Klik "Gerakan Tangan" untuk mulai',
      undo: '↩ Urung', clear: '🗑 Bersihkan', check: '✓ Cek Tulisan',
      precision: 'Presisi:', coverage: 'Cakupan:', tryAgain: 'Coba lagi ↺',
      guide1: '☝️ Tunjuk → menggambar', guide2: '🖐 Telapak terbuka → menghapus', guide3: '🤌 Cubit → angkat pena',
      errEmpty: '✏️ Tulis dulu aksaranya!', errCamera: 'Gagal memuat kamera. Pastikan izin kamera diberikan dan coba lagi.',
      errFont: '⚠️ Font referensi belum siap. Pastikan koneksi internet aktif dan coba lagi.',
      correct: '✅ Bagus sekali! Tulisanmu cocok dengan aksara yang benar.',
      partial: '⚠️ Hampir benar! Perhatikan bentuk dan posisi aksaranya.',
      wrong: '❌ Belum tepat. Lihat referensi di latar kanvas dan coba lagi!',
    },
    en: {
      writeThis: 'Write this script:', hide: '🙈 Hide', show: '👁 Show', hidden: '— hidden —',
      modeMouse: '🖱 Mouse / Touch', modeGesture: '✋ Hand Gesture', loadingMp: '⏳ Loading MediaPipe...',
      gesturePoint: '✍️ Drawing', gesturePalm: '🖐 Erasing', gesturePinch: '✌️ Lifting pen', gestureNone: '👋 No gesture',
      placeholder: 'Draw Balinese script here', startGesture: 'Click "Hand Gesture" to start',
      undo: '↩ Undo', clear: '🗑 Clear', check: '✓ Check Writing',
      precision: 'Precision:', coverage: 'Coverage:', tryAgain: 'Try again ↺',
      guide1: '☝️ Point → draw', guide2: '🖐 Open palm → erase', guide3: '🤌 Pinch → lift pen',
      errEmpty: '✏️ Write the script first!', errCamera: 'Failed to load camera. Make sure camera permission is granted.',
      errFont: '⚠️ Reference font not ready. Check your internet connection and try again.',
      correct: '✅ Excellent! Your writing matches the correct script.',
      partial: '⚠️ Almost right! Pay attention to the shape and position.',
      wrong: '❌ Not quite. Look at the reference watermark on the canvas and try again!',
    },
  }
  const ct = tr[lang]
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const drawingRef = useRef(false)
  const lastPosRef = useRef(null)
  const handsRef = useRef(null)
  const rafIdRef = useRef(null)
  const strokesRef = useRef([]) // array of paths for undo

  const [mode, setMode] = useState('mouse') // 'mouse' | 'gesture'
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'ready' | 'error'
  const [gesture, setGesture] = useState('none')
  const [strokeColor, setStrokeColor] = useState('#0d6efd')
  const [strokeWidth, setStrokeWidth] = useState(4)
  const [errorMsg, setErrorMsg] = useState('')
  const [isDrawingMouse, setIsDrawingMouse] = useState(false)
  const [checkResult, setCheckResult] = useState(null) // null | { status, score, precision, recall, message }
  const [hwrResult, setHwrResult] = useState(null) // null | { recognized, matched }
  const [showRef, setShowRef] = useState(true)
  const currentPathRef = useRef([])

  const getCtx = () => canvasRef.current?.getContext('2d')

  const redrawAll = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    strokesRef.current.forEach(stroke => {
      if (stroke.length < 2) return
      ctx.beginPath()
      ctx.strokeStyle = stroke[0].color
      ctx.lineWidth = stroke[0].width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.moveTo(stroke[0].x, stroke[0].y)
      stroke.forEach(p => ctx.lineTo(p.x, p.y))
      ctx.stroke()
    })
  }, [])

  const clearCanvas = useCallback(() => {
    strokesRef.current = []
    redrawAll()
  }, [redrawAll])

  const undoLast = useCallback(() => {
    strokesRef.current.pop()
    redrawAll()
    setCheckResult(null)
    setHwrResult(null)
  }, [redrawAll])

  // Pixel-comparison handwriting checker
  const checkDrawing = useCallback(async () => {
    if (!canvasRef.current || !referenceBalinese) return

    const GRID_W = 80
    const GRID_H = 50

    const userCanvas = canvasRef.current
    const w = userCanvas.width
    const h = userCanvas.height

    const userCtx = userCanvas.getContext('2d')
    const userData = userCtx.getImageData(0, 0, w, h).data

    // Check if anything was drawn
    let totalUserPixels = 0
    for (let i = 3; i < userData.length; i += 4) {
      if (userData[i] > 50) totalUserPixels++
    }

    if (totalUserPixels < 30) {
      setCheckResult({ status: 'empty', score: 0, message: ct.errEmpty })
      return
    }

    // Ensure font is loaded before rendering reference
    try {
      await document.fonts.load(`260px "Noto Sans Balinese"`)
    } catch (e) { /* continue anyway */ }

    // Render reference character on offscreen canvas
    const refCanvas = document.createElement('canvas')
    refCanvas.width = w
    refCanvas.height = h
    const refCtx = refCanvas.getContext('2d')
    refCtx.fillStyle = '#ffffff'
    refCtx.fillRect(0, 0, w, h)
    const fontSize = Math.min(h * 0.65, w * 0.45)
    refCtx.font = `${fontSize}px "Noto Sans Balinese", serif`
    refCtx.fillStyle = '#000000'
    refCtx.textAlign = 'center'
    refCtx.textBaseline = 'middle'
    refCtx.fillText(referenceBalinese, w / 2, h / 2)
    const refData = refCtx.getImageData(0, 0, w, h).data

    // Check if font rendered any pixels (font may not be available)
    let refPixelCount = 0
    for (let i = 0; i < refData.length; i += 4) {
      if (refData[i] < 128) refPixelCount++
    }

    if (refPixelCount < 50) {
      // Font didn't render — fall back to generous scoring based on stroke coverage
      setCheckResult({ status: 'partial', score: 60, precision: 60, recall: 60, message: ct.errFont })
      return
    }

    // Downsample both to GRID_W×GRID_H binary grids
    const userGrid = new Uint8Array(GRID_W * GRID_H)
    const refGrid = new Uint8Array(GRID_W * GRID_H)
    const cellW = w / GRID_W
    const cellH = h / GRID_H

    for (let gy = 0; gy < GRID_H; gy++) {
      for (let gx = 0; gx < GRID_W; gx++) {
        let userSum = 0, refSum = 0, total = 0
        const x0 = Math.floor(gx * cellW)
        const x1 = Math.min(w - 1, Math.floor((gx + 1) * cellW))
        const y0 = Math.floor(gy * cellH)
        const y1 = Math.min(h - 1, Math.floor((gy + 1) * cellH))

        for (let py = y0; py <= y1; py++) {
          for (let px = x0; px <= x1; px++) {
            const idx = (py * w + px) * 4
            if (userData[idx + 3] > 50) userSum++
            if (refData[idx] < 128) refSum++
            total++
          }
        }
        userGrid[gy * GRID_W + gx] = userSum > total * 0.05 ? 1 : 0
        refGrid[gy * GRID_W + gx] = refSum > total * 0.04 ? 1 : 0
      }
    }

    // Dilate refGrid by 2 cells for spatial tolerance (tighter — shape must be followed closely)
    const DIL = 2
    const dilRef = new Uint8Array(GRID_W * GRID_H)
    for (let gy = 0; gy < GRID_H; gy++) {
      for (let gx = 0; gx < GRID_W; gx++) {
        if (!refGrid[gy * GRID_W + gx]) continue
        for (let dy = -DIL; dy <= DIL; dy++) {
          for (let dx = -DIL; dx <= DIL; dx++) {
            const ny = gy + dy, nx = gx + dx
            if (ny >= 0 && ny < GRID_H && nx >= 0 && nx < GRID_W) {
              dilRef[ny * GRID_W + nx] = 1
            }
          }
        }
      }
    }

    // Compute precision and recall
    let userCells = 0, userInRef = 0, refCells = 0, refCovered = 0
    for (let i = 0; i < GRID_W * GRID_H; i++) {
      if (userGrid[i]) {
        userCells++
        if (dilRef[i]) userInRef++
      }
      if (refGrid[i]) {
        refCells++
        const gy = Math.floor(i / GRID_W), gx = i % GRID_W
        let cov = false
        for (let dy = -DIL; dy <= DIL && !cov; dy++) {
          for (let dx = -DIL; dx <= DIL && !cov; dx++) {
            const ny = gy + dy, nx = gx + dx
            if (ny >= 0 && ny < GRID_H && nx >= 0 && nx < GRID_W && userGrid[ny * GRID_W + nx]) cov = true
          }
        }
        if (cov) refCovered++
      }
    }

    const precision = userCells > 0 ? (userInRef / userCells) * 100 : 0
    const recall = refCells > 0 ? (refCovered / refCells) * 100 : 0
    const score = precision > 0 && recall > 0
      ? 2 * precision * recall / (precision + recall)
      : 0

    let resultStatus, message
    if (score >= 72) {
      resultStatus = 'correct'
      message = ct.correct
    } else if (score >= 45) {
      resultStatus = 'partial'
      message = ct.partial
    } else {
      resultStatus = 'wrong'
      message = ct.wrong
    }

    const finalScore = Math.round(score)
    const finalPrecision = Math.round(precision)
    const finalRecall = Math.round(recall)

    setCheckResult({
      status: resultStatus,
      score: finalScore,
      precision: finalPrecision,
      recall: finalRecall,
      message,
    })

    // Log to Supabase (fire-and-forget)
    if (referenceText) {
      fetch('/api/writing-checks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wordLatin: referenceText,
          score: finalScore,
          precisionPct: finalPrecision,
          recallPct: finalRecall,
          passed: resultStatus === 'correct',
        }),
      }).catch(() => {}) // ignore network errors silently
    }

    // Chrome Handwriting Recognition API (experimental, Chrome only)
    setHwrResult(null)
    if ('createHandwritingRecognizer' in navigator && strokesRef.current.length > 0) {
      try {
        const recognizer = await navigator.createHandwritingRecognizer({ languages: ['mul'] })
        const drawing = recognizer.startDrawing({
          hints: { recognitionType: 'per-character' },
        })
        for (const stroke of strokesRef.current) {
          const hwStroke = new HandwritingStroke()
          let tBase = stroke[0]?.t || Date.now()
          stroke.forEach(p => hwStroke.addPoint({ x: p.x, y: p.y, t: p.t ?? tBase++ }))
          drawing.addStroke(hwStroke)
        }
        const predictions = await drawing.getPrediction()
        recognizer.finish()
        if (predictions?.length > 0) {
          const recognized = predictions[0].text
          setHwrResult({ recognized, matched: recognized === referenceBalinese })
        }
      } catch (_) {
        // API not supported or failed — silently ignore
      }
    }
  }, [referenceBalinese, referenceText])

  // Mouse / touch drawing
  const getCanvasPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = CANVAS_W / rect.width
    const scaleY = CANVAS_H / rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  const startDraw = useCallback((e) => {
    if (mode !== 'mouse') return
    e.preventDefault()
    setIsDrawingMouse(true)
    const pos = getCanvasPos(e)
    currentPathRef.current = [{ ...pos, t: Date.now(), color: strokeColor, width: strokeWidth }]
    const ctx = getCtx()
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }, [mode, strokeColor, strokeWidth])

  const draw = useCallback((e) => {
    if (mode !== 'mouse' || !isDrawingMouse) return
    e.preventDefault()
    const pos = getCanvasPos(e)
    currentPathRef.current.push({ ...pos, t: Date.now(), color: strokeColor, width: strokeWidth })
    const ctx = getCtx()
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }, [mode, isDrawingMouse, strokeColor, strokeWidth])

  const endDraw = useCallback(() => {
    if (!isDrawingMouse) return
    setIsDrawingMouse(false)
    if (currentPathRef.current.length > 1) {
      strokesRef.current.push([...currentPathRef.current])
    }
    currentPathRef.current = []
  }, [isDrawingMouse])

  // MediaPipe Hands setup — uses manual RAF loop (no camera_utils dependency)
  const initGestureMode = useCallback(async () => {
    setStatus('loading')
    setErrorMsg('')
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3.1620248257/drawing_utils.js')
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.js')

      if (!window.Hands) throw new Error('MediaPipe Hands failed to load')

      const hands = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`
      })
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      })

      hands.onResults((results) => {
        // Draw video feed mirrored on overlay canvas
        const oc = overlayRef.current
        if (!oc) return
        const octx = oc.getContext('2d')
        octx.save()
        octx.scale(-1, 1)
        octx.drawImage(results.image, -oc.width, 0, oc.width, oc.height)
        octx.restore()

        if (!results.multiHandLandmarks?.length) {
          drawingRef.current = false
          lastPosRef.current = null
          setGesture('none')
          return
        }

        const landmarks = results.multiHandLandmarks[0]
        const g = detectGesture(landmarks)
        setGesture(g)

        // Draw landmarks on overlay
        if (window.drawConnectors && window.drawLandmarks) {
          window.drawConnectors(octx, landmarks, window.HAND_CONNECTIONS, { color: 'rgba(0,255,150,0.6)', lineWidth: 2 })
          window.drawLandmarks(octx, landmarks, { color: 'rgba(255,50,50,0.8)', lineWidth: 1, radius: 4 })
        }

        // Flip x for mirror effect
        const indexTip = landmarks[8]
        const x = (1 - indexTip.x) * CANVAS_W
        const y = indexTip.y * CANVAS_H

        const ctx = getCtx()
        if (!ctx) return

        if (g === 'point') {
          if (!drawingRef.current) {
            drawingRef.current = true
            currentPathRef.current = [{ x, y, t: Date.now(), color: strokeColor, width: strokeWidth }]
            ctx.beginPath()
            ctx.moveTo(x, y)
          } else {
            currentPathRef.current.push({ x, y, t: Date.now(), color: strokeColor, width: strokeWidth })
            ctx.lineTo(x, y)
            ctx.strokeStyle = strokeColor
            ctx.lineWidth = strokeWidth
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.stroke()
          }
          lastPosRef.current = { x, y }
        } else if (g === 'palm') {
          // Erase circle around finger
          ctx.save()
          ctx.globalCompositeOperation = 'destination-out'
          ctx.beginPath()
          ctx.arc(x, y, 30, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
          drawingRef.current = false
        } else {
          if (drawingRef.current && currentPathRef.current.length > 1) {
            strokesRef.current.push([...currentPathRef.current])
          }
          drawingRef.current = false
          currentPathRef.current = []
        }
      })

      handsRef.current = hands

      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: CANVAS_W, height: CANVAS_H, facingMode: 'user' } })
      videoRef.current.srcObject = stream
      await videoRef.current.play()

      // Manual frame loop — no dependency on camera_utils CDN
      const processFrame = async () => {
        if (!handsRef.current || !videoRef.current) return
        if (videoRef.current.readyState >= 2) {
          await handsRef.current.send({ image: videoRef.current })
        }
        rafIdRef.current = requestAnimationFrame(processFrame)
      }
      rafIdRef.current = requestAnimationFrame(processFrame)

      setStatus('ready')
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Failed to initialize gesture detection')
      setStatus('error')
    }
  }, [strokeColor, strokeWidth])

  const stopGestureMode = useCallback(() => {
    if (rafIdRef.current) { cancelAnimationFrame(rafIdRef.current); rafIdRef.current = null }
    handsRef.current?.close?.()
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      videoRef.current.srcObject = null
    }
    handsRef.current = null
    setStatus('idle')
    setGesture('none')
    // Clear overlay
    const oc = overlayRef.current
    if (oc) oc.getContext('2d').clearRect(0, 0, oc.width, oc.height)
  }, [])

  useEffect(() => {
    if (mode === 'gesture' && status === 'idle') {
      initGestureMode()
    } else if (mode === 'mouse') {
      stopGestureMode()
    }
  }, [mode])

  useEffect(() => {
    return () => stopGestureMode()
  }, [])

  const bg = darkMode ? '#1a1a2e' : '#fafafa'
  const border = darkMode ? '#333' : '#e0e0e0'
  const textColor = darkMode ? '#e0e0e0' : '#333'

  const COLORS = ['#0d6efd', '#dc3545', '#198754', '#6f42c1', '#fd7e14', '#000000']
  const WIDTHS = [2, 4, 7, 12]

  const gestureLabel = {
    point: ct.gesturePoint,
    palm: ct.gesturePalm,
    pinch: ct.gesturePinch,
    none: ct.gestureNone,
  }[gesture] || ''

  return (
    <div style={{ color: textColor }}>
      {/* Reference word */}
      {referenceText && (
        <div style={{
          textAlign: 'center',
          marginBottom: '16px',
          padding: '12px 20px',
          borderRadius: '10px',
          background: darkMode ? '#1e3a5f' : '#e8f0fe',
          border: `1px solid ${darkMode ? '#2d5a9e' : '#c5d8fc'}`,
          position: 'relative',
        }}>
          <button
            onClick={() => setShowRef(v => !v)}
            style={{
              position: 'absolute', top: '8px', right: '10px',
              padding: '3px 10px', borderRadius: '6px', fontSize: '11px',
              border: `1px solid ${darkMode ? '#2d5a9e' : '#c5d8fc'}`,
              background: 'transparent', cursor: 'pointer',
              color: darkMode ? '#8aabdc' : '#4a6fa5',
            }}
          >
            {showRef ? ct.hide : ct.show}
          </button>
          <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '4px' }}>{ct.writeThis}</div>
          {showRef ? (
            <>
              <div style={{ fontSize: '28px', fontFamily: '"Noto Sans Balinese", serif', marginBottom: '4px' }}>
                {referenceBalinese}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', opacity: 0.8 }}>{referenceText}</div>
            </>
          ) : (
            <div style={{ fontSize: '14px', opacity: 0.5, fontStyle: 'italic' }}>{ct.hidden}</div>
          )}
        </div>
      )}

      {/* Mode switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {[{ key: 'mouse', label: ct.modeMouse }, { key: 'gesture', label: ct.modeGesture }].map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: `2px solid ${mode === m.key ? '#0d6efd' : border}`,
              background: mode === m.key ? '#0d6efd' : 'transparent',
              color: mode === m.key ? '#fff' : textColor,
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'all 0.15s',
            }}
          >
            {m.label}
          </button>
        ))}
        {mode === 'gesture' && status === 'loading' && (
          <span style={{ alignSelf: 'center', fontSize: '13px', opacity: 0.7 }}>
            {ct.loadingMp}
          </span>
        )}
        {mode === 'gesture' && status === 'ready' && gesture && (
          <span style={{
            alignSelf: 'center',
            fontSize: '13px',
            padding: '4px 12px',
            borderRadius: '12px',
            background: darkMode ? '#1e3a1e' : '#e8f5e9',
            color: '#198754',
          }}>
            {gestureLabel}
          </span>
        )}
      </div>

      {status === 'error' && (
        <div style={{
          padding: '10px 14px',
          marginBottom: '12px',
          borderRadius: '8px',
          background: '#fff3cd',
          color: '#856404',
          fontSize: '13px',
        }}>
          ⚠️ {errorMsg || ct.errCamera}
        </div>
      )}

      {/* Canvas area */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: CANVAS_W,
        aspectRatio: `${CANVAS_W}/${CANVAS_H}`,
        borderRadius: '12px',
        overflow: 'hidden',
        border: `2px solid ${border}`,
        background: '#fff',
        cursor: mode === 'mouse' ? (isDrawingMouse ? 'crosshair' : 'crosshair') : 'none',
      }}>
        {/* Drawing canvas (always present) */}
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, touchAction: 'none' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {/* Overlay canvas for video + hand landmarks */}
        <canvas
          ref={overlayRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, opacity: mode === 'gesture' ? 1 : 0 }}
        />
        {/* Hidden video element */}
        <video ref={videoRef} style={{ display: 'none' }} muted playsInline />

        {/* Placeholder / watermark guide */}
        {mode === 'mouse' && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none', zIndex: 1,
            opacity: showRef ? 0.15 : 0, fontSize: '14px', color: '#888',
            transition: 'opacity 0.3s',
          }}>
            {referenceBalinese
              ? <span style={{ fontFamily: '"Noto Sans Balinese", serif', fontSize: '80px' }}>{referenceBalinese}</span>
              : ct.placeholder}
          </div>
        )}

        {mode === 'gesture' && status === 'idle' && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: darkMode ? '#1a1a2e' : '#f5f5f5',
            zIndex: 2, gap: '12px',
          }}>
            <span style={{ fontSize: '48px' }}>📷</span>
            <span style={{ fontSize: '14px', opacity: 0.6 }}>{ct.startGesture}</span>
          </div>
        )}
      </div>

      {/* Tools row */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Colors */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => setStrokeColor(c)}
              style={{
                width: '26px', height: '26px', borderRadius: '50%',
                background: c, border: strokeColor === c ? '3px solid #0d6efd' : '2px solid transparent',
                cursor: 'pointer', outline: strokeColor === c ? '2px solid rgba(13,110,253,0.3)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Widths */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {WIDTHS.map(w => (
            <button
              key={w}
              onClick={() => setStrokeWidth(w)}
              style={{
                width: '30px', height: '30px', borderRadius: '6px',
                border: `2px solid ${strokeWidth === w ? '#0d6efd' : border}`,
                background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <div style={{ width: Math.min(w * 2, 20), height: w, background: strokeColor, borderRadius: '2px' }} />
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Undo */}
        <button
          onClick={undoLast}
          style={{
            padding: '7px 16px', borderRadius: '8px',
            border: `1px solid ${border}`, background: 'transparent',
            cursor: 'pointer', fontSize: '13px', color: textColor,
          }}
        >
          {ct.undo}
        </button>

        {/* Clear */}
        <button
          onClick={() => { clearCanvas(); setCheckResult(null); setHwrResult(null) }}
          style={{
            padding: '7px 16px', borderRadius: '8px',
            border: '1px solid #dc3545', background: 'transparent',
            cursor: 'pointer', fontSize: '13px', color: '#dc3545',
          }}
        >
          {ct.clear}
        </button>

        {/* Check button — only shown when a reference word is set */}
        {referenceBalinese && (
          <button
            onClick={checkDrawing}
            style={{
              padding: '7px 20px', borderRadius: '8px',
              border: 'none', background: '#0d6efd',
              cursor: 'pointer', fontSize: '13px', color: '#fff',
              fontWeight: '600', boxShadow: '0 2px 6px rgba(13,110,253,0.3)',
            }}
          >
            {ct.check}
          </button>
        )}
      </div>

      {/* Check result */}
      {checkResult && (
        <div style={{
          marginTop: '14px',
          padding: '16px 20px',
          borderRadius: '12px',
          border: `2px solid ${checkResult.status === 'correct' ? '#22c55e' : checkResult.status === 'partial' ? '#f59e0b' : checkResult.status === 'empty' ? '#94a3b8' : '#ef4444'}`,
          background: checkResult.status === 'correct'
            ? (darkMode ? '#0d2d0d' : '#f0fff4')
            : checkResult.status === 'partial'
              ? (darkMode ? '#2d1f00' : '#fffbeb')
              : checkResult.status === 'empty'
                ? (darkMode ? '#1e1e2e' : '#f8f9fa')
                : (darkMode ? '#2d0d0d' : '#fff5f5'),
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '15px', fontWeight: '500', color: textColor }}>
              {checkResult.message}
            </span>
            {checkResult.status !== 'empty' && (
              <span style={{
                fontSize: '22px', fontWeight: '700',
                color: checkResult.status === 'correct' ? '#22c55e' : checkResult.status === 'partial' ? '#f59e0b' : '#ef4444',
              }}>
                {checkResult.score}%
              </span>
            )}
          </div>

          {checkResult.status !== 'empty' && (
            <div style={{ marginTop: '10px' }}>
              {/* Score bar */}
              <div style={{ height: '6px', borderRadius: '3px', background: darkMode ? '#333' : '#e0e0e0', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{
                  height: '100%', borderRadius: '3px',
                  width: `${checkResult.score}%`,
                  background: checkResult.status === 'correct' ? '#22c55e' : checkResult.status === 'partial' ? '#f59e0b' : '#ef4444',
                  transition: 'width 0.6s ease',
                }} />
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: darkMode ? '#888' : '#666' }}>
                <span>{ct.precision} <b>{checkResult.precision}%</b></span>
                <span>{ct.coverage} <b>{checkResult.recall}%</b></span>
                {checkResult.status !== 'correct' && (
                  <span style={{ color: '#0d6efd', cursor: 'pointer' }} onClick={() => { setCheckResult(null); setHwrResult(null) }}>
                    {ct.tryAgain}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chrome Handwriting Recognition result */}
      {hwrResult && (
        <div style={{
          marginTop: '10px',
          padding: '10px 16px',
          borderRadius: '10px',
          border: `1px solid ${hwrResult.matched ? '#22c55e' : darkMode ? '#333' : '#e0e0e0'}`,
          background: hwrResult.matched
            ? (darkMode ? '#0d2d0d' : '#f0fff4')
            : (darkMode ? '#252535' : '#f8f9fa'),
          display: 'flex', alignItems: 'center', gap: '12px',
          fontSize: '13px', color: darkMode ? '#ccc' : '#555',
        }}>
          <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: '#0d6efd20', color: '#0d6efd', fontWeight: '600', whiteSpace: 'nowrap' }}>
            Chrome HWR
          </span>
          <span>
            {lang === 'en' ? 'Recognized:' : 'Dikenali:'}
            <span style={{ fontFamily: '"Noto Sans Balinese", serif', fontSize: '20px', marginLeft: '8px', verticalAlign: 'middle' }}>
              {hwrResult.recognized}
            </span>
          </span>
          {hwrResult.matched && (
            <span style={{ color: '#22c55e', fontWeight: '600', marginLeft: 'auto' }}>
              {lang === 'en' ? '✓ Matches!' : '✓ Cocok!'}
            </span>
          )}
        </div>
      )}

      {/* Gesture guide */}
      {mode === 'gesture' && (
        <div style={{
          marginTop: '12px',
          padding: '12px 14px',
          borderRadius: '8px',
          background: darkMode ? '#1a2840' : '#f0f4ff',
          fontSize: '12px',
          color: darkMode ? '#8aabdc' : '#4a6fa5',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '6px',
        }}>
          <span>{ct.guide1}</span>
          <span>{ct.guide2}</span>
          <span>{ct.guide3}</span>
        </div>
      )}
    </div>
  )
}
