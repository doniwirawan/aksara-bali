// Latin -> Aksara Bali (Unicode U+1B00–U+1B7F).

const balineseMapping = {
  'ka': '\u1B13', 'kha': '\u1B14', 'ga': '\u1B15', 'gha': '\u1B16', 'nga': '\u1B17',
  'ca': '\u1B18', 'cha': '\u1B19', 'ja': '\u1B1A', 'jha': '\u1B1B', 'nya': '\u1B1C',
  'tha': '\u1B1D', 'thha': '\u1B1E', 'dha': '\u1B1F', 'dhha': '\u1B20', 'nna': '\u1B21',
  'ta': '\u1B22', 'ttha': '\u1B23', 'da': '\u1B24', 'ddha': '\u1B25', 'na': '\u1B26',
  'pa': '\u1B27', 'pha': '\u1B28', 'ba': '\u1B29', 'bha': '\u1B2A', 'ma': '\u1B2B',
  'ya': '\u1B2C', 'ra': '\u1B2D', 'la': '\u1B2E',
  'wa': '\u1B2F', 'va': '\u1B2F',
  'sha': '\u1B30', 'ssa': '\u1B31', 'sa': '\u1B32', 'ha': '\u1B33',

  'a': '\u1B05', 'i': '\u1B07', 'u': '\u1B09', 'e': '\u1B0F', 'o': '\u1B11',
  'aa': '\u1B05\u1B35', 'ii': '\u1B07\u1B37', 'uu': '\u1B09\u1B39',

  'aa_mark': '\u1B35', 'i_mark': '\u1B36', 'ii_mark': '\u1B37',
  'u_mark': '\u1B38', 'uu_mark': '\u1B39', 'e_mark': '\u1B3E', 'o_mark': '\u1B40',
  'ai_mark': '\u1B3F', 'au_mark': '\u1B41', 're_mark': '\u1B42',
  'x_mark': '\u1B42',            // pepet, typed as "x"
  'x': '\u1B05\u1B42',           // word-initial pepet rides an independent a

  'ng': '\u1B02',
  'r_sound': '\u1B03',
  'h_sound': '\u1B04',
  'virama': '\u1B44',
  'om': '\u1B00',

  '0': '\u1B50', '1': '\u1B51', '2': '\u1B52', '3': '\u1B53', '4': '\u1B54',
  '5': '\u1B55', '6': '\u1B56', '7': '\u1B57', '8': '\u1B58', '9': '\u1B59',

  'dot': '\u1B5F', 'comma': '\u1B5E', 'space': '\u200B',
  'cecek': '\u1B34', 'bisah': '\u1B01',
}

// "x" is the pepet vowel, following the convention Balinese typing tools have
// used for years — so it counts as a vowel here and not as a consonant.
const isVowel = (char) => ['a', 'i', 'u', 'e', 'o', 'x'].includes(char?.toLowerCase())
const isConsonant = (char) => 'bcdfghjklmnpqrstvwyz'.includes(char?.toLowerCase())
const isPunctuation = (char) => '.,!?;:()[]{}"\'-'.includes(char)
const normalizeConsonant = (char) => {
  const c = char?.toLowerCase()
  if (c === 'v') return 'w'   // V = W in Balinese tradition
  if (c === 'f') return 'p'   // no /f/ in Balinese; nearest sound is /p/
  return c
}

// Latin diacritics (from the ā ī ū ě ṇ … input helpers) normalized to the plain
// sequences the mapping understands. Keep in sync with the mobile app's converter.
const LATIN_DIACRITICS = {
  'ā': 'aa', 'â': 'aa', 'ī': 'ii', 'î': 'ii', 'ū': 'uu', 'û': 'uu',
  'é': 'e', 'è': 'e', 'ě': 'x', 'ĕ': 'x', 'ö': 'x',
  'ṛ': 're', 'ṝ': 're', 'ṇ': 'nna', 'ṅ': 'ng', 'ñ': 'nya',
  'ś': 'sa', 'ṣ': 'sa', 'ṭ': 'ta', 'ḍ': 'da', 'ḥ': 'h', 'ṁ': 'ng', 'ṃ': 'ng',
}

function normalizeDiacritics(s) {
  let r = s
  for (const [k, v] of Object.entries(LATIN_DIACRITICS)) r = r.split(k).join(v)
  return r
}

