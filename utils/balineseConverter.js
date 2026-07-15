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

// Latin diacritics (from the ā ī ū ě ṇ … input helpers) normalized to the plain
// sequences the mapping understands. Keep in sync with the mobile app's converter.
const LATIN_DIACRITICS = {
  'ā': 'aa', 'â': 'aa', 'ī': 'ii', 'î': 'ii', 'ū': 'uu', 'û': 'uu',
  'é': 'e', 'è': 'e', 'ě': 'e', 'ĕ': 'e', 'ö': 'e',
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
  { latin: 'bapa', meaning: 'bapa / ayah', category: 'Keluarga', difficulty: 'easy' },
  { latin: 'meme', meaning: 'meme / ibu', category: 'Keluarga', difficulty: 'easy' },
  { latin: 'pianak', meaning: 'pianak / anak', category: 'Keluarga', difficulty: 'easy' },
  { latin: 'nyama', meaning: 'nyama / saudara', category: 'Keluarga', difficulty: 'easy' },
  { latin: 'mata', meaning: 'mata / eye', category: 'Tubuh', difficulty: 'easy' },
  { latin: 'lima', meaning: 'lima / tangan', category: 'Tubuh', difficulty: 'easy' },
  { latin: 'batis', meaning: 'batis / kaki', category: 'Tubuh', difficulty: 'easy' },
  { latin: 'sirah', meaning: 'sirah / kepala', category: 'Tubuh', difficulty: 'easy' },
  { latin: 'biu', meaning: 'biu / pisang', category: 'Makanan', difficulty: 'easy' },
  { latin: 'nyuh', meaning: 'nyuh / kelapa', category: 'Makanan', difficulty: 'easy' },
  { latin: 'taluh', meaning: 'taluh / telur', category: 'Makanan', difficulty: 'easy' },
  { latin: 'bulan', meaning: 'bulan / moon', category: 'Alam', difficulty: 'easy' },
  { latin: 'gunung', meaning: 'gunung / mountain', category: 'Alam', difficulty: 'easy' },
  { latin: 'pasih', meaning: 'pasih / laut', category: 'Alam', difficulty: 'easy' },
  { latin: 'umah', meaning: 'umah / rumah', category: 'Tempat', difficulty: 'easy' },
  { latin: 'semengan', meaning: 'semengan / pagi', category: 'Waktu', difficulty: 'medium' },
  { latin: 'peteng', meaning: 'peteng / malam', category: 'Waktu', difficulty: 'medium' },
  { latin: 'majalan', meaning: 'majalan / berjalan', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'madaar', meaning: 'madaar / makan', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'magae', meaning: 'magae / bekerja', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'melajah', meaning: 'melajah / belajar', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'jegeg', meaning: 'jegeg / cantik', category: 'Sifat', difficulty: 'medium' },
  { latin: 'bagus', meaning: 'bagus / tampan', category: 'Sifat', difficulty: 'medium' },
  { latin: 'cerik', meaning: 'cerik / kecil', category: 'Sifat', difficulty: 'medium' },
  { latin: 'bareng', meaning: 'bareng / bersama', category: 'Umum', difficulty: 'medium' },
  { latin: 'catur', meaning: 'catur / empat', category: 'Angka', difficulty: 'hard' },
  { latin: 'aksara', meaning: 'aksara / huruf', category: 'Sastra', difficulty: 'hard' },
  { latin: 'ngaben', meaning: 'ngaben / upacara kremasi', category: 'Agama', difficulty: 'hard' },
  { latin: 'melasti', meaning: 'melasti / upacara penyucian', category: 'Agama', difficulty: 'hard' },
  { latin: 'odalan', meaning: 'odalan / hari jadi pura', category: 'Agama', difficulty: 'hard' },
  { latin: 'pemangku', meaning: 'pemangku / pemimpin upacara', category: 'Agama', difficulty: 'hard' },
  { latin: 'sekala', meaning: 'sekala / dunia nyata', category: 'Filosofi', difficulty: 'hard' },
  { latin: 'niskala', meaning: 'niskala / dunia gaib', category: 'Filosofi', difficulty: 'hard' },
  { latin: 'celeng', meaning: 'celeng / babi', category: 'Hewan', difficulty: 'easy' },
  { latin: 'cicing', meaning: 'cicing / anjing', category: 'Hewan', difficulty: 'easy' },
  { latin: 'meong', meaning: 'meong / kucing', category: 'Hewan', difficulty: 'easy' },
  { latin: 'jaran', meaning: 'jaran / kuda', category: 'Hewan', difficulty: 'easy' },
  { latin: 'bikul', meaning: 'bikul / tikus', category: 'Hewan', difficulty: 'easy' },
  { latin: 'jukut', meaning: 'jukut / sayur', category: 'Makanan', difficulty: 'easy' },
  { latin: 'kopi', meaning: 'kopi / coffee', category: 'Makanan', difficulty: 'easy' },
  { latin: 'gula', meaning: 'gula / sugar', category: 'Makanan', difficulty: 'easy' },
  { latin: 'uyah', meaning: 'uyah / garam', category: 'Makanan', difficulty: 'easy' },
  { latin: 'langit', meaning: 'langit / sky', category: 'Alam', difficulty: 'easy' },
  { latin: 'tanah', meaning: 'tanah / soil', category: 'Alam', difficulty: 'easy' },
  { latin: 'batu', meaning: 'batu / stone', category: 'Alam', difficulty: 'easy' },
  { latin: 'kayu', meaning: 'kayu / wood', category: 'Alam', difficulty: 'easy' },
  { latin: 'desa', meaning: 'desa / village', category: 'Tempat', difficulty: 'easy' },
  { latin: 'pasar', meaning: 'pasar / market', category: 'Tempat', difficulty: 'easy' },
  { latin: 'bunga', meaning: 'bunga / kembang', category: 'Alam', difficulty: 'medium' },
  { latin: 'carik', meaning: 'carik / sawah', category: 'Tempat', difficulty: 'medium' },
  { latin: 'semeton', meaning: 'semeton / kerabat', category: 'Keluarga', difficulty: 'medium' },
  { latin: 'rerama', meaning: 'rerama / orang tua', category: 'Keluarga', difficulty: 'medium' },
  { latin: 'kurenan', meaning: 'kurenan / pasangan', category: 'Keluarga', difficulty: 'medium' },
  { latin: 'megending', meaning: 'megending / bernyanyi', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'ngigel', meaning: 'ngigel / menari', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'masare', meaning: 'masare / tidur', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'mabalih', meaning: 'mabalih / menonton', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'demen', meaning: 'demen / senang', category: 'Sifat', difficulty: 'medium' },
  { latin: 'sebet', meaning: 'sebet / sedih', category: 'Sifat', difficulty: 'medium' },
  { latin: 'gelis', meaning: 'gelis / cepat', category: 'Sifat', difficulty: 'medium' },
  { latin: 'adeng', meaning: 'adeng / lambat', category: 'Sifat', difficulty: 'medium' },
  { latin: 'becik', meaning: 'becik / baik', category: 'Sifat', difficulty: 'medium' },
  { latin: 'corah', meaning: 'corah / buruk', category: 'Sifat', difficulty: 'medium' },
  { latin: 'swadharma', meaning: 'swadharma / kewajiban', category: 'Filosofi', difficulty: 'hard' },
  { latin: 'tatwa', meaning: 'tatwa / filsafat', category: 'Filosofi', difficulty: 'hard' },
  { latin: 'susila', meaning: 'susila / etika', category: 'Filosofi', difficulty: 'hard' },
  { latin: 'upakara', meaning: 'upakara / sarana upacara', category: 'Agama', difficulty: 'hard' },
  { latin: 'yadnya', meaning: 'yadnya / korban suci', category: 'Agama', difficulty: 'hard' },
  { latin: 'pawiwahan', meaning: 'pawiwahan / pernikahan', category: 'Agama', difficulty: 'hard' },
  { latin: 'pratima', meaning: 'pratima / arca suci', category: 'Agama', difficulty: 'hard' },
  { latin: 'sasih', meaning: 'sasih / bulan kalender', category: 'Waktu', difficulty: 'hard' },
  { latin: 'penjor', meaning: 'penjor / hiasan bambu', category: 'Budaya', difficulty: 'hard' },
  { latin: 'ogoh', meaning: 'ogoh / ogoh-ogoh', category: 'Budaya', difficulty: 'hard' },

  // Warna (colors)
  { latin: 'barak', meaning: 'barak / merah', category: 'Warna', difficulty: 'easy' },
  { latin: 'putih', meaning: 'putih / white', category: 'Warna', difficulty: 'easy' },
  { latin: 'selem', meaning: 'selem / hitam', category: 'Warna', difficulty: 'easy' },
  { latin: 'kuning', meaning: 'kuning / yellow', category: 'Warna', difficulty: 'easy' },
  { latin: 'gadang', meaning: 'gadang / hijau', category: 'Warna', difficulty: 'medium' },
  { latin: 'pelung', meaning: 'pelung / biru', category: 'Warna', difficulty: 'medium' },

  // Angka (numbers)
  { latin: 'besik', meaning: 'besik / satu', category: 'Angka', difficulty: 'easy' },
  { latin: 'telu', meaning: 'telu / tiga', category: 'Angka', difficulty: 'easy' },
  { latin: 'papat', meaning: 'papat / empat', category: 'Angka', difficulty: 'easy' },
  { latin: 'pitu', meaning: 'pitu / tujuh', category: 'Angka', difficulty: 'easy' },
  { latin: 'dasa', meaning: 'dasa / sepuluh', category: 'Angka', difficulty: 'easy' },
  { latin: 'kalih', meaning: 'kalih / dua (halus)', category: 'Angka', difficulty: 'medium' },
  { latin: 'nenem', meaning: 'nenem / enam', category: 'Angka', difficulty: 'medium' },
  { latin: 'kutus', meaning: 'kutus / delapan', category: 'Angka', difficulty: 'medium' },
  { latin: 'sia', meaning: 'sia / sembilan', category: 'Angka', difficulty: 'medium' },
  { latin: 'satus', meaning: 'satus / seratus', category: 'Angka', difficulty: 'medium' },
  { latin: 'siu', meaning: 'siu / seribu', category: 'Angka', difficulty: 'medium' },

  // Tubuh (body)
  { latin: 'cunguh', meaning: 'cunguh / hidung', category: 'Tubuh', difficulty: 'easy' },
  { latin: 'kuping', meaning: 'kuping / telinga', category: 'Tubuh', difficulty: 'easy' },
  { latin: 'gigi', meaning: 'gigi / teeth', category: 'Tubuh', difficulty: 'easy' },
  { latin: 'basang', meaning: 'basang / perut', category: 'Tubuh', difficulty: 'easy' },
  { latin: 'bok', meaning: 'bok / rambut', category: 'Tubuh', difficulty: 'easy' },

  // Keluarga (family)
  { latin: 'pekak', meaning: 'pekak / kakek', category: 'Keluarga', difficulty: 'easy' },
  { latin: 'dadong', meaning: 'dadong / nenek', category: 'Keluarga', difficulty: 'easy' },
  { latin: 'beli', meaning: 'beli / kakak laki-laki', category: 'Keluarga', difficulty: 'easy' },
  { latin: 'mbok', meaning: 'mbok / kakak perempuan', category: 'Keluarga', difficulty: 'easy' },
  { latin: 'adi', meaning: 'adi / adik', category: 'Keluarga', difficulty: 'easy' },

  // Hewan (animals)
  { latin: 'siap', meaning: 'siap / ayam', category: 'Hewan', difficulty: 'easy' },
  { latin: 'bebek', meaning: 'bebek / itik', category: 'Hewan', difficulty: 'easy' },
  { latin: 'kedis', meaning: 'kedis / burung', category: 'Hewan', difficulty: 'easy' },
  { latin: 'bojog', meaning: 'bojog / monyet', category: 'Hewan', difficulty: 'easy' },
  { latin: 'lelipi', meaning: 'lelipi / ular', category: 'Hewan', difficulty: 'medium' },
  { latin: 'penyu', meaning: 'penyu / kura-kura laut', category: 'Hewan', difficulty: 'medium' },

  // Makanan (food)
  { latin: 'poh', meaning: 'poh / mangga', category: 'Makanan', difficulty: 'easy' },
  { latin: 'gedang', meaning: 'gedang / pepaya', category: 'Makanan', difficulty: 'easy' },
  { latin: 'juuk', meaning: 'juuk / jeruk', category: 'Makanan', difficulty: 'easy' },
  { latin: 'jaja', meaning: 'jaja / kue tradisional', category: 'Makanan', difficulty: 'easy' },
  { latin: 'bubuh', meaning: 'bubuh / bubur', category: 'Makanan', difficulty: 'easy' },
  { latin: 'tipat', meaning: 'tipat / ketupat', category: 'Makanan', difficulty: 'medium' },
  { latin: 'lawar', meaning: 'lawar / masakan khas Bali', category: 'Makanan', difficulty: 'medium' },
  { latin: 'sela', meaning: 'sela / ubi', category: 'Makanan', difficulty: 'medium' },

  // Alam (nature)
  { latin: 'bintang', meaning: 'bintang / star', category: 'Alam', difficulty: 'easy' },
  { latin: 'ujan', meaning: 'ujan / hujan', category: 'Alam', difficulty: 'easy' },
  { latin: 'don', meaning: 'don / daun', category: 'Alam', difficulty: 'easy' },
  { latin: 'tukad', meaning: 'tukad / sungai', category: 'Alam', difficulty: 'medium' },
  { latin: 'danu', meaning: 'danu / danau', category: 'Alam', difficulty: 'medium' },
  { latin: 'alas', meaning: 'alas / hutan', category: 'Alam', difficulty: 'medium' },
  { latin: 'bias', meaning: 'bias / pasir', category: 'Alam', difficulty: 'medium' },
  { latin: 'punyan', meaning: 'punyan / pohon', category: 'Alam', difficulty: 'medium' },

  // Tempat (places)
  { latin: 'sanur', meaning: 'Sanur (tempat)', category: 'Tempat', difficulty: 'medium' },
  { latin: 'denpasar', meaning: 'Denpasar / ibu kota Bali', category: 'Tempat', difficulty: 'medium' },
  { latin: 'uluwatu', meaning: 'Uluwatu (tempat)', category: 'Tempat', difficulty: 'medium' },
  { latin: 'batur', meaning: 'Batur / gunung & danau', category: 'Tempat', difficulty: 'medium' },
  { latin: 'besakih', meaning: 'Besakih / pura terbesar di Bali', category: 'Tempat', difficulty: 'hard' },

  // Waktu (time) & wewaran (day names)
  { latin: 'jani', meaning: 'jani / sekarang', category: 'Waktu', difficulty: 'easy' },
  { latin: 'mani', meaning: 'mani / besok', category: 'Waktu', difficulty: 'easy' },
  { latin: 'dibi', meaning: 'dibi / kemarin', category: 'Waktu', difficulty: 'medium' },
  { latin: 'tengai', meaning: 'tengai / siang', category: 'Waktu', difficulty: 'medium' },
  { latin: 'sanja', meaning: 'sanja / sore', category: 'Waktu', difficulty: 'medium' },
  { latin: 'redite', meaning: 'redite / hari Minggu', category: 'Waktu', difficulty: 'hard' },
  { latin: 'soma', meaning: 'soma / hari Senin', category: 'Waktu', difficulty: 'hard' },
  { latin: 'anggara', meaning: 'anggara / hari Selasa', category: 'Waktu', difficulty: 'hard' },
  { latin: 'buda', meaning: 'buda / hari Rabu', category: 'Waktu', difficulty: 'hard' },
  { latin: 'wraspati', meaning: 'wraspati / hari Kamis', category: 'Waktu', difficulty: 'hard' },
  { latin: 'sukra', meaning: 'sukra / hari Jumat', category: 'Waktu', difficulty: 'hard' },
  { latin: 'saniscara', meaning: 'saniscara / hari Sabtu', category: 'Waktu', difficulty: 'hard' },

  // Kata kerja (verbs)
  { latin: 'nginem', meaning: 'nginem / minum', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'malaib', meaning: 'malaib / berlari', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'negak', meaning: 'negak / duduk', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'majujuk', meaning: 'majujuk / berdiri', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'matakon', meaning: 'matakon / bertanya', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'meli', meaning: 'meli / membeli', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'ngadep', meaning: 'ngadep / menjual', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'teka', meaning: 'teka / datang', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'mulih', meaning: 'mulih / pulang', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'maca', meaning: 'maca / membaca', category: 'Kata kerja', difficulty: 'medium' },
  { latin: 'nulis', meaning: 'nulis / menulis', category: 'Kata kerja', difficulty: 'medium' },

  // Sifat (adjectives)
  { latin: 'liu', meaning: 'liu / banyak', category: 'Sifat', difficulty: 'medium' },
  { latin: 'bedik', meaning: 'bedik / sedikit', category: 'Sifat', difficulty: 'medium' },
  { latin: 'joh', meaning: 'joh / jauh', category: 'Sifat', difficulty: 'medium' },
  { latin: 'paek', meaning: 'paek / dekat', category: 'Sifat', difficulty: 'medium' },
  { latin: 'tegeh', meaning: 'tegeh / tinggi', category: 'Sifat', difficulty: 'medium' },
  { latin: 'endep', meaning: 'endep / rendah', category: 'Sifat', difficulty: 'medium' },
  { latin: 'melah', meaning: 'melah / baik', category: 'Sifat', difficulty: 'medium' },
  { latin: 'jele', meaning: 'jele / jelek', category: 'Sifat', difficulty: 'medium' },
  { latin: 'anyar', meaning: 'anyar / baru', category: 'Sifat', difficulty: 'medium' },
  { latin: 'panes', meaning: 'panes / panas', category: 'Sifat', difficulty: 'medium' },
  { latin: 'etis', meaning: 'etis / dingin', category: 'Sifat', difficulty: 'medium' },

  // Budaya (culture)
  { latin: 'gong', meaning: 'gong / gong', category: 'Budaya', difficulty: 'easy' },
  { latin: 'kendang', meaning: 'kendang / gendang', category: 'Budaya', difficulty: 'medium' },
  { latin: 'suling', meaning: 'suling / seruling', category: 'Budaya', difficulty: 'medium' },
  { latin: 'keris', meaning: 'keris / senjata pusaka', category: 'Budaya', difficulty: 'medium' },
  { latin: 'udeng', meaning: 'udeng / ikat kepala', category: 'Budaya', difficulty: 'medium' },
  { latin: 'kamen', meaning: 'kamen / kain bawahan', category: 'Budaya', difficulty: 'medium' },
  { latin: 'rindik', meaning: 'rindik / musik bambu', category: 'Budaya', difficulty: 'hard' },

  // Agama (religion)
  { latin: 'dewata', meaning: 'dewata / para dewa', category: 'Agama', difficulty: 'hard' },
  { latin: 'acintya', meaning: 'Acintya / wujud tertinggi Tuhan', category: 'Agama', difficulty: 'hard' },
  { latin: 'sanghyang', meaning: 'sanghyang / gelar dewata', category: 'Agama', difficulty: 'hard' },
  { latin: 'taksu', meaning: 'taksu / karisma spiritual', category: 'Agama', difficulty: 'hard' },
  { latin: 'leak', meaning: 'leak / ilmu hitam mitologi', category: 'Agama', difficulty: 'hard' },
  { latin: 'rangda', meaning: 'Rangda / ratu leak', category: 'Agama', difficulty: 'hard' },
  { latin: 'trisandya', meaning: 'trisandya / doa harian Hindu Bali', category: 'Agama', difficulty: 'hard' },
  { latin: 'padmasana', meaning: 'padmasana / tempat pemujaan', category: 'Agama', difficulty: 'hard' },

  // Filosofi (philosophy)
  { latin: 'atman', meaning: 'atman / jiwa', category: 'Filosofi', difficulty: 'hard' },
  { latin: 'ahimsa', meaning: 'ahimsa / tanpa kekerasan', category: 'Filosofi', difficulty: 'hard' },
  { latin: 'satya', meaning: 'satya / kejujuran', category: 'Filosofi', difficulty: 'hard' },
  { latin: 'trimurti', meaning: 'trimurti / tiga dewa utama', category: 'Filosofi', difficulty: 'hard' },

  // Sastra (literature)
  { latin: 'satua', meaning: 'satua / dongeng', category: 'Sastra', difficulty: 'hard' },
  { latin: 'geguritan', meaning: 'geguritan / puisi tradisional', category: 'Sastra', difficulty: 'hard' },
  { latin: 'pupuh', meaning: 'pupuh / bentuk puisi tembang', category: 'Sastra', difficulty: 'hard' },
  { latin: 'usada', meaning: 'usada / naskah pengobatan', category: 'Sastra', difficulty: 'hard' },
]
