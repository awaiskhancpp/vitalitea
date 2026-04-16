import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true },
  fields: [
    {
      name: 'navLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
      defaultValue: [
        { label: 'Shop', href: '/shop' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
  ],
}
