'use client'
import type { Metadata } from 'next'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import CheckoutClient from '@/components/CheckoutClient'

const paypalId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''

export default function CheckoutPage() {
  if (paypalId) {
    return (
      <PayPalScriptProvider
        options={{ clientId: paypalId, currency: 'USD', intent: 'capture' }}
        deferLoading={false}
      >
        <CheckoutClient />
      </PayPalScriptProvider>
    )
  }
  return <CheckoutClient />
}
