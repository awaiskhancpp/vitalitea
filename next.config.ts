import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

function hostnameFromEnv(value: string | undefined): string | null {
  if (!value?.trim()) return null
  const v = value.trim()
  if (/^https?:\/\//i.test(v)) {
    try {
      return new URL(v).hostname
    } catch {
      return null
    }
  }
  return v.replace(/\/.*$/, '') || null
}

/** Lets `next/image` optimize Payload `/api/media/...` and same-origin previews on Vercel. */
function vercelHosts(): string[] {
  const out = new Set<string>()
  for (const c of [
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.IMAGE_OPTIMIZE_HOSTNAME,
  ]) {
    const h = hostnameFromEnv(c ?? undefined)
    if (h) out.add(h)
  }
  return [...out]
}

const nextConfig: NextConfig = {
  images: {
    // Payload serves uploads at `/api/media/file/…` — explicit entries avoid INVALID_IMAGE_OPTIMIZE_REQUEST on Vercel.
    localPatterns: [
      { pathname: '/api/media/**' },
      { pathname: '/api/media/file/**' },
      { pathname: '/**' },
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
      // Production / preview deployments (INVALID `hostname: '**'` broke optimization)
      ...vercelHosts().map((hostname) => ({
        protocol: 'https' as const,
        hostname,
        pathname: '/api/media/**' as const,
      })),
      {
        protocol: 'https' as const,
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
