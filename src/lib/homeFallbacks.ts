import { mediaUrl } from './cmsUtils'
import type { Media as MediaType } from '@/payload-types'

/** Static testimonials when Payload returns none — never remove content. */
export const FALLBACK_TESTIMONIALS = [
  {
    id: '1',
    author: 'Sarah M.',
    quote:
      "VitaliTea has completely transformed my morning ritual. The teas are incredible and the skincare line is unlike anything I've tried before.",
    rating: '5',
  },
  {
    id: '2',
    author: 'James K.',
    quote:
      "I've been using the Zen Skincare line for 3 months and my skin has never looked better. Highly recommend!",
    rating: '5',
  },
  {
    id: '3',
    author: 'Priya L.',
    quote:
      'The candles and essential oils create the perfect atmosphere for yoga and meditation. Love this brand.',
    rating: '5',
  },
] as const

export type UiTestimonial = {
  id: string | number
  author: string
  quote: string
  rating: string | number
}

/** Map Payload testimonial docs; if empty/null, returns static FALLBACK_TESTIMONIALS. */
export function testimonialsWithFallback(raw: unknown): UiTestimonial[] {
  if (!Array.isArray(raw) || raw.length === 0) return [...FALLBACK_TESTIMONIALS]
  const out: UiTestimonial[] = []
  for (let i = 0; i < raw.length; i++) {
    const d = raw[i] as Record<string, unknown>
    const quote = typeof d.quote === 'string' ? d.quote.trim() : ''
    const author = typeof d.author === 'string' ? d.author.trim() : ''
    if (!quote || !author) continue
    out.push({
      id: (d.id as string | number) ?? String(i),
      author,
      quote,
      rating: (d.rating as string | number | undefined) ?? '5',
    })
  }
  return out.length > 0 ? out : [...FALLBACK_TESTIMONIALS]
}

export type BentoUiTile = { imageUrl: string; alt: string; label: string }

/** Baseline artwork — preserved when CMS has fewer tiles. */
export const FALLBACK_BENTO_TILES: BentoUiTile[] = [
  { imageUrl: '/cat-herbal-tea.png', alt: 'Herbal Tea', label: 'Herbal Tea' },
  { imageUrl: '/cat-manuka-honey-7887dc.png', alt: 'Manuka Honey', label: 'Manuka Honey' },
  { imageUrl: '/cat-yoga.png', alt: 'Yoga', label: 'Yoga' },
  { imageUrl: '/cat-teaware-63561d.png', alt: 'Teaware', label: 'Teaware' },
  { imageUrl: '/cat-oil-candles.png', alt: 'Oil & Candles', label: 'Oil & Candles' },
  { imageUrl: '/cat-skin-wellness-6d4092.png', alt: 'Skin Wellness', label: 'Skin Wellness' },
]

type BentoDoc = {
  image?: number | MediaType | null
  label?: string | null
  size?: 'small' | 'large' | null
}

/** Merge Payload `bentoGrid` with static tiles so all 6 slots always resolve. */
export function bentoTilesWithFallback(rows: unknown): BentoUiTile[] {
  const fb = FALLBACK_BENTO_TILES
  if (!Array.isArray(rows)) return [...fb]
  const tiles: BentoUiTile[] = []
  for (let i = 0; i < 6; i++) {
    const base = fb[i]
    const row = rows[i] as BentoDoc | undefined
    const cmsImg = row?.image ? mediaUrl(row.image) : null
    const labelRaw = typeof row?.label === 'string' ? row.label.trim() : ''
    tiles.push({
      imageUrl: cmsImg || base.imageUrl,
      alt: labelRaw || base.alt,
      label: labelRaw || base.label,
    })
  }
  return tiles
}

/** Shop page market strip — keyed from Homepage.marketSection global. */
export const FALLBACK_MARKET_SECTION = {
  heading: 'The Expanding Health-Conscious Consumer Market',
  body:
    'An increasing focus on mental health and wellness with at-home natural remedies, combined with a significant rise in the preference for spa therapies due to hectic lifestyles, drives the demand for health-conscious and organic products.',
  ctaLabel: 'Learn More',
  /** Default static image when CMS image missing */
  imageUrl: '/selectedtranquil.png',
}

export type MarketSectionUi = {
  heading: string
  body: string
  ctaLabel: string
  imageUrl: string
}

export function marketSectionWithFallback(section: unknown): MarketSectionUi {
  const fb = FALLBACK_MARKET_SECTION
  if (!section || typeof section !== 'object') return { ...fb }
  const o = section as Record<string, unknown>
  const heading = typeof o.heading === 'string' && o.heading.trim() ? o.heading.trim() : fb.heading
  const body = typeof o.body === 'string' && o.body.trim() ? o.body.trim() : fb.body
  const ctaLabel = typeof o.ctaLabel === 'string' && o.ctaLabel.trim() ? o.ctaLabel.trim() : fb.ctaLabel
  const imgUrl = o.image ? mediaUrl(o.image) : null
  return {
    heading,
    body,
    ctaLabel,
    imageUrl: imgUrl || fb.imageUrl,
  }
}
