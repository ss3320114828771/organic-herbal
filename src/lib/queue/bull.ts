// lib/queue/bull.ts

// Simple in-memory queue implementation (mock Bull)
type JobData = any
type JobResult = any

interface Job<T = JobData> {
  id: string
  name: string
  data: T
  opts: JobOptions
  attempts: number
  maxAttempts: number
  createdAt: number
  processedAt?: number
  completedAt?: number
  failedAt?: number
  error?: string
  result?: any
  progress: number
}

interface JobOptions {
  delay?: number
  attempts?: number
  backoff?: number | ((attempts: number) => number)
  removeOnComplete?: boolean
  removeOnFail?: boolean
  priority?: number
}

interface QueueOptions {
  name: string
  concurrency?: number
  defaultJobOptions?: JobOptions
}

type JobHandler<T = JobData, R = JobResult> = (job: Job<T>) => Promise<R>

class BullQueue {
  name: string
  private jobs: Map<string, Job> = new Map()
  private handlers: Map<string, JobHandler> = new Map()
  private processing: Set<string> = new Set()
  private concurrency: number
  private defaultJobOptions: JobOptions
  private timers: Map<string, NodeJS.Timeout> = new Map()
  private intervals: NodeJS.Timeout[] = []

  constructor(options: QueueOptions) {
    this.name = options.name
    this.concurrency = options.concurrency || 1
    this.defaultJobOptions = options.defaultJobOptions || {}

    // Process jobs periodically
    const interval = setInterval(() => this.processNext(), 100)
    this.intervals.push(interval)
  }

  // Add a job to the queue
  async add<T = JobData>(
    name: string,
    data: T,
    options: JobOptions = {}
  ): Promise<Job<T>> {
    const id = Math.random().toString(36).substring(2, 15)
    const now = Date.now()
    
    const jobOptions = { ...this.defaultJobOptions, ...options }
    const delay = jobOptions.delay || 0
    
    const job: Job<T> = {
      id,
      name,
      data,
      opts: jobOptions,
      attempts: 0,
      maxAttempts: jobOptions.attempts || 1,
      createdAt: now,
      progress: 0
    }

    this.jobs.set(id, job)

    // Handle delayed jobs
    if (delay > 0) {
      const timer = setTimeout(() => {
        this.jobs.set(id, { ...job, createdAt: Date.now() })
        this.timers.delete(id)
      }, delay)
      this.timers.set(id, timer)
    }

    return job
  }

  // Add multiple jobs
  async addBulk<T = JobData>(
    jobs: Array<{ name: string; data: T; opts?: JobOptions }>
  ): Promise<Job<T>[]> {
    return Promise.all(jobs.map(j => this.add(j.name, j.data, j.opts)))
  }

  // Process jobs of a specific type
  process<T = JobData, R = JobResult>(
    name: string,
    handler: JobHandler<T, R>
  ): void {
    this.handlers.set(name, handler as JobHandler)
  }

  // Process all job types
  processAll(handler: JobHandler): void {
    this.handlers.set('*', handler)
  }

  // Get a job by ID
  async getJob(jobId: string): Promise<Job | undefined> {
    return this.jobs.get(jobId)
  }

  // Get jobs by state
  async getJobs(types: ('waiting' | 'active' | 'completed' | 'failed')[]): Promise<Job[]> {
    const jobs: Job[] = []
    
    for (const job of this.jobs.values()) {
      const state = this.getJobState(job)
      if (types.includes(state as any)) {
        jobs.push(job)
      }
    }
    
    return jobs
  }

  // Get job counts
  async getJobCounts(): Promise<Record<string, number>> {
    const counts = {
      waiting: 0,
      active: 0,
      completed: 0,
      failed: 0,
      delayed: 0
    }

    for (const job of this.jobs.values()) {
      const state = this.getJobState(job)
      if (state in counts) {
        counts[state as keyof typeof counts]++
      }
    }

    return counts
  }

  // Remove a job
  async remove(jobId: string): Promise<void> {
    this.jobs.delete(jobId)
    this.processing.delete(jobId)
    
    const timer = this.timers.get(jobId)
    if (timer) {
      clearTimeout(timer)
      this.timers.delete(jobId)
    }
  }

