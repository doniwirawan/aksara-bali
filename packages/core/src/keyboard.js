// Aksara Bali on-screen keyboard data: glyph groups in hanacaraka order plus the
// pangangge (vowel signs and syllable finals) that combine with them. Any
// keyboard UI can render this; @aksara-bali/react's <AksaraKeyboard> does.

const LAYOUT = {
  consonants: [
    // Hanacaraka order
    { char: 'ᬳ', label: 'Ha', latin: 'ha' },
    { char: 'ᬦ', label: 'Na', latin: 'na' },
    { char: 'ᬘ', label: 'Ca', latin: 'ca' },
    { char: 'ᬭ', label: 'Ra', latin: 'ra' },
    { char: 'ᬓ', label: 'Ka', latin: 'ka' },
    { char: 'ᬤ', label: 'Da', latin: 'da' },
    { char: 'ᬢ', label: 'Ta', latin: 'ta' },
    { char: 'ᬲ', label: 'Sa', latin: 'sa' },
    { char: 'ᬯ', label: 'Wa', latin: 'wa' },
    { char: 'ᬮ', label: 'La', latin: 'la' },
    { char: 'ᬫ', label: 'Ma', latin: 'ma' },
    { char: 'ᬕ', label: 'Ga', latin: 'ga' },
    { char: 'ᬩ', label: 'Ba', latin: 'ba' },
    { char: 'ᬗ', label: 'Nga', latin: 'nga' },
    { char: 'ᬧ', label: 'Pa', latin: 'pa' },
    { char: 'ᬚ', label: 'Ja', latin: 'ja' },
    { char: 'ᬬ', label: 'Ya', latin: 'ya' },
    { char: 'ᬜ', label: 'Nya', latin: 'nya' },
    { char: 'ᬡ', label: 'Nna', latin: 'nna' },
    { char: 'ᬝ', label: 'Tha', latin: 'tha' },
    // Extra consonants
    { char: 'ᬔ', label: 'Kha', latin: 'kha' },
    { char: 'ᬖ', label: 'Gha', latin: 'gha' },
    { char: 'ᬙ', label: 'Cha', latin: 'cha' },
    { char: 'ᬛ', label: 'Jha', latin: 'jha' },
    { char: 'ᬟ', label: 'Dha', latin: 'dha' },
    { char: 'ᬨ', label: 'Pha', latin: 'pha' },
    { char: 'ᬪ', label: 'Bha', latin: 'bha' },
    { char: 'ᬰ', label: 'Sha', latin: 'sha' },
    { char: 'ᬱ', label: 'Ssa', latin: 'ssa' },
  ],
  vowels: [
    { char: 'ᬅ', label: 'A', latin: 'a' },
    { char: 'ᬆ', label: 'Ā', latin: 'aa' },
    { char: 'ᬇ', label: 'I', latin: 'i' },
    { char: 'ᬈ', label: 'Ī', latin: 'ii' },
    { char: 'ᬉ', label: 'U', latin: 'u' },
    { char: 'ᬊ', label: 'Ū', latin: 'uu' },
    { char: 'ᬏ', label: 'E', latin: 'e' },
    { char: 'ᬑ', label: 'O', latin: 'o' },
  ],
  numbers: [
    { char: '᭐', label: '0' },
    { char: '᭑', label: '1' },
    { char: '᭒', label: '2' },
    { char: '᭓', label: '3' },
    { char: '᭔', label: '4' },
    { char: '᭕', label: '5' },
    { char: '᭖', label: '6' },
    { char: '᭗', label: '7' },
    { char: '᭘', label: '8' },
    { char: '᭙', label: '9' },
  ],
}

// Pangangge (vowel marks + syllable-final signs) — always visible so you can
// tap a consonant then its vowel mark without switching tabs.
const PANGANGGE = [
  { char: 'ᬶ', label: 'i' },
  { char: 'ᬸ', label: 'u' },
  { char: 'ᬾ', label: 'e' },
  { char: 'ᭀ', label: 'o' },
  { char: 'ᬵ', label: 'ā' },
  { char: 'ᬷ', label: 'ī' },
  { char: 'ᬹ', label: 'ū' },
  { char: 'ᭂ', label: 'ə' },
  { char: '᭄', label: 'adeg' },
  { char: 'ᬂ', label: 'ng' },
  { char: 'ᬄ', label: 'h' },
]

/** Keyboard layout in the shape <AksaraKeyboard layout> expects. */
export const BALINESE_KEYBOARD = {
  groups: [
    { id: 'consonants', label: { id: 'Aksara', en: 'Consonants' }, keys: LAYOUT.consonants },
    { id: 'vowels', label: { id: 'Suara', en: 'Vowels' }, keys: LAYOUT.vowels },
    { id: 'numbers', label: { id: 'Angka', en: 'Numbers' }, keys: LAYOUT.numbers },
  ],
  marks: { label: { id: 'Pangangge', en: 'Vowel signs' }, keys: PANGANGGE },
}
