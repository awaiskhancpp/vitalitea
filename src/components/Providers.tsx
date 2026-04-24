'use client'
import { CartProvider } from '@/contexts/CartContext'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
