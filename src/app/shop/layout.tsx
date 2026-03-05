import Link from 'next/link'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/shop" className="flex items-center space-x-2">
              <span className="text-2xl">🌿</span>
              <span className="font-bold text-gray-800">Herbal Shop</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/shop" className="text-gray-600 hover:text-green-600 transition-colors">
                Home
              </Link>
              <Link href="/shop/products" className="text-gray-600 hover:text-green-600 transition-colors">
                All Products
              </Link>
              <Link href="/shop/categories" className="text-gray-600 hover:text-green-600 transition-colors">
                Categories
              </Link>
              <Link href="/shop/deals" className="text-gray-600 hover:text-green-600 transition-colors">
                Deals
              </Link>
              <Link href="/shop/about" className="text-gray-600 hover:text-green-600 transition-colors">
                About Us
              </Link>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <Link href="/shop/search" className="text-gray-600 hover:text-green-600 transition-colors">
                <span className="text-xl">🔍</span>
              </Link>
              <Link href="/shop/cart" className="text-gray-600 hover:text-green-600 transition-colors relative">
                <span className="text-xl">🛒</span>
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>
              <Link href="/shop/account" className="text-gray-600 hover:text-green-600 transition-colors">
                <span className="text-xl">👤</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-600 hover:text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">About Us</h3>
              <p className="text-sm text-gray-600">
                Your trusted source for premium halal-certified herbal products.
              </p>
              <p className="text-xs text-gray-500 mt-2">Admin: Hafiz Sajid Syed</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/shop/products" className="text-gray-600 hover:text-green-600">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/shop/categories" className="text-gray-600 hover:text-green-600">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/shop/deals" className="text-gray-600 hover:text-green-600">
                    Special Deals
                  </Link>
                </li>
                <li>
                  <Link href="/shop/new" className="text-gray-600 hover:text-green-600">
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/shop/contact" className="text-gray-600 hover:text-green-600">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shop/faq" className="text-gray-600 hover:text-green-600">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/shop/shipping" className="text-gray-600 hover:text-green-600">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/shop/returns" className="text-gray-600 hover:text-green-600">
                    Returns Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>📞 +1 (555) 123-4567</li>
                <li>✉️ info@herbalshop.com</li>
                <li>📍 123 Herb Street, Natural City</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Herbal Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}