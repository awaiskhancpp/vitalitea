import { NextResponse } from 'next/server'
import { resolveGeoapifyApiKey } from '@/lib/geoapify/helpers'

export const dynamic = 'force-dynamic'

function parseReversePostcode(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null
  const root = data as Record<string, unknown>

  const fromProps = (p: unknown): string | null => {
    if (!p || typeof p !== 'object') return null
    const o = p as Record<string, unknown>
    for (const k of ['postcode', 'postal_code', 'postalcode']) {
      const v = o[k]
      if (typeof v === 'string' && v.trim()) return v.trim()
    }
    return null
  }

  if (Array.isArray(root.features) && root.features.length) {
    const fc = root.features[0] as { properties?: unknown }
    const pc = fromProps(fc.properties)
    if (pc) return pc
  }
  if (Array.isArray(root.results) && root.results.length) {
    return fromProps(root.results[0])
  }
  return null
}

/** Reverse geocode to fill postal/ZIP — used when city autocomplete has no postcode. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = Number(searchParams.get('lat'))
  const lon = Number(searchParams.get('lon'))
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ postcode: null }, { status: 400 })
  }
  const apiKey = resolveGeoapifyApiKey()
  if (!apiKey) {
    return NextResponse.json({ postcode: null })
  }

  try {
    const qs = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      apiKey,
      format: 'json',
      lang: 'en',
    })
    const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?${qs.toString()}`, {
      cache: 'no-store',
    })
    if (!res.ok) return NextResponse.json({ postcode: null })
    const json: unknown = await res.json()
    const postcode = parseReversePostcode(json)
    return NextResponse.json({ postcode })
  } catch {
    return NextResponse.json({ postcode: null })
  }
}
