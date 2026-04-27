'use client'
import { CartProvider } from '@/contexts/CartContext'
import CartDrawer from '@/components/CartDrawer'
import AddToBagToast from '@/components/AddToBagToast'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <AddToBagToast />
    </CartProvider>
  )
}
