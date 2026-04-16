import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },
  fields: [
    { name: 'about', type: 'textarea' },
    {
      name: 'quickLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'hours', type: 'text' },
  ],
}
