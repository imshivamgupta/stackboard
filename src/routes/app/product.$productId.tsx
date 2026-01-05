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

interface Review {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

interface ProductDetail {
  id: number
  title: string
  description: string
  category: string
  discountPercentage: number
  rating: number
  stock: number
  tags: Array<string>
  brand: string
  sku: string
  weight: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: Array<Review>
  returnPolicy: string
  minimumOrderQuantity: number
  meta: {
    createdAt: string
    updatedAt: string
    barcode: string
    qrCode: string
  }
  images: Array<string>
  thumbnail: string
}

export const Route = createFileRoute('/app/product/$productId')({
  beforeLoad: () => {
    requireAuth()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { productId } = Route.useParams()

  const { data: product, isLoading } = useQuery<ProductDetail>({
    queryKey: ['product', productId],
    queryFn: () =>
      authenticatedFetch(
        `${import.meta.env.VITE_API_BASE_URL}/products/${productId}`,
      ).then((res) => res.json()),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/app" className="text-blue-600 hover:underline">
            Back to Products
          </Link>
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
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <Link
        to="/app"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Image Gallery */}
        <div>
          <div className="relative mb-4">
            <img
              src={product.images[0] || product.thumbnail}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-lg text-lg font-bold">
                -{product.discountPercentage.toFixed(0)}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-2">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-gray-600 mb-2">{product.brand}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={
                    star <= Math.round(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <span className="text-lg font-semibold">{averageRating}</span>
            <span className="text-gray-500">
              ({product.reviews.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-green-600">
              ${discountedPrice}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-xl text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Stock</p>
                <p
                  className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {product.stock > 0
                    ? `${product.stock} available`
                    : 'Out of stock'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Truck size={20} className="text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Shipping</p>
                <p className="font-semibold text-sm">
                  {product.shippingInformation}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Shield size={20} className="text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Warranty</p>
                <p className="font-semibold text-sm">
                  {product.warrantyInformation}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Return Policy</p>
              <p className="font-semibold text-sm">{product.returnPolicy}</p>
            </div>
          </div>

          {/* Specifications */}
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">Specifications</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">SKU:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium">{product.weight}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dimensions:</span>
                <span className="font-medium">
                  {product.dimensions.width} × {product.dimensions.height} ×{' '}
                  {product.dimensions.depth} cm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Min Order:</span>
                <span className="font-medium">
                  {product.minimumOrderQuantity} units
                </span>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            disabled={product.stock === 0}
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-lg font-semibold"
          >
            <ShoppingCart size={24} />
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-4">
          {product.reviews.map((review, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {review.reviewerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{review.reviewerName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
