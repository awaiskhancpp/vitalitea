export type UploadImageResult =
  | { ok: true; url: string }
  | { ok: false; error: string }

const MAX_BYTES = 12 * 1024 * 1024

/** Optional field name override if your form uses another key than `file` */
export async function uploadImageFile(
  file: File,
  options?: { fieldName?: string },
): Promise<UploadImageResult> {
  if (!file || file.size === 0) {
    return { ok: false, error: 'Please choose an image first' }
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: 'File is too large' }
  }
  const mime = (file.type || '').toLowerCase()
  if (!mime.startsWith('image/')) {
    return { ok: false, error: 'Only image files can be uploaded' }
  }

  const field = options?.fieldName ?? 'file'
  const formData = new FormData()
  formData.append(field, file)

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    let json: unknown
    try {
      json = await res.json()
    } catch {
      return { ok: false, error: 'Invalid server response' }
    }

    const err =
      typeof json === 'object' && json !== null && typeof (json as { error?: unknown }).error === 'string'
        ? (json as { error: string }).error
        : undefined

    if (!res.ok) {
      return { ok: false, error: err || `Upload failed (${res.status})` }
    }

    const url =
      typeof json === 'object' && json !== null && typeof (json as { url?: unknown }).url === 'string'
        ? (json as { url: string }).url
        : undefined

    if (!url?.trim()) {
      return { ok: false, error: 'Missing file URL from server' }
    }

    return { ok: true, url }
  } catch {
    return { ok: false, error: 'Network error — try again' }
  }
}
