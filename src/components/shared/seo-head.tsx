import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOHeadProps {
  // Basic
  title?: string
  description?: string
  keywords?: string | string[]
  author?: string
  siteName?: string
  canonical?: string
  
  // Open Graph
  ogTitle?: string
  ogDescription?: string
  ogImage?: string | SEOImage
  ogUrl?: string
  ogType?: 'website' | 'article' | 'product' | 'profile'
  
  // Twitter
  twitterCard?: 'summary' | 'summary_large_image' | 'player' | 'app'
  twitterSite?: string
  twitterCreator?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  
  // Article (for blog posts)
  article?: {
    publishedTime?: string
    modifiedTime?: string
    author?: string
    section?: string
    tags?: string[]
  }
  
  // Product (for e-commerce)
  product?: {
    price?: number
    currency?: string
    availability?: 'in stock' | 'out of stock' | 'preorder'
    brand?: string
    sku?: string
  }
  
  // Profile (for user pages)
  profile?: {
    firstName?: string
    lastName?: string
    username?: string
    gender?: string
  }
  
  // Robots
  robots?: {
    index?: boolean
    follow?: boolean
    noarchive?: boolean
    nosnippet?: boolean
    noimageindex?: boolean
    notranslate?: boolean
  }
  
  // Verification
  googleVerification?: string
  bingVerification?: string
  yandexVerification?: string
  
  // JSON-LD structured data
  jsonLd?: Record<string, any> | Record<string, any>[]
  
  // Alternate languages
  alternateLanguages?: {
    href: string
    hreflang: string
  }[]
  
  // Custom
  children?: React.ReactNode
  
  // Mobile
  viewport?: string
  themeColor?: string
  
  // Icons
  favicon?: string
  appleTouchIcon?: string
  manifest?: string
}

interface SEOImage {
  url: string
  width?: number
  height?: number
  alt?: string
}

export default function SEOHead({
  // Basic
  title,
  description,
  keywords,
  author,
  siteName = 'My Site',
  canonical,
  
  // Open Graph
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogType = 'website',
  
  // Twitter
  twitterCard = 'summary_large_image',
  twitterSite,
  twitterCreator,
  twitterTitle,
  twitterDescription,
  twitterImage,
  
  // Article
  article,
  
  // Product
  product,
  
  // Profile
  profile,
  
  // Robots
  robots = { index: true, follow: true },
  
  // Verification
  googleVerification,
  bingVerification,
  yandexVerification,
  
  // JSON-LD
  jsonLd,
  
  // Alternate languages
  alternateLanguages,
  
  // Custom
  children,
  
  // Mobile
  viewport = 'width=device-width, initial-scale=1',
  themeColor = '#10b981',
  
  // Icons
  favicon = '/favicon.ico',
  appleTouchIcon = '/apple-touch-icon.png',
  manifest = '/site.webmanifest'
}: SEOHeadProps) {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  
  // Resolve URLs
  const currentUrl = ogUrl || `${baseUrl}${router.asPath}`
  const canonicalUrl = canonical || currentUrl
  const imageUrl = typeof ogImage === 'string' ? ogImage : ogImage?.url
  
  // Format keywords
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords
  
  // Build robots meta
  const robotsContent = [
    robots.index === false ? 'noindex' : 'index',
    robots.follow === false ? 'nofollow' : 'follow',
    robots.noarchive ? 'noarchive' : null,
    robots.nosnippet ? 'nosnippet' : null,
    robots.noimageindex ? 'noimageindex' : null,
    robots.notranslate ? 'notranslate' : null
  ].filter(Boolean).join(', ')
  
  // Build JSON-LD
  const jsonLdScripts = React.useMemo(() => {
    const scripts: Record<string, any>[] = []
    
    // Website schema
    if (!jsonLd && (title || description)) {
      scripts.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        description: description,
        url: baseUrl
      })
    }
    
    // Article schema
    if (article) {
      scripts.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        image: imageUrl,
        datePublished: article.publishedTime,
        dateModified: article.modifiedTime || article.publishedTime,
        author: {
          '@type': 'Person',
          name: article.author || author
        }
      })
    }
    
    // Product schema
    if (product) {
      scripts.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: title,
        description: description,
        image: imageUrl,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency || 'USD',
          availability: product.availability === 'in stock' 
            ? 'https://schema.org/InStock'
            : product.availability === 'out of stock'
            ? 'https://schema.org/OutOfStock'
            : 'https://schema.org/PreOrder',
          sku: product.sku
        },
        brand: product.brand ? {
          '@type': 'Brand',
          name: product.brand
        } : undefined
      })
    }
    
    // Profile schema
    if (profile) {
      scripts.push({
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          name: profile.firstName && profile.lastName 
            ? `${profile.firstName} ${profile.lastName}`
            : undefined,
          givenName: profile.firstName,
          familyName: profile.lastName,
          additionalName: profile.username,
          gender: profile.gender
        }
      })
    }
    
    // Custom JSON-LD
    if (jsonLd) {
      if (Array.isArray(jsonLd)) {
        scripts.push(...jsonLd)
      } else {
        scripts.push(jsonLd)
      }
    }
    
    return scripts
  }, [jsonLd, article, product, profile, title, description, imageUrl, siteName, baseUrl, author])

  return (
    <Head>
      {/* Basic */}
      {title && <title>{title}</title>}
      {title && <meta property="og:title" content={ogTitle || title} />}
      {twitterTitle && <meta name="twitter:title" content={twitterTitle} />}
      
      {/* Description */}
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={ogDescription || description} />}
      {twitterDescription && <meta name="twitter:description" content={twitterDescription} />}
      
      {/* Keywords */}
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      
      {/* Author */}
      {author && <meta name="author" content={author} />}
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={ogType} />
      
      {/* OG Image */}
      {imageUrl && (
        <>
          <meta property="og:image" content={imageUrl} />
          {typeof ogImage !== 'string' && ogImage?.width && (
            <meta property="og:image:width" content={String(ogImage.width)} />
          )}
          {typeof ogImage !== 'string' && ogImage?.height && (
            <meta property="og:image:height" content={String(ogImage.height)} />
          )}
          {typeof ogImage !== 'string' && ogImage?.alt && (
            <meta property="og:image:alt" content={ogImage.alt} />
          )}
        </>
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
      
      {/* Article specific */}
      {ogType === 'article' && article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Robots */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      
      {/* Verification */}
      {googleVerification && (
        <meta name="google-site-verification" content={googleVerification} />
      )}
      {bingVerification && (
        <meta name="msvalidate.01" content={bingVerification} />
      )}
      {yandexVerification && (
        <meta name="yandex-verification" content={yandexVerification} />
      )}
      
      {/* Alternate languages */}
      {alternateLanguages?.map((lang) => (
        <link
          key={lang.hreflang}
          rel="alternate"
          href={lang.href}
          hrefLang={lang.hreflang}
        />
      ))}
      
      {/* Mobile */}
      <meta name="viewport" content={viewport} />
      <meta name="theme-color" content={themeColor} />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Icons */}
      <link rel="icon" href={favicon} />
      <link rel="apple-touch-icon" href={appleTouchIcon} />
      <link rel="manifest" href={manifest} />
      
      {/* JSON-LD structured data */}
      {jsonLdScripts.map((script, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(script) }}
        />
      ))}
      
      {/* Custom children */}
      {children}
    </Head>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Basic page SEO
