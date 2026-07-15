import { useEffect, useRef, useCallback } from 'react'
import { HelpCircle } from 'lucide-react'

// Guided page tour built on driver.js. Auto-plays once per page (tracked in
// localStorage), and can be replayed anytime with the floating "?" button.
//
// `steps`: [{ element?, title: {id,en}, desc: {id,en} }] — element omitted
// renders a centered welcome popover; steps whose element isn't on the page
// (e.g. behind a tab) are skipped at runtime.
export default function PageTour({ pageKey, steps, locale }) {
  const autoRan = useRef(false)
  const lang = locale === 'en' ? 'en' : 'id'

  const run = useCallback(async () => {
    const { driver } = await import('driver.js')
    driver({
      showProgress: true,
      nextBtnText: lang === 'en' ? 'Next' : 'Lanjut',
      prevBtnText: lang === 'en' ? 'Back' : 'Kembali',
      doneBtnText: lang === 'en' ? 'Done' : 'Selesai',
      progressText: lang === 'en' ? '{{current}} of {{total}}' : '{{current}} dari {{total}}',
      steps: steps
        .filter(s => !s.element || document.querySelector(s.element))
        .map(s => ({
          element: s.element,
          popover: { title: s.title[lang], description: s.desc[lang] },
        })),
    }).drive()
  }, [steps, lang])

  // First visit to this page → play the tour once, after the page settles.
  useEffect(() => {
    if (autoRan.current) return
    autoRan.current = true
    try {
      const key = `aksara_tour_${pageKey}`
      if (localStorage.getItem(key)) return
      localStorage.setItem(key, '1')
      const t = setTimeout(run, 1200)
      return () => clearTimeout(t)
    } catch { /* private mode — replay button still works */ }
  }, [pageKey, run])

  return (
    <button
      onClick={run}
      data-track={`tour-replay-${pageKey}`}
      aria-label={lang === 'en' ? 'Page tour' : 'Tur halaman'}
      title={lang === 'en' ? 'Show me around this page' : 'Lihat panduan halaman ini'}
      style={{
        position: 'fixed', right: '18px', bottom: '18px', zIndex: 800,
        width: '44px', height: '44px', borderRadius: '50%', border: 'none',
        background: '#0d6efd', color: '#fff', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(13,110,253,0.4)',
      }}
    >
      <HelpCircle size={22} />
    </button>
  )
}
