'use client'

import { fieldClass, inputClass, labelClass, sectionFormHeadingClass } from '@/components/checkout/form-classes'
import { InputError } from '@/components/checkout/InputError'

type FieldErrors = Record<string, string | undefined>

export function CheckoutContactSection({
  email,
  setEmail,
  newsletter,
  setNewsletter,
  fieldErrors,
  clearFieldError,
}: {
  email: string
  setEmail: (v: string) => void
  newsletter: boolean
  setNewsletter: (v: boolean) => void
  fieldErrors: FieldErrors
  clearFieldError: (k: string) => void
}) {
  return (
    <section className="space-y-4">
      <h2 className={sectionFormHeadingClass}>Contact Information</h2>
      <div>
        <label htmlFor="email" className={labelClass}>
          Email Address <span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            clearFieldError('email')
          }}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? 'err-email' : undefined}
          className={fieldClass(inputClass, !!fieldErrors.email)}
        />
        <InputError id="email" message={fieldErrors.email} />
      </div>
      <label className="flex cursor-pointer items-start gap-3 font-['Host_Grotesk'] text-sm text-neutral-800">
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-[#D1C9BE] text-[#627E5C] focus:ring-[#627E5C]/30"
        />
        <span>Subscribe to our newsletter for skincare tips and exclusive offers</span>
      </label>
    </section>
  )
}
