// Adds numbered footnotes ("[^1]" markers + "[^1]: note" lines) to published
// blog posts, in both languages. Re-runnable: existing footnotes are stripped
// and rebuilt from NOTES below, so edit this file and run it again.
//
//   node scripts/add-footnotes.mjs            # dry run: report anchors
//   node scripts/add-footnotes.mjs --write    # update Supabase
//
// Each note anchors either to a heading (h: index of the "## " heading; the
// marker goes on the first text line under it, which works because the ID and
// EN versions share their structure) or to a line (at: text found in that line,
// one string for both languages or { id, en }).
//
// FIXES are factual corrections applied in the same pass, so a footnote never
// cites a source that contradicts the sentence it sits on.

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const WRITE = process.argv.includes('--write')
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const a = (url, text) => `<a href="${url}" target="_blank" rel="noopener">${text}</a>`
const wen = (t, label = t) => a(`https://en.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, '_'))}`, label)
const wid = (t, label = t) => a(`https://id.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, '_'))}`, label)
const both = (t) => ({ id: t, en: t })

// Shared sources
const U_CHART = a('https://www.unicode.org/charts/PDF/U1B00.pdf', 'Unicode Consortium, tabel kode Balinese (U+1B00–U+1B7F)')
const U_CHART_EN = a('https://www.unicode.org/charts/PDF/U1B00.pdf', 'Unicode Consortium, Balinese code chart (U+1B00–U+1B7F)')
const U_CH17 = a('https://www.unicode.org/versions/latest/core-spec/chapter-17/', 'The Unicode Standard, bab 17 (Indonesia and Philippines Scripts), bagian Balinese')
const U_CH17_EN = a('https://www.unicode.org/versions/latest/core-spec/chapter-17/', 'The Unicode Standard, chapter 17 (Indonesia and Philippines Scripts), Balinese section')
const U_50 = a('https://www.unicode.org/versions/Unicode5.0.0/', 'Unicode 5.0.0 (Juli 2006)')
const U_50_EN = a('https://www.unicode.org/versions/Unicode5.0.0/', 'Unicode 5.0.0 (July 2006)')
const NOTO = a('https://fonts.google.com/noto/specimen/Noto+Sans+Balinese', 'Noto Sans Balinese di Google Fonts')
const NOTO_EN = a('https://fonts.google.com/noto/specimen/Noto+Sans+Balinese', 'Noto Sans Balinese on Google Fonts')
const NOTO_GH = a('https://github.com/notofonts/balinese', 'notofonts/balinese')
const KBI = a('https://repositori.kemendikdasmen.go.id/16215/', 'Kamus Bali–Indonesia, edisi ke-3 (Badan Pengembangan dan Pembinaan Bahasa, 2016)')
const KBI_EN = a('https://repositori.kemendikdasmen.go.id/16215/', 'Kamus Bali–Indonesia, 3rd edition (Badan Pengembangan dan Pembinaan Bahasa, 2016)')
const KUNO = a('https://repositori.kemendikdasmen.go.id/2854/', 'Kamus Bahasa Bali Kuno–Indonesia (Pusat Pembinaan dan Pengembangan Bahasa, 1985)')
const SCRIPT = `${wid('Aksara Bali')}; ${wen('Balinese script')}`
const PERGUB = a('https://dictionary.basabali.org/Government_Utsaha_Ngrajegang_Basa_bali_Malarapan_PERGUB_No.80_tahun_2018', 'BASAbali Wiki, Pergub No. 80 tahun 2018')
const ANTARA = a('https://bali.antaranews.com/berita/397482/gubernur-koster-papan-nama-usaha-harus-gunakan-aksara-bali', 'Antara Bali, "Gubernur Koster: papan nama usaha harus gunakan aksara Bali"')
const DIGITS = 'Angka Bali menempati U+1B50–U+1B59'
const DIGITS_EN = 'Balinese digits are U+1B50–U+1B59'
const TOFU_ID = `Kotak kosong itu lazim disebut "tofu"; keluarga font Noto dibuat untuk menghilangkannya: ${wen('Noto fonts')}.`
const TOFU_EN = `Those empty boxes are commonly called "tofu"; the Noto font family was made to eliminate them: ${wen('Noto fonts')}.`

