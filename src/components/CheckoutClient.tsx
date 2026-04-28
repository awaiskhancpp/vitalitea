'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useCart } from '@/contexts/CartContext'
import { useCheckoutQuote } from '@/hooks/useCheckoutQuote'
import { useShippingRegions } from '@/hooks/useShippingRegions'
import { FREE_SHIPPING_AT, SHIPPING_METHOD_BY_COUNTRY } from '@/lib/checkout/constants'
import { pickShippingRegionForCountry } from '@/lib/checkout/pickShippingRegion'
import {
  postOrderDraft,
  postPaypalCapture,
  postPaypalPrepare,
  postStripePaymentIntent,
} from '@/lib/checkout/api'
import { scrollToFirstError } from '@/lib/checkout/scrollToFirstError'
import { validateCheckoutFields } from '@/lib/checkout/validate'
import { ChevronBack } from '@/components/checkout/CheckoutIcons'
import { CheckoutBillingSection } from '@/components/checkout/CheckoutBillingSection'
import { CheckoutContactSection } from '@/components/checkout/CheckoutContactSection'
import { CheckoutFreeShippingCallout, CheckoutShippingMethodCard } from '@/components/checkout/CheckoutShippingMethodCard'
import { CheckoutPaymentSection } from '@/components/checkout/CheckoutPaymentSection'
import { CheckoutShippingSection } from '@/components/checkout/CheckoutShippingSection'
import { OrderSummaryBlock } from '@/components/checkout/OrderSummaryBlock'

const stripePub = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise =
  typeof stripePub === 'string' && stripePub.length > 0 ? loadStripe(stripePub) : null

