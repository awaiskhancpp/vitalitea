/**
 * Checkout only ships to US / CA — both use ITU/E.164 country code **+1** (NANP).
 * Reject other (+92, etc.) regardless of separators.
 */

export const PHONE_ERROR_US_CA =
  'Use a US or Canada number: 10 digits, or start with +1 (not another country code).'

function digitsOnly(s: string): string {
  return s.replace(/\D/g, '')
}

/** NANP subscriber number rules (area + exchange prefixes). */
function nanpSubscriberOk(ten: string): boolean {
  if (ten.length !== 10) return false
  const [n0, , , x0] = [ten[0], ten[1], ten[2], ten[3]]
  if (!n0 || !x0) return false
  if (n0 === '0' || n0 === '1') return false
  if (x0 === '0' || x0 === '1') return false
  return true
}

/** Accepts NANP formatting; rejects non-+1 international and foreign digit patterns. */
export function isPhoneValidForCountry(phoneRaw: string, countryIso: string): boolean {
  const cc = countryIso.trim().toUpperCase()
  if (cc !== 'US' && cc !== 'CA') return false

  const t = phoneRaw.trim()
  if (!t) return false

  const compact = t.replace(/\s+/g, ' ')
  if (compact.startsWith('011')) return false

  if (compact.startsWith('+')) {
    if (!compact.startsWith('+1')) return false
    const subscriber = digitsOnly(compact.slice(2))
    return subscriber.length === 10 && nanpSubscriberOk(subscriber)
  }

  const d = digitsOnly(compact)

  /* Long numeric strings starting with digits other than 1 are unlikely domestic (e.g. 92…) */
  if (d.length >= 11 && !d.startsWith('1')) return false

  if (d.length === 10) return nanpSubscriberOk(d)

  if (d.length === 11 && d.startsWith('1')) {
    return nanpSubscriberOk(d.slice(1))
  }

  return false
}
