// Everything script-specific lives here. To build a converter for another
// script (Javanese, Sundanese, Lontara...), replace these with that script's
// engine and data; the pages and the design stay the same.
import { toBali, toLatin, BALINESE_KEYBOARD } from '@aksara-bali/core'

export const script = {
  /** Product name in Latin and the wordmark in the script itself. */
  name: 'Aksara Bali',
  mark: 'ᬅᬓ᭄ᬱᬭ',
  /** BCP-47 tag for text in the script. */
  lang: 'ban-Bali',
  /** Latin -> script and back. Both take and return strings. */
  toScript: toBali,
  toLatin,
  /** On-screen keyboard layout ({ groups, marks }), or null to hide it. */
  keyboard: BALINESE_KEYBOARD,
  /** Shown while the output is empty. */
  sample: 'om swastyastu',
}
