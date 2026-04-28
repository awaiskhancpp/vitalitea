'use client'

import Link from 'next/link'
import { useState } from 'react'

function parseApiError(json: unknown): string {
  if (!json || typeof json !== 'object') return 'Request failed'
  const j = json as { message?: string; errors?: { message?: string }[] }
  if (Array.isArray(j.errors) && j.errors[0]?.message) return String(j.errors[0].message)
  if (typeof j.message === 'string') return j.message
  return 'Request failed'
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setPending(true)
    try {
      const res = await fetch('/api/customers/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim() }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok) {
        setError(parseApiError(json))
        return
      }
      setMessage('If an account exists for this email, you will receive reset instructions.')
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
            Forgot your password?
          </h1>
          <p
            className="mt-2 font-['Host_Grotesk'] text-[#737373]"
            style={{ fontSize: 'clamp(0.875rem,1.2vw,1rem)' }}
          >
            Enter your email address
          </p>
        </div>

        <div className="mt-10 rounded-3xl bg-white px-6 py-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] sm:px-8 sm:py-10">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label
                className="block font-['Martel_Sans'] text-sm font-semibold text-black"
                htmlFor="forgot-email"
              >
                Email Address
              </label>
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="Enter your email address"
                className="mt-2 w-full rounded-full border border-[#D4D4D4] px-5 py-3 font-['Host_Grotesk'] text-sm text-black outline-none placeholder:text-[#A3A3A3] focus:border-[#627E5C]"
              />
            </div>
            {error ? (
              <p className="font-['Host_Grotesk'] text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="font-['Host_Grotesk'] text-sm text-[#627E5C]" role="status">
                {message}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-[#627E5C] py-3.5 font-['Martel_Sans'] font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-70"
            >
              {pending ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
          <p className="mt-8 text-center font-['Martel_Sans'] text-sm text-black">
            <Link href="/login" className="underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
