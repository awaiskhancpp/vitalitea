/**
 * Unified API key lookup (recommended: `GEOAPIFY_API_KEY` server-only).
 */
export function resolveGeoapifyApiKey(): string {
  const a =
    typeof process.env.GEOAPIFY_API_KEY === 'string' ? process.env.GEOAPIFY_API_KEY.trim() : ''
  if (a) return a
  const b =
    typeof process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY === 'string'
      ? process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY.trim()
      : ''
  return b || ''
}

/** Checkout only allows these countries (ISO alpha-2). */
export function assertUsOrCa(country: string): 'US' | 'CA' | null {
  const u = country.trim().toUpperCase()
  if (u === 'US' || u === 'CA') return u
  return null
}

export function normalizeCityToken(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  const dp = new Array<number>(n + 1)
  for (let j = 0; j <= n; j++) dp[j] = j
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j]
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost)
      prev = tmp
    }
  }
  return dp[n] ?? Math.max(m, n)
}

/** Loose match between user-entered municipality and Geoapify `city`/name. */
export function cityTextsMatch(userInput: string, geoCity: string): boolean {
  const u = normalizeCityToken(userInput)
  const c = normalizeCityToken(geoCity)
  if (!u.length || !c.length) return false
  if (u === c) return true
  if (c.startsWith(u) && u.length >= 3) return true
  if (u.startsWith(c) && c.length >= 3) return true
  const maxDist = Math.min(2, Math.floor(Math.max(u.length, c.length) / 6 + 1))
  if (levenshtein(u, c) <= maxDist && Math.abs(u.length - c.length) <= 3) return true
  return false
}

/** Match state/province field to Geoapify state or state_code. */
export function stateTextsMatch(userInput: string, geoState: string): boolean {
  return cityTextsMatch(userInput, geoState)
}