export function convertLatinToBalinese(text) {
  if (!text) return ''

  let result = ''
  let i = 0
  const normalizedText = normalizeDiacritics(text.toLowerCase().trim())

  while (i < normalizedText.length) {
    let matched = false
    const currentChar = normalizedText[i]

    if (currentChar === ' ') { result += '\u200B'; i++; continue }
    if (currentChar === '.') { result += balineseMapping['dot'] || '.'; i++; continue }
    if (currentChar === ',') { result += balineseMapping['comma'] || ','; i++; continue }
    if (/[0-9]/.test(currentChar)) { result += balineseMapping[currentChar] || currentChar; i++; continue }

    let lookAhead = ''
    const maxLookAhead = Math.min(4, normalizedText.length - i)

    for (let j = 0; j < maxLookAhead; j++) {
      lookAhead += normalizedText[i + j]
      let syllableFound = false

      for (let len = Math.min(4, lookAhead.length); len >= 1; len--) {
        const substr = lookAhead.substring(0, len)

        if (len === 4 && ['thha', 'dhha', 'ttha', 'ddha'].includes(substr)) {
          result += balineseMapping[substr] || substr
          i += len; matched = true; syllableFound = true; break
        }

        if (len === 3 && ['nga', 'nya', 'nna', 'kha', 'gha', 'cha', 'jha', 'tha', 'dha', 'pha', 'bha', 'sha', 'ssa'].includes(substr)) {
          result += balineseMapping[substr] || substr
          i += len; matched = true; syllableFound = true; break
        }

        // "ng" + vowel is the letter NGA carrying a vowel, not a cecek. The
        // look-ahead grows one character at a time, so without this the 2-char
        // "ng" branch below would win before "nga" is ever reachable and
        // "bunga" would come out as cecek + a stray latin "a".
        if (len === 2 && substr === 'ng' && isVowel(normalizedText[i + 2])) {
          const v = normalizedText[i + 2]
          result += balineseMapping['nga'] + (v === 'a' ? '' : balineseMapping[v + '_mark'])
          i += 3; matched = true; syllableFound = true; break
        }

        if (len === 2 && substr === 'ng') {
          result += balineseMapping['ng']
          i += len; matched = true; syllableFound = true; break
        }

        if (len === 2 && ['aa', 'ii', 'uu'].includes(substr)) {
          if (i === 0 || normalizedText[i - 1] === ' ' || !isConsonant(normalizedText[i - 1])) {
            result += balineseMapping[substr]
          } else {
            result += balineseMapping[substr.charAt(0) + '_mark']
          }
          i += len; matched = true; syllableFound = true; break
        }

        if (len === 2 && isConsonant(substr[0]) && isVowel(substr[1])) {
          const nc = normalizeConsonant(substr[0])
          const cWithA = nc + 'a'
          const base = balineseMapping[cWithA]
          if (base) {
            result += substr[1] === 'a' ? base : base + balineseMapping[substr[1] + '_mark']
            i += len; matched = true; syllableFound = true; break
          }
        }
      }

      if (syllableFound) break
    }

    if (!matched) {
      if (isVowel(currentChar)) {
        const prev = i > 0 ? normalizedText[i - 1] : null
        if (!prev || prev === ' ' || !isConsonant(prev)) {
          result += balineseMapping[currentChar] || currentChar
        } else {
          result += balineseMapping[currentChar + '_mark'] || currentChar
        }
        i++; continue
      }

      if (isConsonant(currentChar)) {
        const nextChar = i + 1 < normalizedText.length ? normalizedText[i + 1] : null
        const nc = normalizeConsonant(currentChar)
        const base = balineseMapping[nc + 'a']
        if (base) {
          const needsVirama = !nextChar || nextChar === ' ' || isPunctuation(nextChar) ||
            /[0-9]/.test(nextChar) || isConsonant(nextChar) || !isVowel(nextChar)
          result += base + (needsVirama ? balineseMapping['virama'] : '')
        } else {
          result += currentChar
        }
        i++; continue
      }

      result += currentChar
      i++
    }
  }

  return result
}

export { balineseMapping, LATIN_DIACRITICS, normalizeDiacritics }
