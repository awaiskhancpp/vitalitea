/** Safe URL from Payload media populate (depth ≥ 2). */
export function mediaUrl(media: unknown): string | null {
  if (!media || typeof media !== 'object') return null
  const u = (media as { url?: unknown }).url
  return typeof u === 'string' && u.trim().length > 0 ? u.trim() : null
}

/** Vercel Blob `next/image` often fails to optimize these hosts; load the CDN URL as-is. */
export function isPayloadBlobCdnUrl(src: string): boolean {
  return /^https:\/\//i.test(src) && /\.public\.blob\.vercel-storage\.com\//i.test(src)
}
