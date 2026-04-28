import type { CollectionConfig } from 'payload'

/**
 * Flat shipping rate per region. Match checkout by `country` + optional `stateCode`.
 */
export const ShippingRegions: CollectionConfig = {
  slug: 'shipping-regions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'rate', 'isActive'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        const d = data as {
          name?: string | null
          country?: string | null
          rate?: number | null
          code?: string | null
          stateCode?: string | null
        }
        const trimmed = typeof d.name === 'string' ? d.name.trim() : ''
        const cc =
          typeof d.country === 'string' ? d.country.replace(/\s/g, '').slice(0, 3).toUpperCase() : ''
        if (!String(d.code ?? '').trim() && cc) {
          const st = typeof d.stateCode === 'string' && d.stateCode.trim().length > 0
            ? String(d.stateCode).replace(/\s/g, '').toUpperCase().slice(0, 12)
            : ''
          const rawCode = st ? `${cc}-${st}` : cc
          d.code = rawCode.toLowerCase()
        }
        const nameBad = !trimmed || /^untitled$/i.test(trimmed)
        if (nameBad && cc) {
          d.name = `${cc} — $${Number(d.rate ?? 0)} shipping`
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'e.g. United States (standard)' },
    },
    {
      name: 'country',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'ISO country code, e.g. US, CA' },
    },
    {
      name: 'stateCode',
      type: 'text',
      admin: { description: 'Optional — leave blank for the whole country.' },
    },
    {
      name: 'rate',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'Shipping cost in USD' },
    },
    {
      name: 'deliveryEta',
      type: 'text',
      admin: { description: 'e.g. 3–7 business days — shown on checkout' },
    },
    {
      name: 'summaryHint',
      type: 'text',
      admin: { description: 'Short label in the order summary sidebar' },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'sort',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower number = higher priority when auto-selecting' },
    },
    {
      name: 'code',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true, description: 'Stable key; auto-filled from country / state.' },
    },
  ],
}
