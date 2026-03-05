export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center">
        
        {/* Bismillah */}
        <p className="text-green-800 text-2xl mb-8">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
        
        {/* Animated Loader */}
        <div className="relative mb-8">
          {/* Spinning Circle */}
          <div className="w-24 h-24 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
          
          {/* Inner Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl animate-pulse">🌿</span>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Loading...
        </h2>
        
        <p className="text-gray-600 mb-6">
          Please wait while we prepare your content
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Loading Tips */}
        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-green-800">
            <span className="font-semibold">Did you know?</span><br />
            We source all our herbs from certified organic farms.
          </p>
        </div>

        {/* Random Facts Carousel (Static for loading) */}
        <div className="space-y-2 text-sm text-gray-500">
          <p className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            100% Halal Certified
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Free Shipping on Orders $50+
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Satisfaction Guaranteed
          </p>
        </div>

        {/* Admin Credit */}
        <p className="text-xs text-gray-400 mt-8">
          Admin: Hafiz Sajid Syed
        </p>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-green-200 rounded-full -ml-32 -mt-32 opacity-20 animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full -mr-48 -mb-48 opacity-20 animate-pulse pointer-events-none"></div>
    </div>
  )
}