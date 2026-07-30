// Shortens titles that overrun Google's ~60-character title display and
// excerpts that overrun the ~160-character snippet. Keeps the head keywords.
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const titles = {
  'daftar-lengkap-aksara-bali': 'Daftar Lengkap Aksara Bali: Wreastra, Swara, dan Pangangge',
  'balinese-script-generator-online': 'Balinese Script Generator: Ubah Latin ke Aksara Bali Online',
  'translate-bahasa-indonesia-ke-bahasa-bali': 'Translate Bahasa Indonesia ke Bahasa Bali: Panduan Lengkap',
  'menulis-aksara-bali-online': 'Menulis Aksara Bali Online: Ketik, Salin, dan Bagikan',
  'nama-dalam-aksara-bali': 'Menulis Nama dalam Aksara Bali: Panduan dan Contoh',
  'rangkaian-hari-raya-nyepi': 'Rangkaian Hari Raya Nyepi: Melasti hingga Ngembak Geni',
  'aplikasi-android-aksara-bali-rilis-baru': 'Aplikasi Android Aksara Bali: Konverter, Kuis & Offline',
}

const excerpts = {
  'translate-latin-ke-aksara-bali': 'Cara translate latin ke aksara Bali secara online: langkah-langkahnya, aturan dasar yang perlu dipahami, contoh kata, dan cara membalik aksara Bali ke Latin.',
  'aksara-bali-untuk-tato-dan-desain': 'Menyiapkan tulisan aksara Bali untuk tato, undangan, atau desain — memilih kata, memeriksa ejaan, dan aksara yang sebaiknya tidak dipakai sebagai hiasan.',
  'kakawin-epik-sastra-bali-kuno': 'Kakawin adalah puisi epik Jawa Kuno yang hidup dalam tradisi Bali. Kenali bentuk, isi, dan naskah-naskahnya yang masih dibacakan hingga kini.',
  'aplikasi-android-aksara-bali-rilis-baru': 'Aplikasi Aksara Bali untuk Android hadir dengan kuis berjenjang, pelafalan aksara, konverter gaya word-art, dan belajar sepenuhnya offline.',
}

for (const [slug, title] of Object.entries(titles)) {
  const { error } = await supabase.from('blog_posts')
    .update({ title, updated_at: new Date().toISOString() }).eq('slug', slug)
  console.log('title', error || `${slug} (${title.length})`)
}
for (const [slug, excerpt] of Object.entries(excerpts)) {
  const { error } = await supabase.from('blog_posts')
    .update({ excerpt, updated_at: new Date().toISOString() }).eq('slug', slug)
  console.log('excerpt', error || `${slug} (${excerpt.length})`)
}
