export {
  convertLatinToBalinese,
  balineseMapping,
  LATIN_DIACRITICS,
  normalizeDiacritics,
} from './latin-to-bali.js'
export { convertBalineseToLatin } from './bali-to-latin.js'
export { QUIZ_WORDS } from './quiz-words.js'
export { BALINESE_KEYBOARD } from './keyboard.js'

import { convertLatinToBalinese } from './latin-to-bali.js'
import { convertBalineseToLatin } from './bali-to-latin.js'

/** Short aliases. */
export const toBali = convertLatinToBalinese
export const toLatin = convertBalineseToLatin
