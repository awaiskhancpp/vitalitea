'use client'

import { PayPalButtons } from '@paypal/react-paypal-js'
import { Elements } from '@stripe/react-stripe-js'
import type { Stripe } from '@stripe/stripe-js'
import EmbeddedStripePayment from '@/components/EmbeddedStripePayment'
import { CardBrandIcons, PayPalMark } from '@/components/checkout/CheckoutIcons'

type PayMethod = 'card' | 'paypal'

export function CheckoutPaymentSection({
  checkoutPayMethod,
  setCheckoutPayMethod,
  clearStripeEmbed,
  stripePromise,
  stripeClientSecret,
  embedStripeOrderId,
  qTotal,
  quote,
  submitting,
  prepareCardCheckout,
  payPalEnabled,
  startPaypalOrder,
  onPaypalApprove,
  onPaypalError,
  onStripeSuccess,
}: {
  checkoutPayMethod: PayMethod
  setCheckoutPayMethod: (m: PayMethod) => void
  clearStripeEmbed: () => void
  stripePromise: Promise<Stripe | null> | null
  stripeClientSecret: string | null
  embedStripeOrderId: string | null
  qTotal: number
  quote: { subtotal: number; total: number } | null
  submitting: boolean
  prepareCardCheckout: () => Promise<void>
  payPalEnabled: boolean
  startPaypalOrder: () => Promise<string>
  onPaypalApprove: (data: { orderID: string }) => Promise<void>
  onPaypalError: (msg: string) => void
  onStripeSuccess: () => void
}) {
  return (
    <div className="space-y-5 border-t border-neutral-200 pt-6">
      <h3 className="font-['Cormorant_Garamond'] text-lg font-bold text-neutral-900">Payment Method</h3>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => {
            setCheckoutPayMethod('card')
            clearStripeEmbed()
          }}
          className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
            checkoutPayMethod === 'card'
              ? 'border-[#D1C9BE] bg-[#F5F0E8] shadow-sm'
              : 'border-[#D1C9BE] bg-white hover:bg-neutral-50/80'
          }`}
        >
          <span
            className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
              checkoutPayMethod === 'card' ? 'border-neutral-900 bg-white' : 'border-neutral-300 bg-white'
            }`}
            aria-hidden
          >
            {checkoutPayMethod === 'card' ? (
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
            ) : null}
          </span>
          <CardBrandIcons className="flex shrink-0 gap-0.5" />
          <span className="font-['Host_Grotesk'] text-sm font-bold text-neutral-900 sm:text-[0.95rem]">
            Credit card / Debit card
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            setCheckoutPayMethod('paypal')
            clearStripeEmbed()
          }}
          className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
            checkoutPayMethod === 'paypal'
              ? 'border-[#D1C9BE] bg-[#F5F0E8] shadow-sm'
              : 'border-[#D1C9BE] bg-white hover:bg-neutral-50/80'
          }`}
        >
          <span
            className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
              checkoutPayMethod === 'paypal' ? 'border-neutral-900 bg-white' : 'border-neutral-300 bg-white'
            }`}
            aria-hidden
          >
            {checkoutPayMethod === 'paypal' ? (
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
            ) : null}
          </span>
          <PayPalMark className="h-6 w-16 shrink-0" />
          <span className="font-['Host_Grotesk'] text-sm font-bold text-neutral-900">PayPal</span>
        </button>
      </div>

      {checkoutPayMethod === 'card' && !stripeClientSecret && (
        <button
          type="button"
          onClick={() => void prepareCardCheckout()}
          disabled={submitting || !quote}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#627E5C] font-['Host_Grotesk'] text-sm font-bold text-white transition-opacity enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && (
            <span
              className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white"
              aria-hidden
            />
          )}
          {`Continue to Payment - $${qTotal.toFixed(2)}`}
        </button>
      )}

      {checkoutPayMethod === 'card' && stripeClientSecret && stripePromise && embedStripeOrderId && (
        <Elements
          key={stripeClientSecret}
          stripe={stripePromise}
          options={{
            clientSecret: stripeClientSecret,
            appearance: {
              theme: 'stripe',
              variables: { borderRadius: '10px', colorPrimary: '#0a0a0a' },
            },
          }}
        >
          <EmbeddedStripePayment
            orderId={embedStripeOrderId}
            amount={qTotal}
            onBack={clearStripeEmbed}
            onSucceeded={onStripeSuccess}
            disabled={!quote}
          />
        </Elements>
      )}

      {checkoutPayMethod === 'paypal' && payPalEnabled && (
        <div className="min-h-[48px] w-full">
          <PayPalButtons
            style={{ layout: 'vertical', shape: 'rect', label: 'pay' }}
            disabled={submitting || !quote}
            createOrder={startPaypalOrder}
            onApprove={onPaypalApprove}
            onError={(err) => {
              const msg =
                err && typeof err === 'object' && 'message' in err
                  ? String((err as { message: unknown }).message)
                  : 'PayPal error'
              onPaypalError(msg)
            }}
          />
        </div>
      )}
      {checkoutPayMethod === 'paypal' && !payPalEnabled && (
        <p className="text-center text-sm text-neutral-500">PayPal is not configured.</p>
      )}
    </div>
  )
}
