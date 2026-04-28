'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type SessionCustomer = {
  id: string | number
  email: string
  firstName?: string | null
  lastName?: string | null
}

function mapMeDoc(raw: Record<string, unknown>): SessionCustomer {
  const user = raw.user
  const u =
    typeof user === 'object' && user !== null
      ? (user as Record<string, unknown>)
      : typeof raw.email === 'string'
        ? raw
        : {}

  const id =
    typeof u.id === 'number' ? u.id : typeof u.id === 'string' ? u.id : ''

  const email =
    typeof u.email === 'string'
      ? u.email
      : typeof (u as { email?: unknown }).email === 'string'
        ? String((u as { email: string }).email)
        : ''

  return {
    id,
    email,
    firstName: typeof u.firstName === 'string' ? u.firstName : null,
    lastName: typeof u.lastName === 'string' ? u.lastName : null,
  }
}

type Ctx = {
  customer: SessionCustomer | null
  loading: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const CustomerAuthContext = createContext<Ctx | null>(null)

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<SessionCustomer | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/customers/me', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) {
        setCustomer(null)
        return
      }
      const doc = (await res.json()) as Record<string, unknown>
      const mapped = mapMeDoc(doc)
      const ok =
        typeof mapped.email === 'string' &&
        mapped.email.trim().length > 0 &&
        mapped.id !== '' &&
        mapped.id !== undefined &&
        mapped.id !== null

      setCustomer(ok ? mapped : null)
    } catch {
      setCustomer(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/customers/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      /* ignore */
    }
    setCustomer(null)
  }, [])

  const value = useMemo(
    () => ({ customer, loading, refresh, logout }),
    [customer, loading, refresh, logout],
  )

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>
}

export function useCustomerAuth() {
  const v = useContext(CustomerAuthContext)
  if (!v) throw new Error('CustomerAuthProvider is required')
  return v
}
