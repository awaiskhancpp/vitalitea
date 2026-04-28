import type { CollectionConfig } from 'payload'

const isStaff = (u: unknown): boolean =>
  typeof u === 'object' &&
  u !== null &&
  'collection' in u &&
  (u as { collection?: string }).collection === 'users'

const isCustomer = (u: unknown): boolean =>
  typeof u === 'object' &&
  u !== null &&
  'collection' in u &&
  (u as { collection?: string }).collection === 'customers'

export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'createdAt'],
    description: 'Storefront customer accounts.',
  },
  access: {
    create: () => true,
    read: ({ req }) => {
      if (!req.user) return false
      if (isStaff(req.user)) return true
      if (!isCustomer(req.user)) return false
      const id = (req.user as { id: number | string }).id
      return { id: { equals: id } }
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (isStaff(req.user)) return true
      if (!isCustomer(req.user)) return false
      const id = (req.user as { id: number | string }).id
      return { id: { equals: id } }
    },
    delete: ({ req }) => Boolean(req.user && isStaff(req.user)),
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      admin: { description: 'Customer first name' },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      admin: { description: 'Customer last name' },
    },
    {
      name: 'phone',
      type: 'text',
      admin: { description: 'Phone (optional)' },
    },
  ],
}
