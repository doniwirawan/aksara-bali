// Pronounce aksara / words with the browser's built-in SpeechSynthesis.
// No network and no API key; silently no-ops where speech isn't supported.

export function canSpeak() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

// Chrome/Edge load voices asynchronously: getVoices() is often [] until the
// 'voiceschanged' event fires, which made every early click fall back to the
// English respelling. Cache the list and keep it fresh.
let VOICES = []
function refreshVoices() {
  VOICES = window.speechSynthesis.getVoices() || []
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refreshVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices)
}

function pickVoice(prefix) {
  if (!VOICES.length) refreshVoices()
  const match = VOICES.filter((v) => v.lang?.toLowerCase().replace('_', '-').startsWith(prefix))
  if (!match.length) return null
  // Cloud voices ("Google Bahasa Indonesia", "Microsoft … Online (Natural)")
  // sound far more natural than the local SAPI/eSpeak ones — prefer them.
  return match.find((v) => /google|online|natural/i.test(v.name)) || match[0]
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
    // Only respell for English when we KNOW the voice list is loaded and it
    // really has no Indonesian voice. With an empty list, speak the original
    // text tagged id-ID and let the engine resolve its own default voice.
    const useIndonesian = !!idVoice || VOICES.length === 0
    const voice = idVoice || (useIndonesian ? null : pickVoice('en'))
    const u = new SpeechSynthesisUtterance(useIndonesian ? text : toEnglishApprox(text))
    // Match the utterance language to the chosen voice so its pronunciation
    // rules actually apply to the (respelled) text.
    u.lang = useIndonesian ? lang : (voice?.lang || 'en-US')
    u.rate = 0.9
    if (voice) u.voice = voice
    synth.speak(u)
  } catch { /* speech unavailable — ignore */ }
}
