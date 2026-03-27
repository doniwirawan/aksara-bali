// Dynamic XML sitemap — accessible at /sitemap.xml
// Includes hreflang alternates for id/en bilingual support

const BASE_URL = 'https://transliterasi-latin-ke-bahasa-bali.vercel.app'

const BLOG_POSTS = [
  { slug: 'mengenal-aksara-bali', date: '2026-03-15', priority: '0.8' },
  { slug: 'cara-belajar-aksara-bali', date: '2026-03-10', priority: '0.8' },
  { slug: 'aksara-bali-dan-bahasa-sansekerta', date: '2026-03-05', priority: '0.7' },
  { slug: 'lontar-naskah-kuno-bali', date: '2026-02-28', priority: '0.7' },
  { slug: 'perbedaan-aksara-bali-jawa-latin', date: '2026-02-20', priority: '0.7' },
  { slug: 'upaya-pelestarian-aksara-bali-digital', date: '2026-02-15', priority: '0.7' },
]

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0]

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily', lastmod: today },
    { url: '/practice', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { url: '/blog', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { url: '/faq', priority: '0.8', changefreq: 'monthly', lastmod: today },
  ]

  const blogPages = BLOG_POSTS.map(p => ({
    url: `/blog/${p.slug}`,
    priority: p.priority,
    changefreq: 'monthly',
    lastmod: p.date,
  }))

  const allPages = [...staticPages, ...blogPages]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="id" href="${BASE_URL}${page.url}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.url}?lang=en"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${page.url}"/>
  </url>`).join('\n')}
</urlset>`
}

export async function getServerSideProps({ res }) {
  const sitemap = generateSitemap()
  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate')
  res.write(sitemap)
  res.end()
  return { props: {} }
}

export default function Sitemap() {
  return null
}
