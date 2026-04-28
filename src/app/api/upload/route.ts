import { put } from '@vercel/blob'
import { randomBytes } from 'node:crypto'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

/** Matches client + server checks; keep in sync with uploadImageFile in @/lib/uploadImage */
const MAX_BYTES = 12 * 1024 * 1024

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

function isConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim())
}

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: 'Upload is not configured (missing BLOB_READ_WRITE_TOKEN).' },
      { status: 503 },
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const entry = formData.get('file')
  if (entry === null || entry === undefined) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  if (typeof entry === 'string') {
    return NextResponse.json({ error: 'Expected a file, not text' }, { status: 400 })
  }

  const file = entry as File
  if (file.size === 0) {
    return NextResponse.json({ error: 'Empty file' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large' }, { status: 413 })
  }

  const mime = (file.type || '').toLowerCase()
  if (!mime.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 415 })
  }

  const ext = MIME_TO_EXT[mime]
  if (!ext) {
    return NextResponse.json({ error: 'Unsupported image type' }, { status: 415 })
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN!
  const pathname = `uploads/${Date.now()}-${randomBytes(8).toString('hex')}.${ext}`

  try {
    const blobOptions =
      file.size > 4 * 1024 * 1024
        ? ({
            access: 'public' as const,
            token,
            contentType: mime,
            multipart: true,
          } satisfies Parameters<typeof put>[2])
        : ({
            access: 'public' as const,
            token,
            contentType: mime,
          } satisfies Parameters<typeof put>[2])

    const result = await put(pathname, file, blobOptions)
    return NextResponse.json({ url: result.url })
  } catch (err) {
    console.error('[api/upload]', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
