import type { Metadata } from 'next'
import Link from 'next/link'
import SuccessClient from '@/components/CheckoutSuccessClient'

export const metadata: Metadata = {
  title: 'Order confirmed | VitaliTea',
  description: 'Thank you for your order',
}

export default function CheckoutSuccessPage() {
  return <SuccessClient />
}
