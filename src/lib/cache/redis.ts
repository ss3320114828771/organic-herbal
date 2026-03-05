// lib/cache/redis.ts

// Mock Redis client for development
class MockRedisClient {
  private store: Map<string, any> = new Map()
  private expirations: Map<string, NodeJS.Timeout> = new Map()

  async get(key: string): Promise<any> {
    return this.store.get(key) || null
  }

  async set(key: string, value: any, options?: { ex?: number }): Promise<'OK'> {
    this.store.set(key, value)
    
    // Handle expiration
    if (options?.ex) {
      const timeout = setTimeout(() => {
        this.store.delete(key)
        this.expirations.delete(key)
      }, options.ex * 1000)
      
      // Clear previous expiration if exists
      if (this.expirations.has(key)) {
        clearTimeout(this.expirations.get(key))
      }
      this.expirations.set(key, timeout)
    }
    
    return 'OK'
  }

  async del(key: string): Promise<number> {
    const deleted = this.store.delete(key) ? 1 : 0
    if (this.expirations.has(key)) {
      clearTimeout(this.expirations.get(key))
      this.expirations.delete(key)
    }
    return deleted
  }

  async exists(key: string): Promise<number> {
    return this.store.has(key) ? 1 : 0
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (this.store.has(key)) {
      const timeout = setTimeout(() => {
        this.store.delete(key)
        this.expirations.delete(key)
      }, seconds * 1000)
      
      if (this.expirations.has(key)) {
        clearTimeout(this.expirations.get(key))
      }
      this.expirations.set(key, timeout)
      return 1
    }
    return 0
  }

  async ttl(key: string): Promise<number> {
    return this.store.has(key) ? -1 : -2
  }

  async incr(key: string): Promise<number> {
    const current = (this.store.get(key) as number) || 0
    const newValue = current + 1
    this.store.set(key, newValue)
    return newValue
  }

  async decr(key: string): Promise<number> {
    const current = (this.store.get(key) as number) || 0
    const newValue = current - 1
    this.store.set(key, newValue)
    return newValue
  }

  async flushAll(): Promise<'OK'> {
    this.store.clear()
    this.expirations.forEach(timeout => clearTimeout(timeout))
    this.expirations.clear()
    return 'OK'
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$')
    return Array.from(this.store.keys()).filter(key => regex.test(key))
  }

  async mget(keys: string[]): Promise<any[]> {
    return keys.map(key => this.store.get(key) || null)
  }

  async mset(keyValues: Record<string, any>): Promise<'OK'> {
    Object.entries(keyValues).forEach(([key, value]) => {
      this.store.set(key, value)
    })
    return 'OK'
  }
}

// Export a singleton instance
export const redis = new MockRedisClient()

// Cache utility functions
export const cache = {
  // Get value from cache
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  },

  // Set value in cache
  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    try {
      const stringValue = JSON.stringify(value)
      if (ttlSeconds) {
        await redis.set(key, stringValue, { ex: ttlSeconds })
      } else {
        await redis.set(key, stringValue)
      }
      return true
    } catch (error) {
      console.error('Redis set error:', error)
      return false
    }
  },

  // Delete from cache
  async del(key: string): Promise<boolean> {
    try {
      const result = await redis.del(key)
      return result > 0
    } catch (error) {
      console.error('Redis del error:', error)
      return false
    }
  },

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key)
      return result === 1
    } catch (error) {
      console.error('Redis exists error:', error)
      return false
    }
  },

  // Get multiple keys
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const results = await redis.mget(keys)
      return results.map(r => r ? JSON.parse(r) : null)
    } catch (error) {
      console.error('Redis mget error:', error)
      return keys.map(() => null)
    }
  },

  // Set multiple keys
  async mset(obj: Record<string, any>, ttlSeconds?: number): Promise<boolean> {
    try {
      const stringified: Record<string, string> = {}
      Object.entries(obj).forEach(([key, value]) => {
        stringified[key] = JSON.stringify(value)
      })
      await redis.mset(stringified)
      
      if (ttlSeconds) {
        await Promise.all(
          Object.keys(obj).map(key => redis.expire(key, ttlSeconds))
        )
      }
      return true
    } catch (error) {
      console.error('Redis mset error:', error)
      return false
    }
  },

  // Increment counter
  async incr(key: string): Promise<number | null> {
    try {
      return await redis.incr(key)
    } catch (error) {
      console.error('Redis incr error:', error)
      return null
    }
  },

  // Decrement counter
  async decr(key: string): Promise<number | null> {
    try {
      return await redis.decr(key)
    } catch (error) {
      console.error('Redis decr error:', error)
      return null
    }
  },

  // Get TTL
  async ttl(key: string): Promise<number> {
    try {
      return await redis.ttl(key)
    } catch (error) {
      console.error('Redis ttl error:', error)
      return -2
    }
  },

  // Set expiration
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await redis.expire(key, seconds)
      return result === 1
    } catch (error) {
      console.error('Redis expire error:', error)
      return false
    }
  },

  // Get keys by pattern
  async keys(pattern: string): Promise<string[]> {
    try {
      return await redis.keys(pattern)
    } catch (error) {
      console.error('Redis keys error:', error)
      return []
    }
  },

  // Clear all cache
  async flushAll(): Promise<boolean> {
    try {
      await redis.flushAll()
      return true
    } catch (error) {
      console.error('Redis flushAll error:', error)
      return false
    }
  },

  // Cache wrapper for async functions
  async remember<T>(
    key: string,
    fn: () => Promise<T>,
    ttlSeconds?: number
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const fresh = await fn()
    await this.set(key, fresh, ttlSeconds)
    return fresh
  },

  // Cache wrapper with force refresh
  async refresh<T>(
    key: string,
    fn: () => Promise<T>,
    ttlSeconds?: number
  ): Promise<T> {
    const fresh = await fn()
    await this.set(key, fresh, ttlSeconds)
    return fresh
  },

  // Delete by pattern
  async delPattern(pattern: string): Promise<number> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length === 0) return 0
      
      const results = await Promise.all(keys.map(k => redis.del(k)))
      return results.filter(r => r > 0).length
    } catch (error) {
      console.error('Redis delPattern error:', error)
      return 0
    }
  }
}

// Example usage component
export async function exampleUsage() {
  // Simple set/get
  await cache.set('user:1', { name: 'John', email: 'john@example.com' }, 3600)
  const user = await cache.get('user:1')
  console.log('User:', user)

  // Cache function results
  const data = await cache.remember('api:data', async () => {
    const response = await fetch('https://api.example.com/data')
    return response.json()
  }, 300)

  // Counters
  await cache.incr('visitor:count')
  const count = await cache.get<number>('visitor:count')
  console.log('Visitors:', count)

  // Multiple keys
  await cache.mset({
    'post:1': { title: 'Post 1' },
    'post:2': { title: 'Post 2' }
  }, 3600)

  const posts = await cache.mget(['post:1', 'post:2'])
  console.log('Posts:', posts)

  // Delete by pattern
  await cache.delPattern('post:*')
}