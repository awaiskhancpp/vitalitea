import { describe, expect, it } from 'vitest'
import { PHONE_ERROR_US_CA } from '@/lib/checkout/phoneForCountry'
import { validateCheckoutFields } from '@/lib/checkout/validate'

const base = {
  email: 'a@b.com',
  firstName: 'A',
  lastName: 'B',
  address: '1 St',
  city: 'C',
  state: 'S',
  zip: '12345',
  shippingCountry: 'US',
  phone: '4155550199',
  sameAsShipping: true,
  billFirst: '',
  billLast: '',
  billAddress: '',
  billCity: '',
  billState: '',
  billZip: '',
  shippingRegionId: '1',
}

describe('validateCheckoutFields', () => {
  it('returns empty when all required shipping fields and region are set', () => {
    const e = validateCheckoutFields(base)
    expect(Object.keys(e)).toHaveLength(0)
  })

  it('flags missing email', () => {
    const e = validateCheckoutFields({ ...base, email: '' })
    expect(e.email).toBeDefined()
  })

  it('validates billing when not same as shipping', () => {
    const e = validateCheckoutFields({
      ...base,
      sameAsShipping: false,
      billFirst: 'X',
      billLast: 'Y',
      billAddress: 'Z',
      billCity: 'C',
      billState: 'S',
      billZip: '1',
    })
    expect(Object.keys(e)).toHaveLength(0)
  })

  it('requires billing fields when not same as shipping', () => {
    const e = validateCheckoutFields({ ...base, sameAsShipping: false })
    expect(e.billFirst).toBeDefined()
    expect(e.billZip).toBeDefined()
  })

  it('rejects non-NANP country codes such as +92 when US shipping', () => {
    const e = validateCheckoutFields({
      ...base,
      phone: '+92 300 1234567',
    })
    expect(e.phone).toBe(PHONE_ERROR_US_CA)
  })

  it('accepts +1 formatted numbers for US', () => {
    const e = validateCheckoutFields({
      ...base,
      phone: '+1 (415) 555-0199',
    })
    expect(e.phone).toBeUndefined()
  })
})
