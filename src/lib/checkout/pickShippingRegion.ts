import type { ShippingRegionDto } from '@/lib/checkout/types'

/**
 * Resolves the shipping row for checkout: match ISO country, prefer national (no state) rows, then by sort.
 */
export function pickShippingRegionForCountry(
  regions: ShippingRegionDto[],
  countryIso: string,
): ShippingRegionDto | undefined {
  const cc = countryIso.trim().toUpperCase()
  const forCountry = regions.filter(
    (r) => (r.country ?? '').trim().toUpperCase() === cc,
  )
  if (forCountry.length === 0) return undefined
  return [...forCountry].sort((a, b) => {
    const sa = a.sort ?? 0
    const sb = b.sort ?? 0
    if (sa !== sb) return sa - sb
    const aNat = !a.stateCode?.trim()
    const bNat = !b.stateCode?.trim()
    if (aNat && !bNat) return -1
    if (!aNat && bNat) return 1
    return 0
  })[0]
}
