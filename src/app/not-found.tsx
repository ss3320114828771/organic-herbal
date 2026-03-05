import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
        
        {/* 404 Icon */}
        <div className="text-8xl mb-6 animate-bounce">🔍</div>
        
        {/* Bismillah */}
        <p className="text-green-800 text-2xl mb-4">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
        
        {/* Error Code */}
        <div className="mb-6">
          <span className="text-7xl font-bold text-gray-800">404</span>
        </div>
        
        {/* Main Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 text-lg mb-8">
          Oops! The page you're looking for seems to have wandered off.
        </p>

        {/* Helpful Suggestions */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-gray-800 mb-4">Here's what you can do:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <Link href="/" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <span className="text-2xl">🏠</span>
              <div>
                <p className="font-medium text-gray-800">Go Home</p>
                <p className="text-xs text-gray-500">Return to homepage</p>
              </div>
            </Link>
            
            <Link href="/shop" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <span className="text-2xl">🛍️</span>
              <div>
                <p className="font-medium text-gray-800">Browse Shop</p>
                <p className="text-xs text-gray-500">Explore our products</p>
              </div>
            </Link>
            
            <Link href="/shop/categories" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <span className="text-2xl">📑</span>
              <div>
                <p className="font-medium text-gray-800">Categories</p>
                <p className="text-xs text-gray-500">Shop by category</p>
              </div>
            </Link>
            
            <Link href="/contact" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <span className="text-2xl">📧</span>
              <div>
                <p className="font-medium text-gray-800">Contact Us</p>
                <p className="text-xs text-gray-500">Get help</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-3">Popular Pages</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/shop/products" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
              All Products
            </Link>
            <Link href="/shop/deals" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
              Special Deals
            </Link>
            <Link href="/shop/new" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
              New Arrivals
            </Link>
            <Link href="/shop/bestsellers" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
              Bestsellers
            </Link>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700 mb-2">Try searching instead:</p>
          <form action="/shop/search" method="GET" className="flex gap-2">
            <input
              type="text"
              name="q"
              placeholder="Search products..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Search
            </button>
          </form>
        </div>

        {/* Help Section */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 mb-3">
            If you believe this is a mistake, please contact our support team.
          </p>
          <div className="flex justify-center gap-4">
            <a href="tel:+15551234567" className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1">
              <span>📞</span>
              Call Support
            </a>
            <Link href="/contact" className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1">
              <span>✉️</span>
              Email Us
            </Link>
          </div>
        </div>

        {/* Admin Credit */}
        <p className="text-xs text-gray-400 mt-8">
          Admin: Hafiz Sajid Syed
        </p>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-blue-200 rounded-full -ml-32 -mt-32 opacity-20 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full -mr-48 -mb-48 opacity-20 pointer-events-none"></div>
    </div>
  )
}