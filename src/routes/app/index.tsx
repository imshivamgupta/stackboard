import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  Filter,
  Package,
  Search,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { authenticatedFetch, requireAuth } from '../../middleware/auth'
import type { Product, ProductsResponse } from '../../types/product'

export const Route = createFileRoute('/app/')({
  beforeLoad: ({ search }) => {
    requireAuth()
  },
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    category: (search.category as string) || '',
  }),
})

function RouteComponent() {
  const { category: urlCategory } = Route.useSearch()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Set category from URL params
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory)
    }
  }, [urlCategory])

  const { data, isLoading } = useQuery<ProductsResponse>({
    queryKey: selectedCategory
      ? ['products', 'category', selectedCategory]
      : ['products'],
    queryFn: () =>
      authenticatedFetch(
        selectedCategory
          ? `${import.meta.env.VITE_API_BASE_URL}/products/category/${selectedCategory}`
          : `${import.meta.env.VITE_API_BASE_URL}/products`,
      ).then((res) => res.json()),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })

  const filteredProducts =
    data?.products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    }) || []

  const categories = [...new Set(data?.products.map((p) => p.category) || [])]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading amazing products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back to Categories */}
        {/* <div className="mb-6">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Market
          </Link>
        </div> */}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {selectedCategory
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`
              : 'All Products'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {selectedCategory
              ? `Discover amazing products in the ${selectedCategory} category`
              : 'Explore our curated collection of premium products with unbeatable quality and value'}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products, brands, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed focus:ring-0 focus:border-gray-200 transition-all duration-200"
              />
            </div>
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  const newCategory = e.target.value
                  setSelectedCategory(newCategory)
                  // Update URL without triggering navigation
                  window.history.replaceState(
                    null,
                    '',
                    newCategory ? `/app?category=${newCategory}` : '/app',
                  )
                }}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {data?.total || 0}{' '}
            {selectedCategory ? `${selectedCategory} products` : 'products'}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
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
      className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
    >
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{product.discountPercentage.toFixed(0)}%
          </div>
        )}

        {/* Stock Status */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              product.stock > 0
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Category & Brand */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            {product.category}
          </span>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
            {product.brand}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={
                  star <= Math.round(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500">
            ({product.reviews.length})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ${discountedPrice}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-lg text-gray-500 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Features */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Truck size={14} />
            <span>Fast Shipping</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield size={14} />
            <span>Warranty</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          disabled={product.stock === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
        >
          <ShoppingCart size={18} />
          {product.stock > 0 ? 'View Details' : 'Out of Stock'}
        </button>
      </div>
    </Link>
  )
}
