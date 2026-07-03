import React, { useRef, useEffect, useState, useCallback } from 'react'
import { authedFetch } from '../../utils/supabase'
import { Eye, EyeOff, MousePointer2, Hand, Undo2, Trash2, Check, Camera, AlertTriangle, Pointer, Grab, Maximize, Minimize, Loader } from 'lucide-react'

const CANVAS_W = 800
const CANVAS_H = 500

// ── Gesture-writing state machine config (easy to tweak) ───────────────────
const START_CONFIRM_FRAMES = 3          // consecutive write-pose frames before a stroke starts
const LOST_FRAME_LIMIT = 7              // min consecutive lost frames before a stroke may end
const STROKE_END_TIMEOUT_MS = 350       // desktop: ms of lost tracking before a stroke ends
const MOBILE_STROKE_END_TIMEOUT_MS = 500
const MIN_POINT_DISTANCE_PX = 3         // ignore micro-jitter below this distance
const MAX_POINT_GAP_PX = 220            // only break the line across truly large jumps (glitches)
const SMOOTHING_ALPHA = 0.5             // EMA factor for fingertip (0..1, higher = snappier/less lag)
const ERASER_RADIUS_PX = 75             // open-palm eraser radius (logical px)
const AUTOCHECK_MS = 2500               // idle time after writing before auto-scoring

const IS_MOBILE = typeof navigator !== 'undefined' &&
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '')

// Supersample the drawing canvas to the device pixel ratio (min 2x) so strokes
// stay crisp when the canvas is displayed larger than its logical size.
const DRAW_SCALE = typeof window !== 'undefined'
  ? Math.min(Math.max(window.devicePixelRatio || 1, 2), 3)
  : 2

const MP_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915'
const MP_DRAWING_SCRIPT = 'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3.1620248257/drawing_utils.js'
const MP_HANDS_SCRIPT = `${MP_BASE}/hands.js`

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

// Require tip to be above PIP by at least 30% of the PIP-MCP segment length
// This prevents barely-lifted fingers from registering as extended
function isFingerExtended(landmarks, tipIdx, pipIdx, mcpIdx) {
  const tip = landmarks[tipIdx]
  const pip = landmarks[pipIdx]
  const mcp = landmarks[mcpIdx]
  const pipMcpDist = Math.hypot(pip.x - mcp.x, pip.y - mcp.y)
  return (pip.y - tip.y) > pipMcpDist * 0.3
}

// Raw gesture detection from a single frame
function detectRawGesture(landmarks, pinching) {
  const indexUp  = isFingerExtended(landmarks,  8,  6,  5)
  const middleUp = isFingerExtended(landmarks, 12, 10,  9)
  const ringUp   = isFingerExtended(landmarks, 16, 14, 13)
  const pinkyUp  = isFingerExtended(landmarks, 20, 18, 17)

  if (pinching) return 'pinch'
  // Palm: at least 3 of 4 fingers extended (erase)
  const upCount = (indexUp ? 1 : 0) + (middleUp ? 1 : 0) + (ringUp ? 1 : 0) + (pinkyUp ? 1 : 0)
  if (upCount >= 3) return 'palm'
  // Point: index extended and middle not — ring/pinky are ignored so the pose
  // doesn't flicker out during fast strokes (a common cause of broken lines).
  if (indexUp && !middleUp) return 'point'
  return 'none'
}

// Stable pinch state (hysteresis: enter at <0.055, exit at >0.085)
let _pinching = false
function updatePinch(landmarks) {
  const dist = Math.hypot(landmarks[4].x - landmarks[8].x, landmarks[4].y - landmarks[8].y)
  if (!_pinching && dist < 0.055) _pinching = true
  else if (_pinching && dist > 0.085) _pinching = false
  return _pinching
}

