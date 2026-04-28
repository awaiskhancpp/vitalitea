import type { Payload } from 'payload'
import { snapshotShippingRegion } from './orderShippingSnapshots'
import { resolvedShippingRegionTitle } from './shippingRegionDisplayName'

/** Backfill orphaned FKs using region key + address country; fix empty region titles and snapshots. */
export async function repairOrphanedOrderShippingRegions(payload: Payload): Promise<void> {
  let page = 1
  const limit = 200
  while (page <= 200) {
    const res = await payload.find({
      collection: 'orders',
      depth: 0,
      limit,
      page,
      overrideAccess: true,
      sort: 'id',
    })
    const { docs } = res
    for (const raw of docs) {
      await repairOne(payload, raw)
    }
    if (!docs.length || docs.length < limit) break
    page += 1
  }
}

async function ensureShippingRegionIntegrity(payload: Payload, regionId: number | string): Promise<void> {
  const doc = await payload
    .findByID({ collection: 'shipping-regions', id: regionId, overrideAccess: true })
    .catch(() => null)
  if (!doc) return
  const d = doc as {
    id: string | number
    name?: string | null
    country?: string | null
    rate?: number | null
    code?: string | null
    stateCode?: string | null
  }
  const cc =
    typeof d.country === 'string' ? d.country.replace(/\s/g, '').slice(0, 3).toUpperCase() : ''
  const st =
    typeof d.stateCode === 'string' && d.stateCode.trim().length > 0
      ? String(d.stateCode).replace(/\s/g, '').toUpperCase().slice(0, 12)
      : ''
  const computedCode = cc ? (st ? `${cc}-${st}` : cc).toLowerCase() : ''
  const codeOk = String(d.code ?? '').trim().length > 0

  const curName = typeof d.name === 'string' ? d.name.trim() : ''
  const resolvedName = resolvedShippingRegionTitle(d)
  const nameNeedsPersist = resolvedName !== curName

  const data: Record<string, unknown> = {}
  if (!codeOk && computedCode) {
    const clash = await payload.find({
      collection: 'shipping-regions',
      where: {
        and: [
          { code: { equals: computedCode } },
          { id: { not_equals: d.id } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })
    data.code = clash.docs.length ? `${computedCode}-${String(d.id)}` : computedCode
  }
  if (nameNeedsPersist) data.name = resolvedName

  if (Object.keys(data).length === 0) return
  await payload.update({
    collection: 'shipping-regions',
    id: d.id,
    data,
    overrideAccess: true,
  })
}

async function getRegionCodeFromDoc(payload: Payload, regionId: number | string): Promise<string> {
  const doc = await payload
    .findByID({ collection: 'shipping-regions', id: regionId, overrideAccess: true })
    .catch(() => null)
  if (!doc) return ''
  const d = doc as { code?: string | null; country?: string | null; stateCode?: string | null }
  const c = String(d.code ?? '').trim().toLowerCase()
  if (c) return c
  const cc =
    typeof d.country === 'string' ? d.country.replace(/\s/g, '').slice(0, 3).toUpperCase() : ''
  const st =
    typeof d.stateCode === 'string' && d.stateCode.trim().length > 0
      ? String(d.stateCode).replace(/\s/g, '').toUpperCase().slice(0, 12)
      : ''
  if (!cc) return ''
  return (st ? `${cc}-${st}` : cc).toLowerCase()
}

async function repairOne(payload: Payload, raw: unknown) {
  const row = raw as {
    id: number | string
    shippingRegion?: number | { id?: number } | null
    shippingAddress?: Record<string, unknown> | undefined
    shippingCountryCode?: string | null
    shippingRegionSnapshot?: string | null
    shippingRegionCode?: string | null
  }

  const ridRaw = row.shippingRegion
  const ridNum =
    ridRaw === null || ridRaw === undefined
      ? NaN
      : typeof ridRaw === 'object' && ridRaw !== null && 'id' in ridRaw
        ? Number((ridRaw as { id: unknown }).id)
        : Number(ridRaw)

  let fkValid = false
  if (Number.isFinite(ridNum) && ridNum) {
    try {
      const existing = await payload.findByID({
        collection: 'shipping-regions',
        id: ridNum,
        overrideAccess: true,
      })
      fkValid = Boolean(existing)
    } catch {
      fkValid = false
    }
  }

  if (fkValid && ridNum) {
    await ensureShippingRegionIntegrity(payload, ridNum)
  }

  const addrCountry =
    typeof row.shippingAddress === 'object' && row.shippingAddress
      ? String((row.shippingAddress as Record<string, unknown>).country ?? '')
          .trim()
          .toUpperCase()
      : ''
  const codeFromAddr =
    addrCountry ||
    (typeof row.shippingCountryCode === 'string' ? row.shippingCountryCode.trim().toUpperCase() : '')

  const orderCodePref =
    typeof row.shippingRegionCode === 'string' ? row.shippingRegionCode.trim().toLowerCase() : ''

  let canonicalId: number | null = null

  if (orderCodePref) {
    const byCode = await payload.find({
      collection: 'shipping-regions',
      where: { code: { equals: orderCodePref } },
      limit: 1,
      overrideAccess: true,
    })
    const doc = byCode.docs[0] as { id?: unknown } | undefined
    if (doc?.id != null) {
      const n = Number(doc.id)
      if (Number.isFinite(n)) canonicalId = n
    }
  }

  if (canonicalId === null && fkValid && ridNum) {
    canonicalId = ridNum
  }

  if (canonicalId === null && codeFromAddr) {
    const match = await payload.find({
      collection: 'shipping-regions',
      where: {
        and: [{ country: { equals: codeFromAddr } }, { isActive: { equals: true } }],
      },
      sort: 'sort',
      limit: 1,
      overrideAccess: true,
    })
    const hit = match.docs[0] as { id?: string | number } | undefined
    if (hit?.id != null) {
      const n = typeof hit.id === 'number' ? hit.id : Number(hit.id)
      if (Number.isFinite(n)) canonicalId = n
    }
  }

  if (canonicalId === null) return

  await ensureShippingRegionIntegrity(payload, canonicalId)

  const snap = await snapshotShippingRegion(payload, canonicalId)
  if (!snap) return

  const finalCode = await getRegionCodeFromDoc(payload, canonicalId)
  if (!finalCode) return

  const currentFk = fkValid && ridNum ? ridNum : null
  const rowCode =
    typeof row.shippingRegionCode === 'string' ? row.shippingRegionCode.trim().toLowerCase() : ''

  const needsUpdate =
    currentFk !== canonicalId ||
    row.shippingCountryCode !== snap.shippingCountryCode ||
    row.shippingRegionSnapshot !== snap.snapshot ||
    rowCode !== finalCode

  if (!needsUpdate) return

  await payload.update({
    collection: 'orders',
    id: row.id,
    data: {
      shippingRegion: canonicalId,
      shippingCountryCode: snap.shippingCountryCode,
      shippingRegionSnapshot: snap.snapshot,
      shippingRegionCode: finalCode,
    } as Record<string, unknown>,
    overrideAccess: true,
  })
}
