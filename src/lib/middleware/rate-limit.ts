// lib/rate-limit.ts

interface RateLimitConfig {
  interval?: number // Time window in milliseconds
  maxRequests?: number // Maximum requests per interval
  identifier?: (req: Request) => string // Function to identify unique clients
}

interface RateLimitInfo {
  count: number
  resetTime: number
}

// In-memory store for rate limiting
class MemoryStore {
  private store: Map<string, RateLimitInfo> = new Map()
  
  // Clean up expired entries every minute
  constructor() {
    setInterval(() => {
      const now = Date.now()
      for (const [key, info] of this.store.entries()) {
        if (info.resetTime <= now) {
          this.store.delete(key)
        }
      }
    }, 60000)
  }
  
  async increment(key: string, windowMs: number): Promise<RateLimitInfo> {
    const now = Date.now()
    const info = this.store.get(key)
    
    if (!info || info.resetTime <= now) {
      const newInfo = {
        count: 1,
        resetTime: now + windowMs
      }
      this.store.set(key, newInfo)
      return newInfo
    }
    
    info.count++
    this.store.set(key, info)
    return info
  }
  
  async get(key: string): Promise<RateLimitInfo | undefined> {
    return this.store.get(key)
  }
  
  async reset(key: string): Promise<void> {
    this.store.delete(key)
  }
  
  async resetAll(): Promise<void> {
    this.store.clear()
  }
}

// Create singleton instance
const store = new MemoryStore()

// Default rate limit config
const defaultConfig: RateLimitConfig = {
  interval: 60000, // 1 minute
  maxRequests: 60, // 60 requests per minute
  identifier: (req: Request) => {
    // Use IP address as default identifier
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
    return ip
  }
}

// Main rate limit function
export async function rateLimit(
  req: Request,
  config: RateLimitConfig = {}
): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: number
  error?: string
}> {
  const interval = config.interval || defaultConfig.interval!
  const maxRequests = config.maxRequests || defaultConfig.maxRequests!
  const identifier = config.identifier || defaultConfig.identifier!
  
  const key = identifier(req)
  const info = await store.increment(key, interval)
  
  const remaining = Math.max(0, maxRequests - info.count)
  const success = info.count <= maxRequests
  
  return {
    success,
    limit: maxRequests,
    remaining,
    reset: info.resetTime
  }
}

// Rate limit by IP
export function rateLimitByIP(
  req: Request,
  maxRequests: number = 60,
  interval: number = 60000
) {
  return rateLimit(req, {
    interval,
    maxRequests,
    identifier: (req) => {
      const forwarded = req.headers.get('x-forwarded-for')
      return forwarded ? forwarded.split(',')[0] : 'unknown'
    }
  })
}

// Rate limit by user ID (for authenticated routes)
export function rateLimitByUser(
  req: Request,
  userId: string,
  maxRequests: number = 100,
  interval: number = 60000
) {
  return rateLimit(req, {
    interval,
    maxRequests,
    identifier: () => `user:${userId}`
  })
}

// Rate limit by API key
export function rateLimitByApiKey(
  req: Request,
  apiKey: string,
  maxRequests: number = 1000,
  interval: number = 3600000 // 1 hour
) {
  return rateLimit(req, {
    interval,
    maxRequests,
    identifier: () => `apikey:${apiKey}`
  })
}

// Rate limit by custom key
export function rateLimitByKey(
  key: string,
  maxRequests: number = 60,
  interval: number = 60000
) {
  return async (req: Request) => {
    return rateLimit(req, {
      interval,
      maxRequests,
      identifier: () => key
    })
  }
}

// Middleware for Next.js API routes
export function withRateLimit(
  handler: (req: Request, ...args: any[]) => Promise<Response>,
  config: RateLimitConfig = {}
) {
  return async (req: Request, ...args: any[]) => {
    const result = await rateLimit(req, config)
    
    // Set rate limit headers
    const headers = new Headers()
    headers.set('X-RateLimit-Limit', result.limit.toString())
    headers.set('X-RateLimit-Remaining', result.remaining.toString())
    headers.set('X-RateLimit-Reset', result.reset.toString())
    
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          limit: result.limit,
          remaining: result.remaining,
          reset: result.reset
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...Object.fromEntries(headers)
          }
        }
      )
    }
    
    const response = await handler(req, ...args)
    
    // Add rate limit headers to response
    Object.entries(Object.fromEntries(headers)).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }
}

// Create a rate limiter instance with custom config
export function createRateLimiter(config: RateLimitConfig) {
  return {
    limit: (req: Request) => rateLimit(req, config),
    middleware: (handler: (req: Request, ...args: any[]) => Promise<Response>) =>
      withRateLimit(handler, config)
  }
}

// Reset rate limit for a key
export async function resetRateLimit(key: string) {
  await store.reset(key)
}

// Reset all rate limits
export async function resetAllRateLimits() {
  await store.resetAll()
}

// Get rate limit info
export async function getRateLimitInfo(key: string) {
  return store.get(key)
}

// Example usage in API route
export async function GET(req: Request) {
  const result = await rateLimit(req, {
    maxRequests: 10,
    interval: 60000 // 10 requests per minute
  })
  
  if (!result.success) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded' }),
      { 
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString()
        }
      }
    )
  }
  
  return new Response(
    JSON.stringify({ message: 'Success' }),
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toString()
      }
    }
  )
}

// Example with middleware
export const POST = withRateLimit(
  async (req: Request) => {
    const body = await req.json()
    return new Response(JSON.stringify({ success: true }))
  },
  {
    maxRequests: 5,
    interval: 60000 // 5 requests per minute
  }
)

// Example with custom identifier
export const PUT = withRateLimit(
  async (req: Request) => {
    const body = await req.json()
    return new Response(JSON.stringify({ success: true }))
  },
  {
    maxRequests: 20,
    interval: 60000,
    identifier: (req) => {
      // Rate limit by API key in header
      const apiKey = req.headers.get('x-api-key')
      return apiKey || 'unknown'
    }
  }
)

// Example with different limits per endpoint
export const apiLimiter = createRateLimiter({
  maxRequests: 100,
  interval: 60000
})

// Usage
export const PATCH = apiLimiter.middleware(async (req: Request) => {
  return new Response(JSON.stringify({ success: true }))
})