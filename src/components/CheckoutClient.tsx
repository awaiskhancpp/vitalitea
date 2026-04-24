'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useCart } from '@/contexts/CartContext'

const PK_STATES: { value: string; label: string }[] = [
  { value: '', label: 'State' },
  { value: 'Punjab', label: 'Punjab' },
  { value: 'Sindh', label: 'Sindh' },
  { value: 'Balochistan', label: 'Balochistan' },
  { value: 'KPK', label: 'KPK' },
  { value: 'Azad Kashmir', label: 'Azad Kashmir' },
]

const inputClass =
  "w-full rounded-lg border border-[#D1C9BE] bg-white px-3.5 py-2.5 font-['Host_Grotesk'] text-sm text-[#3B3B3B] shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-neutral-400 focus:border-[#627E5C] focus:ring-2 focus:ring-[#627E5C]/20"
const labelClass = "mb-1.5 block font-['Host_Grotesk'] text-sm font-semibold text-[#3B3B3B]"

type ShippingMethod = 'free' | 'express'

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

/** Trimmed non-empty */
const req = (v: string) => (v && v.trim().length > 0 ? v.trim() : '')

const FIELD_SCROLL_ORDER = [
  'email',
  'firstName',
  'lastName',
  'address',
  'city',
  'state',
  'zip',
  'phone',
  'billFirst',
  'billLast',
  'billAddress',
  'billCity',
  'billState',
  'billZip',
] as const

function validateCheckoutFields(args: {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  sameAsShipping: boolean
  billFirst: string
  billLast: string
  billAddress: string
  billCity: string
  billState: string
  billZip: string
}): Record<string, string> {
  const e: Record<string, string> = {}
  if (!req(args.email)) e.email = 'Email is required'
  else if (!emailOk(args.email)) e.email = 'Enter a valid email address'
  if (!req(args.firstName)) e.firstName = 'First name is required'
  if (!req(args.lastName)) e.lastName = 'Last name is required'
  if (!req(args.address)) e.address = 'Address is required'
  if (!req(args.city)) e.city = 'City is required'
  if (!args.state || !args.state.trim()) e.state = 'Select a state'
  if (!req(args.zip)) e.zip = 'ZIP code is required'
  if (!req(args.phone)) e.phone = 'Phone number is required'
  if (!args.sameAsShipping) {
    if (!req(args.billFirst)) e.billFirst = 'First name is required'
    if (!req(args.billLast)) e.billLast = 'Last name is required'
    if (!req(args.billAddress)) e.billAddress = 'Address is required'
    if (!req(args.billCity)) e.billCity = 'City is required'
    if (!args.billState || !args.billState.trim()) e.billState = 'Select a state'
    if (!req(args.billZip)) e.billZip = 'ZIP code is required'
  }
  return e
}

function fieldClass(base: string, hasError: boolean) {
  return hasError
    ? `${base} border-red-500 focus:border-red-500 focus:ring-red-200/50`
    : base
}

function InputError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={`err-${id}`} className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  )
}

