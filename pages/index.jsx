import Head from 'next/head'
import { useState, useEffect, useCallback } from 'react'
import { WifiOff, Download, X, Smartphone, PenLine, ArrowRight } from 'lucide-react'
import { convertLatinToBalinese } from '../utils/balineseConverter'
import LatinBalineseConverter from '../components/LatinBalineseConverter'
import PageTour from '../components/PageTour'

const HOME_TOUR = [
  { title: { id: 'Selamat datang! 👋', en: 'Welcome! 👋' },
    desc: { id: 'Ini konverter aksara Bali — ubah tulisan Latin jadi aksara Bali langsung di browser. Ikuti tur singkat ini biar tahu cara pakainya.', en: 'This is the Balinese script converter — turn Latin text into Aksara Bali right in your browser. Take this quick tour to see how it works.' } },
  { element: '[data-tour="conv-input"]',
    title: { id: 'Ketik di sini', en: 'Type here' },
    desc: { id: 'Tulis teks Latin apa saja di kotak ini — misalnya namamu. Konversinya jalan otomatis sambil kamu mengetik.', en: 'Write any Latin text in this box — your name, for example. It converts automatically as you type.' } },
  { element: '[data-tour="conv-output"]',
    title: { id: 'Hasil aksara Bali', en: 'Balinese script result' },
    desc: { id: 'Hasilnya muncul di sini. Kamu bisa salin, unduh, atau dengar cara bacanya.', en: 'The result appears here. You can copy it, download it, or listen to how it reads.' } },
  { element: '[data-tour="conv-switch"]',
    title: { id: 'Balik arahnya', en: 'Switch direction' },
    desc: { id: 'Tombol ini membalik arah konversi: dari aksara Bali kembali ke Latin.', en: 'This button reverses the conversion: from Balinese script back to Latin.' } },
  { element: '[data-tour="conv-listen"]',
    title: { id: 'Dengar pengucapannya', en: 'Hear the pronunciation' },
    desc: { id: 'Klik untuk mendengar kata-katamu diucapkan.', en: 'Click to hear your words spoken aloud.' } },
  { element: 'a[href="/practice"]',
    title: { id: 'Lanjut belajar', en: 'Keep learning' },
    desc: { id: 'Sudah bisa mengonversi? Buka halaman Latihan untuk kuis berlevel, kanvas menulis, dan papan ketik aksara.', en: 'Ready for more? Open the Practice page for leveled quizzes, a writing canvas, and the script keyboard.' } },
]
import LanguageSwitcher, { translations } from '../components/LanguageSwitcher'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useEmailGate } from '../components/EmailGate'

