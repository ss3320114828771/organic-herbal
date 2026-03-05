// lib/db.ts

// Mock database connection and utilities
export interface DatabaseConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  ssl?: boolean
}

// Default configuration from environment variables
const defaultConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'myapp',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true'
}

// Mock database connection
class DatabaseConnection {
  private config: DatabaseConfig
  private isConnected: boolean = false
  private queryCount: number = 0

  constructor(config: DatabaseConfig = defaultConfig) {
    this.config = config
  }

  async connect(): Promise<boolean> {
    try {
      console.log(`Connecting to database at ${this.config.host}:${this.config.port}/${this.config.database}`)
      await new Promise(resolve => setTimeout(resolve, 100))
      this.isConnected = true
      console.log('Database connected successfully')
      return true
    } catch (error) {
      console.error('Database connection failed:', error)
      return false
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false
    console.log('Database disconnected')
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Database not connected')
    }

    this.queryCount++
    console.log(`Executing query: ${sql}`)
    
    await new Promise(resolve => setTimeout(resolve, 50))
    
    return {
      rows: [],
      rowCount: 0,
      command: sql.split(' ')[0]
    }
  }

  getStatus() {
    return {
      connected: this.isConnected,
      queryCount: this.queryCount,
      config: { ...this.config, password: '***' }
    }
  }
}

// Create singleton instance
export const db = new DatabaseConnection()

// Mock data storage (for in-memory operations)
class MockDataStore {
  private stores: Map<string, any[]> = new Map()