const NOTES = {
  'mengenal-aksara-bali': [
    { h: 0, id: `Asal-usul dari aksara Brahmi melalui aksara Kawi: ${SCRIPT}.`, en: `Descent from Brahmi through the Kawi script: ${SCRIPT}.` },
    { h: 2, id: `Struktur abugida dan urutan aksaranya: ${U_CH17}.`, en: `Abugida structure and letter order: ${U_CH17_EN}.` },
    { h: 3, id: `Aksara Bali ditambahkan pada ${U_50}; rinciannya di ${U_CHART}.`, en: `Balinese was added in ${U_50_EN}; details in the ${U_CHART_EN}.` },
  ],
  'cara-belajar-aksara-bali': [
    { h: 2, id: `Daftar lengkap tanda vokal: ${U_CHART}. Lihat juga <a href="/blog/pangangge-tanda-vokal-aksara-bali">pangangge</a>.`, en: `The full set of vowel signs: ${U_CHART_EN}. See also <a href="/blog/pangangge-tanda-vokal-aksara-bali">pangangge</a>.` },
    { h: 4, id: `Belajar terjadwal dalam sesi pendek lebih melekat daripada sesi panjang sekaligus, dikenal sebagai efek jarak: ${wen('Spacing effect')}.`, en: `Short, spaced sessions stick better than one long session, known as the spacing effect: ${wen('Spacing effect')}.` },
  ],
  'aksara-bali-dan-bahasa-sansekerta': [
    { h: 1, id: `Tentang bunyi retrofleks: ${wen('Retroflex consonant')}. Huruf murda dalam Unicode: ${U_CHART}.`, en: `On retroflex sounds: ${wen('Retroflex consonant')}. Murda letters in Unicode: ${U_CHART_EN}.` },
    { h: 3, id: `${wen('Abugida')}; ${U_CH17}.`, en: `${wen('Abugida')}; ${U_CH17_EN}.` },
  ],
  'lontar-naskah-kuno-bali': [
    { h: 0, id: `${wid('Lontar')}; ${wen('Lontar')}.`, en: `${wen('Lontar')}; ${wid('Lontar', 'Lontar (Wikipedia bahasa Indonesia)')}.` },
    { h: 3, id: `Gedong Kirtya didirikan pada 1928 di Singaraja: ${wid('Gedong Kirtya')}.`, en: `Gedong Kirtya was founded in 1928 in Singaraja: ${wen('Gedong Kirtya')}.` },
  ],
  'aksara-bali-di-era-digital': [
    { h: 1, id: `${U_50}; ${U_CHART}; font: ${NOTO}.`, en: `${U_50_EN}; ${U_CHART_EN}; font: ${NOTO_EN}.` },
    { h: 3, id: `${a('https://ban.wikipedia.org/', 'Wikipédia basa Bali')}; ${wen('Balinese Wikipedia')}. Kode sumber font: ${NOTO_GH}.`, en: `${a('https://ban.wikipedia.org/', 'Balinese Wikipedia')}; ${wen('Balinese Wikipedia', 'about it')}. Font source code: ${NOTO_GH}.` },
  ],
  'upacara-keagamaan-aksara-bali': [
    { h: 2, id: `Prasasti berbahasa Bali Kuno tertua yang berangka tahun berasal dari akhir abad ke-9, misalnya Sukawana A I (882 M): ${wen('Old Balinese')}. Lihat <a href="/blog/bahasa-bali-kuno-prasasti">bahasa Bali Kuno dan prasasti</a>.`, en: `The oldest dated Old Balinese inscriptions are from the late 9th century, such as Sukawana A I (882 CE): ${wen('Old Balinese')}. See <a href="/blog/bahasa-bali-kuno-prasasti">Old Balinese and the inscriptions</a>.` },
    { h: 3, id: `${wid('Ngaben')}; ${wen('Ngaben')}.`, en: `${wen('Ngaben')}.` },
  ],
  'perbedaan-aksara-bali-jawa-latin': [
    { h: 0, id: `${wid('Aksara Kawi')}; ${wen('Pallava script')}.`, en: `${wen('Kawi script')}; ${wen('Pallava script')}.` },
    { h: 2, id: `128 adalah ukuran blok Balinese (U+1B00–U+1B7F); jumlah karakter yang terisi sedikit lebih sedikit. Lihat ${U_CHART} dan ${a('https://www.unicode.org/charts/PDF/UA980.pdf', 'tabel kode Javanese (U+A980–U+A9DF)')}.`, en: `128 is the size of the Balinese block (U+1B00–U+1B7F); slightly fewer code points are assigned. See the ${U_CHART_EN} and the ${a('https://www.unicode.org/charts/PDF/UA980.pdf', 'Javanese code chart (U+A980–U+A9DF)')}.` },
  ],
  'rerajahan-seni-sakral-aksara-bali': [
    { h: 0, id: `Tentang yantra dalam tradisi Hindu: ${wen('Yantra')}.`, en: `On yantra in Hindu tradition: ${wen('Yantra')}.` },
    { h: 2, id: `Ong ditulis dengan aksara swara O (U+1B12) dan ulu candra (U+1B01): ${U_CHART}.`, en: `Ong is written with the vowel letter O (U+1B12) and ulu candra (U+1B01): ${U_CHART_EN}.` },
  ],
  'aksara-bali-di-kehidupan-sehari-hari': [
    { h: 0, id: `Peraturan Gubernur Bali No. 80 Tahun 2018: ${PERGUB}; ${ANTARA}. Lihat <a href="/blog/pergub-80-2018-aksara-bali-papan-nama">aksara Bali di papan nama</a>.`, en: `Bali Governor Regulation No. 80 of 2018: ${PERGUB}; ${ANTARA}. See <a href="/blog/pergub-80-2018-aksara-bali-papan-nama">Balinese script on signs</a>.` },
  ],
  'belajar-hanacaraka-panduan-lengkap': [
    { h: 0, id: `${wid('Hanacaraka')}; ${wid('Aji Saka')}.`, en: `${wen('Hanacaraka')}; ${wen('Aji Saka')}.` },
    { h: 0, id: `Bentuk dan kode tiap aksara: ${U_CHART}.`, en: `Shapes and code points of each letter: ${U_CHART_EN}.` },
  ],
  'angka-bali-sistem-penomoran-tradisional': [
    { h: 0, id: `${DIGITS}: ${U_CHART}; ${wen('Balinese numerals')}.`, en: `${DIGITS_EN}: ${U_CHART_EN}; ${wen('Balinese numerals')}.` },
    { at: { id: 'Tahun Saka dimulai pada 78 Masehi', en: 'The Saka calendar traditionally' }, id: `Tahun Saka dihitung dari 78 M: ${wen('Balinese saka calendar')}.`, en: `The Saka era counts from 78 CE: ${wen('Balinese saka calendar')}.` },
  ],
  'pangangge-tanda-vokal-aksara-bali': [
    { h: 0, id: `Nama dan kode tiap tanda: ${U_CHART}.`, en: `Names and code points of each sign: ${U_CHART_EN}.` },
    { h: 2, id: `Adeg-adeg adalah virama aksara Bali (U+1B44): ${U_CH17}.`, en: `Adeg-adeg is the Balinese virama (U+1B44): ${U_CH17_EN}.` },
  ],
  'aksara-murda-huruf-kapital-bali': [
    { h: 2, id: `${wen('Retroflex consonant')}.`, en: `${wen('Retroflex consonant')}.` },
    { h: 1, id: `Daftar huruf murda (aksara mahaprana dan retrofleks) dalam Unicode: ${U_CHART}.`, en: `The murda letters (aspirated and retroflex) in Unicode: ${U_CHART_EN}.` },
  ],
  'cara-instal-font-aksara-bali': [
    { h: 0, id: `${U_CHART}. ${TOFU_ID}`, en: `${U_CHART_EN}. ${TOFU_EN}` },
    { h: 1, id: `${NOTO}; kode sumber dan lisensi (SIL Open Font License) di ${NOTO_GH}.`, en: `${NOTO_EN}; source and licence (SIL Open Font License) at ${NOTO_GH}.` },
  ],
  'kakawin-epik-sastra-bali-kuno': [
    { h: 0, id: `${wid('Kakawin')}; ${wen('Kakawin')}.`, en: `${wen('Kakawin')}; ${wen('Old Javanese')}.` },
    { h: 1, id: `${wid('Kakawin Ramayana')}; ${wid('Kakawin Arjunawiwāha', 'Kakawin Arjunawiwaha')}; ${wid('Kakawin Sutasoma')}.`, en: `${wen('Kakawin Ramayana')}; ${wen('Arjunawiwaha')}; ${wen('Kakawin Sutasoma')}.` },
  ],
  'aplikasi-android-aksara-bali-rilis-baru': [
    { h: 0, id: `Versi terbaru dan catatan setiap rilis ada di ${a('https://github.com/doniwirawan/aksara-bali/releases', 'halaman rilis GitHub')}; cara memasangnya di <a href="/download">halaman unduh</a>.`, en: `The latest version and the notes for every release are on the ${a('https://github.com/doniwirawan/aksara-bali/releases', 'GitHub releases page')}; install steps are on the <a href="/download">download page</a>.` },
  ],
  'balinese-script-generator-online': [
    { at: 'U+1B00–U+1B7F', id: `${U_CHART}.`, en: `${U_CHART_EN}.` },
    { at: '□□□', id: TOFU_ID, en: TOFU_EN },
  ],
  'translate-latin-ke-aksara-bali': [
    { at: 'ᬲᬬᬂ', id: `Cecek (U+1B02) dan bisah (U+1B04): ${U_CHART}.`, en: `Cecek (U+1B02) and bisah (U+1B04): ${U_CHART_EN}.` },
    { at: '᭒᭐᭒᭖', id: `${DIGITS}: ${U_CHART}.`, en: `${DIGITS_EN}: ${U_CHART_EN}.` },
  ],
  'menulis-aksara-bali-online': [
    { at: 'Noto Sans Balinese', id: `${NOTO}.`, en: `${NOTO_EN}.` },
    { at: '□□□', id: TOFU_ID, en: TOFU_EN },
  ],
  'nama-dalam-aksara-bali': [
    { h: 1, id: `Aksara Bali adalah abugida yang mencatat suku kata menurut bunyinya: ${SCRIPT}.`, en: `Balinese script is an abugida that records syllables by sound: ${SCRIPT}.` },
  ],
  'daftar-lengkap-aksara-bali': [
    { h: 4, id: `Susunan konsonan menurut tempat artikulasi: ${U_CH17}.`, en: `Consonants arranged by place of articulation: ${U_CH17_EN}.` },
    { h: 7, id: `Ra repa (U+1B0B) dan la lenga (U+1B0D): ${U_CHART}.`, en: `Ra repa (U+1B0B) and la lenga (U+1B0D): ${U_CHART_EN}.` },
    { h: 12, id: `${U_50}; ${U_CHART}.`, en: `${U_50_EN}; ${U_CHART_EN}.` },
  ],
  'ucapan-bahasa-bali-sehari-hari': [
    { h: 3, id: `Tentang tingkatan tutur: ${wen('Balinese language')}; panduan lengkapnya di <a href="/blog/anggah-ungguh-basa-bali">anggah-ungguh basa Bali</a>.`, en: `On speech levels: ${wen('Balinese language')}; the full guide is <a href="/blog/anggah-ungguh-basa-bali">Balinese speech levels</a>.` },
  ],
  'cara-mengetik-aksara-bali-keyboard': [
    { at: 'ᬋ', id: `Ra repa (U+1B0B) dan la lenga (U+1B0D): ${U_CHART}.`, en: `Ra repa (U+1B0B) and la lenga (U+1B0D): ${U_CHART_EN}.` },
    { at: 'scriptio continua', id: `${wen('Scriptio continua')}.`, en: `${wen('Scriptio continua')}.` },
  ],
  'gantungan-gempelan-aksara-bali': [
    { at: 'ᬩᬦ᭄ᬚᬭ᭄', id: `Unicode menyimpan gugus konsonan sebagai konsonan + adeg-adeg (U+1B44) + konsonan, dan font yang menampilkannya sebagai gantungan: ${U_CH17}.`, en: `Unicode stores a cluster as consonant + adeg-adeg (U+1B44) + consonant, and the font draws it as a gantungan: ${U_CH17_EN}.` },
  ],
  'copy-paste-aksara-bali': [
    { h: 0, id: `Semua karakter di halaman ini berasal dari ${U_CHART}.`, en: `Every character on this page comes from the ${U_CHART_EN}.` },
    { at: '□□□', id: TOFU_ID, en: TOFU_EN },
  ],
  'translate-bahasa-indonesia-ke-bahasa-bali': [
    { h: 0, id: `${wen('Transliteration')}.`, en: `${wen('Transliteration')}.` },
    { h: 2, id: `Untuk padanan yang lebih lengkap: ${KBI}, yang juga dipakai <a href="/translate">Kamus Bahasa Bali</a> di situs ini.`, en: `For fuller equivalents: ${KBI_EN}, which this site's <a href="/translate">Balinese dictionary</a> also uses.` },
  ],
  'aksara-bali-untuk-tato-dan-desain': [
    { at: 'Noto Sans Balinese', id: `${NOTO}.`, en: `${NOTO_EN}.` },
    { h: 3, id: `Tentang aksara dan simbol bertuah: <a href="/blog/rerajahan-seni-sakral-aksara-bali">rerajahan</a>; ${wen('Balinese Hinduism')}.`, en: `On sacred letters and symbols: <a href="/blog/rerajahan-seni-sakral-aksara-bali">rerajahan</a>; ${wen('Balinese Hinduism')}.` },
  ],
  'asal-usul-aksara-bali-aji-saka': [
    { h: 1, id: `${wen('Brahmi script')}; ${wen('Pallava script')}; ${wid('Aksara Kawi')}.`, en: `${wen('Brahmi script')}; ${wen('Pallava script')}; ${wen('Kawi script')}.` },
    { h: 2, id: `${wid('Aji Saka')}; ${wid('Hanacaraka')}. Versi legenda berbeda antar daerah.`, en: `${wen('Aji Saka')}; ${wen('Hanacaraka')}. Versions of the legend differ by region.` },
    { h: 5, id: `${U_50}; ${U_CHART}.`, en: `${U_50_EN}; ${U_CHART_EN}.` },
  ],
  'menulis-aksara-bali-di-word-canva': [
    { h: 0, id: `${NOTO}; ${NOTO_GH}.`, en: `${NOTO_EN}; ${NOTO_GH}.` },
  ],
  'kelengkapan-penjor-galungan': [
    { at: 'Eka Setyawan', id: `${a('https://commons.wikimedia.org/wiki/File:%C3%89t%C3%A9h-%C3%A9t%C3%A9h_P%C3%A9njor_Galungan.png', 'Étéh-étéh Pénjor Galungan, Wikimedia Commons')}; ${wid('Penjor')}.`, en: `${a('https://commons.wikimedia.org/wiki/File:%C3%89t%C3%A9h-%C3%A9t%C3%A9h_P%C3%A9njor_Galungan.png', 'Étéh-étéh Pénjor Galungan, Wikimedia Commons')}; ${wen('Penjor')}.` },
    { h: 3, id: `${wid('Galungan')}; ${wid('Pawukon')}. Rangkaian lengkapnya di <a href="/blog/galungan-kuningan-rangkaian-hari-raya">Galungan dan Kuningan</a>.`, en: `${wen('Galungan')}; ${wen('Pawukon calendar')}. The full sequence is in <a href="/blog/galungan-kuningan-rangkaian-hari-raya">Galungan and Kuningan</a>.` },
  ],
  'rangkaian-hari-raya-nyepi': [
    { h: 0, id: `${wid('Nyepi')}; ${wen('Nyepi')}.`, en: `${wen('Nyepi')}; ${wen('Balinese saka calendar')}.` },
    { h: 1, id: `${wid('Melasti')}; ${wid('Ogoh-ogoh')}.`, en: `${wen('Ogoh-ogoh')}; ${wid('Melasti', 'Melasti (Wikipedia bahasa Indonesia)')}.` },
  ],
  'anggah-ungguh-basa-bali': [
    { h: 1, id: `Pembagian tingkatan dan contoh di artikel ini mengikuti data <a href="/translate">Kamus Bahasa Bali</a> situs ini, yang bersumber dari Kamus Anggah-Ungguh Kruna Bali–Indonesia dan ${KBI}.`, en: `The levels and examples follow this site's <a href="/translate">Balinese dictionary</a>, drawn from the Kamus Anggah-Ungguh Kruna Bali–Indonesia and the ${KBI_EN}.` },
    { h: 4, id: `Tentang tingkatan tutur bahasa Bali: ${wen('Balinese language')}.`, en: `On Balinese speech levels: ${wen('Balinese language')}.` },
  ],
  'bahasa-bali-kuno-prasasti': [
    { h: 1, id: `${wen('Old Balinese')}; ${wid('Prasasti Blanjong')}; ${wen('Belanjong pillar')}.`, en: `${wen('Old Balinese')}; ${wen('Belanjong pillar')}.` },
    { h: 2, id: `${KUNO}.`, en: `${KUNO}.` },
  ],
  'kata-bahasa-bali-yang-mulai-punah': [
    { h: 0, id: `Utas asal: ${a('https://www.threads.com/@gekwann/post/Dfrg4WGn1jc', 'Threads, @gekwann')}. Arti diperiksa dengan ${KBI}.`, en: `The original thread: ${a('https://www.threads.com/@gekwann/post/Dfrg4WGn1jc', 'Threads, @gekwann')}. Meanings were checked against the ${KBI_EN}.` },
  ],
  'cara-memakai-kamus-bahasa-bali-online': [
    { h: 0, id: `${KBI}, lisensi CC BY-NC 4.0.`, en: `${KBI_EN}, licensed CC BY-NC 4.0.` },
    { h: 4, id: `${KUNO}.`, en: `${KUNO}.` },
  ],
  'nama-hari-wuku-sasih-kalender-bali': [
    { h: 0, id: `${wid('Pawukon')}; ${wen('Pawukon calendar')}; ${wen('Balinese saka calendar')}.`, en: `${wen('Pawukon calendar')}; ${wen('Balinese saka calendar')}.` },
    { h: 3, id: `${wid('Wuku')}.`, en: `${wid('Wuku', 'Wuku (Wikipedia bahasa Indonesia)')}; ${wen('Pawukon calendar')}.` },
  ],
  'galungan-kuningan-rangkaian-hari-raya': [
    { h: 0, id: `${wid('Galungan')}; ${wid('Hari raya Kuningan')}.`, en: `${wen('Galungan')}; ${wid('Hari raya Kuningan', 'Kuningan (Wikipedia bahasa Indonesia)')}.` },
    { h: 2, id: 'Dihitung dari Galungan 17 Juni 2026 dengan menambahkan 210 hari; Kuningan selalu 10 hari setelah Galungan.', en: 'Counted from Galungan on 17 June 2026 by adding 210 days; Kuningan is always 10 days after Galungan.' },
  ],
  'hari-raya-saraswati-aksara-bali': [
    { h: 0, id: `${wid('Saraswati (hari raya)')}; ${wen('Saraswati')}.`, en: `${wen('Saraswati')}; ${wid('Saraswati (hari raya)', 'Saraswati day (Wikipedia bahasa Indonesia)')}.` },
    { h: 2, id: `${wid('Pagerwesi')}; ${wid('Pawukon')}.`, en: `${wid('Pagerwesi', 'Pagerwesi (Wikipedia bahasa Indonesia)')}; ${wen('Pawukon calendar')}.` },
    { h: 3, id: 'Saraswati jatuh 136 hari setelah Galungan; dihitung dari Galungan 17 Juni 2026 (Saraswati 31 Oktober 2026), lalu ditambah 210 hari.', en: 'Saraswati falls 136 days after Galungan; counted from Galungan on 17 June 2026 (Saraswati 31 October 2026), then 210 days on.' },
  ],
  'pergub-80-2018-aksara-bali-papan-nama': [
    { h: 0, id: `${PERGUB}; ${ANTARA}.`, en: `${PERGUB}; ${ANTARA}.` },
    { h: 1, id: `Bulan Bahasa Bali diatur dalam Pergub yang sama: ${PERGUB}.`, en: `Balinese Language Month is set out in the same regulation: ${PERGUB}.` },
    { h: 2, id: `${a('https://coconuts.co/bali/news/irony-balinese-script-incorrect-sign-posted-jembrana-school', 'Coconuts Bali, papan sekolah di Jembrana')}; ${a('https://ejournal.undiksha.ac.id/index.php/JJPBB/article/view/35959/19880', 'Jurnal Pendidikan Bahasa Bali, Undiksha')}.`, en: `${a('https://coconuts.co/bali/news/irony-balinese-script-incorrect-sign-posted-jembrana-school', 'Coconuts Bali, school sign in Jembrana')}; ${a('https://ejournal.undiksha.ac.id/index.php/JJPBB/article/view/35959/19880', 'Jurnal Pendidikan Bahasa Bali, Undiksha')}.` },
  ],
}

