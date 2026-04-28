'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import AuthSplitLine from '@/components/account/AuthSplitLine'

function parseApiError(json: unknown): string {
  if (!json || typeof json !== 'object') return 'Sign in failed'
  const j = json as { message?: string; errors?: { message?: string }[] }
  if (Array.isArray(j.errors) && j.errors[0]?.message) return String(j.errors[0].message)
  if (typeof j.message === 'string') return j.message
  return 'Sign in failed'
}

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const { refresh } = useCustomerAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      const res = await fetch('/api/customers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok) {
        setError(parseApiError(json))
        return
      }
      await refresh()
      const dest = next.startsWith('/') ? next : '/'
      router.replace(dest)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] w-full bg-white pt-28 pb-20">
      <div className="mx-auto w-full max-w-md px-6">
        <div className="text-center">
          <h1
            className="font-['Cormorant_Garamond'] font-bold text-black"
            style={{ fontSize: 'clamp(1.75rem,4vw,2.25rem)' }}
          >
            Welcome Back
          </h1>
          <p
            className="mt-2 font-['Host_Grotesk'] text-[#737373]"
            style={{ fontSize: 'clamp(0.875rem,1.2vw,1rem)' }}
          >
            Sign in to continue your skincare journey
          </p>
        </div>

        <div className="mt-10 rounded-3xl bg-white px-6 py-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] sm:px-8 sm:py-10">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label
                className="block font-['Martel_Sans'] text-sm font-semibold text-black"
                htmlFor="login-email"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="Enter your email address"
                className="mt-2 w-full rounded-full border border-[#D4D4D4] px-5 py-3 font-['Host_Grotesk'] text-sm text-black outline-none placeholder:text-[#A3A3A3] focus:border-[#627E5C]"
              />
            </div>
            <div>
              <label
                className="block font-['Martel_Sans'] text-sm font-semibold text-black"
                htmlFor="login-password"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                placeholder="Enter your password"
                className="mt-2 w-full rounded-full border border-[#D4D4D4] px-5 py-3 font-['Host_Grotesk'] text-sm text-black outline-none placeholder:text-[#A3A3A3] focus:border-[#627E5C]"
              />
            </div>
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="font-['Martel_Sans'] text-sm font-normal text-black hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            {error ? (
              <p className="font-['Host_Grotesk'] text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-[#627E5C] py-3.5 font-['Martel_Sans'] font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-70"
              style={{ fontSize: 'clamp(0.9rem,1.1vw,1rem)' }}
            >
              {pending ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <AuthSplitLine>New to Vitali Tea?</AuthSplitLine>

          <p
            className="text-center font-['Martel_Sans'] text-sm text-black"
            style={{ lineHeight: 1.5 }}
          >
            <Link href="/register" className="font-semibold underline">
              Create your account
            </Link>{' '}
            <span className="font-normal">and unlock exclusive skincare benefits</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen w-full bg-white pt-28" aria-hidden />}
    >
      <LoginInner />
    </Suspense>
  )
}
