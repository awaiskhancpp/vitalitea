import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  upload: {
    // Vercel serverless has no writable disk; `vercelBlobStorage` handles `media` there. Local dev uses disk.
    ...(process.env.VERCEL ? {} : { staticDir: 'public/media' }),
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 576, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [{ name: 'alt', type: 'text', required: true }],
}
