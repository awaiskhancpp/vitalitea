import { NextResponse } from 'next/server'
import { fetchGeoapifyCitySuggestions } from '@/lib/geoapify/autocomplete'
import { assertUsOrCa } from '@/lib/geoapify/helpers'

export const dynamic = 'force-dynamic'

/**
 * Proxies Geoapify city autocomplete so the browser does not require
 * `NEXT_PUBLIC_GEOAPIFY_API_KEY` — uses `GEOAPIFY_API_KEY` on the server.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') ?? '').trim()
  const country = (searchParams.get('country') ?? 'US').trim()

  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  const cc = assertUsOrCa(country)
  if (!cc) {
    return NextResponse.json({ suggestions: [] })
  }

  try {
    const suggestions = await fetchGeoapifyCitySuggestions(q, cc)
    return NextResponse.json({ suggestions })
  } catch {
    return NextResponse.json({ suggestions: [] })
  }
}