export default function Home({ locale, setLocale }) {
    const { requireEmail } = useEmailGate()
    const [darkMode, setDarkMode] = useState(false)
    const [isOnline, setIsOnline] = useState(true)
    const [isLoaded, setIsLoaded] = useState(false)
    const [deferredPrompt, setDeferredPrompt] = useState(null)
    const [showInstallPrompt, setShowInstallPrompt] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)

    const t = translations[locale] || translations.en

    useEffect(() => {
        let deferredPromptEvent = null;

        const handleBeforeInstallPrompt = (e) => {
            console.log('[PWA] beforeinstallprompt event fired');
            e.preventDefault();
            deferredPromptEvent = e;
            setDeferredPrompt(e);

            const installPromptDismissed = localStorage.getItem('pwa-install-dismissed');
            if (!installPromptDismissed) {
                setShowInstallPrompt(true);
            }
        };

        const handleAppInstalled = () => {
            console.log('[PWA] App was installed');
            setIsInstalled(true);
            setShowInstallPrompt(false);
            setDeferredPrompt(null);
            deferredPromptEvent = null;
        };

        const checkIfInstalled = () => {
            if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
                console.log('[PWA] App is running in standalone mode');
                setIsInstalled(true);
                return true;
            }

            if (window.navigator.standalone === true) {
                console.log('[PWA] App is running in iOS standalone mode');
                setIsInstalled(true);
                return true;
            }

            return false;
        };

        if (typeof window !== 'undefined') {
            if (checkIfInstalled()) {
                setShowInstallPrompt(false);
            }

            window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.addEventListener('appinstalled', handleAppInstalled);

            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('[PWA] Service Worker registered:', registration);

                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    console.log('[PWA] New content available');
                                }
                            });
                        });
                    })
                    .catch((error) => {
                        console.error('[PWA] Service Worker registration failed:', error);
                    });
            }

            return () => {
                window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
                window.removeEventListener('appinstalled', handleAppInstalled);
            };
        }
    }, []);

    // The APK is gated: collect an email, then send them to the release page.
    const handleApkClick = async (e) => {
        e.preventDefault()
        const href = e.currentTarget.href
        if (!await requireEmail('apk-landing')) return
        if (!window.open(href, '_blank', 'noopener')) window.location.href = href
    }

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            console.log('[PWA] No deferred prompt available');
            return;
        }

        console.log('[PWA] Showing install prompt');

        try {
            const result = await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            console.log(`[PWA] User response to install prompt: ${outcome}`);

            if (outcome === 'accepted') {
                console.log('[PWA] User accepted the install prompt');
            } else {
                console.log('[PWA] User dismissed the install prompt');
                localStorage.setItem('pwa-install-dismissed', Date.now().toString());
            }
        } catch (error) {
            console.error('[PWA] Error showing install prompt:', error);
        }

        setDeferredPrompt(null);
        setShowInstallPrompt(false);
    };

    const dismissInstallPrompt = () => {
        console.log('[PWA] Install prompt dismissed by user');
        setShowInstallPrompt(false);
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && !isLoaded) {
            try {
                const savedTheme = localStorage.getItem('aksara-dark-mode')
                if (savedTheme === 'true') {
                    setDarkMode(true)
                }
                setIsLoaded(true)
            } catch (error) {
                console.warn('Error loading theme:', error)
                setIsLoaded(true)
            }
        }
    }, [isLoaded])

    const toggleDarkMode = useCallback(() => {
        setDarkMode(prev => {
            const newMode = !prev
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('aksara-dark-mode', String(newMode))
                    if (newMode) {
                        document.documentElement.setAttribute('data-bs-theme', 'dark')
                    } else {
                        document.documentElement.removeAttribute('data-bs-theme')
                    }
                } catch (error) {
                    console.warn('Error saving theme:', error)
                }
            }
            return newMode
        })
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined' && isLoaded) {
            try {
                if (darkMode) {
                    document.documentElement.setAttribute('data-bs-theme', 'dark')
                } else {
                    document.documentElement.removeAttribute('data-bs-theme')
                }
            } catch (error) {
                console.warn('Error applying theme:', error)
            }
        }
    }, [darkMode, isLoaded])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleOnline = () => setIsOnline(true)
            const handleOffline = () => setIsOnline(false)

            setIsOnline(navigator.onLine)

            window.addEventListener('online', handleOnline)
            window.addEventListener('offline', handleOffline)

            return () => {
                window.removeEventListener('online', handleOnline)
                window.removeEventListener('offline', handleOffline)
            }
        }
    }, [])

    const pageTitle = locale === 'id'
        ? "Konverter Aksara Bali - Latin ke Aksara Bali dengan Dukungan Sansekerta"
        : "Balinese Script Converter - Latin to Aksara Bali with Sanskrit Support"

    const pageDescription = locale === 'id'
        ? "Konversi teks Latin ke aksara Bali yang indah dengan dukungan Sansekerta lengkap, equivalensi V=W, dan konversi real-time. Alat edukasi untuk melestarikan budaya Bali."
        : "Convert Latin text to beautiful Balinese script (Aksara Bali) with comprehensive Sanskrit support, V=W equivalency, and real-time conversion. Educational tool for preserving Balinese culture."

    if (!isLoaded) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content={locale === 'id'
                    ? "aksara bali, konverter aksara, bahasa bali, Sansekerta, budaya indonesia, transliterasi, alat edukasi, pelestarian budaya, hindu bali"
                    : "Balinese script, Aksara Bali, Sanskrit converter, Indonesia culture, Bali language, Hindu script, transliteration, educational tool, cultural preservation"
                } />

                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />

                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:locale" content={locale === 'id' ? 'id_ID' : 'en_US'} />
                <meta property="og:locale:alternate" content={locale === 'id' ? 'en_US' : 'id_ID'} />
                <meta property="og:url" content="https://aksarabali.doniwirawan.xyz/" />

                {locale === 'id' && (
                    <>
                        <meta name="geo.region" content="ID" />
                        <meta name="geo.country" content="Indonesia" />
                        <meta name="target-audience" content="Indonesian" />
                    </>
                )}

                <link rel="manifest" href="/site.webmanifest" />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            "name": t.appTitle,
                            "description": pageDescription,
                            "url": "https://aksarabali.doniwirawan.xyz/",
                            "applicationCategory": "EducationalApplication",
                            "operatingSystem": "Web Browser",
                            "inLanguage": locale === 'id' ? ['id-ID', 'ban'] : ['en-US', 'ban'],
                            "creator": {
                                "@type": "Person",
                                "name": "Doni Wirawan",
                                "url": "https://www.linkedin.com/in/doniwirawan/"
                            },
                            "audience": {
                                "@type": "Audience",
                                "audienceType": locale === 'id'
                                    ? ["Pelajar", "Peneliti", "Pecinta Budaya", "Pembelajar Bahasa"]
                                    : ["Students", "Researchers", "Cultural Enthusiasts", "Language Learners"],
                                "geographicArea": {
                                    "@type": "Place",
                                    "name": locale === 'id' ? "Indonesia" : "Worldwide"
                                }
                            },
                            "about": [
                                {
                                    "@type": "Thing",
                                    "name": locale === 'id' ? "Aksara Bali" : "Balinese Script",
                                    "sameAs": "https://en.wikipedia.org/wiki/Balinese_script"
                                },
                                {
                                    "@type": "Thing",
                                    "name": locale === 'id' ? "Bahasa Sansekerta" : "Sanskrit Language",
                                    "sameAs": "https://en.wikipedia.org/wiki/Sanskrit"
                                },
                                {
                                    "@type": "Thing",
                                    "name": locale === 'id' ? "Budaya Bali" : "Balinese Culture",
                                    "sameAs": "https://en.wikipedia.org/wiki/Balinese_culture"
                                }
                            ]
                        })
                    }}
                />
            </Head>

            <div className="home">
                {showInstallPrompt && !isInstalled && (
                    <div className="strip strip--install" role="region" aria-label={locale === 'id' ? 'Install Aplikasi' : 'Install App'}>
                        <span>
                            <strong>{locale === 'id' ? 'Install Aplikasi' : 'Install App'}</strong>
                            <span className="d-none d-sm-inline">
                                {' · '}
                                {locale === 'id'
                                    ? 'Dapatkan akses cepat dan gunakan offline!'
                                    : 'Get quick access and use offline!'
                                }
                            </span>
                        </span>
                        <span className="d-flex align-items-center gap-1">
                            <button onClick={handleInstallClick} className="strip__btn">
                                <Download size={14} />
                                Install
                            </button>
                            <button
                                onClick={dismissInstallPrompt}
                                className="strip__x"
                                aria-label={locale === 'id' ? 'Tutup' : 'Close'}
                            >
                                <X size={18} />
                            </button>
                        </span>
                    </div>
                )}

                {!isOnline && (
                    <div className="strip strip--offline" role="status">
                        <WifiOff size={14} />
                        <span>
                            {locale === 'id'
                                ? 'Offline - Konversi dasar tetap berfungsi!'
                                : 'Offline - Basic conversion still works!'
                            }
                        </span>
                    </div>
                )}

                <Navbar
                    darkMode={darkMode}
                    onToggleDarkMode={toggleDarkMode}
                    locale={locale}
                    onToggleLocale={() => setLocale(locale === 'id' ? 'en' : 'id')}
                />

                <main>
                    <LatinBalineseConverter locale={locale} darkMode={darkMode} />
                    <PageTour pageKey="home" locale={locale} steps={HOME_TOUR} />

                    <div className="page" style={{ paddingTop: 0 }}>
                        {/* Each tool, shown doing its job on a real word */}
                        <section className="tools-strip" aria-labelledby="tools-title">
                            <h2 className="section-title" id="tools-title">
                                {locale === 'id' ? 'Semua Fitur' : 'All Features'}
                            </h2>
                            <div className="tool-rows">
                                <a href="/translate" className="tool-row">
                                    <span>
                                        <span className="tool-row__name">{locale === 'id' ? 'Kamus' : 'Dictionary'}</span>
                                        <span className="tool-row__desc">{locale === 'id' ? 'Indonesia ⇄ Bali, dengan tingkatan bahasa.' : 'Indonesian ⇄ Balinese, with speech levels.'}</span>
                                    </span>
                                    <span className="tool-row__demo">
                                        <span>abu</span>
                                        <span className="tool-row__arrow" aria-hidden="true">→</span>
                                        <span>awu</span>
                                        <span className="aksara" lang="ban-Bali">{convertLatinToBalinese('awu')}</span>
                                    </span>
                                    <span className="tool-row__go">{locale === 'id' ? 'Buka Kamus' : 'Open'} <ArrowRight size={15} /></span>
                                </a>
                                <a href="/practice" className="tool-row">
                                    <span>
                                        <span className="tool-row__name">{locale === 'id' ? 'Latihan Kuis' : 'Quiz Practice'}</span>
                                        <span className="tool-row__desc">{locale === 'id' ? 'Uji pengetahuan aksara Bali dengan kuis interaktif bergambar.' : 'Test your Balinese script knowledge with image-based interactive quizzes.'}</span>
                                    </span>
                                    <span className="tool-row__demo">
                                        <span>{locale === 'id' ? 'Mana yang “pura”?' : 'Which is “pura”?'}</span>
                                        <span className="cells" aria-hidden="true">
                                            {['dewa', 'pura', 'padi', 'api', 'suka', 'jaya'].map(w => (
                                                <span key={w} className={w === 'pura' ? 'is-hit' : ''} style={{ fontSize: w.length > 3 ? 17 : 22 }}>{convertLatinToBalinese(w)}</span>
                                            ))}
                                        </span>
                                    </span>
                                    <span className="tool-row__go">{locale === 'id' ? 'Mulai' : 'Start'} <ArrowRight size={15} /></span>
                                </a>
                                <a href="/practice" className="tool-row">
                                    <span>
                                        <span className="tool-row__name">{locale === 'id' ? 'Latihan Menulis' : 'Writing Practice'}</span>
                                        <span className="tool-row__desc">{locale === 'id' ? 'Gambar aksara Bali di kanvas dengan mouse, sentuh, atau gerakan tangan.' : 'Draw Balinese script on a canvas with mouse, touch, or hand gestures.'}</span>
                                    </span>
                                    <span className="tool-row__demo">
                                        <span className="aksara" lang="ban-Bali" style={{ fontSize: 44, color: 'var(--mute)', opacity: .45 }}>{convertLatinToBalinese('ka')}</span>
                                        <PenLine size={22} />
                                        <span>{locale === 'id' ? 'Gerakan tangan lewat kamera' : 'Hand gestures via webcam'}</span>
                                    </span>
                                    <span className="tool-row__go">{locale === 'id' ? 'Coba' : 'Try it'} <ArrowRight size={15} /></span>
                                </a>
                                <a href="/read" className="tool-row">
                                    <span>
                                        <span className="tool-row__name">{locale === 'id' ? 'Baca dari Foto' : 'Read from Photo'}</span>
                                        <span className="tool-row__desc">{locale === 'id' ? 'Potret aksara Bali dan baca hasilnya dalam Latin — OCR langsung di browser.' : 'Snap Balinese script and read it back in Latin — OCR right in your browser.'}</span>
                                    </span>
                                    <span className="tool-row__demo">
                                        <span className="aksara" lang="ban-Bali">{convertLatinToBalinese('pura')}</span>
                                        <span className="tool-row__arrow" aria-hidden="true">→</span>
                                        <span>pura</span>
                                    </span>
                                    <span className="tool-row__go">{locale === 'id' ? 'Baca' : 'Read'} <ArrowRight size={15} /></span>
                                </a>
                                <a href="/blog" className="tool-row">
                                    <span>
                                        <span className="tool-row__name">{locale === 'id' ? 'Blog Aksara' : 'Script Blog'}</span>
                                        <span className="tool-row__desc">{locale === 'id' ? 'Artikel tentang sejarah, struktur, dan pelestarian aksara Bali.' : 'Articles on the history, structure, and preservation of Balinese script.'}</span>
                                    </span>
                                    <span className="tool-row__go">{locale === 'id' ? 'Baca artikel' : 'Read articles'} <ArrowRight size={15} /></span>
                                </a>
                                <a href="/dashboard" className="tool-row">
                                    <span>
                                        <span className="tool-row__name">{locale === 'id' ? 'Dasbor Belajar' : 'Learning Dashboard'}</span>
                                        <span className="tool-row__desc">{locale === 'id' ? 'Pantau progres belajar, nilai kuis, dan statistik latihan menulismu.' : 'Track your learning progress, quiz scores, and writing practice stats.'}</span>
                                    </span>
                                    <span className="tool-row__go">{locale === 'id' ? 'Buka' : 'Open'} <ArrowRight size={15} /></span>
                                </a>
                                <a href="/faq" className="tool-row">
                                    <span>
                                        <span className="tool-row__name">FAQ</span>
                                        <span className="tool-row__desc">{locale === 'id' ? 'Pertanyaan umum tentang aksara Bali, cara penggunaan, dan fitur teknis.' : 'Common questions about Balinese script, usage guide, and technical features.'}</span>
                                    </span>
                                    <span className="tool-row__go">{locale === 'id' ? 'Lihat' : 'View'} <ArrowRight size={15} /></span>
                                </a>
                            </div>
                        </section>

                        {/* Get the Android app */}
                        <section className="app-band" aria-labelledby="app-title">
                            <div>
                                <h2 className="app-band__title" id="app-title">
                                    {locale === 'id' ? 'Dapatkan aplikasi Android' : 'Get the Android app'}
                                </h2>
                                <p>
                                    {locale === 'id' ? 'Konversi & latihan aksara Bali di ponsel Anda.' : 'Convert & practice Balinese script on your phone.'}
                                </p>
                            </div>
                            <div className="app-band__ctas">
                                <a href="https://play.google.com/apps/internaltest/4700728977787153239" target="_blank" rel="noopener noreferrer"
                                    data-track="landing-play-store" className="cta cta--red">
                                    <Smartphone size={18} /> {locale === 'id' ? 'Dapatkan di Google Play' : 'Get it on Google Play'}
                                </a>
                                <a href="https://github.com/doniwirawan/aksara-bali/releases/latest" target="_blank" rel="noopener noreferrer"
                                    data-track="landing-download-apk" onClick={handleApkClick} className="cta cta--ghost">
                                    <Download size={18} /> {locale === 'id' ? 'Unduh APK' : 'Download APK'}
                                </a>
                            </div>
                        </section>
                    </div>
                </main>

                <Footer darkMode={darkMode} locale={locale} />
            </div>

            <style jsx>{`
                .home {
                    min-height: 100vh;
                    min-height: 100dvh;
                    overscroll-behavior: none;
                }
            `}</style>
        </>
    )
}