const DIGIT_ROWS_EN_FULL = ['| 6 | ᭖ | U+1B56 |', '| 7 | ᭗ | U+1B57 |', '| 8 | ᭘ | U+1B58 |', '| 9 | ᭙ | U+1B59 |'].join('\n')
const FIXES = {
  'angka-bali-sistem-penomoran-tradisional': [
    [/U\+1BD(\d)/g, 'U+1B5$1'], // Balinese digits are U+1B50–U+1B59 (1BD0 is Batak)
    ['(and more...)', DIGIT_ROWS_EN_FULL],
  ],
  'pangangge-tanda-vokal-aksara-bali': [
    ['**Cecek** (ᬁ)', '**Cecek** (ᬂ)'], // ᬁ is ulu candra; cecek is U+1B02
    ['**Nania** — menghasilkan konsonan nasal', '**Nania** — bentuk gantungan ya, misalnya ᬓ᭄ᬬ (kya)'],
  ],
}

const MARK = /\[\^\w+\]/g
const DEF = /^\[\^\w+\]:.*$/

function strip(text) {
  return text.split('\n').filter(l => !DEF.test(l)).join('\n').replace(MARK, '').replace(/\n+$/, '')
}

function fix(text, slug) {
  for (const [from, to] of FIXES[slug] || []) text = from instanceof RegExp ? text.replace(from, to) : text.split(from).join(to)
  return text
}

