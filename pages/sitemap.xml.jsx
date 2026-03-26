// This generates /sitemap.xml dynamically via Next.js getServerSideProps
// It will be accessible at /sitemap.xml

const BASE_URL = 'https://transliterasi-latin-ke-bahasa-bali.vercel.app'

const BLOG_SLUGS = [
  'mengenal-aksara-bali',
  'cara-belajar-aksara-bali',
  'aksara-bali-dan-bahasa-sansekerta',
  'lontar-naskah-kuno-bali',
  'perbedaan-aksara-bali-jawa-latin',
  'upaya-pelestarian-aksara-bali-digital',
]

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0]

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly', lastmod: today },
    { url: '/practice', priority: '0.9', changefreq: 'monthly', lastmod: today },
    { url: '/blog', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { url: '/faq', priority: '0.8', changefreq: 'monthly', lastmod: today },
  ]

  const blogPages = BLOG_SLUGS.map(slug => ({
    url: `/blog/${slug}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: today,
  }))

  const allPages = [...staticPages, ...blogPages]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
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
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(sitemap)
  res.end()
  return { props: {} }
}

export default function Sitemap() {
  return null
}