export default function HandGestureCanvas({ darkMode, referenceText, referenceBalinese, locale, onSolved, quizMode = false }) {
  const lang = locale === 'en' ? 'en' : 'id'
  const tr = {
    id: {
      writeThis: 'Tulis aksara ini:', hide: 'Sembunyikan', show: 'Tampilkan', hidden: '— tersembunyi —',
      modeMouse: 'Mouse / Sentuh', modeGesture: 'Gerakan Tangan', loadingMp: 'Memuat MediaPipe...',
      gesturePoint: 'Menggambar', gesturePalm: 'Menghapus', gesturePinch: 'Mengangkat pena', gestureNone: 'Tidak ada gesture',
      placeholder: 'Gambar aksara Bali di sini', startGesture: 'Klik "Gerakan Tangan" untuk mulai',
      undo: 'Urung', clear: 'Bersihkan', check: 'Cek Tulisan',
      showGuide: 'Tampilkan pola', hideGuide: 'Sembunyikan pola',
      precision: 'Presisi:', coverage: 'Cakupan:', tryAgain: 'Coba lagi',
      guide1: 'Tunjuk → menggambar', guide2: 'Telapak terbuka → menghapus', guide3: 'Cubit → angkat pena',
      errEmpty: 'Tulis dulu aksaranya!', errCamera: 'Gagal memuat kamera. Pastikan izin kamera diberikan dan coba lagi.',
      errFont: 'Font referensi belum siap. Pastikan koneksi internet aktif dan coba lagi.',
      correct: 'Bagus sekali! Tulisanmu cocok dengan aksara yang benar.',
      partial: 'Hampir benar! Perhatikan bentuk dan posisi aksaranya.',
      wrong: 'Belum tepat. Lihat referensi di latar kanvas dan coba lagi!',
    },
    en: {
      writeThis: 'Write this script:', hide: 'Hide', show: 'Show', hidden: '— hidden —',
      modeMouse: 'Mouse / Touch', modeGesture: 'Hand Gesture', loadingMp: 'Loading MediaPipe...',
      gesturePoint: 'Drawing', gesturePalm: 'Erasing', gesturePinch: 'Lifting pen', gestureNone: 'No gesture',
      placeholder: 'Draw Balinese script here', startGesture: 'Click "Hand Gesture" to start',
      undo: 'Undo', clear: 'Clear', check: 'Check Writing',
      showGuide: 'Show guide', hideGuide: 'Hide guide',
      precision: 'Precision:', coverage: 'Coverage:', tryAgain: 'Try again',
      guide1: 'Point → draw', guide2: 'Open palm → erase', guide3: 'Pinch → lift pen',
      errEmpty: 'Write the script first!', errCamera: 'Failed to load camera. Make sure camera permission is granted.',
      errFont: 'Reference font not ready. Check your internet connection and try again.',
      correct: 'Excellent! Your writing matches the correct script.',
      partial: 'Almost right! Pay attention to the shape and position.',
      wrong: 'Not quite. Look at the reference watermark on the canvas and try again!',
    },
  }
  const ct = tr[lang]
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const handsRef = useRef(null)
  const rafIdRef = useRef(null)
  const strokesRef = useRef([]) // array of paths for undo
  const gestureBufferRef = useRef([]) // last N raw gestures for stability
  const stableGestureRef = useRef('none') // confirmed stable gesture
  const GESTURE_BUFFER = 3 // frames required before gesture change is accepted

  // Writing state machine: 'idle' | 'writing' | 'pending_end'
  const writeStateRef = useRef('idle')
  const lostFramesRef = useRef(0)    // consecutive frames without a valid write pose
  const lostSinceRef = useRef(0)     // timestamp (ms) when tracking/pose was lost
  const startConfirmRef = useRef(0)  // consecutive write-pose frames seen while idle
  const smoothedRef = useRef(null)   // EMA-smoothed fingertip position { x, y }

  const [mode, setMode] = useState('mouse') // 'mouse' | 'gesture'
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'ready' | 'error'
  const [gesture, setGesture] = useState('none')
  const [strokeColor, setStrokeColor] = useState('#0d6efd')
  const [strokeWidth, setStrokeWidth] = useState(4)
  const [errorMsg, setErrorMsg] = useState('')
  const [isDrawingMouse, setIsDrawingMouse] = useState(false)
  const [checkResult, setCheckResult] = useState(null) // null | { status, score, precision, recall, message }
  const [hwrResult, setHwrResult] = useState(null) // null | { recognized, matched }
  // In a quiz we must NOT reveal the answer, so the reference aksara starts hidden.
  const [showRef, setShowRef] = useState(!quizMode)
  const [showOverlay, setShowOverlay] = useState(true) // faint aksara guide on the canvas
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0) // MediaPipe init progress 0..100
  const currentPathRef = useRef([])
  const canvasAreaRef = useRef(null)
  const liveMidRef = useRef(null) // last midpoint, for smooth live curves
  const readyRef = useRef(false) // first processed frame = model ready
  const lastActivityRef = useRef(0) // timestamp of last drawing activity (for auto-check)
  const autoCheckedRef = useRef(false) // guard so we auto-score only once per drawing
  const checkDrawingRef = useRef(null) // latest checkDrawing for the rAF loop

  const getCtx = () => canvasRef.current?.getContext('2d')

  // Map logical (CANVAS_W×CANVAS_H) coords to the supersampled backing store
  const applyDrawTransform = (ctx) => {
    ctx.setTransform(DRAW_SCALE, 0, 0, DRAW_SCALE, 0, 0)
    ctx.imageSmoothingEnabled = true
  }

  const drawStroke = (ctx, stroke) => {
    if (stroke.length < 2) return
    ctx.beginPath()
    ctx.strokeStyle = stroke[0].color
    ctx.lineWidth = stroke[0].width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.moveTo(stroke[0].x, stroke[0].y)
    for (let i = 1; i < stroke.length; i++) {
      const p = stroke[i]
      // A break point (stroke resumed after a large tracking gap) starts a new
      // sub-path instead of drawing a line across the gap.
      if (p.brk) { ctx.moveTo(p.x, p.y); continue }
      const next = stroke[i + 1]
      if (next && !next.brk) {
        const mid = { x: (p.x + next.x) / 2, y: (p.y + next.y) / 2 }
        ctx.quadraticCurveTo(p.x, p.y, mid.x, mid.y)
      } else {
        ctx.lineTo(p.x, p.y)
      }
    }
    ctx.stroke()
  }

  const redrawAll = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    applyDrawTransform(ctx)
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    strokesRef.current.forEach(stroke => drawStroke(ctx, stroke))
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

    // ── Normalize by bounding box so writing position & size don't matter ──
    // (a correctly-shaped character drawn smaller / off-centre should still score
    //  well; only the SHAPE should drive the score.)
    const NORM = 64
    const userTest = (idx) => userData[idx + 3] > 50
    const refTest = (idx) => refData[idx] < 128

    const bbox = (test) => {
      let minX = w, minY = h, maxX = -1, maxY = -1
      for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
          if (test((py * w + px) * 4)) {
            if (px < minX) minX = px
            if (px > maxX) maxX = px
            if (py < minY) minY = py
            if (py > maxY) maxY = py
          }
        }
      }
      return maxX < 0 ? null : { minX, minY, w: maxX - minX + 1, h: maxY - minY + 1 }
    }

    // Rasterize a source into an NORM×NORM grid, fitting its bbox while
    // preserving aspect ratio and centring it.
    const rasterize = (test, bb) => {
      const grid = new Uint8Array(NORM * NORM)
      const scale = (NORM - 2) / Math.max(bb.w, bb.h)
      const offX = (NORM - bb.w * scale) / 2
      const offY = (NORM - bb.h * scale) / 2
      for (let py = bb.minY; py < bb.minY + bb.h; py++) {
        for (let px = bb.minX; px < bb.minX + bb.w; px++) {
          if (!test((py * w + px) * 4)) continue
          const gx = Math.floor(offX + (px - bb.minX) * scale)
          const gy = Math.floor(offY + (py - bb.minY) * scale)
          if (gx >= 0 && gx < NORM && gy >= 0 && gy < NORM) grid[gy * NORM + gx] = 1
        }
      }
      return grid
    }

    const ubb = bbox(userTest)
    const rbb = bbox(refTest)
    if (!ubb || !rbb) {
      setCheckResult({ status: 'empty', score: 0, message: ct.errEmpty })
      return
    }

    const userGrid = rasterize(userTest, ubb)
    const refGrid = rasterize(refTest, rbb)

    // ── Chamfer distance matching (shape-aware; a blob or a scribble far from
    //    the true strokes scores low, unlike plain overlap) ──
    // Two-pass chamfer distance transform: distance from every cell to the
    // nearest set ("ink") cell.
    const distanceTransform = (grid) => {
      const INF = 1e9
      const d = new Float32Array(NORM * NORM)
      for (let i = 0; i < d.length; i++) d[i] = grid[i] ? 0 : INF
      for (let y = 0; y < NORM; y++) {
        for (let x = 0; x < NORM; x++) {
          const i = y * NORM + x
          if (y > 0) d[i] = Math.min(d[i], d[i - NORM] + 1)
          if (x > 0) d[i] = Math.min(d[i], d[i - 1] + 1)
          if (y > 0 && x > 0) d[i] = Math.min(d[i], d[i - NORM - 1] + 1.4142)
          if (y > 0 && x < NORM - 1) d[i] = Math.min(d[i], d[i - NORM + 1] + 1.4142)
        }
      }
      for (let y = NORM - 1; y >= 0; y--) {
        for (let x = NORM - 1; x >= 0; x--) {
          const i = y * NORM + x
          if (y < NORM - 1) d[i] = Math.min(d[i], d[i + NORM] + 1)
          if (x < NORM - 1) d[i] = Math.min(d[i], d[i + 1] + 1)
          if (y < NORM - 1 && x < NORM - 1) d[i] = Math.min(d[i], d[i + NORM + 1] + 1.4142)
          if (y < NORM - 1 && x > 0) d[i] = Math.min(d[i], d[i + NORM - 1] + 1.4142)
        }
      }
      return d
    }

    const dtRef = distanceTransform(refGrid)   // distance to nearest reference ink
    const dtUser = distanceTransform(userGrid) // distance to nearest user ink
    const TAU = 6 // tolerance (grid cells) covering stroke width + wobble

    // Precision: how close the user's ink sits to the reference shape.
    // Recall: how well the reference shape is covered by the user's ink.
    // Each contribution falls off linearly with distance (1 on the stroke,
    // 0 beyond TAU), so being roughly right counts and being off does not.
    let pSum = 0, pN = 0, rSum = 0, rN = 0
    for (let i = 0; i < NORM * NORM; i++) {
      if (userGrid[i]) { pN++; pSum += Math.max(0, 1 - dtRef[i] / TAU) }
      if (refGrid[i]) { rN++; rSum += Math.max(0, 1 - dtUser[i] / TAU) }
    }
    const precision = pN > 0 ? (pSum / pN) * 100 : 0
    const recall = rN > 0 ? (rSum / rN) * 100 : 0
    const score = precision > 0 && recall > 0
      ? 2 * precision * recall / (precision + recall)
      : 0

    let resultStatus, message
    if (score >= 55) {
      resultStatus = 'correct'
      message = ct.correct
    } else if (score >= 30) {
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

    // Good result → automatically move on to the next word.
    if (resultStatus === 'correct' && onSolved) {
      setTimeout(() => onSolved(), 1500)
    }

    // Log to Supabase (fire-and-forget)
    if (referenceText) {
      authedFetch('/api/writing-checks', {
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
  }, [referenceBalinese, referenceText, onSolved])

  // Keep a ref to the latest checkDrawing so the gesture loop can auto-score
  useEffect(() => { checkDrawingRef.current = checkDrawing }, [checkDrawing])

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
    const path = currentPathRef.current
    path.push({ ...pos, t: Date.now(), color: strokeColor, width: strokeWidth })
    const ctx = getCtx()
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (path.length >= 3) {
      const prev = path[path.length - 2]
      const mid = { x: (prev.x + pos.x) / 2, y: (prev.y + pos.y) / 2 }
      ctx.quadraticCurveTo(prev.x, prev.y, mid.x, mid.y)
    } else {
      ctx.lineTo(pos.x, pos.y)
    }
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
    readyRef.current = false
    setLoadProgress(8)
    try {
      await loadScript(MP_DRAWING_SCRIPT)
      setLoadProgress(25)
      await loadScript(MP_HANDS_SCRIPT)
      setLoadProgress(45)

      if (!window.Hands) throw new Error('MediaPipe Hands failed to load')

      const hands = new window.Hands({
        locateFile: (file) => `${MP_BASE}/${file}`
      })
      setLoadProgress(60)
      hands.setOptions({
        maxNumHands: 1,
        // Lighter model + lower tracking threshold on mobile: faster, and keeps
        // the hand "tracked" through motion blur instead of dropping it.
        modelComplexity: IS_MOBILE ? 0 : 1,
        minDetectionConfidence: 0.6,
        // Lower tracking threshold keeps the hand locked through motion blur
        // (higher values drop tracking mid-stroke → broken lines).
        minTrackingConfidence: IS_MOBILE ? 0.35 : 0.4,
      })

      const STROKE_END_TIMEOUT = IS_MOBILE ? MOBILE_STROKE_END_TIMEOUT_MS : STROKE_END_TIMEOUT_MS

      // The video is shown with object-fit: cover, so when the camera frame's
      // aspect ratio differs from the canvas (common on mobile) it gets cropped.
      // This maps normalized MediaPipe coords through the SAME cover transform so
      // the drawn point and the landmark overlay line up with the visible hand.
      const coverMap = () => {
        const vw = videoRef.current?.videoWidth || CANVAS_W
        const vh = videoRef.current?.videoHeight || CANVAS_H
        const scale = Math.max(CANVAS_W / vw, CANVAS_H / vh)
        const dispW = vw * scale
        const dispH = vh * scale
        return { dispW, dispH, offsetX: (CANVAS_W - dispW) / 2, offsetY: (CANVAS_H - dispH) / 2 }
      }

      // Exponential moving average to smooth out fingertip jitter
      const ema = (prev, x, y) => prev
        ? { x: prev.x + SMOOTHING_ALPHA * (x - prev.x), y: prev.y + SMOOTHING_ALPHA * (y - prev.y) }
        : { x, y }

      const commitStroke = () => {
        if (currentPathRef.current.length > 1) strokesRef.current.push([...currentPathRef.current])
        currentPathRef.current = []
        smoothedRef.current = null
      }

      // Open-palm eraser: remove stroke points within the eraser circle, splitting
      // strokes around the erased area (vector erase, survives redraw + undo).
      const eraseAt = (ex, ey) => {
        const r2 = ERASER_RADIUS_PX * ERASER_RADIUS_PX
        let changed = false
        const out = []
        for (const stroke of strokesRef.current) {
          let seg = []
          for (const p of stroke) {
            const dx = p.x - ex, dy = p.y - ey
            if (dx * dx + dy * dy <= r2) {
              changed = true
              if (seg.length > 1) out.push(seg)
              seg = []
            } else {
              seg.push(p)
            }
          }
          if (seg.length > 1) out.push(seg)
        }
        if (changed) {
          strokesRef.current = out
          redrawAll()
          lastActivityRef.current = performance.now()
          autoCheckedRef.current = false
        }
      }

      // Reset the whole writing machine to idle (used on erase / stop)
      const resetWriting = () => {
        writeStateRef.current = 'idle'
        currentPathRef.current = []
        smoothedRef.current = null
        startConfirmRef.current = 0
        lostFramesRef.current = 0
        lostSinceRef.current = 0
      }

      // Tracking lost OR write pose absent for this frame.
      // Never ends a stroke immediately — only after BOTH the timeout AND the
      // lost-frame limit are exceeded, so brief drops don't break the line.
      const handleLost = (now) => {
        startConfirmRef.current = 0
        const state = writeStateRef.current
        if (state === 'idle') return
        if (state === 'writing') {
          writeStateRef.current = 'pending_end'
          lostSinceRef.current = now
          lostFramesRef.current = 1
          return
        }
        // pending_end
        lostFramesRef.current += 1
        const elapsed = now - lostSinceRef.current
        if (elapsed >= STROKE_END_TIMEOUT && lostFramesRef.current >= LOST_FRAME_LIMIT) {
          commitStroke()
          writeStateRef.current = 'idle'
        }
      }

      // Valid write pose (index point) detected this frame at raw canvas coords.
      const handleWrite = (rawX, rawY, now) => {
        const ctx = getCtx()
        if (!ctx) return
        const state = writeStateRef.current

        lastActivityRef.current = performance.now()
        autoCheckedRef.current = false // user is writing again → allow a fresh auto-score

        if (state === 'idle') {
          // Require the pose to be stable for a few frames before starting.
          startConfirmRef.current += 1
          smoothedRef.current = ema(smoothedRef.current, rawX, rawY)
          if (startConfirmRef.current < START_CONFIRM_FRAMES) return
          writeStateRef.current = 'writing'
          setCheckResult(null) // starting a new stroke clears the previous score
          setHwrResult(null)
          const p = smoothedRef.current
          currentPathRef.current = [{ x: p.x, y: p.y, t: now, color: strokeColor, width: strokeWidth }]
          liveMidRef.current = { x: p.x, y: p.y }
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          return
        }

        // Resuming after a brief loss: re-anchor smoothing so we don't drag a
        // line in from the stale position, but keep the SAME stroke.
        const resumed = state === 'pending_end'
        if (resumed) smoothedRef.current = { x: rawX, y: rawY }
        writeStateRef.current = 'writing'
        lostFramesRef.current = 0
        lostSinceRef.current = 0

        const sm = ema(smoothedRef.current, rawX, rawY)
        smoothedRef.current = sm
        const path = currentPathRef.current
        const last = path[path.length - 1]
        const dist = last ? Math.hypot(sm.x - last.x, sm.y - last.y) : Infinity

        // Drop micro-jitter points (but always keep moving after a resume)
        if (!resumed && dist < MIN_POINT_DISTANCE_PX) return

        // Large jump (glitch or movement during the gap) → break the visual line
        const brk = resumed && (!last || dist > MAX_POINT_GAP_PX)
        path.push({ x: sm.x, y: sm.y, t: now, color: strokeColor, width: strokeWidth, brk })

        if (brk || !last) {
          liveMidRef.current = { x: sm.x, y: sm.y }
        } else {
          // Smooth live curve: draw from the previous midpoint through the last
          // point to the new midpoint (quadratic), matching the committed render.
          const newMid = { x: (last.x + sm.x) / 2, y: (last.y + sm.y) / 2 }
          const prevMid = liveMidRef.current || { x: last.x, y: last.y }
          ctx.strokeStyle = strokeColor
          ctx.lineWidth = strokeWidth
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.beginPath()
          ctx.moveTo(prevMid.x, prevMid.y)
          ctx.quadraticCurveTo(last.x, last.y, newMid.x, newMid.y)
          ctx.stroke()
          liveMidRef.current = newMid
        }
      }

      hands.onResults((results) => {
        const oc = overlayRef.current
        if (!oc) return
        const octx = oc.getContext('2d')
        const now = Date.now()

        octx.clearRect(0, 0, oc.width, oc.height)

        if (!results.multiHandLandmarks?.length) {
          // Hand not detected this frame — don't break the stroke, just mark lost.
          handleLost(now)
          gestureBufferRef.current = []
          stableGestureRef.current = 'none'
          _pinching = false
          setGesture('none')
          return
        }

        const landmarks = results.multiHandLandmarks[0]
        const m = coverMap()

        // Redraw landmarks MIRRORED + cover-mapped so they align with the visible video
        if (window.drawConnectors && window.drawLandmarks) {
          octx.save()
          octx.translate(oc.width, 0)
          octx.scale(-1, 1)
          octx.translate(m.offsetX, m.offsetY)
          octx.scale(m.dispW / CANVAS_W, m.dispH / CANVAS_H)
          window.drawConnectors(octx, landmarks, window.HAND_CONNECTIONS, { color: 'rgba(0,255,150,0.85)', lineWidth: 3 })
          window.drawLandmarks(octx, landmarks, { color: 'rgba(255,50,50,0.95)', lineWidth: 1, radius: 5 })
          octx.restore()
        }

        const pinching = updatePinch(landmarks)
        const raw = detectRawGesture(landmarks, pinching)

        // Stability buffer: only commit to a new gesture once it appears
        // consistently across GESTURE_BUFFER consecutive frames
        const buf = gestureBufferRef.current
        buf.push(raw)
        if (buf.length > GESTURE_BUFFER) buf.shift()
        const counts = {}
        buf.forEach(x => { counts[x] = (counts[x] || 0) + 1 })
        const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
        const g = counts[dominant] >= GESTURE_BUFFER - 1 ? dominant : stableGestureRef.current
        stableGestureRef.current = g
        setGesture(g)

        if (g === 'palm') {
          // Open palm = eraser: rub out strokes around the palm centre (landmark 9)
          const c = landmarks[9]
          const ex = CANVAS_W - (m.offsetX + c.x * m.dispW)
          const ey = m.offsetY + c.y * m.dispH
          eraseAt(ex, ey)
          // Eraser ring indicator on the overlay (same coord space as the canvas)
          octx.beginPath()
          octx.arc(ex, ey, ERASER_RADIUS_PX, 0, Math.PI * 2)
          octx.fillStyle = 'rgba(255,80,80,0.18)'
          octx.fill()
          octx.lineWidth = 2
          octx.strokeStyle = 'rgba(255,80,80,0.9)'
          octx.stroke()
          resetWriting()
          return
        }

        if (g === 'point') {
          // Map fingertip through the cover transform, then mirror x to match the display
          const indexTip = landmarks[8]
          const px = m.offsetX + indexTip.x * m.dispW
          const py = m.offsetY + indexTip.y * m.dispH
          handleWrite(CANVAS_W - px, py, now)
        } else {
          // 'none' / 'pinch' (pen lifted) — treat as lost pose, let the timeout decide
          handleLost(now)
        }
      })

      handsRef.current = hands

      // Lower resolution on mobile so the model runs faster (higher FPS = better tracking)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: IS_MOBILE ? 480 : CANVAS_W },
          height: { ideal: IS_MOBILE ? 360 : CANVAS_H },
          frameRate: { ideal: IS_MOBILE ? 24 : 30 },
        },
      })
      setLoadProgress(78)
      videoRef.current.srcObject = stream
      // play() can reject if the stream is swapped/stopped before it resolves
      // (e.g. quickly toggling modes) — that AbortError is benign, so ignore it.
      try { await videoRef.current.play() } catch (_) { /* interrupted load — ignore */ }
      setLoadProgress(88)

      // Manual frame loop — no dependency on camera_utils CDN.
      // Throttle inference to a target FPS: MediaPipe runs on the main thread, so
      // running it every animation frame starves the compositor and makes the
      // webcam feed stutter. Capping it leaves time to paint the video smoothly.
      const MIN_FRAME_MS = 1000 / (IS_MOBILE ? 24 : 30)
      let lastSend = 0
      const processFrame = async () => {
        if (!handsRef.current || !videoRef.current) return
        const t = performance.now()
        if (videoRef.current.readyState >= 2 && t - lastSend >= MIN_FRAME_MS) {
          lastSend = t
          await handsRef.current.send({ image: videoRef.current })
          if (!readyRef.current) {
            readyRef.current = true
            setLoadProgress(100)
            setStatus('ready')
          }
        }
        // Hands-free scoring: once the user stops writing for a moment, auto-check.
        if (referenceBalinese && writeStateRef.current === 'idle' && strokesRef.current.length > 0
          && !autoCheckedRef.current && performance.now() - lastActivityRef.current > AUTOCHECK_MS) {
          autoCheckedRef.current = true
          checkDrawingRef.current?.()
        }
        rafIdRef.current = requestAnimationFrame(processFrame)
      }
      rafIdRef.current = requestAnimationFrame(processFrame)
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
    // Reset writing state machine
    writeStateRef.current = 'idle'
    currentPathRef.current = []
    smoothedRef.current = null
    startConfirmRef.current = 0
    lostFramesRef.current = 0
    lostSinceRef.current = 0
    gestureBufferRef.current = []
    stableGestureRef.current = 'none'
    _pinching = false
    readyRef.current = false
    setLoadProgress(0)
    setStatus('idle')
    setGesture('none')
    // Clear overlay
    const oc = overlayRef.current
    if (oc) oc.getContext('2d').clearRect(0, 0, oc.width, oc.height)
  }, [])

  useEffect(() => {
    // Switching modes starts a fresh canvas — mouse drawing shouldn't carry over
    // into gesture mode (and vice versa).
    strokesRef.current = []
    currentPathRef.current = []
    redrawAll()
    setCheckResult(null)
    setHwrResult(null)
    if (mode === 'gesture' && status === 'idle') {
      initGestureMode()
    } else if (mode === 'mouse') {
      stopGestureMode()
    }
  }, [mode])

  // New practice word → start with a fresh canvas.
  useEffect(() => {
    strokesRef.current = []
    currentPathRef.current = []
    redrawAll()
    setCheckResult(null)
    setHwrResult(null)
    autoCheckedRef.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referenceBalinese])

  useEffect(() => {
    return () => stopGestureMode()
  }, [])

  // Warm up MediaPipe as soon as the canvas mounts, so entering gesture mode is fast
  useEffect(() => {
    loadScript(MP_DRAWING_SCRIPT).catch(() => {})
    loadScript(MP_HANDS_SCRIPT).catch(() => {})
  }, [])

  // Establish the supersample transform on the drawing context once mounted
  useEffect(() => {
    const ctx = getCtx()
    if (ctx) applyDrawTransform(ctx)
  }, [])

  // Track fullscreen state for the canvas area
  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const toggleFullscreen = useCallback(() => {
    const el = canvasAreaRef.current
    if (!el) return
    if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => {})
    else document.exitFullscreen?.()
  }, [])

  const bg = darkMode ? '#1a1a2e' : '#fafafa'
  const border = darkMode ? '#333' : '#e0e0e0'
  const textColor = darkMode ? '#e0e0e0' : '#333'

  const COLORS = ['#0d6efd', '#dc3545', '#198754', '#6f42c1', '#fd7e14', '#000000']
  const WIDTHS = [2, 4, 7, 12]

  // Icon-button style for the fullscreen floating toolbar
  const fsToolBtn = {
    height: '32px', minWidth: '32px', borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.08)',
    color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  }

  const gestureLabel = {
    point: ct.gesturePoint,
    palm: ct.gesturePalm,
    pinch: ct.gesturePinch,
    none: ct.gestureNone,
  }[gesture] || ''

  return (
    <div style={{ color: textColor }}>
      {/* Reference word — hidden in quiz mode (the quiz shows the prompt itself) */}
      {referenceText && !quizMode && (
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
              display: 'inline-flex', alignItems: 'center', gap: '5px',
            }}
          >
            {showRef ? <EyeOff size={12} /> : <Eye size={12} />} {showRef ? ct.hide : ct.show}
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
        {[{ key: 'mouse', label: ct.modeMouse, icon: MousePointer2 }, { key: 'gesture', label: ct.modeGesture, icon: Hand }].map(m => (
          <button
            key={m.key}
            data-track={`write-mode-${m.key}`}
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
              display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}
          >
            <m.icon size={15} /> {m.label}
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
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <AlertTriangle size={15} style={{ flexShrink: 0 }} /> {errorMsg || ct.errCamera}
        </div>
      )}

      {/* Canvas area (wrapper is the fullscreen target) */}
      <div
        ref={canvasAreaRef}
        style={isFullscreen
          ? { background: '#000', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }
          : {}}
      >
      <div style={{
        position: 'relative',
        width: isFullscreen ? 'auto' : '100%',
        height: isFullscreen ? '100%' : 'auto',
        maxWidth: '100%',
        aspectRatio: `${CANVAS_W}/${CANVAS_H}`,
        borderRadius: isFullscreen ? 0 : '12px',
        overflow: 'hidden',
        border: isFullscreen ? 'none' : `2px solid ${border}`,
        background: '#fff',
        cursor: mode === 'mouse' ? 'crosshair' : 'none',
        containerType: 'size',
      }}>
        {/* Layer 1 (bottom): webcam feed — mirrored via CSS */}
        <video
          ref={videoRef}
          muted
          playsInline
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            zIndex: 2, objectFit: 'cover',
            transform: 'scaleX(-1)',
            display: mode === 'gesture' && status === 'ready' ? 'block' : 'none',
          }}
        />

        {/* Layer 2: drawing canvas (supersampled for crisp, smooth strokes) */}
        <canvas
          ref={canvasRef}
          width={CANVAS_W * DRAW_SCALE}
          height={CANVAS_H * DRAW_SCALE}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, touchAction: 'none' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />

        {/* Layer 3 (top): hand landmark overlay — transparent, pointer-events disabled */}
        <canvas
          ref={overlayRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            zIndex: 10,
            opacity: mode === 'gesture' && status === 'ready' ? 1 : 0,
            pointerEvents: 'none',
          }}
        />

        {/* Aksara guide watermark — toggleable, shown in BOTH mouse and gesture modes.
            zIndex 4 keeps it above the webcam (2) but below the drawing (5). */}
        {referenceBalinese
          ? (showOverlay && showRef && (
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none', zIndex: 4,
                opacity: mode === 'gesture' ? 0.3 : 0.15,
                transition: 'opacity 0.3s',
              }}>
                <span style={{ fontFamily: '"Noto Sans Balinese", serif', fontSize: 'min(11cqw, 26cqh)', lineHeight: 1, whiteSpace: 'nowrap', color: mode === 'gesture' ? '#fff' : '#888' }}>{referenceBalinese}</span>
              </div>
            ))
          : (mode === 'mouse' && (
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none', zIndex: 1,
                opacity: 0.5, fontSize: '14px', color: '#888',
              }}>
                {ct.placeholder}
              </div>
            ))}

        {mode === 'gesture' && status === 'idle' && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: darkMode ? '#1a1a2e' : '#f5f5f5',
            zIndex: 2, gap: '12px',
          }}>
            <Camera size={48} style={{ opacity: 0.6 }} />
            <span style={{ fontSize: '14px', opacity: 0.6 }}>{ct.startGesture}</span>
          </div>
        )}

        {/* Loading overlay while MediaPipe / camera initializes */}
        {mode === 'gesture' && status === 'loading' && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: darkMode ? '#1a1a2e' : '#f5f5f5',
            zIndex: 12, gap: '14px', padding: '0 24px',
          }}>
            <Loader size={40} style={{ opacity: 0.7, animation: 'aksara-spin 1s linear infinite' }} />
            <span style={{ fontSize: '14px', opacity: 0.7 }}>{ct.loadingMp} {loadProgress}%</span>
            <div style={{ width: '100%', maxWidth: '260px', height: '6px', borderRadius: '3px', background: darkMode ? '#333' : '#e0e0e0', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${loadProgress}%`, background: '#0d6efd', borderRadius: '3px', transition: 'width 0.3s ease' }} />
            </div>
            <style>{`@keyframes aksara-spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* Score result shown inside fullscreen (auto-scored or via the Cek button) */}
        {isFullscreen && checkResult && (
          <div style={{
            position: 'absolute', top: '14px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 14, maxWidth: '92%',
            padding: '12px 20px', borderRadius: '14px',
            background: 'rgba(20,20,30,0.88)', color: '#fff',
            border: `2px solid ${checkResult.status === 'correct' ? '#22c55e' : checkResult.status === 'partial' ? '#f59e0b' : checkResult.status === 'empty' ? '#94a3b8' : '#ef4444'}`,
            display: 'flex', alignItems: 'center', gap: '14px',
          }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{checkResult.message}</span>
            {checkResult.status !== 'empty' && (
              <span style={{ fontSize: '22px', fontWeight: 800, color: checkResult.status === 'correct' ? '#22c55e' : checkResult.status === 'partial' ? '#f59e0b' : '#ef4444' }}>
                {checkResult.score}%
              </span>
            )}
          </div>
        )}

        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Keluar layar penuh' : 'Layar penuh'}
          style={{
            position: 'absolute', top: '10px', right: '10px', zIndex: 13,
            width: '36px', height: '36px', borderRadius: '8px',
            border: 'none', background: 'rgba(0,0,0,0.45)', color: '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>

        {/* Fullscreen floating toolbar — mirrors the main tools so they're usable in fullscreen (both modes) */}
        {isFullscreen && (
          <div style={{
            position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 13, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
            justifyContent: 'center', maxWidth: '94%',
            background: 'rgba(20,20,30,0.82)', padding: '10px 14px', borderRadius: '14px',
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => setStrokeColor(c)} aria-label={`Warna ${c}`} style={{
                  width: '24px', height: '24px', borderRadius: '50%', background: c, cursor: 'pointer',
                  border: strokeColor === c ? '3px solid #fff' : '2px solid rgba(255,255,255,0.35)',
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {WIDTHS.map(w => (
                <button key={w} onClick={() => setStrokeWidth(w)} aria-label={`Tebal ${w}`} style={{
                  width: '28px', height: '28px', borderRadius: '6px', background: 'transparent', cursor: 'pointer',
                  border: strokeWidth === w ? '2px solid #fff' : '2px solid rgba(255,255,255,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: Math.min(w * 2, 18), height: w, background: '#fff', borderRadius: '2px' }} />
                </button>
              ))}
            </div>
            {referenceBalinese && (
              <button onClick={() => setShowOverlay(v => !v)} aria-label={showOverlay ? ct.hideGuide : ct.showGuide} style={fsToolBtn}>
                {showOverlay ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
            <button onClick={undoLast} aria-label={ct.undo} style={fsToolBtn}><Undo2 size={16} /></button>
            <button onClick={() => { clearCanvas(); setCheckResult(null); setHwrResult(null) }} aria-label={ct.clear} style={{ ...fsToolBtn, color: '#ff7a7a' }}><Trash2 size={16} /></button>
            {referenceBalinese && (
              <button onClick={checkDrawing} style={{ ...fsToolBtn, background: '#0d6efd', color: '#fff', width: 'auto', padding: '0 14px', gap: '6px' }}>
                <Check size={16} /> {ct.check}
              </button>
            )}
          </div>
        )}
      </div>
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

        {/* Toggle aksara guide overlay (works in mouse + gesture mode) */}
        {referenceBalinese && (
          <button
            data-track="write-toggle-guide"
            onClick={() => setShowOverlay(v => !v)}
            style={{
              padding: '7px 16px', borderRadius: '8px',
              border: `1px solid ${border}`, background: showOverlay ? (darkMode ? '#1e3a5f' : '#e8f0fe') : 'transparent',
              cursor: 'pointer', fontSize: '13px', color: textColor,
              display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}
          >
            {showOverlay ? <EyeOff size={15} /> : <Eye size={15} />} {showOverlay ? ct.hideGuide : ct.showGuide}
          </button>
        )}

        <div style={{ flex: 1 }} />

        {/* Undo */}
        <button
          onClick={undoLast}
          style={{
            padding: '7px 16px', borderRadius: '8px',
            border: `1px solid ${border}`, background: 'transparent',
            cursor: 'pointer', fontSize: '13px', color: textColor,
            display: 'inline-flex', alignItems: 'center', gap: '6px',
          }}
        >
          <Undo2 size={15} /> {ct.undo}
        </button>

        {/* Clear */}
        <button
          onClick={() => { clearCanvas(); setCheckResult(null); setHwrResult(null) }}
          style={{
            padding: '7px 16px', borderRadius: '8px',
            border: '1px solid #dc3545', background: 'transparent',
            cursor: 'pointer', fontSize: '13px', color: '#dc3545',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
          }}
        >
          <Trash2 size={15} /> {ct.clear}
        </button>

        {/* Check button — only shown when a reference word is set */}
        {referenceBalinese && (
          <button
            data-track="write-check"
            onClick={checkDrawing}
            style={{
              flex: '1 1 100%', minWidth: '200px',
              padding: '14px 28px', borderRadius: '10px',
              border: 'none', background: '#0d6efd',
              cursor: 'pointer', fontSize: '16px', color: '#fff',
              fontWeight: '700', boxShadow: '0 2px 8px rgba(13,110,253,0.3)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <Check size={18} /> {ct.check}
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
            <span style={{ color: '#22c55e', fontWeight: '600', marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Check size={14} /> {lang === 'en' ? 'Matches!' : 'Cocok!'}
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
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Pointer size={14} style={{ flexShrink: 0 }} /> {ct.guide1}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Hand size={14} style={{ flexShrink: 0 }} /> {ct.guide2}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Grab size={14} style={{ flexShrink: 0 }} /> {ct.guide3}</span>
        </div>
      )}
    </div>
  )
}