  // Clean jobs
  async clean(grace: number, limit: number, type?: 'completed' | 'failed'): Promise<string[]> {
    const now = Date.now()
    const removed: string[] = []

    for (const [id, job] of this.jobs.entries()) {
      if (removed.length >= limit) break

      const jobState = this.getJobState(job)
      if (type && jobState !== type) continue

      const completedAt = job.completedAt || job.failedAt
      if (completedAt && now - completedAt > grace) {
        this.jobs.delete(id)
        removed.push(id)
      }
    }

    return removed
  }

  // Pause queue
  async pause(): Promise<void> {
    this.concurrency = 0
  }

  // Resume queue
  async resume(): Promise<void> {
    this.concurrency = 1
  }

  // Check if queue is paused
  isPaused(): boolean {
    return this.concurrency === 0
  }

  // Close queue
  async close(): Promise<void> {
    this.intervals.forEach(clearInterval)
    this.timers.forEach(clearTimeout)
    this.jobs.clear()
    this.processing.clear()
    this.handlers.clear()
  }

  // Private: Get job state
  private getJobState(job: Job): string {
    if (job.completedAt) return 'completed'
    if (job.failedAt) return 'failed'
    if (this.processing.has(job.id)) return 'active'
    if (job.opts.delay && job.createdAt + job.opts.delay > Date.now()) return 'delayed'
    return 'waiting'
  }

  // Private: Process next job - FIXED line 128
  private async processNext(): Promise<void> {
    if (this.processing.size >= this.concurrency) return

    // Find next waiting job
    const waitingJobs = Array.from(this.jobs.values())
      .filter(job => this.getJobState(job) === 'waiting')
      .sort((a, b) => (b.opts.priority || 0) - (a.opts.priority || 0))

    if (waitingJobs.length === 0) return

    const job = waitingJobs[0]
    this.processing.add(job.id)
    job.processedAt = Date.now()

    try {
      // Find handler
      const handler = this.handlers.get(job.name) || this.handlers.get('*')
      
      if (!handler) {
        throw new Error(`No handler for job type: ${job.name}`)
      }

      // Execute job
      job.attempts++
      const result = await handler(job)
      
      // Mark as completed
      job.completedAt = Date.now()
      job.result = result
      job.progress = 100
      
      this.processing.delete(job.id)

      // Remove if configured
      if (job.opts.removeOnComplete) {
        this.jobs.delete(job.id)
      }
    } catch (error: any) {
      console.error(`Job ${job.id} failed:`, error)

      // Retry logic
      if (job.attempts < job.maxAttempts) {
        // Calculate backoff
        let backoffMs = 0
        if (job.opts.backoff) {
          if (typeof job.opts.backoff === 'function') {
            backoffMs = job.opts.backoff(job.attempts)
          } else {
            backoffMs = job.opts.backoff
          }
        }

        // Re-add with delay
        setTimeout(() => {
          this.jobs.set(job.id, {
            ...job,
            processedAt: undefined,
            failedAt: undefined
          })
        }, backoffMs)
      } else {
        // Mark as failed
        job.failedAt = Date.now()
        job.error = error.message
      }

      this.processing.delete(job.id)

      // Remove if configured
      if (job.opts.removeOnFail) {
        this.jobs.delete(job.id)
      }
    }
  }
}

// Queue manager
class QueueManager {
  private queues: Map<string, BullQueue> = new Map()

  createQueue(name: string, options?: Partial<QueueOptions>): BullQueue {
    if (this.queues.has(name)) {
      return this.queues.get(name)!
    }

    const queue = new BullQueue({
      name,
      concurrency: options?.concurrency || 1,
      defaultJobOptions: options?.defaultJobOptions
    })

    this.queues.set(name, queue)
    return queue
  }

  getQueue(name: string): BullQueue | undefined {
    return this.queues.get(name)
  }

  async closeAll(): Promise<void> {
    for (const queue of this.queues.values()) {
      await queue.close()
    }
    this.queues.clear()
  }
}

// Export singleton
export const queueManager = new QueueManager()

// Export main class
export { BullQueue, type Job, type JobOptions, type JobHandler }