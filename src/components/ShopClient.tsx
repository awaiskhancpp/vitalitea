'use client'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/seeds'

export default function ShopClient({ products }: { products: Product[] }) {
  return (
    <section className="mt-0 w-full bg-[#F5F1E8] px-4 pb-20 pt-0 sm:px-6 lg:px-[6.94%] 2xl:px-[3%]">
      <div className="mx-auto w-full max-w-[1240px]">
        <h2
          className="mb-7 font-['Cormorant_Garamond'] font-bold leading-[1.21] text-black pt-8 sm:pt-10 lg:mb-[clamp(32px,6.25vw,90px)] lg:pt-0"
          style={{ fontSize: 'clamp(32px, 3.47vw, 50px)' }}
        >
          Our Products
        </h2>

        {/* justify-items-stretch: each card fills its full column width */}
        <div className="grid w-full grid-cols-1 justify-items-stretch gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              slug={product.slug}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
