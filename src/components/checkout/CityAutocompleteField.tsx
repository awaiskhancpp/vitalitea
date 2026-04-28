'use client'

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { fieldClass, inputClass, labelClass } from '@/components/checkout/form-classes'
import { InputError } from '@/components/checkout/InputError'
import {
  enrichCitySuggestionPostcode,
  fetchGeoapifyCitySuggestions,
  type GeoapifyCitySuggestion,
} from '@/lib/geoapify/autocomplete'

type Props = {
  id?: string
  name?: string
  /** Unique ID prefix for accessibility & error linkage (e.g. `checkout-shipping-city`) */
  validationFieldMarker: string
  label: ReactNode
  value: string
  onCityChange: (next: string) => void
  /** From checkout `<select>` — `US` or `CA` */
  checkoutCountryIso: string
  fieldErrorCity?: string
  onClearFieldErrorCity?: () => void
  /** Populate state/ZIP once a row is tapped */
  applySuggestionExtras?: (suggestion: GeoapifyCitySuggestion) => void
  inputAutoComplete?: string
}

/**
 * Shipping/billing city: suggestions load via `/api/geoapify/city-autocomplete` (server uses
 * `GEOAPIFY_API_KEY`; `NEXT_PUBLIC_GEOAPIFY_API_KEY` is optional for direct client calls only).
 */
export function CityAutocompleteField({
  id,
  name,
  validationFieldMarker,
  label,
  value,
  onCityChange,
  checkoutCountryIso,
  fieldErrorCity,
  onClearFieldErrorCity,
  applySuggestionExtras,
  inputAutoComplete = 'shipping address-level2',
}: Props) {
  const hid = useId()
  const baseId = id ?? `${validationFieldMarker}-input-${hid}`
  const listboxId = `${baseId}-list`
  const errMsgElementId = `err-${validationFieldMarker}`

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<GeoapifyCitySuggestion[]>([])
  const abRef = useRef<AbortController | null>(null)
  const debRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const hasKey = true

  const syncRemote = useCallback(() => {
    if (!hasKey || value.trim().length < 2) {
      setRows([])
      setLoading(false)
      return
    }
    setLoading(true)
    abRef.current?.abort()
    const ac = new AbortController()
    abRef.current = ac
    void fetchGeoapifyCitySuggestions(value, checkoutCountryIso, ac.signal)
      .then((r) => {
        if (!ac.signal.aborted) setRows(r)
        if (!ac.signal.aborted) setLoading(false)
      })
      .catch(() => {
        if (!ac.signal.aborted) {
          setRows([])
          setLoading(false)
        }
      })
  }, [checkoutCountryIso, value, hasKey])

  useEffect(() => {
    if (!hasKey || value.trim().length < 2) {
      setRows([])
      setOpen(false)
      if (debRef.current != null) {
        clearTimeout(debRef.current)
        debRef.current = null
      }
    } else {
      if (debRef.current != null) {
        clearTimeout(debRef.current)
        debRef.current = null
      }
      debRef.current = setTimeout(() => {
        void syncRemote()
        setOpen(true)
      }, 350)
    }
    return () => {
      if (debRef.current != null) {
        clearTimeout(debRef.current)
        debRef.current = null
      }
    }
  }, [checkoutCountryIso, value, hasKey, syncRemote])

  useEffect(() => {
    setRows([])
    setOpen(false)
  }, [checkoutCountryIso])

  const pickRow = useCallback(
    async (suggestion: GeoapifyCitySuggestion) => {
      onCityChange(suggestion.city)
      onClearFieldErrorCity?.()
      const enriched = await enrichCitySuggestionPostcode(suggestion)
      applySuggestionExtras?.(enriched)
      setRows([])
      setOpen(false)
    },
    [onCityChange, onClearFieldErrorCity, applySuggestionExtras],
  )

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const err = !!fieldErrorCity

  return (
    <div ref={wrapRef} className="relative min-w-0">
      <label htmlFor={baseId} className={labelClass}>
        {label}
      </label>
      <div className="relative mt-[2px]">
        <input
          id={baseId}
          name={name}
          type="text"
          autoComplete={inputAutoComplete}
          aria-invalid={err}
          aria-describedby={err ? errMsgElementId : undefined}
          aria-autocomplete={hasKey ? 'list' : undefined}
          aria-expanded={hasKey ? open && rows.length > 0 : undefined}
          aria-controls={hasKey && rows.length ? listboxId : undefined}
          value={value}
          onChange={(e) => {
            onCityChange(e.target.value)
            onClearFieldErrorCity?.()
            if (hasKey && e.target.value.trim().length >= 2) setOpen(true)
          }}
          className={fieldClass(inputClass, err)}
        />
        {loading && hasKey && (
          <div
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-[#627E5C]/20 border-t-[#627E5C]"
            aria-hidden
          />
        )}
      </div>
      {hasKey && open && rows.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-[60] mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {rows.map((suggestion, idx) => (
            <li key={`${idx}-${suggestion.label}`} role="option">
              <button
                type="button"
                className="w-full px-3 py-2 text-left font-['Host_Grotesk'] text-sm text-neutral-900 hover:bg-[#627E5C]/10"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pickRow(suggestion)}
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      <InputError id={validationFieldMarker} message={fieldErrorCity} />
    </div>
  )
}
