'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface FooterProps {
  logo?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
  brandName?: string
  brandDescription?: string
  showNewsletter?: boolean
  newsletterTitle?: string
  newsletterDescription?: string
  showSocialIcons?: boolean
  showPaymentIcons?: boolean
  showLanguageSelector?: boolean
  showCurrencySelector?: boolean
  showBackToTop?: boolean
  columns?: FooterColumn[]
  bottomLinks?: BottomLink[]
  copyright?: {
    text: string
    showYear?: boolean
    year?: number
  }
  socialLinks?: SocialLink[]
  paymentMethods?: PaymentMethod[]
  languages?: Language[]
  currencies?: Currency[]
  className?: string
  variant?: 'default' | 'minimal' | 'compact' | 'dark' | 'centered'
  sticky?: boolean
}

interface FooterColumn {
  title: string
  links: Array<{
    label: string
    href: string
    icon?: React.ReactNode
    external?: boolean
    badge?: string
  }>
}

interface BottomLink {
  label: string
  href: string
  external?: boolean
}

interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'pinterest' | 'tiktok' | 'github' | 'custom'
  url: string
  icon?: React.ReactNode
  label?: string
}

interface PaymentMethod {
  name: string
  icon: React.ReactNode
  width?: number
  height?: number
}

interface Language {
  code: string
  name: string
  flag?: string
}

interface Currency {
  code: string
  symbol: string
  name: string
}

