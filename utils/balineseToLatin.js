// Standalone Balinese → Latin transliterator (inverse of balineseConverter.js).
// Deterministic; used by the OCR reader to turn recognized Aksara Bali back into
// readable Latin. Ported from the reverse logic in components/dev so the two stay
// in sync. Codepoints mirror the forward converter's `balineseMapping`.

const balineseMapping = {
  'ka': 'ᬓ', 'kha': 'ᬔ', 'ga': 'ᬕ', 'gha': 'ᬖ', 'nga': 'ᬗ',
  'ca': 'ᬘ', 'cha': 'ᬙ', 'ja': 'ᬚ', 'jha': 'ᬛ', 'nya': 'ᬜ',
  'tha': 'ᬝ', 'thha': 'ᬞ', 'dha': 'ᬟ', 'dhha': 'ᬠ', 'nna': 'ᬡ',
  'ta': 'ᬢ', 'ttha': 'ᬣ', 'da': 'ᬤ', 'ddha': 'ᬥ', 'na': 'ᬦ',
  'pa': 'ᬧ', 'pha': 'ᬨ', 'ba': 'ᬩ', 'bha': 'ᬪ', 'ma': 'ᬫ',
  'ya': 'ᬬ', 'ra': 'ᬭ', 'la': 'ᬮ', 'wa': 'ᬯ',
  'sha': 'ᬰ', 'ssa': 'ᬱ', 'sa': 'ᬲ', 'ha': 'ᬳ',

  'a': 'ᬅ', 'i': 'ᬇ', 'u': 'ᬉ', 'e': 'ᬏ', 'o': 'ᬑ',

  'ng': 'ᬂ',
  'om': 'ᬀ',
  'virama': '᭄',

  '0': '᭐', '1': '᭑', '2': '᭒', '3': '᭓', '4': '᭔',
  '5': '᭕', '6': '᭖', '7': '᭗', '8': '᭘', '9': '᭙',

  'dot': '᭟', 'comma': '᭞',
}

// Dependent vowel signs (gantungan/pengangge suara) → the Latin vowel they add.
const vowelMarks = {
  'ᬵ': 'aa', // tedung
  'ᬶ': 'i',  // ulu
  'ᬷ': 'ii', // ulu sari
  'ᬸ': 'u',  // suku
  'ᬹ': 'uu', // suku ilut
  'ᬾ': 'e',  // taling
  'ᭀ': 'o',  // taling tedung
}

export function convertBalineseToLatin(balineseText) {
  if (!balineseText) return ''

  let result = ''
  let i = 0

  while (i < balineseText.length) {
    const currentChar = balineseText[i]

    // Word separator (zero-width space) and normal space both become a space.
    if (currentChar === '​' || currentChar === ' ') {
      result += ' '
      i++
      continue
    }

    // Digits
    let matched = false
    for (let num = 0; num <= 9; num++) {
      if (currentChar === balineseMapping[num.toString()]) {
        result += num.toString()
        matched = true
        break
      }
    }
    if (matched) { i++; continue }

    if (currentChar === balineseMapping['dot']) { result += '.'; i++; continue }
    if (currentChar === balineseMapping['comma']) { result += ','; i++; continue }
    if (currentChar === balineseMapping['om']) { result += 'om'; i++; continue }
    if (currentChar === balineseMapping['ng']) {
      // The forward converter can leave a vowel sign floating after the cecek
      // (e.g. "angin" → …ᬂᬶ…). Absorb it so "ng" + i reads back as "ngi".
      const nextChar = i + 1 < balineseText.length ? balineseText[i + 1] : null
      if (nextChar && vowelMarks[nextChar]) { result += 'ng' + vowelMarks[nextChar]; i += 2 }
      else { result += 'ng'; i++ }
      continue
    }

    // Base consonants: emit the onset, then resolve the following vowel.
    let consonantFound = false
    for (const [latin, balinese] of Object.entries(balineseMapping)) {
      if (balinese !== currentChar) continue
      if (latin === 'virama' || latin.length === 1 && 'aiueo'.includes(latin)) continue
      if (!/[bcdfghjklmnpqrstvwxyz]/.test(latin)) continue // consonants only here

      const onset = latin.endsWith('a') ? latin.slice(0, -1) : latin
      const nextChar = i + 1 < balineseText.length ? balineseText[i + 1] : null

      if (nextChar === balineseMapping['virama']) {
        // Adeg-adeg / conjunct: consonant with no vowel.
        result += onset
        i += 2
        consonantFound = true
        break
      }

      if (nextChar && vowelMarks[nextChar]) {
        result += onset + vowelMarks[nextChar]
        i += 2
        consonantFound = true
        break
      }

      // Bare consonant keeps its inherent 'a'.
      result += latin.endsWith('a') ? latin : latin + 'a'
      i++
      consonantFound = true
      break
    }
    if (consonantFound) continue

    // Independent vowels
    let vowelFound = false
    for (const [latin, balinese] of Object.entries(balineseMapping)) {
      if (balinese === currentChar && latin.length === 1 && 'aiueo'.includes(latin)) {
        // A tedung right after an independent vowel lengthens it (a → aa).
        const nextChar = i + 1 < balineseText.length ? balineseText[i + 1] : null
        if (nextChar === 'ᬵ') { result += latin + latin; i += 2 }
        else { result += latin; i++ }
        vowelFound = true
        break
      }
    }
    if (vowelFound) continue

    // Unknown glyph — pass it through so nothing silently disappears.
    result += currentChar
    i++
  }

  return result
}
