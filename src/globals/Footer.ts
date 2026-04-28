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
    {
      name: 'socialLinks',
      type: 'array',
      labels: { singular: 'Social link', plural: 'Social links' },
      admin: { description: 'Social profiles shown above the copyright line.' },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          admin: { description: 'Used to pick icon styling' },
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'TikTok', value: 'tiktok' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: { description: 'Full URL including https://' },
        },
      ],
    },
  ],
}
