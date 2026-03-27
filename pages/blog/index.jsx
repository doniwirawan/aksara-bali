import Head from 'next/head'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export async function getServerSideProps() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    const posts = (data || []).map(p => ({
      slug: p.slug,
      title: p.title,
      titleEn: p.title_en || p.title,
      excerpt: p.excerpt || '',
      excerptEn: p.excerpt_en || p.excerpt || '',
      category: p.category,
      date: p.created_at ? p.created_at.split('T')[0] : '',
      readTime: p.read_time || '5 menit',
      tags: Array.isArray(p.tags) ? p.tags : [],
      imageUrl: p.image_url || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    }))
    return { props: { posts } }
  } catch {
    return { props: { posts: [] } }
  }
}

const CATEGORIES = [
  { id: 'all', labelId: 'Semua', labelEn: 'All' },
  { id: 'Sejarah & Budaya', labelId: 'Sejarah & Budaya', labelEn: 'History & Culture' },
  { id: 'Panduan Belajar', labelId: 'Panduan Belajar', labelEn: 'Learning Guide' },
  { id: 'Linguistik', labelId: 'Linguistik', labelEn: 'Linguistics' },
  { id: 'Naskah Kuno', labelId: 'Naskah Kuno', labelEn: 'Ancient Manuscripts' },
  { id: 'Teknologi & Budaya', labelId: 'Teknologi & Budaya', labelEn: 'Technology & Culture' },
]