// Line index where note n's marker goes, or -1.
function anchorLine(lines, note, lang) {
  const at = typeof note.at === 'string' ? note.at : note.at?.[lang]
  if (at !== undefined) {
    let i = lines.findIndex(l => l.includes(at))
    if (i >= 0 && lines[i].startsWith('#')) i = firstText(lines, i)
    return i
  }
  let seen = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## ') && ++seen === note.h) return firstText(lines, i)
  }
  return -1
}

function firstText(lines, from) {
  for (let i = from + 1; i < lines.length; i++) {
    const l = lines[i]
    if (l.startsWith('## ')) return -1
    if (!l.trim() || l.startsWith('#') || l.startsWith('|') || l.startsWith('>')) continue
    return i
  }
  return -1
}

function build(text, notes, lang, slug) {
  const lines = strip(fix(text, slug)).split('\n')
  const defs = []
  const problems = []
  notes.forEach((note, k) => {
    const n = k + 1
    const i = anchorLine(lines, note, lang)
    if (i < 0) { problems.push(`note ${n} (${lang}) has no anchor`); return }
    lines[i] = lines[i].replace(/\s+$/, '') + `[^${n}]`
    defs.push(`[^${n}]: ${note[lang]}`)
  })
  return { text: lines.join('\n') + '\n\n' + defs.join('\n'), problems }
}

