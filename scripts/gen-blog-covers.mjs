// Blog cover generator: Unsplash photo + SVG text overlay -> PNG in public/covers.
//
//   node scripts/gen-blog-covers.mjs             # write PNGs for every published post
//   node scripts/gen-blog-covers.mjs --update    # also write image_url + credit fields
//   node scripts/gen-blog-covers.mjs <slug> ...  # only these slugs
//
// Photos and their attribution come from scripts/data/unsplash-photos.json,
// built by scripts/fetch-unsplash-photos.mjs. Credit is stored on the post so
// the article page can render "Photo by <name> on Unsplash" per Unsplash's
// attribution guideline.
//
// Covers are 1200x630 (OG card ratio). Overlay text is Latin only — the SVG
// rasteriser does no complex-script shaping, so the Balinese watermark is a
// single un-composed base letter, which needs none.

import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const OUT_DIR = path.join(process.cwd(), 'public', 'covers')
const CATALOGUE = path.join(process.cwd(), 'scripts', 'data', 'unsplash-photos.json')
const BASE_URL = 'https://aksarabali.doniwirawan.xyz'
const W = 1200
const H = 630

// Which catalogue bucket suits each post, and the short title to print. Posts
// not listed fall back to their category's bucket and an auto-wrapped title.
const ASSIGN = {
  'balinese-script-generator-online':          ['bali-temple', 0, ['Balinese Script', 'Generator & Translator']],
  'translate-latin-ke-aksara-bali':            ['bali-culture', 0, ['Translate Latin', 'ke Aksara Bali']],
  'menulis-aksara-bali-online':                ['handwriting', 1, ['Menulis Aksara', 'Bali Online']],
  'cara-mengetik-aksara-bali-keyboard':        ['keyboard-typing', 0, ['Cara Mengetik Aksara', 'Bali di Keyboard']],
  'nama-dalam-aksara-bali':                    ['calligraphy-writing', 1, ['Menulis Nama', 'dalam Aksara Bali']],
  'daftar-lengkap-aksara-bali':                ['bali-temple', 1, ['Daftar Lengkap', 'Aksara Bali']],
  'ucapan-bahasa-bali-sehari-hari':            ['bali-culture', 1, ['Ucapan Bahasa Bali', 'Sehari-hari']],
  'gantungan-gempelan-aksara-bali':            ['old-manuscript', 1, ['Gantungan dan', 'Gempelan']],
  'copy-paste-aksara-bali':                    ['bali-temple', 2, ['Copy Paste', 'Aksara Bali']],
  'translate-bahasa-indonesia-ke-bahasa-bali': ['bali-culture', 2, ['Translate Indonesia', 'ke Bahasa Bali']],
  'aksara-bali-untuk-tato-dan-desain':         ['tattoo-artist', 0, ['Aksara Bali untuk', 'Tato dan Desain']],
  'asal-usul-aksara-bali-aji-saka':            ['old-manuscript', 0, ['Asal-usul Aksara Bali', 'dan Aji Saka']],
  'menulis-aksara-bali-di-word-canva':         ['design-studio', 0, ['Aksara Bali di', 'Word dan Canva']],
  'rangkaian-hari-raya-nyepi':                ['balinese-ceremony', 2, ['Rangkaian Hari', 'Raya Nyepi']],
  'kelengkapan-penjor-galungan':               ['bali-offering', 0, ['Kelengkapan Penjor', 'dan Maknanya']],
  // Older posts
  'mengenal-aksara-bali':                      ['bali-temple', 3, ['Mengenal', 'Aksara Bali']],
  'cara-belajar-aksara-bali':                  ['classroom-learning', 0, ['Cara Belajar', 'Aksara Bali']],
  'belajar-hanacaraka-panduan-lengkap':        ['classroom-learning', 1, ['Panduan Lengkap', 'Hanacaraka']],
  'pangangge-tanda-vokal-aksara-bali':         ['handwriting', 2, ['Pangangge:', 'Tanda Vokal']],
  'angka-bali-sistem-penomoran-tradisional':   ['old-manuscript', 2, ['Angka Bali']],
  'aksara-murda-huruf-kapital-bali':           ['calligraphy-writing', 0, ['Aksara Murda']],
  'aksara-bali-dan-bahasa-sansekerta':         ['palm-leaf-manuscript', 0, ['Aksara Bali dan', 'Bahasa Sansekerta']],
  'perbedaan-aksara-bali-jawa-latin':          ['calligraphy-writing', 2, ['Aksara Bali,', 'Jawa, dan Latin']],
  'lontar-naskah-kuno-bali':                   ['palm-leaf-manuscript', 2, ['Lontar: Naskah', 'Kuno Bali']],
  'kakawin-epik-sastra-bali-kuno':             ['library-books', 0, ['Kakawin: Epik', 'Sastra Bali Kuno']],
  'upacara-keagamaan-aksara-bali':             ['balinese-ceremony', 1, ['Aksara Bali dalam', 'Upacara Keagamaan']],
  'rerajahan-seni-sakral-aksara-bali':         ['stone-carving', 0, ['Rerajahan: Seni', 'Sakral Aksara']],
  'aksara-bali-di-kehidupan-sehari-hari':      ['bali-rice-terrace', 0, ['Aksara Bali dalam', 'Kehidupan Sehari-hari']],
  'aksara-bali-di-era-digital':                ['laptop-writing', 1, ['Aksara Bali di', 'Era Digital']],
  'cara-instal-font-aksara-bali':              ['laptop-writing', 3, ['Cara Instal Font', 'Aksara Bali']],
  'aplikasi-android-aksara-bali-rilis-baru':   ['keyboard-typing', 2, ['Aplikasi Android', 'Aksara Bali']],
}

