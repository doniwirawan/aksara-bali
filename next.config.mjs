import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
// Short commit on Vercel, else build date — so we can tell which build is live.
const buildRef = (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7)
  || new Date().toISOString().slice(0, 16).replace('T', ' ')

/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,

    env: {
        NEXT_PUBLIC_APP_VERSION: pkg.version,
        NEXT_PUBLIC_BUILD_REF: buildRef,
    },

    images: {
        unoptimized: true
    },

    // The site builds @aksara-bali/react from its source in packages/, so a
    // deploy never depends on the package's dist/ having been built first.
    webpack: (config) => {
        config.resolve.alias['@aksara-bali/react$'] = fileURLToPath(new URL('./packages/react/src/index.js', import.meta.url))
        return config
    },

    // PWA configuration
    async headers() {
        return [
            {
                // Dictionary data, readable from other sites by @aksara-bali/kamus loadKamus().
                source: '/data/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
                ],
            },
            {
                source: '/site.webmanifest',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/manifest+json',
                    },
                ],
            },
            {
                source: '/sw.js',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/javascript',
                    },
                    {
                        key: 'Service-Worker-Allowed',
                        value: '/',
                    },
                ],
            },
        ];
    },

    // Ensure proper PWA caching
    // Read-from-photo is paused until the OCR model reads reliably; its code
    // (components/OcrPanel.jsx, utils/balineseOcr.js, scripts/ocr/) is kept.
    async redirects() {
        return [{ source: '/read', destination: '/', permanent: false }]
    },

    async rewrites() {
        return [
            {
                source: '/manifest.json',
                destination: '/site.webmanifest',
            },
        ];
    },
}

export default nextConfig