'use client'

import { useCallback, useState } from 'react'
import { uploadImageFile, type UploadImageResult } from '@/lib/uploadImage'

/**
 * Sends the selected image to `/api/upload` and exposes URL + preview state.
 * Token stays server-side; only the returned HTTPS URL touches the client.
 */
export function useImageUpload(initialUrl?: string | null) {
  const [url, setUrl] = useState<string | null>(initialUrl ?? null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const upload = useCallback(async (file: File): Promise<UploadImageResult> => {
    setError(null)
    setUploading(true)
    try {
      const r = await uploadImageFile(file)
      if (!r.ok) {
        setUrl(null)
        setError(r.error)
        return r
      }
      setUrl(r.url)
      return r
    } finally {
      setUploading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setUrl(initialUrl ?? null)
    setError(null)
    setUploading(false)
  }, [initialUrl])

  return {
    /** Public blob URL after a successful upload (or controlled initial preview) */
    url,
    setUrl,
    error,
    uploading,
    upload,
    reset,
  }
}