const CATEGORY_BUCKET = {
  'Panduan Belajar': 'classroom-learning',
  'Sejarah & Budaya': 'bali-culture',
  'Linguistik': 'calligraphy-writing',
  'Naskah Kuno': 'palm-leaf-manuscript',
  'Teknologi & Budaya': 'laptop-writing',
}

const KICKER = {
  'Panduan Belajar': 'Panduan',
  'Sejarah & Budaya': 'Budaya',
  'Linguistik': 'Linguistik',
  'Naskah Kuno': 'Naskah',
  'Teknologi & Budaya': 'Teknologi',
}

// Base letters only — no vowel signs, so no shaping is required.
const GLYPHS = ['ᬓ', 'ᬩ', 'ᬮ', 'ᬦ', 'ᬳ', 'ᬲ', 'ᬢ', 'ᬭ', 'ᬫ', 'ᬧ']

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function wrapTitle(title) {
  const head = title.split(':')[0].split(' — ')[0]
  const words = head.split(/\s+/)
  const lines = ['']
  for (const word of words) {
    const line = lines[lines.length - 1]
    if (!line) lines[lines.length - 1] = word
    else if ((line + ' ' + word).length <= 22) lines[lines.length - 1] = line + ' ' + word
    else if (lines.length < 3) lines.push(word)
    else break
  }
  return lines.filter(Boolean)
}

