export interface Product {
  id: string | number
  name: string
  description: string
  price: number
  slug: string
  image?: { url: string; alt: string } | null
}

// ─────────────────────────────────────────────
// SEED DATA — matches the 3×3 grid in screenshot
// CHANGE: remove SEED_PRODUCTS and use real DB/API
//         data once your Payload collection is live.
// ─────────────────────────────────────────────
export const SEED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Black Velvet',
    description:
      'Embark on an enchanting journey. Smoky black tea, fresh bergamot and spicy bay leaves....',
    price: 35.96,
    slug: 'black-velvet',
    image: { url: '/rectangle1.png', alt: 'Black Velvet perfume bottle' },
  },
  {
    id: '2',
    name: 'Black Velvet Room Spray',
    description:
      'Embark on an enchanting journey. Smoky black tea, fresh bergamot and spicy bay leaves....',
    price: 35.96,
    slug: 'black-velvet-room-spray',
    image: { url: '/rectangle2.png', alt: 'Black Velvet Room Spray bottle' },
  },
  {
    id: '3',
    name: 'Black Velvet Reed Diffuser',
    description:
      'Embark on an enchanting journey. Smoky black tea, fresh bergamot and spicy bay leaves....',
    price: 35.96,
    slug: 'black-velvet-reed-diffuser',
    image: { url: '/rectangle3.png', alt: 'Black Velvet Reed Diffuser' },
  },
  {
    id: '4',
    name: 'Black Velvet Candle',
    description:
      'Embark on an enchanting journey. Smoky black tea, fresh bergamot and spicy bay leaves....',
    price: 29.99,
    slug: 'black-velvet-candle',
    image: { url: '/rectangle6.png', alt: 'Black Velvet Candle' },
  },
  {
    id: '5',
    name: 'Blue Moon Bath Bomb',
    description:
      'Embark on an enchanting journey. Smoky black tea, fresh bergamot and spicy bay leaves....',
    price: 12.99,
    slug: 'blue-moon-bath-bomb',
    image: { url: '/rectangle5.png', alt: 'Blue Moon Bath Bomb' },
  },
  {
    id: '6',
    name: 'Cell Renewal Exfoliating Gel',
    description:
      'Embark on an enchanting journey. Smoky black tea, fresh bergamot and spicy bay leaves....',
    price: 9.0,
    slug: 'cell-renewal-exfoliating-gel',
    image: { url: '/rectangle4.png', alt: 'Cell Renewal Exfoliating Gel' },
  },
  {
    id: '7',
    name: 'Discovery Candle Set',
    description:
      'Discover our set while remaining in a state of relaxation in its 4 hand-poured candles....',
    price: 35.46,
    slug: 'discovery-candle-set',
    image: { url: '/rectangle7.png', alt: 'Discovery Candle Set' },
  },
  {
    id: '8',
    name: 'Earl Grey Moonlight Tea',
    description:
      'Embark on an enchanting journey. Smoky black tea, fresh bergamot and spicy bay leaves....',
    price: 18.46,
    slug: 'earl-grey-moonlight-tea',
    image: { url: '/rectangle8.png', alt: 'Earl Grey Moonlight Tea' },
  },
  {
    id: '9',
    name: 'Deluxe Black Velvet Candle',
    description:
      'Embark on an enchanting journey. Smoky black tea, fresh bergamot and spicy bay leaves....',
    price: 39.0,
    slug: 'deluxe-black-velvet-candle',
    image: { url: '/rectangle9.png', alt: 'Deluxe Black Velvet Candle' },
  },
]
