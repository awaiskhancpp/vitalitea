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
  /** GeoJSON centroid/point coordinates — ZIP filled via reverse geocode if `postcode` is missing */
  lat?: number
  lon?: number
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
  postal_code?: string | null
  postalcode?: string | null
}

type GeoapifyGeometry =
  | { type: 'Point'; coordinates: [number, number] | number[] }
  | { type?: string; coordinates?: unknown }

/** Best-effort USPS / CA postal codes from Geoapify `properties`. */
function postcodeFromProps(p: FeatureProps): string | null {
  for (const v of [
    p.postcode,
    p.postal_code,
    p.postalcode,
  ]) {
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return null
}

/** Approximate center of Polygon / MultiPolygon for reverse geocode (city polygons often omit `postcode`). */
function centroidFromPolygonishGeometry(g: Record<string, unknown>): { lat: number; lon: number } | null {
  let ring: unknown
  const t = typeof g.type === 'string' ? g.type : ''
  if (t === 'Polygon' && Array.isArray(g.coordinates)) ring = g.coordinates[0]
  else if (t === 'MultiPolygon' && Array.isArray(g.coordinates) && (g.coordinates as unknown[][])[0]?.length)
    ring = (g.coordinates as unknown[][][])[0][0]
  else return null
  if (!Array.isArray(ring) || ring.length < 2) return null
  let sumLon = 0
  let sumLat = 0
  let n = 0
  for (const pt of ring) {
    if (!Array.isArray(pt) || pt.length < 2) continue
    sumLon += Number(pt[0])
    sumLat += Number(pt[1])
    n++
  }
  const lon = n ? sumLon / n : NaN
  const lat = n ? sumLat / n : NaN
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  return { lat, lon }
}

function lonLatFromFeature(raw?: {
  geometry?: GeoapifyGeometry
}): { lat?: number; lon?: number } {
  const g = raw?.geometry as (GeoapifyGeometry & Record<string, unknown>) | undefined
  if (!g) return {}
  if (g.type === 'Point' && Array.isArray(g.coordinates)) {
    const coords = g.coordinates as number[]
    const [a0, a1] = coords
    const lon = Number(a0)
    const lat = Number(a1)
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return {}
    return { lat, lon }
  }
  const polyCentroid = centroidFromPolygonishGeometry(g as Record<string, unknown>)
  return polyCentroid ?? {}
}

type AutocompleteResponse = {
  features?: Array<{ properties?: FeatureProps; geometry?: GeoapifyGeometry }>
  /** `format=json` returns this instead of GeoJSON `features` (see Geoapify docs). */
  results?: FeatureProps[]
}

/** Normalize Geoapify autocomplete/search JSON: GeoJSON uses `features[].properties`, JSON uses `results[]`. */
function collectGeoapifyFeatureRows(
  data: AutocompleteResponse,
): Array<{ properties?: FeatureProps; geometry?: GeoapifyGeometry }> {
  if (Array.isArray(data.features) && data.features.length) return data.features
  if (Array.isArray(data.results) && data.results.length) {
    return data.results.map((properties) => ({ properties }))
  }
  return []
}

/** Map one GeoJSON feature to a dropdown row (or skip). */
export function featureToGeoapifyCitySuggestion(
  raw: { properties?: FeatureProps; geometry?: GeoapifyGeometry } | undefined,
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
  const postcode = postcodeFromProps(p)

  const { lat, lon } = lonLatFromFeature(raw)

  if (!city && !label) return null
  const row: GeoapifyCitySuggestion = {
    label: label || city,
    city: city || label,
    state,
    postcode,
  }
  if (lat != null && lon != null) {
    row.lat = lat
    row.lon = lon
  }
  return row
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
 * City autocomplete rarely includes a single ZIP (`postcode` empty). Reverse-geocode the
 * feature centroid server-side (`/api/geoapify/reverse`) to populate ZIP when possible.
 */
export async function enrichCitySuggestionPostcode(
  suggestion: GeoapifyCitySuggestion,
  signal?: AbortSignal,
): Promise<GeoapifyCitySuggestion> {
  if (suggestion.postcode?.trim()) return suggestion
  if (typeof suggestion.lat !== 'number' || typeof suggestion.lon !== 'number') return suggestion
  if (typeof window === 'undefined') return suggestion
  try {
    const u = `/api/geoapify/reverse?lat=${encodeURIComponent(String(suggestion.lat))}&lon=${encodeURIComponent(String(suggestion.lon))}`
    const res = await fetch(u, { signal, credentials: 'same-origin' })
    if (!res.ok) return suggestion
    const data = (await res.json()) as { postcode?: string | null }
    const pc = typeof data.postcode === 'string' ? data.postcode.trim() : ''
    return pc ? { ...suggestion, postcode: pc } : suggestion
  } catch {
    return suggestion
  }
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
