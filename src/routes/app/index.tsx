import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { authenticatedFetch, requireAuth } from '../../middleware/auth'
import type { Product, ProductsResponse } from '../../types/product'

export const Route = createFileRoute('/app/')({
  beforeLoad: () => {
    requireAuth()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading } = useQuery<ProductsResponse>({
    queryKey: ['products'],
    queryFn: () =>
      authenticatedFetch(`${import.meta.env.VITE_API_BASE_URL}/products`).then(
        (res) => res.json(),
      ),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const discountedPrice = (
    product.price -
    (product.price * product.discountPercentage) / 100
  ).toFixed(2)

  return (
    <Link
      to="/app/product/$productId"
      params={{ productId: product.id.toString() }}
      className="block border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="relative">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        {product.discountPercentage > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            -{product.discountPercentage.toFixed(0)}%
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-lg font-semibold line-clamp-2 flex-1">
            {product.title}
          </h2>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {product.brand}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="text-sm ml-1">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviews.length} reviews)
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-green-600">
            ${discountedPrice}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-sm text-gray-500 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="text-xs text-gray-600 space-y-1 mb-3">
          <div>
            Stock:{' '}
            <span
              className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}
            >
              {product.stock > 0
                ? `${product.stock} available`
                : 'Out of stock'}
            </span>
          </div>
          <div>{product.shippingInformation}</div>
          <div>{product.warrantyInformation}</div>
        </div>

        <button
          disabled={product.stock === 0}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          {product.stock > 0 ? 'View Details' : 'Out of Stock'}
        </button>
      </div>
    </Link>
  )
}
