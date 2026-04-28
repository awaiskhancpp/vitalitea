'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import AuthSplitLine from '@/components/account/AuthSplitLine'

function meetsPasswordRules(pw: string): boolean {
  return pw.length >= 8 && /[A-Z]/.test(pw) && /\d/.test(pw)
}

function parseApiError(json: unknown): string {
  if (!json || typeof json !== 'object') return 'Could not create account'
  const j = json as { message?: string; errors?: { message?: string }[] }
  if (Array.isArray(j.errors) && j.errors[0]?.message) return String(j.errors[0].message)
  if (typeof j.message === 'string') return j.message
  return 'Could not create account'
}

export default function RegisterPage() {
  const router = useRouter()
  const { refresh } = useCustomerAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!meetsPasswordRules(password)) {
      setError('Password must have min 8 characters, one uppercase letter, and one number')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setPending(true)
    try {
      const body: Record<string, string> = {
        email: email.trim(),
        password,
        passwordConfirm: confirmPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      }
      if (phone.trim()) body.phone = phone.trim()

      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok) {
        setError(parseApiError(json))
        return
      }
      await refresh()
      router.replace('/account')
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
            Create Your Account
          </h1>
          <p
            className="mt-2 font-['Host_Grotesk'] text-[#737373]"
            style={{ fontSize: 'clamp(0.875rem,1.2vw,1rem)' }}
          >
            Start your personalized skincare journey today
          </p>
        </div>

        <div className="mt-10 rounded-3xl bg-white px-6 py-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] sm:px-8 sm:py-10">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label
                  className="block font-['Martel_Sans'] text-sm font-semibold text-black"
                  htmlFor="reg-first"
                >
                  First Name
                </label>
                <input
                  id="reg-first"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(ev) => setFirstName(ev.target.value)}
                  placeholder="First name"
                  className="mt-2 w-full rounded-full border border-[#D4D4D4] px-5 py-3 font-['Host_Grotesk'] text-sm text-black outline-none placeholder:text-[#A3A3A3] focus:border-[#627E5C]"
                />
              </div>
              <div className="sm:col-span-1">
                <label
                  className="block font-['Martel_Sans'] text-sm font-semibold text-black"
                  htmlFor="reg-last"
                >
                  Last Name
                </label>
                <input
                  id="reg-last"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(ev) => setLastName(ev.target.value)}
                  placeholder="Last name"
                  className="mt-2 w-full rounded-full border border-[#D4D4D4] px-5 py-3 font-['Host_Grotesk'] text-sm text-black outline-none placeholder:text-[#A3A3A3] focus:border-[#627E5C]"
                />
              </div>
            </div>

            <div>
              <label
                className="block font-['Martel_Sans'] text-sm font-semibold text-black"
                htmlFor="reg-email"
              >
                Email Address
              </label>
              <input
                id="reg-email"
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
                htmlFor="reg-phone"
              >
                Phone Number (optional)
              </label>
              <input
                id="reg-phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
                placeholder="Enter your phone number"
                className="mt-2 w-full rounded-full border border-[#D4D4D4] px-5 py-3 font-['Host_Grotesk'] text-sm text-black outline-none placeholder:text-[#A3A3A3] focus:border-[#627E5C]"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  className="block font-['Martel_Sans'] text-sm font-semibold text-black"
                  htmlFor="reg-pass"
                >
                  Password
                </label>
                <input
                  id="reg-pass"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  placeholder="Create password"
                  className="mt-2 w-full rounded-full border border-[#D4D4D4] px-5 py-3 font-['Host_Grotesk'] text-sm text-black outline-none placeholder:text-[#A3A3A3] focus:border-[#627E5C]"
                />
                <p className="mt-1 font-['Host_Grotesk'] text-[0.75rem] text-[#737373]">
                  Min 8 characters, 1 uppercase, 1 number
                </p>
              </div>
              <div>
                <label
                  className="block font-['Martel_Sans'] text-sm font-semibold text-black"
                  htmlFor="reg-confirm"
                >
                  Confirm Password
                </label>
                <input
                  id="reg-confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(ev) => setConfirmPassword(ev.target.value)}
                  placeholder="Confirm password"
                  className="mt-2 w-full rounded-full border border-[#D4D4D4] px-5 py-3 font-['Host_Grotesk'] text-sm text-black outline-none placeholder:text-[#A3A3A3] focus:border-[#627E5C]"
                />
              </div>
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
              {pending ? 'Creating…' : 'Create Account'}
            </button>
          </form>

          <AuthSplitLine>Already have an account?</AuthSplitLine>

          <p
            className="text-center font-['Martel_Sans'] text-sm text-black"
            style={{ lineHeight: 1.5 }}
          >
            <Link href="/login" className="font-semibold underline">
              Sign in here
            </Link>{' '}
            <span className="font-normal">to access your skincare products</span>
          </p>
        </div>
      </div>
    </div>
  )
}
