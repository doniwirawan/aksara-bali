import { readFileSync } from 'node:fs'

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

    // PWA configuration
    async headers() {
        return [
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