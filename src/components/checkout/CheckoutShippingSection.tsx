'use client'

import {
  fieldClass,
  inputClass,
  labelClass,
  sectionFormHeadingClass,
  selectClass,
} from '@/components/checkout/form-classes'
import { CityAutocompleteField } from '@/components/checkout/CityAutocompleteField'
import { InputError } from '@/components/checkout/InputError'
import type { GeoapifyCitySuggestion } from '@/lib/geoapify/autocomplete'

type FieldErrors = Record<string, string | undefined>

export function CheckoutShippingSection({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  address,
  setAddress,
  address2,
  setAddress2,
  city,
  setCity,
  state,
  setState,
  zip,
  setZip,
  country,
  setCountry,
  phone,
  setPhone,
  fieldErrors,
  clearFieldError,
}: {
  firstName: string
  setFirstName: (v: string) => void
  lastName: string
  setLastName: (v: string) => void
  address: string
  setAddress: (v: string) => void
  address2: string
  setAddress2: (v: string) => void
  city: string
  setCity: (v: string) => void
  state: string
  setState: (v: string) => void
  zip: string
  setZip: (v: string) => void
  country: string
  setCountry: (v: string) => void
  phone: string
  setPhone: (v: string) => void
  fieldErrors: FieldErrors
  clearFieldError: (k: string) => void
}) {
  const onGeoPick = (s: GeoapifyCitySuggestion) => {
    if (s.state != null && s.state !== '') {
      setState(String(s.state))
      clearFieldError('state')
    }
    if (s.postcode != null && s.postcode !== '') {
      setZip(String(s.postcode))
      clearFieldError('zip')
    }
  }

  return (
    <section className="space-y-4">
      <h2 className={sectionFormHeadingClass}>Shipping Address</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First Name <span className="text-red-600">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            autoComplete="shipping given-name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value)
              clearFieldError('firstName')
            }}
            aria-invalid={!!fieldErrors.firstName}
            aria-describedby={fieldErrors.firstName ? 'err-firstName' : undefined}
            className={fieldClass(inputClass, !!fieldErrors.firstName)}
          />
          <InputError id="firstName" message={fieldErrors.firstName} />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last Name <span className="text-red-600">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            autoComplete="shipping family-name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value)
              clearFieldError('lastName')
            }}
            aria-invalid={!!fieldErrors.lastName}
            aria-describedby={fieldErrors.lastName ? 'err-lastName' : undefined}
            className={fieldClass(inputClass, !!fieldErrors.lastName)}
          />
          <InputError id="lastName" message={fieldErrors.lastName} />
        </div>
      </div>
      <div>
        <label htmlFor="address" className={labelClass}>
          Address <span className="text-red-600">*</span>
        </label>
        <input
          id="address"
          name="address"
          autoComplete="shipping address-line1"
          placeholder="123 Main Street"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value)
            clearFieldError('address')
          }}
          aria-invalid={!!fieldErrors.address}
          aria-describedby={fieldErrors.address ? 'err-address' : undefined}
          className={fieldClass(inputClass, !!fieldErrors.address)}
        />
        <InputError id="address" message={fieldErrors.address} />
      </div>
      <div>
        <label htmlFor="address2" className={labelClass}>
          Apartment, suite, etc. <span className="font-normal text-neutral-500">(Optional)</span>
        </label>
        <input
          id="address2"
          name="address2"
          autoComplete="shipping address-line2"
          placeholder="Apt 4B"
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="country" className={labelClass}>
          Country <span className="text-red-600">*</span>
        </label>
        <select
          id="country"
          name="country"
          autoComplete="shipping country"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value)
            clearFieldError('country')
          }}
          className={fieldClass(selectClass, !!fieldErrors.country)}
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
        </select>
        <InputError id="country" message={fieldErrors.country} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="min-w-0 sm:col-span-1">
          <CityAutocompleteField
            validationFieldMarker="shipping-city-checkout"
            name="city"
            label={
              <>
                City <span className="text-red-600">*</span>
              </>
            }
            value={city}
            onCityChange={setCity}
            checkoutCountryIso={country}
            fieldErrorCity={fieldErrors.city}
            onClearFieldErrorCity={() => clearFieldError('city')}
            applySuggestionExtras={onGeoPick}
          />
        </div>
        <div>
          <label htmlFor="state" className={labelClass}>
            State/Province <span className="text-red-600">*</span>
          </label>
          <input
            id="state"
            name="state"
            autoComplete="shipping address-level1"
            value={state}
            onChange={(e) => {
              setState(e.target.value)
              clearFieldError('state')
            }}
            placeholder="State/Province"
            aria-invalid={!!fieldErrors.state}
            aria-describedby={fieldErrors.state ? 'err-state' : undefined}
            className={fieldClass(inputClass, !!fieldErrors.state)}
          />
          <InputError id="state" message={fieldErrors.state} />
        </div>
        <div>
          <label htmlFor="zip" className={labelClass}>
            Postal Code <span className="text-red-600">*</span>
          </label>
          <input
            id="zip"
            name="zip"
            autoComplete="shipping postal-code"
            value={zip}
            placeholder="Postal Code"
            onChange={(e) => {
              setZip(e.target.value)
              clearFieldError('zip')
            }}
            aria-invalid={!!fieldErrors.zip}
            aria-describedby={fieldErrors.zip ? 'err-zip' : undefined}
            className={fieldClass(inputClass, !!fieldErrors.zip)}
          />
          <InputError id="zip" message={fieldErrors.zip} />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone number <span className="text-red-600">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(555) 123-4567"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
            clearFieldError('phone')
          }}
          aria-invalid={!!fieldErrors.phone}
          aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
          className={fieldClass(inputClass, !!fieldErrors.phone)}
        />
        <InputError id="phone" message={fieldErrors.phone} />
      </div>
    </section>
  )
}
