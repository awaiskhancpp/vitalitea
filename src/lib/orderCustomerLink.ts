import type { Payload } from 'payload'

function collectionSlug(user: unknown): string | undefined {
  if (!user || typeof user !== 'object') return undefined
  const rec = user as Record<string, unknown>
  if (typeof rec.collectionSlug === 'string') return rec.collectionSlug
  if (typeof rec.collection === 'string') return rec.collection
  return undefined
}

/**
 * Links an order to a logged-in storefront customer only when JWT matches the checkout email.
 */
export async function resolveOptionalOrderCustomerRelationship(
  payload: Payload,
  headers: Headers,
  checkoutEmail: string,
): Promise<number | undefined> {
  const { user } = await payload.auth({ headers })
  if (!user || typeof user !== 'object') return undefined
  if (collectionSlug(user) !== 'customers') return undefined
  const ur = user as { id?: string | number }
  const lookupId = ur.id
  if (lookupId === undefined) return undefined

  const doc = await payload.findByID({
    collection: 'customers',
    id: lookupId,
    depth: 0,
    overrideAccess: true,
  })
  const em = typeof doc.email === 'string' ? doc.email.trim().toLowerCase() : ''
  const want = checkoutEmail.trim().toLowerCase()
  if (!em || em !== want) return undefined

  const rawId = typeof ur.id === 'number' ? ur.id : Number(ur.id)
  if (!Number.isFinite(rawId)) return undefined
  return rawId
}