export function BasicPageSEO({ title, description }: { title: string; description: string }) {
  return (
    <SEOHead
      title={title}
      description={description}
      ogType="website"
    />
  )
}

// Blog post SEO
export function BlogPostSEO({
  title,
  description,
  image,
  publishedTime,
  author,
  tags
}: {
  title: string
  description: string
  image?: string
  publishedTime: string
  author: string
  tags?: string[]
}) {
  return (
    <SEOHead
      title={title}
      description={description}
      ogImage={image}
      ogType="article"
      article={{
        publishedTime,
        author,
        tags
      }}
      twitterCard="summary_large_image"
    />
  )
}

// Product page SEO
export function ProductSEO({
  title,
  description,
  image,
  price,
  currency = 'USD',
  availability = 'in stock',
  brand,
  sku
}: {
  title: string
  description: string
  image?: string
  price: number
  currency?: string
  availability?: 'in stock' | 'out of stock' | 'preorder'
  brand?: string
  sku?: string
}) {
  return (
    <SEOHead
      title={title}
      description={description}
      ogImage={image}
      ogType="product"
      product={{
        price,
        currency,
        availability,
        brand,
        sku
      }}
    />
  )
}

// Homepage SEO
export function HomepageSEO() {
  return (
    <SEOHead
      title="Home - My Site"
      description="Welcome to My Site - the best place for everything"
      ogType="website"
    />
  )
}

// 404 page SEO
export function NotFoundSEO() {
  return (
    <SEOHead
      title="Page Not Found - My Site"
      description="Sorry, the page you are looking for does not exist."
      robots={{ index: false, follow: true }}
    />
  )
}

// ==================== HOOK ====================

// Custom hook for SEO management
export function useSEO() {
  const router = useRouter()
  
  const updateSEO = (params: SEOHeadProps) => {
    // This would update the SEO dynamically
    // You could use a state management solution here
    console.log('SEO updated:', params)
  }
  
  const generateBreadcrumbJsonLd = (items: { name: string; url: string }[]) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.url}`
      }))
    }
  }
  
  const generateFAQJsonLd = (faqs: { question: string; answer: string }[]) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  }
  
  return {
    updateSEO,
    generateBreadcrumbJsonLd,
    generateFAQJsonLd
  }
}