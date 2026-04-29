/** When the browser sends an empty MIME (common), infer from extension. */
const EXT_TO_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
}

export function mimeFromFilename(name: string): string | undefined {
  const i = name.lastIndexOf('.')
  if (i < 0) return undefined
  return EXT_TO_MIME[name.slice(i).toLowerCase()]
}