const { data, error } = await supabase.from('blog_posts').select('id,slug,content,content_en').eq('published', true)
if (error) throw error
let bad = 0
for (const p of data) {
  if (!NOTES[p.slug]) { console.log('NO NOTES  ', p.slug); bad++; continue }
  // Number notes in reading order (by where they land in the Indonesian text).
  const idLines = strip(fix(p.content, p.slug)).split('\n')
  const notes = [...NOTES[p.slug]].sort((x, y) => anchorLine(idLines, x, 'id') - anchorLine(idLines, y, 'id'))
  const id = build(p.content, notes, 'id', p.slug)
  const en = p.content_en ? build(p.content_en, notes, 'en', p.slug) : { text: p.content_en, problems: [] }
  const problems = [...id.problems, ...en.problems]
  if (problems.length) { console.log('PROBLEM   ', p.slug, problems.join('; ')); bad++; continue }
  if (WRITE) {
    const { error: e } = await supabase.from('blog_posts').update({ content: id.text, content_en: en.text }).eq('id', p.id)
    console.log(e ? 'ERROR     ' : 'updated   ', p.slug, e?.message || `${notes.length} notes`)
  } else {
    console.log('ok        ', p.slug, `${notes.length} notes`)
  }
}
console.log(bad ? `${bad} post(s) need attention` : 'all posts anchored')
