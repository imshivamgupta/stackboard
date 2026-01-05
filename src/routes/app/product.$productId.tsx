import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  Package,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react'
import { authenticatedFetch, requireAuth } from '../../middleware/auth'
import type { Product } from '../../types/product'

export const Route = createFileRoute('/app/product/$productId')({
  beforeLoad: () => {
    requireAuth()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { productId } = Route.useParams()

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () =>
      authenticatedFetch(
        `${import.meta.env.VITE_API_BASE_URL}/products/${productId}`,
      ).then((res) => res.json()),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Loading amazing product details...
          </p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-3xl font-bold mb-4 text-gray-700">
              Product not found
            </h1>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <ArrowLeft size={20} />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const discountedPrice = (
    product.price -
    (product.price * product.discountPercentage) / 100
  ).toFixed(2)

  const averageRating = product.rating.toFixed(1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-square">
                <img
                  src={product.images[0] || product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.discountPercentage > 0 && (
                <div className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                  -{product.discountPercentage.toFixed(0)}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-24 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                  {product.brand}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <p className="text-xl text-gray-600">{product.brand}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={
                      star <= Math.round(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-xl font-bold text-gray-900">
                {averageRating}
              </span>
              <span className="text-gray-500">
                ({product.reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold text-gray-900">
                ${discountedPrice}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-2xl text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Product Details
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Package size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stock</p>
                    <p
                      className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {product.stock > 0
                        ? `${product.stock} available`
                        : 'Out of stock'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Truck size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shipping</p>
                    <p className="font-semibold text-sm">
                      {product.shippingInformation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Shield size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Warranty</p>
                    <p className="font-semibold text-sm">
                      {product.warrantyInformation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <ArrowLeft
                      size={20}
                      className="text-orange-600 rotate-180"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Return Policy</p>
                    <p className="font-semibold text-sm">
                      {product.returnPolicy}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Specifications
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">SKU:</span>
                  <span className="font-semibold text-gray-900">
                    {product.sku}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Weight:</span>
                  <span className="font-semibold text-gray-900">
                    {product.weight}g
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Dimensions:</span>
                  <span className="font-semibold text-gray-900">
                    {product.dimensions.width} × {product.dimensions.height} ×{' '}
                    {product.dimensions.depth} cm
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Min Order:</span>
                  <span className="font-semibold text-gray-900">
                    {product.minimumOrderQuantity} units
                  </span>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              disabled={product.stock === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              <ShoppingCart size={24} />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Customer Reviews
          </h2>
          <div className="space-y-6">
            {product.reviews.map((review, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {review.reviewerName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.reviewerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
