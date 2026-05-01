import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
import db from "@/db/db"
import { cache } from "@/lib/cache"
import logging from "@/lib/logging"
import { Suspense } from "react"

const getProducts = cache(
  () => {
    logging({rootPath:"(customerFacing)/products/page.tsx[9]",func: "getProducts"})
    return db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { name: "asc" },
    })
  },
  ["/products", "getProducts"]
)

export default function ProductsPage() {
  logging({rootPath:"(customerFacing)/products/page.tsx[19]",func: "ProductsPage"})
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense
        fallback={
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        }
      >
        <ProductsSuspense />
      </Suspense>
    </div>
  )
}

async function ProductsSuspense() {
  logging({rootPath:"(customerFacing)/products/page.tsx[41]",func: "ProductsSuspense"})
  const products = await getProducts()

  return products.map(product => <ProductCard key={product.id} {...product} />)
}
