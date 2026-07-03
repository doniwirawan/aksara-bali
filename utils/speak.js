// Pronounce aksara / words with the browser's built-in SpeechSynthesis.
// No network and no API key; silently no-ops where speech isn't supported.

export function canSpeak() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function pickVoice(prefix) {
  const voices = window.speechSynthesis.getVoices() || []
  return voices.find((v) => v.lang?.toLowerCase().startsWith(prefix)) || null
}

// Balinese readings are phonetically close to Indonesian, so we prefer an
// Indonesian voice and fall back to English, then to the platform default.
export function speak(text, lang = 'id-ID') {
  if (!canSpeak() || !text) return
  const synth = window.speechSynthesis
  try {
    synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    u.rate = 0.9
    const v = pickVoice('id') || pickVoice('en')
    if (v) u.voice = v
    synth.speak(u)
  } catch { /* speech unavailable — ignore */ }
}