  constructor() {
    // Users store
    this.stores.set('users', [
      { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      { id: '2', name: 'Regular User', email: 'user@example.com', role: 'user' }
    ])

    // Products store
    this.stores.set('products', [
      { id: '1', name: 'Product 1', price: 29.99, stock: 100 },
      { id: '2', name: 'Product 2', price: 49.99, stock: 50 }
    ])

    // Orders store
    this.stores.set('orders', [
      { id: '1', orderNumber: 'ORD-001', total: 70.38, status: 'delivered' },
      { id: '2', orderNumber: 'ORD-002', total: 59.49, status: 'shipped' }
    ])

    // Tasks store
    this.stores.set('tasks', [
      { 
        id: '1', 
        title: 'Complete project report', 
        status: 'pending',
        description: 'Finish the quarterly report',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '2', 
        title: 'Review pull requests', 
        status: 'in-progress',
        description: 'Check team PRs',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '3', 
        title: 'Update documentation', 
        status: 'completed',
        description: 'Update API docs',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ])

    // ===== PROJECTS STORE =====
    this.stores.set('projects', [
      { 
        id: '1', 
        name: 'Website Redesign', 
        status: 'active',
        description: 'Redesign company website with modern UI',
        progress: 65,
        ownerId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '2', 
        name: 'Mobile App Development', 
        status: 'planning',
        description: 'Build cross-platform mobile app',
        progress: 15,
        ownerId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '3', 
        name: 'Marketing Campaign', 
        status: 'completed',
        description: 'Q2 marketing campaign',
        progress: 100,
        ownerId: '2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ])
  }

  async find(store: string, query?: Partial<any>): Promise<any[]> {
    const data = this.stores.get(store) || []
    if (!query) return data

    return data.filter(item => {
      return Object.entries(query).every(([key, value]) => item[key] === value)
    })
  }

  async findOne(store: string, query: Partial<any>): Promise<any | null> {
    const results = await this.find(store, query)
    return results[0] || null
  }

  async findById(store: string, id: string): Promise<any | null> {
    const data = this.stores.get(store) || []
    return data.find(item => item.id === id) || null
  }

  async create(store: string, data: any): Promise<any> {
    const newItem = {
      id: String(Date.now()),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const storeData = this.stores.get(store) || []
    storeData.push(newItem)
    this.stores.set(store, storeData)
    
    return newItem
  }

  async update(store: string, id: string, data: Partial<any>): Promise<any | null> {
    const storeData = this.stores.get(store) || []
    const index = storeData.findIndex(item => item.id === id)
    
    if (index === -1) return null
    
    storeData[index] = {
      ...storeData[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    
    this.stores.set(store, storeData)
    return storeData[index]
  }

  async delete(store: string, id: string): Promise<boolean> {
    const storeData = this.stores.get(store) || []
    const newData = storeData.filter(item => item.id !== id)
    
    if (newData.length === storeData.length) return false
    
    this.stores.set(store, newData)
    return true
  }

  async count(store: string, query?: Partial<any>): Promise<number> {
    const results = await this.find(store, query)
    return results.length
  }

  async clear(store: string): Promise<void> {
    this.stores.set(store, [])
  }

  async clearAll(): Promise<void> {
    this.stores.clear()
  }
}

// Create mock store instance
export const mockDb = new MockDataStore()

// Query builder utilities
export const sql = {
  select: (table: string, fields: string[] = ['*']) => {
    return `SELECT ${fields.join(', ')} FROM ${table}`
  },

  insert: (table: string, data: Record<string, any>) => {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ')
    
    return {
      text: `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    }
  },

  update: (table: string, id: string | number, data: Record<string, any>) => {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ')
    
    return {
      text: `UPDATE ${table} SET ${setClause}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`,
      values: [...values, id]
    }
  },

  delete: (table: string, id: string | number) => {
    return {
      text: `DELETE FROM ${table} WHERE id = $1 RETURNING *`,
      values: [id]
    }
  },

  where: (condition: string, values: any[] = []) => {
    return { text: `WHERE ${condition}`, values }
  },

  orderBy: (field: string, direction: 'ASC' | 'DESC' = 'ASC') => {
    return `ORDER BY ${field} ${direction}`
  },

  limit: (count: number) => {
    return `LIMIT ${count}`
  },

  offset: (count: number) => {
    return `OFFSET ${count}`
  }
}

// Transaction helper
export async function transaction<T>(
  callback: (trx: { query: (sql: string, params?: any[]) => Promise<any> }) => Promise<T>
): Promise<T> {
  try {
    console.log('Beginning transaction')
    
    const result = await callback({
      query: async (sql: string, params: any[] = []) => {
        return db.query(sql, params)
      }
    })
    
    console.log('Committing transaction')
    return result
  } catch (error) {
    console.log('Rolling back transaction')
    throw error
  }
}

// Migration helper
export async function runMigrations() {
  const migrations = [
    {
      version: 1,
      name: 'create_users_table',
      up: async () => {
        await db.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `)
      },
      down: async () => {
        await db.query(`DROP TABLE IF EXISTS users`)
      }
    },
    {
      version: 2,
      name: 'create_products_table',
      up: async () => {
        await db.query(`
          CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            stock INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `)
      },
      down: async () => {
        await db.query(`DROP TABLE IF EXISTS products`)
      }
    }
  ]

  for (const migration of migrations) {
    console.log(`Running migration: ${migration.name}`)
    await migration.up()
  }

  console.log('All migrations completed')
}

// Health check
export async function healthCheck(): Promise<{
  status: 'healthy' | 'unhealthy'
  details: any
}> {
  try {
    const dbStatus = db.getStatus()
    
    return {
      status: dbStatus.connected ? 'healthy' : 'unhealthy',
      details: {
        database: dbStatus,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error: any) {
    return {
      status: 'unhealthy',
      details: {
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Example usage
export async function example() {
  await db.connect()

  const users = await mockDb.find('users')
  console.log('Users:', users)

  const user = await mockDb.findById('users', '1')
  console.log('User:', user)

  const newUser = await mockDb.create('users', {
    name: 'New User',
    email: 'new@example.com',
    role: 'user'
  })
  console.log('Created user:', newUser)

  const updated = await mockDb.update('users', newUser.id, {
    name: 'Updated Name'
  })
  console.log('Updated user:', updated)

  const admins = await mockDb.find('users', { role: 'admin' })
  console.log('Admins:', admins)

  const userCount = await mockDb.count('users')
  console.log('Total users:', userCount)

  await mockDb.delete('users', newUser.id)

  const health = await healthCheck()
  console.log('Health:', health)

  await db.disconnect()
}