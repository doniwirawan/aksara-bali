// Pronounce aksara / words with the browser's built-in SpeechSynthesis.
// No network and no API key; silently no-ops where speech isn't supported.

export function canSpeak() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function pickVoice(prefix) {
  const voices = window.speechSynthesis.getVoices() || []
  return voices.find((v) => v.lang?.toLowerCase().startsWith(prefix)) || null
}

// When no Indonesian voice is installed we fall back to an English voice, which
// would read Indonesian spelling with English rules — "ca" like "kah", "la"
// like "law". Respell into an English-phonetic approximation so it still sounds
// Indonesian: c is always /tʃ/ ("ch"), and the five vowels are pure
// (a/e/i/o/u → ah/eh/ee/oh/oo), e.g. "adeg" → "ahdehg" (adheg).
const VOWELS = { a: 'ah', e: 'eh', i: 'ee', o: 'oh', u: 'oo' }
function toEnglishApprox(text) {
  return text
    .replace(/c(?!h)/gi, 'ch') // ca → cha, cicing → chiching
    // Single pass over the ORIGINAL vowels so inserted letters aren't re-mapped
    // (otherwise i→"ee" would then hit the e rule).
    .replace(/[aeiou]/gi, (m) => VOWELS[m.toLowerCase()])
}

// Balinese readings are phonetically close to Indonesian, so we prefer an
// Indonesian voice; otherwise fall back to English with phonetic respelling.
export function speak(text, lang = 'id-ID') {
  if (!canSpeak() || !text) return
  const synth = window.speechSynthesis
  try {
    synth.cancel()
    const idVoice = pickVoice('id')
    const voice = idVoice || pickVoice('en')
    const u = new SpeechSynthesisUtterance(idVoice ? text : toEnglishApprox(text))
    // Match the utterance language to the chosen voice so its pronunciation
    // rules actually apply to the (respelled) text.
    u.lang = idVoice ? lang : (voice?.lang || 'en-US')
    u.rate = 0.9
    if (voice) u.voice = voice
    synth.speak(u)
  } catch { /* speech unavailable — ignore */ }
}
