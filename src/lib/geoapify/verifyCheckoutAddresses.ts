import {
  fetchGeoapifyCitySuggestions,
  fetchGeoapifySearchCitySuggestions,
  type GeoapifyCitySuggestion,
} from '@/lib/geoapify/autocomplete'
import {
  assertUsOrCa,
  cityTextsMatch,
  resolveGeoapifyApiKey,
  stateTextsMatch,
} from '@/lib/geoapify/helpers'


export type PostalAddressSlice = {
  city: string
  state: string
  zip: string
  country: string
}

function dedupeSuggestions(rows: GeoapifyCitySuggestion[]): GeoapifyCitySuggestion[] {
  const seen = new Set<string>()
  return rows.filter((s) => {
    const k = `${s.city}|${s.state ?? ''}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

/**
 * Validates city + state against Geoapify for US/CA only.
 * Requires `GEOAPIFY_API_KEY` or `NEXT_PUBLIC_GEOAPIFY_API_KEY` so scripted clients cannot bypass.
 */
async function verifyOnePostalRegion(
  addr: PostalAddressSlice,
  label: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const ccIso = assertUsOrCa(addr.country)
  if (!ccIso) {
    return {
      ok: false,
      error: `${label}: shipping is only available to the United States or Canada.`,
    }
  }

  const city = addr.city?.trim() ?? ''
  const state = addr.state?.trim() ?? ''
  if (city.length < 2) return { ok: false, error: `${label}: enter a valid city.` }
  if (!state.length) return { ok: false, error: `${label}: state or province is required.` }

  const apiKey = resolveGeoapifyApiKey()
  if (!apiKey) {
    return {
      ok: false,
      error:
        `${label}: address verification is unavailable. Set GEOAPIFY_API_KEY on the server.`,
    }
  }

  let merged = dedupeSuggestions(await fetchGeoapifyCitySuggestions(city, ccIso))
  if (merged.length < 8) {
    const extra = await fetchGeoapifySearchCitySuggestions(city, ccIso)
    merged = dedupeSuggestions([...merged, ...extra])
  }

  const cityHits = merged.filter((r) => cityTextsMatch(city, r.city))
  if (!cityHits.length) {
    return {
      ok: false,
      error: `${label}: choose a city in ${ccIso === 'US' ? 'the United States' : 'Canada'} from the list, or type until you see a matching suggestion.`,
    }
  }

  const rowsWithState = cityHits.filter((r) => r.state?.trim())
  if (rowsWithState.length) {
    const stateOk = rowsWithState.some((r) => stateTextsMatch(state, r.state!))
    if (!stateOk) {
      return {
        ok: false,
        error: `${label}: city does not match the selected state or province for that country.`,
      }
    }
  }

  return { ok: true }
}

export async function verifyCheckoutPostalAddresses(args: {
  shipping: PostalAddressSlice
  billing?: PostalAddressSlice
  sameAsShipping: boolean
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const s = await verifyOnePostalRegion(args.shipping, 'Shipping')
  if (!s.ok) return s
  if (args.sameAsShipping) return { ok: true }
  if (!args.billing) {
    return { ok: false, error: 'Billing address is required when not same as shipping.' }
  }
  return verifyOnePostalRegion(args.billing, 'Billing')
}
