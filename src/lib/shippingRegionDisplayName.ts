/** Used by seed/repair ShippingRegions hooks and beforeChange-aligned persist. */
export function resolvedShippingRegionTitle(doc: {
  id?: string | number
  name?: unknown
  country?: unknown
  rate?: unknown
}): string {
  const raw = typeof doc.name === 'string' ? doc.name.trim() : ''
  if (raw.length > 0 && !/^untitled$/i.test(raw)) return raw
  const cc =
    typeof doc.country === 'string' ? doc.country.replace(/\s/g, '').slice(0, 3).toUpperCase() : ''
  if (cc) return `${cc} — $${Number(doc.rate ?? 0)} shipping`
  return raw.length > 0 ? raw : `Shipping region #${doc.id ?? '?'}`
}
