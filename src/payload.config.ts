import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { Testimonials } from './collections/Testimonials'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { Homepage } from './globals/Homepage'
import { Users } from './collections/Users'
import Shop from './collections/Shop'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const connectionString = process.env.DATABASE_URI || process.env.DATABASE_URL || ''

export default buildConfig({
  admin: { user: 'users' },
  collections: [Media, Products, Categories, Testimonials, Users, Shop],
  globals: [Header, Footer, Homepage],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-here',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({ pool: { connectionString } }),
  upload: { limits: { fileSize: 5000000 } },
})
