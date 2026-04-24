'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'vitalitea-cart'

export type CartItem = {
  id: string
  slug: string
  name: string
  price: number
  imageUrl: string
  imageAlt: string
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  ready: boolean
  itemCount: number
  subtotal: number
  addItem: (line: Omit<CartItem, 'quantity'>) => void
  setQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clear: () => void
  /** Last add-to-bag for navbar confirmation; auto-clears after a few seconds */
  lastAddedName: string | null
  drawerOpen: boolean
  openCartDrawer: () => void
  closeCartDrawer: () => void
  toggleCartDrawer: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function loadFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (p): p is CartItem =>
        p &&
        typeof p === 'object' &&
        typeof (p as CartItem).id === 'string' &&
        typeof (p as CartItem).quantity === 'number',
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lastAddedName, setLastAddedName] = useState<string | null>(null)

  const openCartDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeCartDrawer = useCallback(() => setDrawerOpen(false), [])
  const toggleCartDrawer = useCallback(() => setDrawerOpen((o) => !o), [])

  useEffect(() => {
    setItems(loadFromStorage())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* ignore */
    }
  }, [items, ready])

  useEffect(() => {
    if (lastAddedName == null) return
    const t = setTimeout(() => setLastAddedName(null), 4500)
    return () => clearTimeout(t)
  }, [lastAddedName])

  const addItem = useCallback((line: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === line.id)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], quantity: next[i].quantity + 1 }
        return next
      }
      return [...prev, { ...line, quantity: 1 }]
    })
    setLastAddedName(line.name)
  }, [])

  const setQuantity = useCallback((id: string, quantity: number) => {
    const q = Math.max(0, Math.floor(quantity))
    setItems((prev) => {
      if (q === 0) return prev.filter((p) => p.id !== id)
      return prev.map((p) => (p.id === id ? { ...p, quantity: q } : p))
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const itemCount = useMemo(
    () => items.reduce((sum, p) => sum + p.quantity, 0),
    [items],
  )
  const subtotal = useMemo(
    () => items.reduce((sum, p) => sum + p.price * p.quantity, 0),
    [items],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      itemCount,
      subtotal,
      addItem,
      setQuantity,
      removeItem,
      clear,
      lastAddedName,
      drawerOpen,
      openCartDrawer,
      closeCartDrawer,
      toggleCartDrawer,
    }),
    [
      items,
      ready,
      itemCount,
      subtotal,
      addItem,
      setQuantity,
      removeItem,
      clear,
      lastAddedName,
      drawerOpen,
      openCartDrawer,
      closeCartDrawer,
      toggleCartDrawer,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
