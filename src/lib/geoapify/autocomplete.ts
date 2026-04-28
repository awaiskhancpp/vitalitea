import { resolveGeoapifyApiKey } from '@/lib/geoapify/helpers'

const GEOAUTOCOMPLETE_URL = 'https://api.geoapify.com/v1/geocode/autocomplete'
const GEOSEARCH_URL = 'https://api.geoapify.com/v1/geocode/search'

export type GeoapifyCitySuggestion = {
  /** Display line in dropdown */
  label: string
  /** Value for the city input */
  city: string
  state: string | null
  postcode: string | null
}

type FeatureProps = {
  formatted?: string
  name?: string
  city?: string
  locality?: string
  municipality?: string
  state?: string | null
  state_code?: string | null
  postcode?: string | null
}

type AutocompleteResponse = {
  features?: { properties?: FeatureProps }[]
  /** `format=json` returns this instead of GeoJSON `features` (see Geoapify docs). */
  results?: FeatureProps[]
}

/** Normalize Geoapify autocomplete/search JSON: GeoJSON uses `features[].properties`, JSON uses `results[]`. */
function collectGeoapifyFeatureRows(data: AutocompleteResponse): { properties?: FeatureProps }[] {
  if (Array.isArray(data.features) && data.features.length) return data.features
  if (Array.isArray(data.results) && data.results.length) {
    return data.results.map((properties) => ({ properties }))
  }
  return []
}

/** Map one GeoJSON feature to a dropdown row (or skip). */
export function featureToGeoapifyCitySuggestion(
  raw: { properties?: FeatureProps } | undefined,
): GeoapifyCitySuggestion | null {
  const p = raw?.properties ?? {}
  const city =
    (typeof p.city === 'string' && p.city) ||
    (typeof p.locality === 'string' && p.locality) ||
    (typeof p.name === 'string' && p.name) ||
    (typeof p.municipality === 'string' && p.municipality) ||
    ''

  const display =
    (typeof p.formatted === 'string' && p.formatted.trim()) ||
    [city, p.state_code || p.state].filter(Boolean).join(', ')
  const label = display || city
  const state =
    typeof p.state_code === 'string' ? p.state_code : typeof p.state === 'string' ? p.state : null
  const postcode = typeof p.postcode === 'string' ? p.postcode : null

  if (!city && !label) return null
  return {
    label: label || city,
    city: city || label,
    state,
    postcode,
  }
}

/**
 * Geoapify `filter=countrycode:` expects lowercase `us` or `ca`.
 * Validate country with {@link assertUsOrCa} before autocomplete; unknown ISO codes default to US
 * filter only where the UI already restricts choice to US/CA.
 */
export function geoapifyCountryFilter(iso: string): string {
  const c = iso.trim().toUpperCase()
  if (c === 'US') return 'us'
  if (c === 'CA') return 'ca'
  return 'us'
}

/**
 * City suggestions for Geoapify Address Autocomplete (`type=city`, `filter=countrycode:…`).
 * In the **browser**, calls `/api/geoapify/city-autocomplete` so `GEOAPIFY_API_KEY` works
 * without `NEXT_PUBLIC_GEOAPIFY_API_KEY`. On the **server**, calls Geoapify directly.
 */
export async function fetchGeoapifyCitySuggestions(
  rawText: string,
  checkoutCountryIso: string,
  signal?: AbortSignal,
): Promise<GeoapifyCitySuggestion[]> {
  const text = rawText.trim()
  if (text.length < 2) return []

  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams({
        country: checkoutCountryIso.trim().length ? checkoutCountryIso.trim().toUpperCase() : 'US',
        q: text,
      })
      const res = await fetch(`/api/geoapify/city-autocomplete?${params.toString()}`, {
        signal,
        credentials: 'same-origin',
      })
      if (!res.ok) return []
      const data = (await res.json()) as { suggestions?: GeoapifyCitySuggestion[] }
      return Array.isArray(data.suggestions) ? data.suggestions : []
    } catch {
      return []
    }
  }

  const apiKey = resolveGeoapifyApiKey()
  if (!apiKey || text.length < 2) return []

  const cc = geoapifyCountryFilter(checkoutCountryIso)
  const params = new URLSearchParams({
    apiKey,
    text,
    type: 'city',
    filter: `countrycode:${cc}`,
    limit: '8',
    format: 'geojson',
    lang: 'en',
  })
  const url = `${GEOAUTOCOMPLETE_URL}?${params.toString()}`

  const res = await fetch(url, { signal, credentials: 'omit' })
  if (!res.ok) return []

  const data = (await res.json()) as AutocompleteResponse
  const feats = collectGeoapifyFeatureRows(data)

  const out: GeoapifyCitySuggestion[] = []
  for (const f of feats) {
    const row = featureToGeoapifyCitySuggestion(f)
    if (row) out.push(row)
  }

  /** Dedupe by city+state prefix */
  const seen = new Set<string>()
  return out.filter((s) => {
    const k = `${s.city}|${s.state ?? ''}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

/** Extra city rows from forward search (used when autocomplete yields few rows). */
export async function fetchGeoapifySearchCitySuggestions(
  rawText: string,
  checkoutCountryIso: string,
): Promise<GeoapifyCitySuggestion[]> {
  const apiKey = resolveGeoapifyApiKey()
  const text = rawText.trim()
  if (!apiKey || text.length < 2) return []

  const cc = geoapifyCountryFilter(checkoutCountryIso)
  const params = new URLSearchParams({
    apiKey,
    text,
    type: 'city',
    filter: `countrycode:${cc}`,
    limit: '15',
    format: 'geojson',
    lang: 'en',
  })
  const url = `${GEOSEARCH_URL}?${params.toString()}`
  const res = await fetch(url, { credentials: 'omit' })
  if (!res.ok) return []
  const data = (await res.json()) as AutocompleteResponse
  const feats = collectGeoapifyFeatureRows(data)
  const out: GeoapifyCitySuggestion[] = []
  for (const f of feats) {
    const row = featureToGeoapifyCitySuggestion(f)
    if (row) out.push(row)
  }
  return out
}
