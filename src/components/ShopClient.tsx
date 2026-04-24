'use client'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/seeds'

export default function ShopClient({ products }: { products: Product[] }) {
  return (
    <div className="app-container w-full min-w-0 max-w-full pb-20 pt-0">
      <h2
        className="min-w-0 font-['Cormorant_Garamond'] font-bold leading-[1.21] text-[#6F5845] pt-8 sm:pt-10 lg:mb-[clamp(2rem,6.25vw,5.625rem)] lg:pt-4"
        style={{ fontSize: 'clamp(1.5rem,3.47vw,3.125rem)' }}
      >
        Our Products
      </h2>

      <div className="grid w-full min-w-0 auto-rows-fr grid-cols-1 space-around items-stretch gap-x-[clamp(1rem,1.18vw,1.25rem)] gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-8">
        {products.map((product) => (
          <div key={product.id} className="flex h-full min-h-0 min-w-0 w-full max-w-full">
            <ProductCard
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              slug={product.slug}
              image={product.image}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
