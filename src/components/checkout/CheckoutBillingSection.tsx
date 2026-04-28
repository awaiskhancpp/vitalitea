'use client'

import type { Dispatch, SetStateAction } from 'react'
import {
  fieldClass,
  inputClass,
  labelClass,
  selectClass,
} from '@/components/checkout/form-classes'
import { CityAutocompleteField } from '@/components/checkout/CityAutocompleteField'
import { InputError } from '@/components/checkout/InputError'
import type { GeoapifyCitySuggestion } from '@/lib/geoapify/autocomplete'

type FieldErrors = Record<string, string | undefined>

export function CheckoutBillingSection({
  sameAsShipping,
  setSameAsShipping,
  setFieldErrors,
  billFirst,
  setBillFirst,
  billLast,
  setBillLast,
  billAddress,
  setBillAddress,
  billCity,
  setBillCity,
  billState,
  setBillState,
  billZip,
  setBillZip,
  billCountry,
  setBillCountry,
  fieldErrors,
  clearFieldError,
}: {
  sameAsShipping: boolean
  setSameAsShipping: (v: boolean) => void
  setFieldErrors: Dispatch<SetStateAction<Record<string, string>>>
  billFirst: string
  setBillFirst: (v: string) => void
  billLast: string
  setBillLast: (v: string) => void
  billAddress: string
  setBillAddress: (v: string) => void
  billCity: string
  setBillCity: (v: string) => void
  billState: string
  setBillState: (v: string) => void
  billZip: string
  setBillZip: (v: string) => void
  billCountry: string
  setBillCountry: (v: string) => void
  fieldErrors: FieldErrors
  clearFieldError: (k: string) => void
}) {
  const onBillingGeoPick = (s: GeoapifyCitySuggestion) => {
    if (s.state != null && s.state !== '') {
      setBillState(String(s.state))
      clearFieldError('billState')
    }
    if (s.postcode != null && s.postcode !== '') {
      setBillZip(String(s.postcode))
      clearFieldError('billZip')
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="border-b border-neutral-200 pb-2 font-['Cormorant_Garamond'] text-lg font-bold text-neutral-900">
        Billing Address
      </h2>
      <label className="flex cursor-pointer items-start gap-3 font-['Host_Grotesk'] text-sm text-[#3B3B3B]">
        <input
          type="checkbox"
          checked={sameAsShipping}
          onChange={(e) => {
            setSameAsShipping(e.target.checked)
            if (e.target.checked) {
              setFieldErrors((p) => {
                const n = { ...p }
                ;['billFirst', 'billLast', 'billAddress', 'billCity', 'billState', 'billZip'].forEach(
                  (k) => delete n[k],
                )
                return n
              })
            }
          }}
          className="mt-0.5 h-4 w-4 rounded border-[#D1C9BE] text-[#627E5C] focus:ring-[#627E5C]/30"
        />
        <span>Same as shipping address</span>
      </label>
      {!sameAsShipping && (
        <div className="space-y-4 rounded-lg border border-[#E5E0D8] bg-white/50 p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="billFirst" className={labelClass}>
                First Name <span className="text-red-600">*</span>
              </label>
              <input
                id="billFirst"
                value={billFirst}
                onChange={(e) => {
                  setBillFirst(e.target.value)
                  clearFieldError('billFirst')
                }}
                aria-invalid={!!fieldErrors.billFirst}
                aria-describedby={fieldErrors.billFirst ? 'err-billFirst' : undefined}
                className={fieldClass(inputClass, !!fieldErrors.billFirst)}
              />
              <InputError id="billFirst" message={fieldErrors.billFirst} />
            </div>
            <div>
              <label htmlFor="billLast" className={labelClass}>
                Last Name <span className="text-red-600">*</span>
              </label>
              <input
                id="billLast"
                value={billLast}
                onChange={(e) => {
                  setBillLast(e.target.value)
                  clearFieldError('billLast')
                }}
                aria-invalid={!!fieldErrors.billLast}
                aria-describedby={fieldErrors.billLast ? 'err-billLast' : undefined}
                className={fieldClass(inputClass, !!fieldErrors.billLast)}
              />
              <InputError id="billLast" message={fieldErrors.billLast} />
            </div>
          </div>
          <div>
            <label htmlFor="billAddress" className={labelClass}>
              Address <span className="text-red-600">*</span>
            </label>
            <input
              id="billAddress"
              value={billAddress}
              onChange={(e) => {
                setBillAddress(e.target.value)
                clearFieldError('billAddress')
              }}
              aria-invalid={!!fieldErrors.billAddress}
              aria-describedby={fieldErrors.billAddress ? 'err-billAddress' : undefined}
              className={fieldClass(inputClass, !!fieldErrors.billAddress)}
            />
            <InputError id="billAddress" message={fieldErrors.billAddress} />
          </div>
          <div>
            <label htmlFor="billCountry" className={labelClass}>
              Country <span className="text-red-600">*</span>
            </label>
            <select
              id="billCountry"
              value={billCountry}
              onChange={(e) => {
                setBillCountry(e.target.value)
                clearFieldError('billCountry')
              }}
              className={selectClass}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="min-w-0 sm:col-span-1">
              <CityAutocompleteField
                validationFieldMarker="billing-city-checkout"
                name="billingCityDisplay"
                label={
                  <>
                    City <span className="text-red-600">*</span>
                  </>
                }
                value={billCity}
                onCityChange={setBillCity}
                checkoutCountryIso={billCountry}
                fieldErrorCity={fieldErrors.billCity}
                onClearFieldErrorCity={() => clearFieldError('billCity')}
                applySuggestionExtras={onBillingGeoPick}
                inputAutoComplete="billing address-level2"
              />
            </div>
            <div>
              <label htmlFor="billState" className={labelClass}>
                State/Province <span className="text-red-600">*</span>
              </label>
              <input
                id="billState"
                value={billState}
                onChange={(e) => {
                  setBillState(e.target.value)
                  clearFieldError('billState')
                }}
                aria-invalid={!!fieldErrors.billState}
                aria-describedby={fieldErrors.billState ? 'err-billState' : undefined}
                className={fieldClass(inputClass, !!fieldErrors.billState)}
              />
              <InputError id="billState" message={fieldErrors.billState} />
            </div>
            <div>
              <label htmlFor="billZip" className={labelClass}>
                ZIP <span className="text-red-600">*</span>
              </label>
              <input
                id="billZip"
                value={billZip}
                onChange={(e) => {
                  setBillZip(e.target.value)
                  clearFieldError('billZip')
                }}
                aria-invalid={!!fieldErrors.billZip}
                aria-describedby={fieldErrors.billZip ? 'err-billZip' : undefined}
                className={fieldClass(inputClass, !!fieldErrors.billZip)}
              />
              <InputError id="billZip" message={fieldErrors.billZip} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