function overlaySvg({ kicker, title, glyph }) {
  const size = title.length > 2 ? 52 : 62
  const step = title.length > 2 ? 64 : 74
  const top = 400 - (title.length - 2) * 40
  const titleLines = title
    .map((line, i) => `<text x="72" y="${top + i * step}" class="title">${esc(line)}</text>`)
    .join('\n    ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0.6">
        <stop offset="0%" stop-color="#0b0b14" stop-opacity="0.94"/>
        <stop offset="55%" stop-color="#0b0b14" stop-opacity="0.72"/>
        <stop offset="100%" stop-color="#0b0b14" stop-opacity="0.28"/>
      </linearGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0b0b14" stop-opacity="0"/>
        <stop offset="100%" stop-color="#0b0b14" stop-opacity="0.85"/>
      </linearGradient>
      <style>
        .kicker { font-family: 'Segoe UI', Arial, sans-serif; font-size: 24px; font-weight: 600;
                  letter-spacing: 6px; fill: #e8c67a; text-transform: uppercase; }
        .title  { font-family: 'Segoe UI', Arial, sans-serif; font-size: ${size}px; font-weight: 700; fill: #ffffff; }
        .foot   { font-family: 'Segoe UI', Arial, sans-serif; font-size: 24px; font-weight: 500; fill: #cfd2dc; }
        .mark   { font-family: 'Noto Sans Balinese', sans-serif; font-size: 340px; fill: #e8c67a; opacity: 0.16; }
      </style>
    </defs>

    <rect width="${W}" height="${H}" fill="url(#scrim)"/>
    <rect y="${H - 220}" width="${W}" height="220" fill="url(#floor)"/>

    <text x="${W - 90}" y="${H - 120}" text-anchor="end" class="mark">${glyph}</text>

    <rect x="72" y="112" width="64" height="5" rx="2.5" fill="#e8c67a"/>
    <text x="72" y="176" class="kicker">${esc(kicker)}</text>

    ${titleLines}

    <text x="72" y="${H - 68}" class="foot">Konverter Aksara Bali &#183; aksarabali</text>
  </svg>`
}

async function buildCover(post, photo, titleLines, glyph) {
  const res = await fetch(`${photo.photo}?auto=format&fit=crop&w=1600&q=85`)
  if (!res.ok) throw new Error(`fetch ${post.slug}: HTTP ${res.status}`)

  const base = await sharp(Buffer.from(await res.arrayBuffer()))
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .modulate({ saturation: 0.85 })
    .toBuffer()

  const out = path.join(OUT_DIR, `${post.slug}.png`)
  await sharp(base)
    .composite([{
      input: Buffer.from(overlaySvg({ kicker: KICKER[post.category] || 'Aksara Bali', title: titleLines, glyph })),
      top: 0, left: 0,
    }])
    .png({ quality: 90, compressionLevel: 9, palette: true })
    .toFile(out)

  const { size } = await fs.stat(out)
  return { out, kb: Math.round(size / 1024) }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const catalogue = JSON.parse(await fs.readFile(CATALOGUE, 'utf8'))
const only = process.argv.slice(2).filter(a => !a.startsWith('--'))
const doUpdate = process.argv.includes('--update')

const { data: posts, error } = await supabase
  .from('blog_posts').select('slug, title, category').eq('published', true).order('slug')
if (error) throw error

await fs.mkdir(OUT_DIR, { recursive: true })

let n = 0
for (const post of posts) {
  if (only.length && !only.includes(post.slug)) continue

  const [bucket, index, lines] = ASSIGN[post.slug]
    || [CATEGORY_BUCKET[post.category] || 'bali-culture', 0, null]
  const pool = catalogue[bucket] || []
  const photo = pool[index % Math.max(pool.length, 1)] || pool[0]
  if (!photo) { console.log('no photo for', post.slug); continue }

  const glyph = GLYPHS[[...post.slug].reduce((a, c) => a + c.charCodeAt(0), 0) % GLYPHS.length]
  const { kb } = await buildCover(post, photo, lines || wrapTitle(post.title), glyph)
  n++
  console.log(`${post.slug}.png  ${kb} KB  <- ${photo.credit}`)

  if (doUpdate) {
    const { error: e } = await supabase.from('blog_posts').update({
      image_url: `${BASE_URL}/covers/${post.slug}.png`,
      image_credit: photo.credit,
      image_credit_url: photo.creditUrl,
      image_source_url: photo.sourceUrl,
      updated_at: new Date().toISOString(),
    }).eq('slug', post.slug)
    if (e) console.log('  update failed:', e.message)
  }
}
console.log(`\n${n} covers written${doUpdate ? ' and linked' : ''}`)
