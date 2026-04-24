import type { Metadata } from 'next'
import CheckoutClient from '@/components/CheckoutClient'

export const metadata: Metadata = {
  title: 'Checkout | VitaliTea',
  description: 'Complete your order',
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
