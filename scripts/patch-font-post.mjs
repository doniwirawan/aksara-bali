// One-off: give cara-instal-font-aksara-bali real Google Fonts download links
// and replace the dead aksarabali.id reference with the site's own converter.
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const GF = 'https://fonts.google.com/noto/specimen/Noto+Sans+Balinese'

const patches = {
  content: [
    [
      '**Noto Sans Balinese** adalah pilihan terbaik:\n- Gratis dan open source dari Google\n- Coverage lengkap semua karakter aksara Bali\n- Tersedia untuk semua platform',
      '**Noto Sans Balinese** adalah pilihan terbaik:\n- Gratis dan open source dari Google\n- Coverage lengkap semua karakter aksara Bali\n- Tersedia untuk semua platform\n\nUnduh langsung dari halaman resminya di Google Fonts: <a href="' + GF + '" target="_blank" rel="noopener">Noto Sans Balinese di Google Fonts</a> — tekan tombol **Get font**, lalu **Download all** untuk mendapatkan berkas fontnya.',
    ],
    [
      '1. Buka browser dan kunjungi **fonts.google.com**\n2. Cari "Noto Sans Balinese"\n3. Klik tombol **Download family**',
      '1. Buka <a href="' + GF + '" target="_blank" rel="noopener">halaman Noto Sans Balinese di Google Fonts</a>\n2. Klik **Get font**\n3. Klik **Download all**, lalu buka berkas ZIP-nya',
    ],
    [
      '1. Download font dari Google Fonts',
      '1. Unduh fontnya dari <a href="' + GF + '" target="_blank" rel="noopener">Google Fonts</a>',
    ],
    [
      'Setelah instalasi, kunjungi halaman konverter di aksarabali.id dan coba konversi teks. Jika aksara Bali tampil dengan benar, instalasi berhasil!',
      'Setelah instalasi, buka <a href="/">halaman konverter</a> dan coba konversi teks. Jika aksara Bali tampil dengan benar — bukan kotak-kotak — instalasi berhasil. Untuk memeriksa bentuk tiap aksara, bandingkan dengan <a href="/blog/daftar-lengkap-aksara-bali">daftar lengkap aksara Bali</a>.',
    ],
  ],
  content_en: [
    [
      '**Noto Sans Balinese** is the best choice — free, open source, complete coverage.',
      '**Noto Sans Balinese** is the best choice — free, open source, complete coverage.\n\nDownload it from its official page: <a href="' + GF + '" target="_blank" rel="noopener">Noto Sans Balinese on Google Fonts</a> — press **Get font**, then **Download all**.',
    ],
    [
      '1. Visit **fonts.google.com**\n2. Search "Noto Sans Balinese"\n3. Click **Download family**',
      '1. Open the <a href="' + GF + '" target="_blank" rel="noopener">Noto Sans Balinese page on Google Fonts</a>\n2. Click **Get font**\n3. Click **Download all**, then open the ZIP',
    ],
    [
      '1. Download from Google Fonts',
      '1. Download it from <a href="' + GF + '" target="_blank" rel="noopener">Google Fonts</a>',
    ],
    [
      'Visit aksarabali.id converter and try converting text — if it shows correctly, installation succeeded!',
      'Open the <a href="/">converter page</a> and convert some text — if the script renders properly instead of boxes, the installation worked. To check individual letter shapes, compare against the <a href="/blog/daftar-lengkap-aksara-bali">complete Balinese script chart</a>.',
    ],
  ],
}

const { data } = await supabase.from('blog_posts')
  .select('id, content, content_en').eq('slug', 'cara-instal-font-aksara-bali').single()

const update = {}
for (const [field, pairs] of Object.entries(patches)) {
  let text = data[field]
  for (const [from, to] of pairs) {
    if (!text.includes(from)) { console.log('MISS in', field, ':', from.slice(0, 50)); continue }
    text = text.replace(from, to)
  }
  update[field] = text
}

const { error } = await supabase.from('blog_posts')
  .update({ ...update, updated_at: new Date().toISOString() }).eq('id', data.id)
console.log(error || 'font post patched')
