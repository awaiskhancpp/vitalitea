import type { Payload } from 'payload'

/** Human-readable snapshot so orders stay valid in admin if shipping-region IDs change after re-seed. */
export async function snapshotShippingRegion(
  payload: Payload,
  regionId: number | string,
): Promise<{ snapshot: string; shippingCountryCode: string } | null> {
  const doc = await payload.findByID({
    collection: 'shipping-regions',
    id: regionId,
    overrideAccess: true,
  })
  if (!doc) return null
  const d = doc as { name?: string | null; country?: string | null; rate?: number | null }
  const cc = typeof d.country === 'string' ? d.country.trim().toUpperCase() : ''
  if (!cc) return null
  const nm =
    typeof d.name === 'string' && d.name.trim().length > 0
      ? d.name.trim()
      : `${cc} shipping`
  return {
    shippingCountryCode: cc,
    snapshot: `${nm} (${cc}) — $${Number(d.rate ?? 0)} USD`,
  }
}
