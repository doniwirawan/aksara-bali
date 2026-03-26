// Standalone Balinese converter utility (extracted from LatinBalineseConverter)

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

const isVowel = (char) => ['a', 'i', 'u', 'e', 'o'].includes(char?.toLowerCase())
const isConsonant = (char) => 'bcdfghjklmnpqrstvwxyz'.includes(char?.toLowerCase())
const isPunctuation = (char) => '.,!?;:()[]{}"\'-'.includes(char)
const normalizeConsonant = (char) => char?.toLowerCase() === 'v' ? 'w' : char?.toLowerCase()

export function convertLatinToBalinese(text) {
  if (!text) return ''

  let result = ''
  let i = 0
  const normalizedText = text.toLowerCase().trim()

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

export const QUIZ_WORDS = [
  // Easy - short words (2-3 syllables)
  { latin: 'bali', meaning: 'Bali (pulau)', category: 'Tempat', difficulty: 'easy' },
  { latin: 'dewa', meaning: 'dewa / deity', category: 'Agama', difficulty: 'easy' },
  { latin: 'pura', meaning: 'pura / temple', category: 'Agama', difficulty: 'easy' },
  { latin: 'api', meaning: 'api / fire', category: 'Alam', difficulty: 'easy' },
  { latin: 'suka', meaning: 'suka / happy', category: 'Umum', difficulty: 'easy' },
  { latin: 'duka', meaning: 'duka / sadness', category: 'Umum', difficulty: 'easy' },
  { latin: 'jaya', meaning: 'jaya / victory', category: 'Umum', difficulty: 'easy' },
  { latin: 'kuta', meaning: 'Kuta (tempat)', category: 'Tempat', difficulty: 'easy' },
  { latin: 'padi', meaning: 'padi / rice plant', category: 'Alam', difficulty: 'easy' },
  { latin: 'toya', meaning: 'toya / water (formal)', category: 'Alam', difficulty: 'easy' },
  { latin: 'sapi', meaning: 'sapi / cow', category: 'Hewan', difficulty: 'easy' },
  { latin: 'kuda', meaning: 'kuda / horse', category: 'Hewan', difficulty: 'easy' },
  { latin: 'nasi', meaning: 'nasi / cooked rice', category: 'Makanan', difficulty: 'easy' },
  { latin: 'babi', meaning: 'babi / pig', category: 'Hewan', difficulty: 'easy' },
  { latin: 'raja', meaning: 'raja / king', category: 'Umum', difficulty: 'easy' },
  { latin: 'dadi', meaning: 'dadi / to become', category: 'Umum', difficulty: 'easy' },
  { latin: 'malu', meaning: 'malu / first / ahead', category: 'Umum', difficulty: 'easy' },
  { latin: 'tua', meaning: 'tua / old', category: 'Umum', difficulty: 'easy' },
  { latin: 'muda', meaning: 'muda / young', category: 'Umum', difficulty: 'easy' },
  { latin: 'gede', meaning: 'gede / big', category: 'Umum', difficulty: 'easy' },

  // Medium
  { latin: 'ubud', meaning: 'Ubud (tempat)', category: 'Tempat', difficulty: 'medium' },
  { latin: 'surya', meaning: 'surya / matahari', category: 'Alam', difficulty: 'medium' },
  { latin: 'candra', meaning: 'candra / bulan', category: 'Alam', difficulty: 'medium' },
  { latin: 'banyu', meaning: 'banyu / air', category: 'Alam', difficulty: 'medium' },
  { latin: 'angin', meaning: 'angin / wind', category: 'Alam', difficulty: 'medium' },
  { latin: 'barong', meaning: 'barong / pelindung', category: 'Budaya', difficulty: 'medium' },
  { latin: 'wayang', meaning: 'wayang / shadow puppet', category: 'Budaya', difficulty: 'medium' },
  { latin: 'gamelan', meaning: 'gamelan / musik tradisional', category: 'Budaya', difficulty: 'medium' },
  { latin: 'kecak', meaning: 'kecak / tari kecak', category: 'Budaya', difficulty: 'medium' },
  { latin: 'legong', meaning: 'legong / tarian Bali', category: 'Budaya', difficulty: 'medium' },
  { latin: 'canang', meaning: 'canang / sesajen bunga', category: 'Agama', difficulty: 'medium' },
  { latin: 'tirta', meaning: 'tirta / air suci', category: 'Agama', difficulty: 'medium' },
  { latin: 'banten', meaning: 'banten / sesajen', category: 'Agama', difficulty: 'medium' },
  { latin: 'subak', meaning: 'subak / sistem irigasi', category: 'Budaya', difficulty: 'medium' },
  { latin: 'banjar', meaning: 'banjar / komunitas desa', category: 'Budaya', difficulty: 'medium' },
  { latin: 'jaba', meaning: 'jaba / halaman luar pura', category: 'Agama', difficulty: 'medium' },
  { latin: 'jeroan', meaning: 'jeroan / dalam pura', category: 'Agama', difficulty: 'medium' },
  { latin: 'galungan', meaning: 'galungan / hari raya', category: 'Agama', difficulty: 'medium' },
  { latin: 'kuningan', meaning: 'kuningan / hari raya', category: 'Agama', difficulty: 'medium' },
  { latin: 'nyepi', meaning: 'nyepi / hari raya sunyi', category: 'Agama', difficulty: 'medium' },

  // Hard - longer words or consonant clusters
  { latin: 'dharma', meaning: 'dharma / kewajiban', category: 'Filosofi', difficulty: 'hard' },
  { latin: 'karma', meaning: 'karma / perbuatan', category: 'Filosofi', difficulty: 'hard' },
  { latin: 'mantra', meaning: 'mantra / doa sakral', category: 'Agama', difficulty: 'hard' },
  { latin: 'yoga', meaning: 'yoga / latihan spiritual', category: 'Filosofi', difficulty: 'hard' },
  { latin: 'moksha', meaning: 'moksha / pembebasan jiwa', category: 'Filosofi', difficulty: 'hard' },
  { latin: 'samsara', meaning: 'samsara / siklus kehidupan', category: 'Filosofi', difficulty: 'hard' },
  { latin: 'brahma', meaning: 'Brahma / dewa pencipta', category: 'Agama', difficulty: 'hard' },
  { latin: 'wisnu', meaning: 'Wisnu / dewa pemelihara', category: 'Agama', difficulty: 'hard' },
  { latin: 'shiwa', meaning: 'Shiwa / dewa penghancur', category: 'Agama', difficulty: 'hard' },
  { latin: 'saraswati', meaning: 'Saraswati / dewi ilmu', category: 'Agama', difficulty: 'hard' },
  { latin: 'lakshmi', meaning: 'Lakshmi / dewi kemakmuran', category: 'Agama', difficulty: 'hard' },
  { latin: 'ramayana', meaning: 'Ramayana / epos Hindu', category: 'Sastra', difficulty: 'hard' },
  { latin: 'mahabharata', meaning: 'Mahabharata / epos Hindu', category: 'Sastra', difficulty: 'hard' },
  { latin: 'kakawin', meaning: 'kakawin / puisi Jawa Kuno', category: 'Sastra', difficulty: 'hard' },
  { latin: 'lontar', meaning: 'lontar / daun palem untuk menulis', category: 'Budaya', difficulty: 'hard' },
]
