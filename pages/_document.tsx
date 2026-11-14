import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="id">
            <Head>
                <meta charSet="utf-8" />

                {/* Preconnect for performance */}
                <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="//fonts.googleapis.com" />
                <link rel="dns-prefetch" href="//fonts.gstatic.com" />
                <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />

                {/* Noto Sans Balinese + Schibsted Grotesk from Google Fonts */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Noto+Sans+Balinese:wght@400;700&family=Schibsted+Grotesk:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />

                {/* Preload critical Balinese font woff2 */}
                {/* eslint-disable-next-line @next/next/google-font-preconnect */}
                <link
                    rel="preload"
                    href="https://fonts.gstatic.com/s/notosansbalinese/v18/NaPwcH_SC65F4aFg5FlhMrONeFVbJp1qYMOBhVGpOzMO.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
            </Head>
            <body>
                {/* Apply the saved theme before first paint so every page's colour tokens resolve correctly. */}
                <script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.getItem('aksara-dark-mode')==='true')document.documentElement.setAttribute('data-bs-theme','dark')}catch(e){}" }} />
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}