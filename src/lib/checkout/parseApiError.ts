export function parseApiError(body: string, status: number, fallback: string): string {
  try {
    const j = JSON.parse(body) as { error?: string }
    if (j.error) return j.error
  } catch {
    if (body?.trim()) return `${fallback} (${status}): ${body.trim().slice(0, 240)}`
  }
  return `${fallback} (HTTP ${status})`
}