export default function CheckoutClient() {
  const router = useRouter()
  const { items, ready, subtotal, itemCount, clear } = useCart()

  const [email, setEmail] = useState('')
  const [newsletter, setNewsletter] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('Pk')
  const [phone, setPhone] = useState('')
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [billFirst, setBillFirst] = useState('')
  const [billLast, setBillLast] = useState('')
  const [billAddress, setBillAddress] = useState('')
  const [billCity, setBillCity] = useState('')
  const [billState, setBillState] = useState('')
  const [billZip, setBillZip] = useState('')
  const [billCountry, setBillCountry] = useState('Pk')
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('free')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const clearFieldError = useCallback((key: string) => {
    setFieldErrors((p) => {
      if (!p[key]) return p
      const n = { ...p }
      delete n[key]
      return n
    })
  }, [])

  useEffect(() => {
    if (ready && itemCount === 0 && !submitted) {
      router.replace('/bag')
    }
  }, [ready, itemCount, router, submitted])

  const shippingCost = useMemo(() => (shippingMethod === 'express' ? 15 : 0), [shippingMethod])
  const orderTotal = subtotal + shippingCost

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const nextErrors = validateCheckoutFields({
        email,
        firstName,
        lastName,
        address,
        city,
        state,
        zip,
        phone,
        sameAsShipping,
        billFirst,
        billLast,
        billAddress,
        billCity,
        billState,
        billZip,
      })
      setFieldErrors(nextErrors)
      if (Object.keys(nextErrors).length > 0) {
        const firstId = FIELD_SCROLL_ORDER.find((k) => nextErrors[k])
        if (firstId && typeof document !== 'undefined') {
          window.requestAnimationFrame(() => {
            document.getElementById(firstId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            ;(document.getElementById(firstId) as HTMLInputElement | HTMLSelectElement | null)?.focus?.()
          })
        }
        return
      }
      setSubmitting(true)
      window.setTimeout(() => {
        setSubmitting(false)
        clear()
        setSubmitted(true)
        setFieldErrors({})
      }, 800)
    },
    [
      clear,
      email,
      firstName,
      lastName,
      address,
      city,
      state,
      zip,
      phone,
      sameAsShipping,
      billFirst,
      billLast,
      billAddress,
      billCity,
      billState,
      billZip,
    ],
  )

  if (!ready) {
    return (
      <div className="min-h-[50vh] w-full bg-[#F5F1E8] px-4 py-20 sm:px-6">
        <p className="text-center font-['Host_Grotesk'] text-neutral-500">Loading checkout…</p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen w-full bg-[#F5F1E8] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-[#D1C9BE] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#627E5C]/12 text-[#627E5C]">
            <CheckIcon className="h-8 w-8" />
          </div>
          <h1 className="mt-5 font-['Cormorant_Garamond'] text-3xl font-bold text-[#3B3B3B]">
            Your order has been placed
          </h1>
          <p className="mt-2 font-['Host_Grotesk'] text-sm font-medium text-[#4a6b45]">
            We&rsquo;ll send a confirmation to your email shortly.
          </p>
          <p className="mt-3 font-['Host_Grotesk'] text-sm leading-relaxed text-neutral-600">
            This is a demo store — no payment was processed. In production, your payment and order
            would be sent to your backend.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#627E5C] font-['Host_Grotesk'] text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  if (itemCount === 0) {
    return null
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F1E8]">
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

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <form onSubmit={onSubmit} className="min-w-0 space-y-10 lg:col-span-7" noValidate>
            <h1 className="font-['Cormorant_Garamond'] text-[clamp(1.75rem,4vw,2.25rem)] font-bold text-[#3B3B3B]">
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

            <section className="space-y-4">
              <h2 className="border-b border-[#E5E0D8] pb-2 font-['Host_Grotesk'] text-base font-bold text-[#3B3B3B]">
                Contact
              </h2>
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email address <span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clearFieldError('email')
                  }}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'err-email' : undefined}
                  className={fieldClass(inputClass, !!fieldErrors.email)}
                />
                <InputError id="email" message={fieldErrors.email} />
              </div>
              {/* <label className="flex cursor-pointer items-start gap-3 font-['Host_Grotesk'] text-sm text-[#3B3B3B]">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#D1C9BE] text-[#627E5C] focus:ring-[#627E5C]/30"
                />
                <span>Subscribe to our newsletter for tips and exclusive offers</span>
              </label> */}
            </section>

            <section className="space-y-4">
              <h2 className="border-b border-[#E5E0D8] pb-2 font-['Host_Grotesk'] text-base font-bold text-[#3B3B3B]">
                Shipping address
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className={labelClass}>
                    First name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    autoComplete="shipping given-name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value)
                      clearFieldError('firstName')
                    }}
                    aria-invalid={!!fieldErrors.firstName}
                    aria-describedby={fieldErrors.firstName ? 'err-firstName' : undefined}
                    className={fieldClass(inputClass, !!fieldErrors.firstName)}
                  />
                <InputError id="firstName" message={fieldErrors.firstName} />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClass}>
                    Last name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    autoComplete="shipping family-name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value)
                      clearFieldError('lastName')
                    }}
                    aria-invalid={!!fieldErrors.lastName}
                    aria-describedby={fieldErrors.lastName ? 'err-lastName' : undefined}
                    className={fieldClass(inputClass, !!fieldErrors.lastName)}
                  />
                  <InputError id="lastName" message={fieldErrors.lastName} />
                </div>
              </div>
              <div>
                <label htmlFor="address" className={labelClass}>
                  Address <span className="text-red-600">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  autoComplete="shipping address-line1"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value)
                    clearFieldError('address')
                  }}
                  aria-invalid={!!fieldErrors.address}
                  aria-describedby={fieldErrors.address ? 'err-address' : undefined}
                  className={fieldClass(inputClass, !!fieldErrors.address)}
                />
                <InputError id="address" message={fieldErrors.address} />
              </div>
              <div>
                <label htmlFor="address2" className={labelClass}>
                  Apartment, suite, etc.{' '}
                  <span className="font-normal text-neutral-500">(optional)</span>
                </label>
                <input
                  id="address2"
                  name="address2"
                  autoComplete="shipping address-line2"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <label htmlFor="city" className={labelClass}>
                    City <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    autoComplete="shipping address-level2"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value)
                      clearFieldError('city')
                    }}
                    aria-invalid={!!fieldErrors.city}
                    aria-describedby={fieldErrors.city ? 'err-city' : undefined}
                    className={fieldClass(inputClass, !!fieldErrors.city)}
                  />
                  <InputError id="city" message={fieldErrors.city} />
                </div>
                <div>
                  <label htmlFor="state" className={labelClass}>
                    State <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value)
                      clearFieldError('state')
                    }}
                    aria-invalid={!!fieldErrors.state}
                    aria-describedby={fieldErrors.state ? 'err-state' : undefined}
                    className={fieldClass(inputClass, !!fieldErrors.state)}
                  >
                    {PK_STATES.map((s) => (
                      <option
                        key={s.value || 'state-placeholder'}
                        value={s.value}
                        disabled={s.value === ''}
                      >
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <InputError id="state" message={fieldErrors.state} />
                </div>
                <div>
                  <label htmlFor="zip" className={labelClass}>
                    ZIP <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="zip"
                    name="zip"
                    autoComplete="shipping postal-code"
                    value={zip}
                    onChange={(e) => {
                      setZip(e.target.value)
                      clearFieldError('zip')
                    }}
                    aria-invalid={!!fieldErrors.zip}
                    aria-describedby={fieldErrors.zip ? 'err-zip' : undefined}
                    className={fieldClass(inputClass, !!fieldErrors.zip)}
                  />
                  <InputError id="zip" message={fieldErrors.zip} />
                </div>
              </div>
              <div>
                <label htmlFor="country" className={labelClass}>
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  autoComplete="shipping country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={inputClass}
                >
                  <option value="Pk">Pakistan</option>
                </select>
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone <span className="text-red-600">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    clearFieldError('phone')
                  }}
                  aria-invalid={!!fieldErrors.phone}
                  aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
                  className={fieldClass(inputClass, !!fieldErrors.phone)}
                />
                <InputError id="phone" message={fieldErrors.phone} />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="border-b border-[#E5E0D8] pb-2 font-['Host_Grotesk'] text-base font-bold text-[#3B3B3B]">
                Billing address
              </h2>
              <label className="flex cursor-pointer items-start gap-3 font-['Host_Grotesk'] text-sm text-[#3B3B3B]">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => {
                    setSameAsShipping(e.target.checked)
                    if (e.target.checked) {
                      setFieldErrors((p) => {
                        const n = { ...p }
                        ;['billFirst', 'billLast', 'billAddress', 'billCity', 'billState', 'billZip'].forEach(
                          (k) => delete n[k],
                        )
                        return n
                      })
                    }
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-[#D1C9BE] text-[#627E5C] focus:ring-[#627E5C]/30"
                />
                <span>Same as shipping address</span>
              </label>
              {!sameAsShipping && (
                <div className="space-y-4 rounded-lg border border-[#E5E0D8] bg-white/50 p-4 sm:p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="billFirst" className={labelClass}>
                        First name <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="billFirst"
                        value={billFirst}
                        onChange={(e) => {
                          setBillFirst(e.target.value)
                          clearFieldError('billFirst')
                        }}
                        aria-invalid={!!fieldErrors.billFirst}
                        aria-describedby={fieldErrors.billFirst ? 'err-billFirst' : undefined}
                        className={fieldClass(inputClass, !!fieldErrors.billFirst)}
                      />
                      <InputError id="billFirst" message={fieldErrors.billFirst} />
                    </div>
                    <div>
                      <label htmlFor="billLast" className={labelClass}>
                        Last name <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="billLast"
                        value={billLast}
                        onChange={(e) => {
                          setBillLast(e.target.value)
                          clearFieldError('billLast')
                        }}
                        aria-invalid={!!fieldErrors.billLast}
                        aria-describedby={fieldErrors.billLast ? 'err-billLast' : undefined}
                        className={fieldClass(inputClass, !!fieldErrors.billLast)}
                      />
                      <InputError id="billLast" message={fieldErrors.billLast} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="billAddress" className={labelClass}>
                      Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="billAddress"
                      value={billAddress}
                      onChange={(e) => {
                        setBillAddress(e.target.value)
                        clearFieldError('billAddress')
                      }}
                      aria-invalid={!!fieldErrors.billAddress}
                      aria-describedby={fieldErrors.billAddress ? 'err-billAddress' : undefined}
                      className={fieldClass(inputClass, !!fieldErrors.billAddress)}
                    />
                    <InputError id="billAddress" message={fieldErrors.billAddress} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="billCity" className={labelClass}>
                        City <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="billCity"
                        value={billCity}
                        onChange={(e) => {
                          setBillCity(e.target.value)
                          clearFieldError('billCity')
                        }}
                        aria-invalid={!!fieldErrors.billCity}
                        aria-describedby={fieldErrors.billCity ? 'err-billCity' : undefined}
                        className={fieldClass(inputClass, !!fieldErrors.billCity)}
                      />
                      <InputError id="billCity" message={fieldErrors.billCity} />
                    </div>
                    <div>
                      <label htmlFor="billState" className={labelClass}>
                        State <span className="text-red-600">*</span>
                      </label>
                      <select
                        id="billState"
                        value={billState}
                        onChange={(e) => {
                          setBillState(e.target.value)
                          clearFieldError('billState')
                        }}
                        aria-invalid={!!fieldErrors.billState}
                        aria-describedby={fieldErrors.billState ? 'err-billState' : undefined}
                        className={fieldClass(inputClass, !!fieldErrors.billState)}
                      >
                        {PK_STATES.map((s) => (
                          <option
                            key={`bill-${s.value || 'p'}`}
                            value={s.value}
                            disabled={s.value === ''}
                          >
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <InputError id="billState" message={fieldErrors.billState} />
                    </div>
                    <div>
                      <label htmlFor="billZip" className={labelClass}>
                        ZIP <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="billZip"
                        value={billZip}
                        onChange={(e) => {
                          setBillZip(e.target.value)
                          clearFieldError('billZip')
                        }}
                        aria-invalid={!!fieldErrors.billZip}
                        aria-describedby={fieldErrors.billZip ? 'err-billZip' : undefined}
                        className={fieldClass(inputClass, !!fieldErrors.billZip)}
                      />
                      <InputError id="billZip" message={fieldErrors.billZip} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="billCountry" className={labelClass}>
                      Country
                    </label>
                    <select
                      id="billCountry"
                      value={billCountry}
                      onChange={(e) => setBillCountry(e.target.value)}
                      className={inputClass}
                    >
                      <option value="Pk">Pakistan</option>
                    </select>
                  </div>
                </div>
              )}
            </section>

            <section className="space-y-4">
              <h2 className="border-b border-[#E5E0D8] pb-2 font-['Host_Grotesk'] text-base font-bold text-[#3B3B3B]">
                Shipping method
              </h2>
              <div className="space-y-3" role="radiogroup" aria-label="Shipping method">
                <label
                  className={`flex cursor-pointer items-start justify-between gap-4 rounded-xl border-2 p-4 transition-colors sm:items-center ${
                    shippingMethod === 'free'
                      ? 'border-[#3B3B3B] bg-white shadow-sm'
                      : 'border-[#D1C9BE] bg-white/80 hover:border-[#627E5C]/40'
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-3 sm:items-center">
                    <input
                      type="radio"
                      name="shipping"
                      className="mt-1 h-4 w-4 text-[#627E5C] focus:ring-[#627E5C]/30 sm:mt-0"
                      checked={shippingMethod === 'free'}
                      onChange={() => setShippingMethod('free')}
                    />
                    <div>
                      <p className="font-['Host_Grotesk'] text-sm font-semibold text-[#3B3B3B]">
                        Free shipping
                      </p>
                      <p className="mt-0.5 font-['Host_Grotesk'] text-xs text-neutral-500">
                        5–7 business days
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 font-['Martel_Sans'] text-sm font-semibold text-[#3B3B3B]">
                    FREE
                  </span>
                </label>
                <label
                  className={`flex cursor-pointer items-start justify-between gap-4 rounded-xl border-2 p-4 transition-colors sm:items-center ${
                    shippingMethod === 'express'
                      ? 'border-[#3B3B3B] bg-white shadow-sm'
                      : 'border-[#D1C9BE] bg-white/80 hover:border-[#627E5C]/40'
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-3 sm:items-center">
                    <input
                      type="radio"
                      name="shipping"
                      className="mt-1 h-4 w-4 text-[#627E5C] focus:ring-[#627E5C]/30 sm:mt-0"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                    />
                    <p className="font-['Host_Grotesk'] text-sm font-semibold text-[#3B3B3B]">
                      2-day express
                    </p>
                  </div>
                  <span className="shrink-0 font-['Martel_Sans'] text-sm font-semibold text-[#3B3B3B]">
                    $15.00
                  </span>
                </label>
              </div>
            </section>

            <div className="lg:hidden">
              <OrderSummaryBlock
                items={items}
                subtotal={subtotal}
                shippingCost={shippingCost}
                orderTotal={orderTotal}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#627E5C] font-['Host_Grotesk'] text-sm font-bold text-white transition-opacity enabled:hover:opacity-90 disabled:cursor-wait disabled:opacity-80"
              >
                {submitting && (
                  <span
                    className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    aria-hidden
                  />
                )}
                {submitting ? 'Placing order…' : 'Place order'}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-neutral-500">
                <LockIcon className="h-3.5 w-3.5 text-[#627E5C]" />
                <span className="font-['Host_Grotesk']">Secure checkout (demo — no charge)</span>
              </p>
            </div>
          </form>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="lg:sticky lg:top-28">
              <OrderSummaryBlock
                items={items}
                subtotal={subtotal}
                shippingCost={shippingCost}
                orderTotal={orderTotal}
                isSidebar
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderSummaryBlock({
  items,
  subtotal,
  shippingCost,
  orderTotal,
  isSidebar,
}: {
  items: {
    id: string
    name: string
    price: number
    quantity: number
    imageUrl: string
    imageAlt: string
  }[]
  subtotal: number
  shippingCost: number
  orderTotal: number
  isSidebar?: boolean
}) {
  return (
    <aside
      className={`rounded-2xl border border-[#D1C9BE] bg-white p-5 sm:p-6 ${isSidebar ? 'shadow-sm' : ''}`}
    >
      <h2 className="border-b border-[#E5E0D8] pb-3 font-['Host_Grotesk'] text-lg font-bold text-[#3B3B3B]">
        Order summary
      </h2>
      <ul className="mt-4 max-h-[min(50vh,28rem)] space-y-4 overflow-y-auto pr-1">
        {items.map((line) => (
          <li
            key={line.id}
            className="overflow-hidden rounded-xl border border-[#627E5C]/15 bg-[#EEF3EC] p-3 sm:p-4"
          >
            <div className="flex gap-3 sm:gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white/60 bg-[#e8e4dd] sm:h-24 sm:w-24">
                <Image
                  src={line.imageUrl}
                  alt={line.imageAlt}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-['Host_Grotesk'] text-sm font-semibold leading-tight text-[#3B3B3B] sm:text-base">
                  {line.name}
                </h3>
                <p className="mt-1 font-['Host_Grotesk'] text-xs text-neutral-500">
                  ${line.price.toFixed(2)} each · Qty {line.quantity}
                </p>
                <p className="mt-2 font-['Martel_Sans'] text-sm font-semibold text-[#3B3B3B]">
                  ${(line.price * line.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-5 space-y-2.5 border-t border-[#E5E0D8] pt-4">
        <div className="flex items-center justify-between font-['Host_Grotesk'] text-sm text-[#3B3B3B]">
          <span>Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between font-['Host_Grotesk'] text-sm text-[#3B3B3B]">
          <span>Shipping</span>
          <span className="font-semibold">
            {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-[#E5E0D8] pt-2 font-['Host_Grotesk'] text-base font-bold text-[#3B3B3B]">
          <span>Total</span>
          <span className="font-['Martel_Sans']">${orderTotal.toFixed(2)}</span>
        </div>
      </div>
    </aside>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function ChevronBack({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15a2 2 0 100-4 2 2 0 000 4zM5 9h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2zM8 7V5a4 4 0 118 0v2"
      />
    </svg>
  )
}
