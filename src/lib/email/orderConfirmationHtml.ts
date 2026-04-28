function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatMoney(n: number): string {
  return `$${Number(n).toFixed(2)}`
}

type Addr = Record<string, unknown>

function shippingLines(addr: Addr | undefined): string[] {
  if (!addr || typeof addr !== 'object') return []
  const o = addr as Addr
  const name = `${String(o.firstName ?? '').trim()} ${String(o.lastName ?? '').trim()}`.trim()
  const rows: string[] = []
  if (name) rows.push(name)
  const a1 = typeof o.address === 'string' ? o.address : ''
  if (a1) rows.push(a1)
  const a2 = typeof o.address2 === 'string' ? o.address2.trim() : ''
  if (a2) rows.push(a2)
  const cityRow = [
    typeof o.city === 'string' ? o.city.trim() : '',
    typeof o.state === 'string' ? o.state.trim() : '',
    typeof o.zip === 'string' ? o.zip.trim() : '',
  ]
    .filter(Boolean)
    .join(', ')
  if (cityRow) rows.push(cityRow)
  const ct = typeof o.country === 'string' ? o.country.trim() : ''
  if (ct) rows.push(ct)
  const ph = typeof o.phone === 'string' ? o.phone.trim() : ''
  if (ph) rows.push(ph)
  return rows
}

export type OrderEmailPayload = {
  orderNumber: string
  email: string
  lineItems?: Array<{
    name: string
    quantity?: number
    price: number
  }>
  subtotal: number
  discount?: number
  shipping: number
  total: number
  couponCodeSnapshot?: string | null
  paymentMethod?: string | null
  shippingAddress?: Addr
}

export function buildOrderConfirmationMarkdown(o: OrderEmailPayload): string {
  const lines: string[] = [
    `Your order ${o.orderNumber} is confirmed.`,
    '',
    `Payment: ${o.paymentMethod === 'paypal' ? 'PayPal' : 'Card'}`,
    '',
    'Items',
    '-----',
  ]
  for (const li of o.lineItems ?? []) {
    const qty = Math.max(1, Math.floor(Number(li.quantity ?? 1)))
    lines.push(`${li.name} × ${qty}`)
    lines.push(`  ${formatMoney(li.price * qty)}`)
    lines.push('')
  }
  lines.push(`Subtotal: ${formatMoney(o.subtotal)}`)
  if ((o.discount ?? 0) > 0) lines.push(`Discount: −${formatMoney(o.discount ?? 0)}`)
  lines.push(`Shipping: ${formatMoney(o.shipping)}`)
  lines.push(`Total: ${formatMoney(o.total)}`)
  if (o.couponCodeSnapshot) lines.push(`Coupon: ${String(o.couponCodeSnapshot)}`)
  lines.push('')
  lines.push('Ship to')
  lines.push('-------')
  lines.push(...shippingLines(o.shippingAddress))
  return lines.join('\n')
}

export function buildOrderConfirmationHtml(o: OrderEmailPayload): string {
  const rows = (o.lineItems ?? [])
    .map((li) => {
      const qty = Math.max(1, Math.floor(Number(li.quantity ?? 1)))
      const lineTotal = Number(li.price) * qty
      return `<tr><td style="padding:10px;border-bottom:1px solid #e5e5e5">${escapeHtml(li.name)}</td><td style="padding:10px;border-bottom:1px solid #e5e5e5;text-align:center">${qty}</td><td style="padding:10px;border-bottom:1px solid #e5e5e5;text-align:right">${formatMoney(lineTotal)}</td></tr>`
    })
    .join('')

  const shipHtml = shippingLines(o.shippingAddress)
    .map((l) => `<p style="margin:4px 0">${escapeHtml(l)}</p>`)
    .join('')

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#1a1a1a;background:#fafafa;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;border:1px solid #e8e8e8">
<h1 style="font-size:1.25rem;margin:0 0 16px;color:#3d4f3f">Thank you — your order is placed</h1>
<p style="margin:0 0 16px">Order <strong>${escapeHtml(o.orderNumber)}</strong></p>
<p style="margin:0 0 20px;color:#555">${o.paymentMethod === 'paypal' ? 'PayPal' : 'Card'} payment received.</p>
<table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:0.95rem">
<thead><tr><th align="left" style="padding:8px;border-bottom:2px solid #ddd">Item</th><th style="padding:8px;border-bottom:2px solid #ddd">Qty</th><th align="right" style="padding:8px;border-bottom:2px solid #ddd">Total</th></tr></thead>
<tbody>${rows}</tbody></table>
<p style="margin:8px 0"><span style="color:#666">Subtotal</span> <span style="float:right">${formatMoney(o.subtotal)}</span></p>
${(o.discount ?? 0) > 0 ? `<p style="margin:8px 0"><span style="color:#666">Discount</span> <span style="float:right">−${formatMoney(o.discount ?? 0)}</span></p>` : ''}
<p style="margin:8px 0"><span style="color:#666">Shipping</span> <span style="float:right">${formatMoney(o.shipping)}</span></p>
<p style="margin:16px 0;font-size:1.1rem;font-weight:600;border-top:1px solid #ddd;padding-top:12px"><span>Total</span> <span style="float:right">${formatMoney(o.total)}</span></p>
${o.couponCodeSnapshot ? `<p style="color:#666;font-size:0.9rem">Coupon applied: ${escapeHtml(String(o.couponCodeSnapshot))}</p>` : ''}
<h2 style="font-size:1rem;margin:24px 0 8px">Shipping address</h2>${shipHtml}
</div></body></html>`
}
