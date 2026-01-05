import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import {
  Baby,
  Camera,
  Car,
  Dumbbell,
  Flower2,
  Gamepad2,
  Gem,
  Grid3X3,
  Headphones,
  Home,
  Home as HomeIcon,
  Laptop,
  LogOut,
  Menu,
  Shirt,
  Smartphone,
  Sofa,
  Watch,
  X,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { authenticatedFetch, isAuthenticated, logout } from '../middleware/auth'

interface Category {
  slug: string
  name: string
  url: string
}

// Function to get appropriate icon for each category
const getCategoryIcon = (categoryName: string) => {
  const iconMap: Record<string, any> = {
    beauty: Gem,
    fragrances: Flower2,
    furniture: Sofa,
    groceries: HomeIcon,
    'home-decoration': HomeIcon,
    'kitchen-accessories': HomeIcon,
    laptops: Laptop,
    'mens-shirts': Shirt,
    'mens-shoes': Shirt,
    'mens-watches': Watch,
    'mobile-accessories': Smartphone,
    motorcycle: Car,
    'skin-care': Gem,
    smartphones: Smartphone,
    'sports-accessories': Dumbbell,
    sunglasses: Watch,
    tablets: Laptop,
    tops: Shirt,
    vehicle: Car,
    'womens-bags': Shirt,
    'womens-dresses': Shirt,
    'womens-jewellery': Gem,
    'womens-shoes': Shirt,
    'womens-watches': Watch,
  }

  const IconComponent = iconMap[categoryName.toLowerCase()] || Grid3X3
  return IconComponent
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const { data: categories } = useQuery<Array<Category>>({
    queryKey: ['categories'],
    queryFn: () =>
      authenticatedFetch(
        `${import.meta.env.VITE_API_BASE_URL}/products/categories`,
      ).then((res) => res.json()),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return (
    <>
      <header className="p-4 flex items-center justify-between bg-gray-800 text-white shadow-lg">
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="ml-4 text-xl font-semibold">
            <Link to="/app">Stackboard Market</Link>
          </h1>
        </div>

        {/* Logout Button - Only show when authenticated */}
        {isAuthenticated() && (
          <button
            onClick={() => {
              logout()
              // Redirect to login page
              window.location.href = '/app/login'
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {/* Categories */}
          {categories?.map((category) => {
            const IconComponent = getCategoryIcon(category.slug)
            return (
              <Link
                key={category.slug}
                to="/app"
                search={{ category: category.slug }}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
                }}
              >
                <IconComponent size={20} />
                <span className="font-medium">{category.name}</span>
              </Link>
            )
          })}

          {/* Demo Links End */}
        </nav>
      </aside>
    </>
  )
}