export default function Footer({
  logo,
  brandName = 'Your Brand',
  brandDescription = 'Providing quality products and services since 2024',
  showNewsletter = false,
  newsletterTitle = 'Subscribe to our newsletter',
  newsletterDescription = 'Get the latest updates and offers',
  showSocialIcons = true,
  showPaymentIcons = false,
  showLanguageSelector = false,
  showCurrencySelector = false,
  showBackToTop = false,
  columns = [],
  bottomLinks = [],
  copyright = {
    text: 'All rights reserved',
    showYear: true,
    year: new Date().getFullYear()
  },
  socialLinks = [
    { platform: 'facebook', url: 'https://facebook.com' },
    { platform: 'twitter', url: 'https://twitter.com' },
    { platform: 'instagram', url: 'https://instagram.com' },
    { platform: 'linkedin', url: 'https://linkedin.com' }
  ],
  paymentMethods = [],
  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' }
  ],
  currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
  ],
  className = '',
  variant = 'default',
  sticky = false
}: FooterProps) {
  const pathname = usePathname()
  const [email, setEmail] = React.useState('')
  const [newsletterStatus, setNewsletterStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [selectedLanguage, setSelectedLanguage] = React.useState('en')
  const [selectedCurrency, setSelectedCurrency] = React.useState('USD')
  const [showScrollTop, setShowScrollTop] = React.useState(false)

  // Handle scroll to top button visibility
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNewsletterStatus('loading')
    
    // Simulate API call
    setTimeout(() => {
      setNewsletterStatus('success')
      setEmail('')
      setTimeout(() => setNewsletterStatus('idle'), 3000)
    }, 1500)
  }

  // Social Icons
  const SocialIcon = ({ platform }: { platform: SocialLink['platform'] }) => {
    switch (platform) {
      case 'facebook':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
          </svg>
        )
      case 'twitter':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.05-4.55 4.55 0 .36.04.7.1 1.04-3.8-.2-7.17-2-9.42-4.74-.4.68-.6 1.46-.6 2.3 0 1.58.8 2.98 2.02 3.8-.74-.02-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.45-.38.1-.78.16-1.2.16-.3 0-.58-.03-.86-.08.58 1.82 2.27 3.15 4.28 3.2-1.57 1.23-3.55 1.96-5.7 1.96-.37 0-.74-.02-1.1-.06 2.03 1.3 4.44 2.06 7.04 2.06 8.45 0 13.07-7 13.07-13.07v-.6c.9-.66 1.68-1.47 2.3-2.4z"/>
          </svg>
        )
      case 'instagram':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.7 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.22-1.67 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.25-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85 0-3.2.01-3.58.07-4.85.15-3.22 1.67-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.7.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.35 2.63 6.78 6.98 6.98 1.28.06 1.67.07 4.95.07 3.28 0 3.67-.01 4.95-.07 4.35-.2 6.78-2.63 6.98-6.98.06-1.28.07-1.67.07-4.95 0-3.28-.01-3.67-.07-4.95-.2-4.35-2.63-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.41-10.41a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
          </svg>
        )
      case 'linkedin':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.4-1.85 3.64 0 4.31 2.4 4.31 5.52v6.22zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.1 20.45H3.6V9h3.5v11.45z"/>
          </svg>
        )
      case 'youtube':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.5 6.2c-.3-1-1-1.8-2-2-.9-.2-4.5-.2-9.5-.2s-8.6 0-9.5.2c-1 .2-1.8 1-2 2-.2 1-.2 4.2-.2 5.8s0 4.8.2 5.8c.3 1 1 1.8 2 2 .9.2 4.5.2 9.5.2s8.6 0 9.5-.2c1-.2 1.8-1 2-2 .2-1 .2-4.2.2-5.8s0-4.8-.2-5.8zm-14 9.5V8.3l6.2 3.7-6.2 3.7z"/>
          </svg>
        )
      case 'pinterest':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.14.5C5.86.5 2.5 4.9 2.5 8.7c0 2.4 1 4.5 2.8 5.3.3.1.6 0 .7-.4l.2-.8c.1-.3 0-.4-.2-.7-.7-.8-1-1.8-1-3.2 0-4 3-7.6 7.8-7.6 4.2 0 6.6 2.6 6.6 6 0 4.5-2 8.3-5 8.3-1.7 0-2.9-1.4-2.5-3 .5-2 1.4-4.2 1.4-5.6 0-1.3-.7-2.4-2-2.4-1.6 0-2.9 1.7-2.9 3.9 0 1.4.5 2.4.5 2.4s-1.6 6.8-1.9 8c-.3 1.2 0 2.8 0 3 .1.1.2.1.2.1.1 0 .2-.1.2-.2.2-.3 2.4-3 3.2-5.7.3-1 .6-2.1.9-3 .5 1 2 1.8 3.5 1.8 4.6 0 7.7-4.2 7.7-9.8 0-4.3-3.6-8.2-9.1-8.2z"/>
          </svg>
        )
      case 'tiktok':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 015.09-1.87V8.72a8.37 8.37 0 004.94 1.48v-3.5a4.87 4.87 0 01-2.61-.01z"/>
          </svg>
        )
      case 'github':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.8c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.4-2 .1-2.7-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 1.1.9-.3 1.8-.4 2.7-.4s1.8.1 2.7.4c2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.6.1 2.9.6.7 1 1.6 1 2.7 0 3.8-2.3 4.7-4.6 4.9.4.3.7 1 .7 2v3c0 .3.2.6.7.5C19.14 20.16 22 16.42 22 12c0-5.52-4.48-10-10-10z"/>
          </svg>
        )
      default:
        return null
    }
  }

  // Payment Icons
  const PaymentIcon = ({ name }: { name: string }) => {
    switch (name.toLowerCase()) {
      case 'visa':
        return (
          <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="4" fill="#1A1F71"/>
            <path d="M18.5 10.5L14 21.5H10L7.5 13.5C7.3 12.9 6.9 12.3 6.2 12.1C5.2 11.7 4.1 11.4 3 11.2V10.5H9.5C10.4 10.5 11.1 11.2 11 12.1L12.5 18.5L16 10.5H18.5Z" fill="white"/>
            <path d="M27 15.5C27 13 24.5 12.5 23 12.5C21.5 12.5 20.5 13 20.5 14C20.5 14.8 21.3 15.3 22.5 15.7L23.5 16C25 16.5 26 17.2 26 18.5C26 20.5 24 21.5 21.5 21.5C19.5 21.5 17.5 20.5 17 19.5L18.5 17.5C19 18.5 20 19 21 19C21.8 19 22.5 18.7 22.5 18C22.5 17.3 21.8 17 20.5 16.5C19 16 17.5 15 17.5 13.5C17.5 11.5 19.5 10 22.5 10C24 10 26 10.5 27 11.5L27 15.5Z" fill="white"/>
            <path d="M33.5 21.5H31L30 18.5H25L24 21.5H21.5L26 10.5H29L33.5 21.5ZM28.5 13.5L27 16.5H29.5L28.5 13.5Z" fill="white"/>
            <path d="M38 21.5H35.5L38 10.5H40.5L38 21.5Z" fill="white"/>
          </svg>
        )
      case 'mastercard':
        return (
          <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="4" fill="#252525"/>
            <circle cx="18" cy="16" r="8" fill="#EB001B" fillOpacity="0.8"/>
            <circle cx="30" cy="16" r="8" fill="#F79E1B" fillOpacity="0.8"/>
            <path d="M24 20.5C25.8 19 27 16.7 27 14C27 11.3 25.8 9 24 7.5C22.2 9 21 11.3 21 14C21 16.7 22.2 19 24 20.5Z" fill="#FF5F00"/>
          </svg>
        )
      case 'amex':
        return (
          <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="4" fill="#006FCF"/>
            <path d="M8 9H40V23H8V9Z" fill="white"/>
            <text x="12" y="20" fontSize="8" fill="#006FCF" fontWeight="bold">AMERICAN</text>
            <text x="12" y="26" fontSize="8" fill="#006FCF" fontWeight="bold">EXPRESS</text>
          </svg>
        )
      case 'paypal':
        return (
          <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="4" fill="#003087"/>
            <path d="M14.5 9H23.5C25.5 9 27 10.5 27 12.5C27 14.5 25.5 16 23.5 16H19L18 21H15L16.5 12H14L14.5 9Z" fill="#009CDE"/>
            <path d="M19 12H22.5C23.5 12 24.5 13 24.5 14C24.5 15 23.5 16 22.5 16H20L19 12Z" fill="white"/>
          </svg>
        )
      default:
        return null
    }
  }

  // Variant styles
  const variantStyles = {
    default: 'bg-gray-50 border-t border-gray-200',
    minimal: 'bg-white border-t border-gray-100',
    compact: 'bg-gray-50 border-t border-gray-200 py-8',
    dark: 'bg-gray-900 text-gray-300 border-t border-gray-800',
    centered: 'bg-gray-50 border-t border-gray-200 text-center'
  }

  const textStyles = {
    default: 'text-gray-600',
    minimal: 'text-gray-600',
    compact: 'text-gray-600',
    dark: 'text-gray-400',
    centered: 'text-gray-600'
  }

  const headingStyles = {
    default: 'text-gray-800',
    minimal: 'text-gray-800',
    compact: 'text-gray-800',
    dark: 'text-white',
    centered: 'text-gray-800'
  }

  const linkStyles = {
    default: 'text-gray-600 hover:text-green-600',
    minimal: 'text-gray-600 hover:text-green-600',
    compact: 'text-gray-600 hover:text-green-600',
    dark: 'text-gray-400 hover:text-white',
    centered: 'text-gray-600 hover:text-green-600'
  }

  return (
    <footer className={`${variantStyles[variant]} ${className} ${sticky ? 'mt-auto' : ''}`}>
      {/* Back to Top Button */}
      {showBackToTop && showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all z-50"
          aria-label="Back to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className={`py-12 ${variant === 'compact' ? 'py-8' : 'py-12'}`}>
          <div className={`grid ${columns.length > 0 ? `grid-cols-1 md:grid-cols-${Math.min(columns.length + 1, 4)} gap-8` : 'grid-cols-1 gap-8'}`}>
            
            {/* Brand Column */}
            <div className={`${variant === 'centered' ? 'text-center' : ''}`}>
              {logo ? (
                <Link href="/" className="inline-block mb-4">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width || 150}
                    height={logo.height || 50}
                    className="h-auto"
                  />
                </Link>
              ) : (
                <Link href="/" className={`text-xl font-bold mb-4 block ${headingStyles[variant]}`}>
                  {brandName}
                </Link>
              )}
              
              <p className={`text-sm ${textStyles[variant]} max-w-md ${variant === 'centered' ? 'mx-auto' : ''}`}>
                {brandDescription}
              </p>

              {/* Newsletter Signup */}
              {showNewsletter && (
                <div className="mt-6">
                  <h3 className={`text-sm font-semibold mb-2 ${headingStyles[variant]}`}>
                    {newsletterTitle}
                  </h3>
                  <p className={`text-xs ${textStyles[variant]} mb-3`}>
                    {newsletterDescription}
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="flex max-w-md">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                      required
                    />
                    <button
                      type="submit"
                      disabled={newsletterStatus === 'loading'}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-r-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {newsletterStatus === 'loading' ? '...' : 'Subscribe'}
                    </button>
                  </form>
                  {newsletterStatus === 'success' && (
                    <p className="text-xs text-green-600 mt-2">Thanks for subscribing!</p>
                  )}
                  {newsletterStatus === 'error' && (
                    <p className="text-xs text-red-600 mt-2">Something went wrong. Please try again.</p>
                  )}
                </div>
              )}
            </div>

            {/* Dynamic Columns */}
            {columns.map((column, idx) => (
              <div key={idx} className={variant === 'centered' ? 'text-center' : ''}>
                <h3 className={`text-sm font-semibold mb-4 ${headingStyles[variant]}`}>
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className={`text-sm ${linkStyles[variant]} inline-flex items-center gap-1`}
                      >
                        {link.icon && <span>{link.icon}</span>}
                        {link.label}
                        {link.badge && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-600 rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social Links & Selectors */}
            {(showSocialIcons || showLanguageSelector || showCurrencySelector) && (
              <div className={variant === 'centered' ? 'text-center' : ''}>
                {/* Social Icons */}
                {showSocialIcons && (
                  <div className="mb-6">
                    <h3 className={`text-sm font-semibold mb-4 ${headingStyles[variant]}`}>
                      Follow Us
                    </h3>
                    <div className={`flex gap-4 ${variant === 'centered' ? 'justify-center' : ''}`}>
                      {socialLinks.map((social, idx) => (
                        <Link
                          key={idx}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${linkStyles[variant]} hover:scale-110 transition-transform`}
                          aria-label={social.label || social.platform}
                        >
                          {social.icon || <SocialIcon platform={social.platform} />}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Language & Currency Selectors */}
                {(showLanguageSelector || showCurrencySelector) && (
                  <div className="space-y-4">
                    {showLanguageSelector && (
                      <div>
                        <label className={`text-xs ${textStyles[variant]} block mb-2`}>
                          Language
                        </label>
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 bg-white"
                        >
                          {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                              {lang.flag && `${lang.flag} `}{lang.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {showCurrencySelector && (
                      <div>
                        <label className={`text-xs ${textStyles[variant]} block mb-2`}>
                          Currency
                        </label>
                        <select
                          value={selectedCurrency}
                          onChange={(e) => setSelectedCurrency(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 bg-white"
                        >
                          {currencies.map((currency) => (
                            <option key={currency.code} value={currency.code}>
                              {currency.symbol} {currency.code} - {currency.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {/* Payment Icons */}
                {showPaymentIcons && paymentMethods.length > 0 && (
                  <div className="mt-6">
                    <h3 className={`text-sm font-semibold mb-4 ${headingStyles[variant]}`}>
                      We Accept
                    </h3>
                    <div className={`flex flex-wrap gap-2 ${variant === 'centered' ? 'justify-center' : ''}`}>
                      {paymentMethods.map((method, idx) => (
                        <div key={idx} className="flex items-center">
                          {method.icon || <PaymentIcon name={method.name} />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`py-6 border-t ${variant === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className={`flex flex-col md:flex-row justify-between items-center gap-4 ${variant === 'centered' ? 'text-center' : ''}`}>
            
            {/* Copyright */}
            <div className={`text-xs ${textStyles[variant]}`}>
              © {copyright.showYear && (copyright.year || new Date().getFullYear())} {brandName}. {copyright.text}
            </div>

            {/* Bottom Links */}
            {bottomLinks.length > 0 && (
              <div className={`flex flex-wrap gap-4 ${variant === 'centered' ? 'justify-center' : ''}`}>
                {bottomLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className={`text-xs ${linkStyles[variant]}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

// Pre-configured footer for e-commerce
export function EcommerceFooter() {
  const columns: FooterColumn[] = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', href: '/products' },
        { label: 'New Arrivals', href: '/products/new' },
        { label: 'Best Sellers', href: '/products/bestsellers' },
        { label: 'Sale', href: '/products/sale', badge: '30% off' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'FAQs', href: '/faqs' },
        { label: 'Shipping', href: '/shipping' },
        { label: 'Returns', href: '/returns' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' },
        { label: 'Privacy Policy', href: '/privacy' }
      ]
    }
  ]

  const paymentMethods: PaymentMethod[] = [
    { name: 'visa', icon: <PaymentIcon name="visa" /> },
    { name: 'mastercard', icon: <PaymentIcon name="mastercard" /> },
    { name: 'amex', icon: <PaymentIcon name="amex" /> },
    { name: 'paypal', icon: <PaymentIcon name="paypal" /> }
  ]

  return (
    <Footer
      brandName="ShopHub"
      brandDescription="Your one-stop shop for quality products at affordable prices."
      columns={columns}
      showNewsletter={true}
      showSocialIcons={true}
      showPaymentIcons={true}
      showLanguageSelector={true}
      showCurrencySelector={true}
      showBackToTop={true}
      paymentMethods={paymentMethods}
      bottomLinks={[
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Cookie Policy', href: '/cookies' }
      ]}
    />
  )
}

// Minimal footer for blogs
export function BlogFooter() {
  return (
    <Footer
      variant="minimal"
      brandName="BlogSpace"
      brandDescription="Thoughts, stories and ideas worth sharing."
      columns={[
        {
          title: 'Categories',
          links: [
            { label: 'Technology', href: '/category/tech' },
            { label: 'Lifestyle', href: '/category/lifestyle' },
            { label: 'Travel', href: '/category/travel' },
            { label: 'Food', href: '/category/food' }
          ]
        }
      ]}
      showSocialIcons={true}
      bottomLinks={[
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy', href: '/privacy' }
      ]}
    />
  )
}

// Compact footer for dashboards
export function DashboardFooter() {
  return (
    <Footer
      variant="compact"
      brandName="Dashboard"
      columns={[]}
      showSocialIcons={false}
      bottomLinks={[
        { label: 'Help', href: '/help' },
        { label: 'Terms', href: '/terms' },
        { label: 'Privacy', href: '/privacy' }
      ]}
      copyright={{
        text: 'All rights reserved.',
        showYear: true
      }}
    />
  )
}

// Dark footer for modern sites
export function DarkFooter() {
  const columns: FooterColumn[] = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'FAQ', href: '/faq' },
        { label: 'API', href: '/api' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'Tutorials', href: '/tutorials' },
        { label: 'Blog', href: '/blog' },
        { label: 'Community', href: '/community' }
      ]
    }
  ]

  return (
    <Footer
      variant="dark"
      brandName="TechCorp"
      brandDescription="Building the future of technology, one line of code at a time."
      columns={columns}
      showSocialIcons={true}
      socialLinks={[
        { platform: 'github', url: 'https://github.com' },
        { platform: 'twitter', url: 'https://twitter.com' },
        { platform: 'linkedin', url: 'https://linkedin.com' }
      ]}
      bottomLinks={[
        { label: 'Terms', href: '/terms' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Security', href: '/security' }
      ]}
    />
  )
}

// Helper component for Payment Icons (needed for EcommerceFooter)
function PaymentIcon({ name }: { name: string }) {
  switch (name.toLowerCase()) {
    case 'visa':
      return (
        <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
          <rect width="48" height="32" rx="4" fill="#1A1F71"/>
          <path d="M18.5 10.5L14 21.5H10L7.5 13.5C7.3 12.9 6.9 12.3 6.2 12.1C5.2 11.7 4.1 11.4 3 11.2V10.5H9.5C10.4 10.5 11.1 11.2 11 12.1L12.5 18.5L16 10.5H18.5Z" fill="white"/>
          <path d="M27 15.5C27 13 24.5 12.5 23 12.5C21.5 12.5 20.5 13 20.5 14C20.5 14.8 21.3 15.3 22.5 15.7L23.5 16C25 16.5 26 17.2 26 18.5C26 20.5 24 21.5 21.5 21.5C19.5 21.5 17.5 20.5 17 19.5L18.5 17.5C19 18.5 20 19 21 19C21.8 19 22.5 18.7 22.5 18C22.5 17.3 21.8 17 20.5 16.5C19 16 17.5 15 17.5 13.5C17.5 11.5 19.5 10 22.5 10C24 10 26 10.5 27 11.5L27 15.5Z" fill="white"/>
          <path d="M33.5 21.5H31L30 18.5H25L24 21.5H21.5L26 10.5H29L33.5 21.5ZM28.5 13.5L27 16.5H29.5L28.5 13.5Z" fill="white"/>
          <path d="M38 21.5H35.5L38 10.5H40.5L38 21.5Z" fill="white"/>
        </svg>
      )
    case 'mastercard':
      return (
        <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
          <rect width="48" height="32" rx="4" fill="#252525"/>
          <circle cx="18" cy="16" r="8" fill="#EB001B" fillOpacity="0.8"/>
          <circle cx="30" cy="16" r="8" fill="#F79E1B" fillOpacity="0.8"/>
          <path d="M24 20.5C25.8 19 27 16.7 27 14C27 11.3 25.8 9 24 7.5C22.2 9 21 11.3 21 14C21 16.7 22.2 19 24 20.5Z" fill="#FF5F00"/>
        </svg>
      )
    case 'amex':
      return (
        <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
          <rect width="48" height="32" rx="4" fill="#006FCF"/>
          <path d="M8 9H40V23H8V9Z" fill="white"/>
          <text x="12" y="20" fontSize="8" fill="#006FCF" fontWeight="bold">AMERICAN</text>
          <text x="12" y="26" fontSize="8" fill="#006FCF" fontWeight="bold">EXPRESS</text>
        </svg>
      )
    case 'paypal':
      return (
        <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
          <rect width="48" height="32" rx="4" fill="#003087"/>
          <path d="M14.5 9H23.5C25.5 9 27 10.5 27 12.5C27 14.5 25.5 16 23.5 16H19L18 21H15L16.5 12H14L14.5 9Z" fill="#009CDE"/>
          <path d="M19 12H22.5C23.5 12 24.5 13 24.5 14C24.5 15 23.5 16 22.5 16H20L19 12Z" fill="white"/>
        </svg>
      )
    default:
      return null
  }
}