export default function BlogIndex({ locale, setLocale, posts = [] }) {
  const [darkMode, setDarkMode] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const lang = locale === 'en' ? 'en' : 'id'

  useEffect(() => {
    const saved = localStorage.getItem('aksara-dark-mode')
    if (saved !== null) setDarkMode(saved === 'true')
  }, [])

  const blogUi = {
    id: { allLabel: 'Semua', searchPlaceholder: 'Cari artikel...', readMore: 'Baca selengkapnya →', minRead: 'menit baca', blogTitle: 'Blog Aksara Bali', blogSub: 'Artikel tentang aksara, budaya, dan sejarah Bali' },
    en: { allLabel: 'All', searchPlaceholder: 'Search articles...', readMore: 'Read more →', minRead: 'min read', blogTitle: 'Balinese Script Blog', blogSub: 'Articles about Balinese script, culture, and history' },
  }[lang]

  const displayPost = (post) => ({
    title: lang === 'en' ? (post.titleEn || post.title) : post.title,
    excerpt: lang === 'en' ? (post.excerptEn || post.excerpt) : post.excerpt,
    category: lang === 'en' ? (post.categoryEn || post.category) : post.category,
  })

  const filteredPosts = posts.filter(post => {
    const d = displayPost(post)
    const matchCategory = activeCategory === 'all' || post.category === activeCategory
    const q = searchQuery.toLowerCase()
    const matchSearch = !q ||
      d.title.toLowerCase().includes(q) ||
      d.excerpt.toLowerCase().includes(q) ||
      post.tags.some(t => t.includes(q))
    return matchCategory && matchSearch
  })

  const bg = darkMode ? '#0f0f1a' : '#f5f5f0'
  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textColor = darkMode ? '#e8e8e8' : '#1a1a1a'
  const borderColor = darkMode ? '#2a2a3e' : '#e0e0d8'
  const mutedColor = darkMode ? '#888' : '#666'

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog Aksara Bali',
    description: 'Artikel tentang aksara Bali, sejarah, cara belajar, dan pelestarian budaya Bali',
    url: 'https://aksarabali.id/blog',
    inLanguage: ['id', 'en'],
    publisher: {
      '@type': 'Organization',
      name: 'Aksara Bali Converter',
      url: 'https://aksarabali.id',
    },
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      url: `https://transliterasi-latin-ke-bahasa-bali.vercel.app/blog/${post.slug}`,
      keywords: post.tags.join(', '),
      image: post.imageUrl,
      author: { '@type': 'Person', name: 'Doni Wirawan' },
    })),
  }

  return (
    <>
      <Head>
        <title>Blog Aksara Bali — Artikel Budaya, Sejarah & Panduan Belajar</title>
        <meta name="description" content="Temukan artikel lengkap tentang aksara Bali: sejarah, cara belajar, hubungan dengan bahasa Sansekerta, naskah lontar, dan upaya pelestarian digital." />
        <meta name="keywords" content="blog aksara bali, belajar aksara bali, sejarah aksara bali, budaya bali, lontar bali, sansekerta bali, huruf bali, cara menulis aksara bali" />
        <meta name="author" content="Doni Wirawan" />
        <meta property="og:title" content="Blog Aksara Bali — Artikel Budaya & Panduan Belajar" />
        <meta property="og:description" content="Artikel mendalam tentang aksara Bali: sejarah, cara belajar, linguistik, dan pelestarian budaya." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={posts[0]?.imageUrl || ''} />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="533" />
        <meta property="og:url" content="https://transliterasi-latin-ke-bahasa-bali.vercel.app/blog" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog Aksara Bali — Artikel Budaya & Panduan Belajar" />
        <meta name="twitter:description" content="Artikel mendalam tentang aksara Bali: sejarah, cara belajar, linguistik, dan pelestarian budaya." />
        <meta name="twitter:image" content={posts[0].imageUrl} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href="https://transliterasi-latin-ke-bahasa-bali.vercel.app/blog" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      <div style={{ minHeight: '100vh', background: bg, color: textColor, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => { const n = !darkMode; setDarkMode(n); localStorage.setItem('aksara-dark-mode', n) }}
          locale={locale || 'id'}
          onToggleLocale={() => setLocale && setLocale(locale === 'id' ? 'en' : 'id')}
        />

        <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 16px' }}>
          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <a href="/">
              <img src="/icons/android-chrome-192x192.png" alt="Aksara Bali" width="56" height="56"
                style={{ borderRadius: '14px', marginBottom: '12px', display: 'inline-block', boxShadow: '0 2px 12px rgba(13,110,253,0.2)' }} />
            </a>
            <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 10px', lineHeight: 1.2 }}>
              {blogUi.blogTitle}
            </h1>
            <p style={{ color: mutedColor, fontSize: '16px', margin: 0, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
              {blogUi.blogSub}
            </p>
          </div>

          {/* Search */}
          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <input
              type="search"
              placeholder={blogUi.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px 12px 44px',
                borderRadius: '12px', border: `1px solid ${borderColor}`,
                background: cardBg, color: textColor,
                fontSize: '15px', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>🔍</span>
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '7px 16px', borderRadius: '20px',
                  border: `1px solid ${activeCategory === cat.id ? '#0d6efd' : borderColor}`,
                  background: activeCategory === cat.id ? '#0d6efd' : 'transparent',
                  color: activeCategory === cat.id ? '#fff' : mutedColor,
                  cursor: 'pointer', fontSize: '13px', fontWeight: activeCategory === cat.id ? '600' : '400',
                  transition: 'all 0.15s',
                }}
              >
                {lang === 'en' ? cat.labelEn : cat.labelId}
              </button>
            ))}
          </div>

          {/* Featured post (first) */}
          {filteredPosts.length > 0 && activeCategory === 'all' && !searchQuery && (
            <a href={`/blog/${filteredPosts[0].slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article style={{
                display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px',
                padding: '28px', borderRadius: '16px',
                background: cardBg, border: `1px solid ${borderColor}`,
                marginBottom: '24px', cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
              >
                <div style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/3', background: darkMode ? '#252535' : '#f8f8f8', minHeight: '160px' }}>
                  <img
                    src={filteredPosts[0].imageUrl}
                    alt={displayPost(filteredPosts[0]).title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', background: '#0d6efd20', color: '#0d6efd', fontWeight: '600' }}>
                      ⭐ {lang === 'en' ? 'Featured' : 'Unggulan'}
                    </span>
                    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', background: darkMode ? '#252535' : '#f0f0f0', color: mutedColor }}>
                      {displayPost(filteredPosts[0]).category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 10px', lineHeight: 1.3, color: textColor }}>
                    {displayPost(filteredPosts[0]).title}
                  </h2>
                  <p style={{ margin: '0 0 16px', color: mutedColor, fontSize: '14px', lineHeight: 1.6 }}>
                    {displayPost(filteredPosts[0]).excerpt}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: mutedColor }}>
                    <span>📅 {filteredPosts[0].date}</span>
                    <span>⏱ {filteredPosts[0].readTime}</span>
                  </div>
                </div>
              </article>
            </a>
          )}

          {/* Post grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {(activeCategory === 'all' && !searchQuery ? filteredPosts.slice(1) : filteredPosts).map(post => {
              const d = displayPost(post)
              return (
                <a key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <article style={{
                    padding: '20px', borderRadius: '14px',
                    background: cardBg, border: `1px solid ${borderColor}`,
                    cursor: 'pointer', height: '100%',
                    transition: 'box-shadow 0.2s, transform 0.15s',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                    display: 'flex', flexDirection: 'column',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '12px', aspectRatio: '16/9', background: darkMode ? '#252535' : '#f8f8f8' }}>
                      <img
                        src={post.imageUrl}
                        alt={d.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        loading="lazy"
                      />
                    </div>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', background: darkMode ? '#252535' : '#f0f0f0', color: mutedColor, marginBottom: '10px', alignSelf: 'flex-start' }}>
                      {d.category}
                    </span>
                    <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px', lineHeight: 1.4, color: textColor, flex: 1 }}>
                      {d.title}
                    </h2>
                    <p style={{ margin: '0 0 14px', color: mutedColor, fontSize: '13px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {d.excerpt}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: mutedColor }}>
                      <span>📅 {post.date}</span>
                      <span>⏱ {post.readTime}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '8px', background: '#0d6efd15', color: '#0d6efd' }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </article>
                </a>
              )
            })}
          </div>

          {filteredPosts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: mutedColor }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
              <p>{lang === 'en' ? 'No articles match your search.' : 'Tidak ada artikel yang cocok dengan pencarian Anda.'}</p>
            </div>
          )}
        </main>

        <Footer darkMode={darkMode} locale={locale || 'id'} />
      </div>
    </>
  )
}
