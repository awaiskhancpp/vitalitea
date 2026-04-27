import { FIELD_SCROLL_ORDER } from './constants'

export function scrollToFirstError(nextErrors: Record<string, string>) {
  const firstId = FIELD_SCROLL_ORDER.find((k) => nextErrors[k as string])
  if (firstId && typeof document !== 'undefined') {
    window.requestAnimationFrame(() => {
      document.getElementById(firstId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      ;(document.getElementById(firstId) as HTMLInputElement | HTMLSelectElement | null)?.focus?.()
    })
  }
}
