// Duolingo-inspired UI sound effects, synthesized live with the Web Audio API.
// No audio files: nothing to download, works offline, and passes strict CSPs.
// The AudioContext is created lazily on the first sound so we stay inside the
// browser autoplay policy (audio may only start after a user gesture).

let ctx = null
const STORAGE_KEY = 'aksara-sfx-enabled'

function getCtx() {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

// Sound is on by default; remembered per browser.
export function sfxEnabled() {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(STORAGE_KEY) !== 'false'
}

export function setSfxEnabled(on) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, on ? 'true' : 'false')
}

// One shaped note. `type` is an oscillator waveform; the gain envelope gives it
// a soft attack and exponential decay so it reads as a pluck, not a beep.
function note(c, { freq, start = 0, dur = 0.15, type = 'sine', gain = 0.18, glideTo }) {
  const t0 = c.currentTime + start
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

function play(build) {
  if (!sfxEnabled()) return
  const c = getCtx()
  if (!c) return
  try { build(c) } catch { /* audio not available — ignore */ }
}

// Bright rising two-note chirp — the "correct answer" reward.
export function playCorrect() {
  play((c) => {
    note(c, { freq: 587.33, dur: 0.12, type: 'triangle', gain: 0.16 })            // D5
    note(c, { freq: 880.0, start: 0.1, dur: 0.18, type: 'triangle', gain: 0.18 }) // A5
  })
}

// Low, short descending "donk" — gentle "not quite", never harsh.
export function playWrong() {
  play((c) => {
    note(c, { freq: 196.0, dur: 0.24, type: 'sawtooth', gain: 0.12, glideTo: 120 })
  })
}

// Celebratory major arpeggio — level passed.
export function playComplete() {
  play((c) => {
    const seq = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
    seq.forEach((f, i) => note(c, { freq: f, start: i * 0.11, dur: 0.28, type: 'triangle', gain: 0.17 }))
    note(c, { freq: 1318.5, start: 0.44, dur: 0.4, type: 'sine', gain: 0.12 })   // sparkle
  })
}

// Soft click for taps (keyboard keys, option selects).
export function playTap() {
  play((c) => note(c, { freq: 330, dur: 0.05, type: 'sine', gain: 0.07 }))
}