export default function CheckoutClient() {
  const router = useRouter()
  const { items, ready, subtotal, itemCount } = useCart()
  const regions = useShippingRegions()

  const [email, setEmail] = useState('')
  const [newsletter, setNewsletter] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('US')
  const [phone, setPhone] = useState('')
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [billFirst, setBillFirst] = useState('')
  const [billLast, setBillLast] = useState('')
  const [billAddress, setBillAddress] = useState('')
  const [billCity, setBillCity] = useState('')
  const [billState, setBillState] = useState('')
  const [billZip, setBillZip] = useState('')
  const [billCountry, setBillCountry] = useState('US')
  const [shippingRegionId, setShippingRegionId] = useState('')
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [checkoutPayMethod, setCheckoutPayMethod] = useState<'card' | 'paypal'>('card')
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null)
  const [embedStripeOrderId, setEmbedStripeOrderId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [payError, setPayError] = useState<string | null>(null)
  const lastPaypalPayloadRef = useRef<{ orderId: string } | null>(null)
  const payPalEnabled = Boolean(
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  )

  const { quote, quoteError } = useCheckoutQuote({
    ready,
    items,
    shippingRegionId,
    appliedCoupon,
  })

  const clearFieldError = useCallback((key: string) => {
    setFieldErrors((p) => {
      if (!p[key]) return p
      const n = { ...p }
      delete n[key]
      return n
    })
  }, [])

  useEffect(() => {
    if (ready && itemCount === 0) {
      router.replace('/bag')
    }
  }, [ready, itemCount, router])

  useEffect(() => {
    if (!regions.length) return
    const match = pickShippingRegionForCountry(regions, country)
    setShippingRegionId(match ? match.id : '')
  }, [country, regions])

  useEffect(() => {
    if (sameAsShipping) setBillCountry(country)
  }, [sameAsShipping, country])

  const qSub = quote?.subtotal ?? subtotal
  const qDisc = quote?.discount ?? 0
  const qShip = quote?.shipping ?? 0
  const qTotal = quote?.total ?? subtotal
  const shipMethodCopy = SHIPPING_METHOD_BY_COUNTRY[country] ?? SHIPPING_METHOD_BY_COUNTRY.US

  const getValidationErrors = useCallback((): Record<string, string> => {
    return validateCheckoutFields({
      email,
      firstName,
      lastName,
      address,
      city,
      state,
      zip,
      shippingCountry: country,
      phone,
      sameAsShipping,
      billFirst,
      billLast,
      billAddress,
      billCity,
      billState,
      billZip,
      shippingRegionId,
    })
  }, [
    email,
    firstName,
    lastName,
    address,
    city,
    state,
    zip,
    country,
    phone,
    sameAsShipping,
    billFirst,
    billLast,
    billAddress,
    billCity,
    billState,
    billZip,
    shippingRegionId,
  ])

  const buildDraftBody = useCallback(
    (paymentMethod: 'stripe' | 'paypal') => ({
      items: items.map((i) => ({
        id: i.id,
        slug: i.slug,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        imageUrl: i.imageUrl,
        imageAlt: i.imageAlt,
      })),
      shippingRegionId,
      couponCode: appliedCoupon.trim() || null,
      paymentMethod,
      sameAsShipping,
      shippingAddress: {
        email,
        firstName,
        lastName,
        address,
        address2,
        city,
        state,
        zip,
        country,
        phone,
      },
      billingAddress: sameAsShipping
        ? undefined
        : {
            email,
            firstName: billFirst,
            lastName: billLast,
            address: billAddress,
            city: billCity,
            state: billState,
            zip: billZip,
            country: billCountry,
            phone,
          },
    }),
    [
      items,
      shippingRegionId,
      appliedCoupon,
      sameAsShipping,
      email,
      firstName,
      lastName,
      address,
      address2,
      city,
      state,
      zip,
      country,
      phone,
      billFirst,
      billLast,
      billAddress,
      billCity,
      billState,
      billZip,
      billCountry,
    ],
  )

  const clearStripeEmbed = useCallback(() => {
    setStripeClientSecret(null)
    setEmbedStripeOrderId(null)
  }, [])

  const prepareCardCheckout = useCallback(async () => {
    setPayError(null)
    const nextErrors = getValidationErrors()
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      scrollToFirstError(nextErrors)
      return
    }
    if (!stripePromise) {
      setPayError('Stripe is not configured. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your environment.')
      return
    }
    if (!quote) {
      setPayError('Please wait for your order total to load.')
      return
    }
    setSubmitting(true)
    try {
      const draft = await postOrderDraft(buildDraftBody('stripe'))
      if (!draft.ok) {
        setPayError(draft.error)
        return
      }
      const pi = await postStripePaymentIntent(draft.data.orderId)
      if (!pi.ok) {
        setPayError(pi.error)
        return
      }
      setEmbedStripeOrderId(draft.data.orderId)
      setStripeClientSecret(pi.data.clientSecret)
    } catch (e) {
      setPayError(e instanceof Error ? e.message : 'Payment failed to start')
    } finally {
      setSubmitting(false)
    }
  }, [getValidationErrors, buildDraftBody, quote, stripePromise])

  const startPaypalOrder = useCallback(async () => {
    setPayError(null)
    const nextErrors = getValidationErrors()
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      scrollToFirstError(nextErrors)
      throw new Error('validation')
    }
    const body = { ...buildDraftBody('paypal') } as Record<string, unknown>
    delete body.paymentMethod
    const res = await postPaypalPrepare(body)
    if (!res.ok) {
      setPayError(res.error)
      throw new Error('prepare')
    }
    lastPaypalPayloadRef.current = { orderId: res.data.orderId }
    return res.data.paypalOrderId
  }, [getValidationErrors, buildDraftBody])

  const onPaypalApprove = useCallback(
    async (data: { orderID: string }) => {
      const oid = lastPaypalPayloadRef.current?.orderId
      if (!oid) {
        setPayError('Session expired — try again')
        return
      }
      setSubmitting(true)
      try {
        const res = await postPaypalCapture(oid, data.orderID)
        if (!res.ok) {
          setPayError(res.error)
          return
        }
        router.push(`/checkout/success?orderId=${encodeURIComponent(oid)}`)
      } finally {
        setSubmitting(false)
      }
    },
    [router],
  )

  const onStripeSuccessNav = useCallback(() => {
    if (embedStripeOrderId) {
      router.push(`/checkout/success?orderId=${encodeURIComponent(embedStripeOrderId)}`)
    }
  }, [router, embedStripeOrderId])

  if (!ready) {
    return (
      <div className="min-h-[50vh] w-full bg-neutral-100 px-4 py-20 sm:px-6">
        <p className="text-center font-['Host_Grotesk'] text-neutral-500">Loading checkout…</p>
      </div>
    )
  }

  if (itemCount === 0) {
    return null
  }

  return (
    <div className="min-h-screen w-full bg-neutral-100 pt-20">
      <div className="mx-auto w-full max-w-[min(100%,100rem)] px-4 py-8 sm:px-6 sm:py-10 lg:px-[6.94%]">
        <div className="mb-8">
          <Link
            href="/bag"
            className="inline-flex items-center gap-1.5 font-['Host_Grotesk'] text-sm font-medium text-[#627E5C] transition-colors hover:text-[#4a6b45]"
          >
            <ChevronBack className="h-4 w-4" />
            Back to bag
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          <div className="min-w-0 space-y-8 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm sm:space-y-9 sm:p-6 lg:col-span-7 lg:p-8">
            <h1 className="font-['Cormorant_Garamond'] text-[clamp(1.75rem,4vw,2.25rem)] font-bold text-neutral-900">
              Checkout
            </h1>
            {Object.keys(fieldErrors).length > 0 && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-['Host_Grotesk'] text-sm text-red-800"
              >
                Please complete all required fields marked with * before placing your order.
              </div>
            )}

            <CheckoutContactSection
              email={email}
              setEmail={setEmail}
              newsletter={newsletter}
              setNewsletter={setNewsletter}
              fieldErrors={fieldErrors}
              clearFieldError={clearFieldError}
            />

            <CheckoutShippingSection
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              address={address}
              setAddress={setAddress}
              address2={address2}
              setAddress2={setAddress2}
              city={city}
              setCity={setCity}
              state={state}
              setState={setState}
              zip={zip}
              setZip={setZip}
              country={country}
              setCountry={setCountry}
              phone={phone}
              setPhone={setPhone}
              fieldErrors={fieldErrors}
              clearFieldError={clearFieldError}
            />

            <CheckoutBillingSection
              sameAsShipping={sameAsShipping}
              setSameAsShipping={setSameAsShipping}
              setFieldErrors={setFieldErrors}
              billFirst={billFirst}
              setBillFirst={setBillFirst}
              billLast={billLast}
              setBillLast={setBillLast}
              billAddress={billAddress}
              setBillAddress={setBillAddress}
              billCity={billCity}
              setBillCity={setBillCity}
              billState={billState}
              setBillState={setBillState}
              billZip={billZip}
              setBillZip={setBillZip}
              billCountry={billCountry}
              setBillCountry={setBillCountry}
              fieldErrors={fieldErrors}
              clearFieldError={clearFieldError}
            />

            <CheckoutShippingMethodCard
              title={shipMethodCopy.title}
              eta={shipMethodCopy.eta}
              priceLabel={qShip === 0 ? 'FREE' : `$${qShip.toFixed(2)}`}
            />

            <CheckoutFreeShippingCallout />

            <div className="lg:hidden">
              <OrderSummaryBlock
                items={items}
                subtotal={qSub}
                discount={qDisc}
                shippingCost={qShip}
                orderTotal={qTotal}
                freeShipAt={FREE_SHIPPING_AT}
                shippingHint={shipMethodCopy.summaryHint}
                couponInput={couponInput}
                onCouponInputChange={setCouponInput}
                onApplyCoupon={() => setAppliedCoupon(couponInput.trim().toUpperCase())}
                quoteError={quoteError}
                isSidebar={false}
              />
            </div>

            {payError && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-['Host_Grotesk'] text-sm text-red-800"
              >
                {payError}
              </div>
            )}

            <CheckoutPaymentSection
              checkoutPayMethod={checkoutPayMethod}
              setCheckoutPayMethod={setCheckoutPayMethod}
              clearStripeEmbed={clearStripeEmbed}
              stripePromise={stripePromise}
              stripeClientSecret={stripeClientSecret}
              embedStripeOrderId={embedStripeOrderId}
              qTotal={qTotal}
              quote={quote}
              submitting={submitting}
              prepareCardCheckout={prepareCardCheckout}
              payPalEnabled={payPalEnabled}
              startPaypalOrder={startPaypalOrder}
              onPaypalApprove={onPaypalApprove}
              onPaypalError={setPayError}
              onStripeSuccess={onStripeSuccessNav}
            />
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="lg:sticky lg:top-28">
              <OrderSummaryBlock
                items={items}
                subtotal={qSub}
                discount={qDisc}
                shippingCost={qShip}
                orderTotal={qTotal}
                freeShipAt={FREE_SHIPPING_AT}
                shippingHint={shipMethodCopy.summaryHint}
                couponInput={couponInput}
                onCouponInputChange={setCouponInput}
                onApplyCoupon={() => setAppliedCoupon(couponInput.trim().toUpperCase())}
                quoteError={quoteError}
                isSidebar
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
