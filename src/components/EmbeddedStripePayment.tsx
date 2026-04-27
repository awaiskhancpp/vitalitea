'use client'

import { useState } from 'react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'

type EmbeddedStripePaymentProps = {
  orderId: string
  amount: number
  onBack: () => void
  onSucceeded: () => void
  disabled?: boolean
}

/**
 * Renders after parent mounts <Elements options={{ clientSecret, appearance }}> around this.
 */
export default function EmbeddedStripePayment({
  orderId,
  amount,
  onBack,
  onSucceeded,
  disabled = false,
}: EmbeddedStripePaymentProps) {
  return (
    <div className="mt-2 space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="font-['Cormorant_Garamond'] text-lg font-bold text-neutral-900">
          Complete payment
        </h3>
        <button
          type="button"
          onClick={onBack}
          className="w-fit text-left text-sm text-sky-600 underline-offset-2 hover:underline"
        >
          ← Change payment method
        </button>
      </div>
      <EmbeddedStripeForm
        orderId={orderId}
        amount={amount}
        onBack={onBack}
        onSucceeded={onSucceeded}
        disabled={disabled}
      />
    </div>
  )
}

function EmbeddedStripeForm({
  orderId,
  amount,
  onBack,
  onSucceeded,
  disabled = false,
}: EmbeddedStripePaymentProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setMsg(null)
    setBusy(true)
    const { error: submitError } = await elements.submit()
    if (submitError) {
      setMsg(submitError.message || 'Check your details')
      setBusy(false)
      return
    }
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/checkout/success?orderId=${encodeURIComponent(orderId)}`,
      },
      redirect: 'if_required',
    })
    setBusy(false)
    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMsg(error.message || 'Payment failed')
      } else {
        setMsg(error.message || 'Could not process payment')
      }
      return
    }
    if (paymentIntent?.status === 'succeeded') {
      setBusy(true)
      try {
        const sync = await fetch('/api/checkout/verify-embedded-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, paymentIntentId: paymentIntent.id }),
        })
        if (!sync.ok) {
          const j = (await sync.json().catch(() => ({}))) as { error?: string }
          setMsg(j.error || 'Could not confirm order; try the success link or contact support.')
          return
        }
        onSucceeded()
      } finally {
        setBusy(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-neutral-200/90 bg-white p-3 sm:p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>
      {msg && <p className="font-['Host_Grotesk'] text-sm text-red-600">{msg}</p>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="w-fit text-sm text-sky-600 underline-offset-2 hover:underline"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || busy || disabled}
          className="inline-flex h-12 min-w-[9rem] items-center justify-center rounded-lg bg-neutral-900 px-6 font-['Host_Grotesk'] text-sm font-bold text-white transition-opacity enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? (
            <span
              className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white"
              aria-hidden
            />
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </button>
      </div>
    </form>
  )
}
