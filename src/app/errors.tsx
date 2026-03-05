'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
        
        {/* Error Icon */}
        <div className="text-8xl mb-6 animate-bounce">⚠️</div>
        
        {/* Bismillah */}
        <p className="text-green-800 text-2xl mb-4">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
        
        {/* Error Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Something Went Wrong!
        </h1>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700 font-mono text-sm break-all">
            {error.message || 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="text-xs text-gray-500 mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        
        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. Our team has been notified and is working on fixing the issue.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>🔄</span>
            Try Again
          </button>
          
          <Link
            href="/"
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>🏠</span>
            Go Home
          </Link>
          
          <Link
            href="/shop"
            className="px-8 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>🛍️</span>
            Continue Shopping
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="font-semibold text-gray-800 mb-4">Need immediate assistance?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <Link href="/contact" className="text-green-600 hover:text-green-700 flex items-center justify-center gap-1">
              <span>📧</span>
              Contact Support
            </Link>
            <Link href="/faq" className="text-green-600 hover:text-green-700 flex items-center justify-center gap-1">
              <span>❓</span>
              Visit FAQ
            </Link>
            <a href="tel:+15551234567" className="text-green-600 hover:text-green-700 flex items-center justify-center gap-1">
              <span>📞</span>
              Call Us
            </a>
          </div>
        </div>

        {/* Admin Credit */}
        <p className="text-xs text-gray-500 mt-8">
          Admin: Hafiz Sajid Syed
        </p>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-red-200 rounded-full -ml-32 -mt-32 opacity-20 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full -mr-48 -mb-48 opacity-20 pointer-events-none"></div>
    </div>
  )
}