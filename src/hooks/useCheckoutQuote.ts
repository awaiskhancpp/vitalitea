import { useEffect, useState } from 'react'
import type { CartItem } from '@/contexts/CartContext'
import { postCheckoutQuote } from '@/lib/checkout/api'
import type { CheckoutLine, CheckoutQuote } from '@/lib/checkout/types'

function toQuoteLines(
  items: { id: string; slug: string; name: string; price: number; quantity: number; imageUrl: string; imageAlt: string; variantLabel?: string }[],
): CheckoutLine[] {
  return items.map((i) => ({
    id: i.id,
    slug: i.slug,
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    imageUrl: i.imageUrl,
    imageAlt: i.imageAlt,
    variantLabel: i.variantLabel,
  }))
}

type Args = {
  ready: boolean
  items: CartItem[]
  shippingRegionId: string
  appliedCoupon: string
}

/**
 * Debounced server quote for the current cart, region, and coupon.
 */
export function useCheckoutQuote({ ready, items, shippingRegionId, appliedCoupon }: Args) {
  const [quote, setQuote] = useState<CheckoutQuote | null>(null)
  const [quoteError, setQuoteError] = useState<string | null>(null)

  useEffect(() => {
    if (!ready || !items.length || !shippingRegionId) return
    const controller = new AbortController()
    const t = window.setTimeout(() => {
      void (async () => {
        setQuoteError(null)
        try {
          const r = await postCheckoutQuote(
            {
              items: toQuoteLines(items),
              shippingRegionId,
              couponCode: appliedCoupon.trim() || null,
            },
            controller.signal,
          )
          if (r.ok) {
            setQuote(r.data)
            setQuoteError(null)
          } else {
            setQuoteError(r.error)
            setQuote(null)
          }
        } catch {
          /* aborted or network */
        }
      })()
    }, 400)
    return () => {
      clearTimeout(t)
      controller.abort()
    }
  }, [ready, items, shippingRegionId, appliedCoupon])

  return { quote, quoteError, setQuoteError }
}
