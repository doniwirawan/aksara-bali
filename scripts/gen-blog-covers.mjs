// Blog cover generator: Unsplash photo + SVG text overlay -> PNG in public/covers.
//
//   node scripts/gen-blog-covers.mjs            # write PNGs only
//   node scripts/gen-blog-covers.mjs --update   # also point blog_posts.image_url at them
//
// Covers are 1200x630 (OG card ratio). Latin text only — Balinese script is
// left to a single un-composed base letter as a watermark, since the SVG
// rasteriser does no complex-script shaping.

import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'

const OUT_DIR = path.join(process.cwd(), 'public', 'covers')
const BASE_URL = 'https://transliterasi-latin-ke-bahasa-bali.vercel.app'
const W = 1200
const H = 630

const covers = [
  {
    slug: 'balinese-script-generator-online',
    kicker: 'Konverter',
    title: ['Balinese Script', 'Generator & Translator'],
    photo: 'https://images.unsplash.com/photo-1592364395653-83e648b20cc2',
    glyph: 'ᬓ', // ka
  },
  {
    slug: 'translate-latin-ke-aksara-bali',
    kicker: 'Panduan',
    title: ['Translate Latin', 'ke Aksara Bali'],
    photo: 'https://images.unsplash.com/photo-1565967511849-76a60a516170',
    glyph: 'ᬩ', // ba
  },
  {
    slug: 'menulis-aksara-bali-online',
    kicker: 'Panduan',
    title: ['Menulis Aksara', 'Bali Online'],
    photo: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94',
    glyph: 'ᬮ', // la
  },
  {
    slug: 'nama-dalam-aksara-bali',
    kicker: 'Panduan',
    title: ['Menulis Nama', 'dalam Aksara Bali'],
    photo: 'https://images.unsplash.com/photo-1501179691627-eeaa65ea017c',
    glyph: 'ᬦ', // na
  },
  {
    slug: 'daftar-lengkap-aksara-bali',
    kicker: 'Referensi',
    title: ['Daftar Lengkap', 'Aksara Bali'],
    photo: 'https://images.unsplash.com/photo-1524675053444-52c3ca294ad2',
    glyph: 'ᬳ', // ha
  },
  {
    slug: 'ucapan-bahasa-bali-sehari-hari',
    kicker: 'Basa Bali',
    title: ['Ucapan Bahasa Bali', 'Sehari-hari'],
    photo: 'https://images.unsplash.com/photo-1553902000-e036b7d05af5',
    glyph: 'ᬲ', // sa
  },
]

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function overlaySvg({ kicker, title, glyph }) {
  const titleLines = title
    .map((line, i) => `<text x="72" y="${400 + i * 74}" class="title">${esc(line)}</text>`)
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
        .title  { font-family: 'Segoe UI', Arial, sans-serif; font-size: 62px; font-weight: 700; fill: #ffffff; }
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

async function buildCover(cover) {
  const src = `${cover.photo}?auto=format&fit=crop&w=1600&q=85`
  const res = await fetch(src)
  if (!res.ok) throw new Error(`fetch ${cover.slug}: HTTP ${res.status}`)
  const photo = Buffer.from(await res.arrayBuffer())

  const base = await sharp(photo)
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .modulate({ saturation: 0.85 })
    .toBuffer()

  const out = path.join(OUT_DIR, `${cover.slug}.png`)
  await sharp(base)
    .composite([{ input: Buffer.from(overlaySvg(cover)), top: 0, left: 0 }])
    .png({ quality: 90, compressionLevel: 9, palette: true })
    .toFile(out)

  const { size } = await fs.stat(out)
  console.log(`${cover.slug}.png  ${(size / 1024).toFixed(0)} KB`)
  return `${BASE_URL}/covers/${cover.slug}.png`
}

await fs.mkdir(OUT_DIR, { recursive: true })

const urls = {}
for (const cover of covers) urls[cover.slug] = await buildCover(cover)

if (process.argv.includes('--update')) {
  const { createClient } = await import('@supabase/supabase-js')
  const dotenv = await import('dotenv')
  dotenv.default.config({ path: '.env.local' })
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  for (const [slug, url] of Object.entries(urls)) {
    const { error } = await supabase.from('blog_posts')
      .update({ image_url: url, updated_at: new Date().toISOString() })
      .eq('slug', slug)
    console.log('image_url ->', error || slug)
  }
}
