import type { ValidateCheckoutInput } from './types'
import { isPhoneValidForCountry, PHONE_ERROR_US_CA } from './phoneForCountry'

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
const req = (v: string) => (v && v.trim().length > 0 ? v.trim() : '')

export function validateCheckoutFields(
  args: ValidateCheckoutInput,
): Record<string, string> {
  const e: Record<string, string> = {}
  if (!req(args.email)) e.email = 'Email is required'
  else if (!emailOk(args.email)) e.email = 'Enter a valid email address'
  if (!req(args.firstName)) e.firstName = 'First name is required'
  if (!req(args.lastName)) e.lastName = 'Last name is required'
  if (!req(args.address)) e.address = 'Address is required'
  if (!req(args.city)) e.city = 'City is required'
  if (!args.state || !args.state.trim()) e.state = 'State / province is required'
  if (!req(args.zip)) e.zip = 'ZIP or postal code is required'
  if (!req(args.phone)) e.phone = 'Phone number is required'
  else if (!isPhoneValidForCountry(args.phone, args.shippingCountry)) {
    e.phone = PHONE_ERROR_US_CA
  }
  if (!args.shippingRegionId) e.country = 'Select a country to set shipping'
  if (!args.sameAsShipping) {
    if (!req(args.billFirst)) e.billFirst = 'First name is required'
    if (!req(args.billLast)) e.billLast = 'Last name is required'
    if (!req(args.billAddress)) e.billAddress = 'Address is required'
    if (!req(args.billCity)) e.billCity = 'City is required'
    if (!args.billState || !args.billState.trim()) e.billState = 'State / province is required'
    if (!req(args.billZip)) e.billZip = 'ZIP code is required'
  }
  return e
}
