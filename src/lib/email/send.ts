// email/send.ts

interface EmailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  from?: string
  cc?: string | string[]
  bcc?: string | string[]
  attachments?: Array<{
    filename: string
    content?: Buffer | string
    path?: string
    contentType?: string
  }>
}

// Mock email service (logs to console instead of sending)
export async function sendEmail(options: EmailOptions): Promise<{
  success: boolean
  messageId?: string
  error?: string
}> {
  try {
    // Generate a mock message ID
    const messageId = `mock-${Date.now()}-${Math.random().toString(36).substring(7)}`
    
    // Log the email to console (for development)
    console.log('📧 Email would be sent:')
    console.log('  To:', options.to)
    console.log('  Subject:', options.subject)
    console.log('  From:', options.from || 'default@example.com')
    if (options.cc) console.log('  CC:', options.cc)
    if (options.bcc) console.log('  BCC:', options.bcc)
    if (options.text) console.log('  Text:', options.text.substring(0, 100) + '...')
    if (options.attachments) console.log('  Attachments:', options.attachments.length)
    
    // In production, you would integrate with a real email service here
    // Example: AWS SES, SendGrid, Mailgun, etc.
    
    return {
      success: true,
      messageId
    }
  } catch (error: any) {
    console.error('Email send error:', error)
    return {
      success: false,
      error: error.message || 'Failed to send email'
    }
  }
}

// Send multiple emails
export async function sendBulkEmails(
  emails: EmailOptions[],
  batchSize: number = 10
): Promise<{
  success: boolean
  sent: number
  failed: number
  errors: Array<{ email: string; error: string }>
}> {
  const results = {
    success: true,
    sent: 0,
    failed: 0,
    errors: [] as Array<{ email: string; error: string }>
  }

  // Process in batches
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize)
    
    const batchPromises = batch.map(async (email) => {
      const result = await sendEmail(email)
      if (result.success) {
        results.sent++
      } else {
        results.failed++
        results.errors.push({
          email: Array.isArray(email.to) ? email.to.join(', ') : email.to,
          error: result.error || 'Unknown error'
        })
      }
    })

    await Promise.all(batchPromises)
    
    // Small delay between batches
    if (i + batchSize < emails.length) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  results.success = results.failed === 0
  return results
}

// Send template email
export async function sendTemplateEmail(
  to: string | string[],
  template: {
    subject: string
    text: string
    html: string
  },
  options?: Partial<EmailOptions>
) {
  return sendEmail({
    to,
    subject: template.subject,
    text: template.text,
    html: template.html,
    ...options
  })
}

// Send test email
export async function sendTestEmail(to: string) {
  return sendEmail({
    to,
    subject: 'Test Email',
    text: 'This is a test email from your application.',
    html: '<h1>Test Email</h1><p>This is a test email from your application.</p>'
  })
}

// Simple in-memory queue for emails
class EmailQueue {
  private queue: Array<EmailOptions & { id: string; retries: number }> = []
  private processing = false
  private maxRetries = 3

  async add(email: EmailOptions) {
    const id = Math.random().toString(36).substring(7)
    this.queue.push({ ...email, id, retries: 0 })
    
    if (!this.processing) {
      this.process()
    }
    
    return id
  }

  private async process() {
    this.processing = true
    
    while (this.queue.length > 0) {
      const email = this.queue.shift()
      if (!email) continue

      try {
        const result = await sendEmail(email)
        if (!result.success && email.retries < this.maxRetries) {
          // Requeue with incremented retry count
          this.queue.push({
            ...email,
            retries: email.retries + 1
          })
          console.log(`Requeued email ${email.id} (retry ${email.retries + 1})`)
        }
      } catch (error) {
        console.error(`Failed to process email ${email.id}:`, error)
      }

      // Small delay between emails
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    this.processing = false
  }

  getQueueLength() {
    return this.queue.length
  }

  clear() {
    this.queue = []
  }
}

export const emailQueue = new EmailQueue()

// Example usage
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const html = `
    <h1>Welcome ${userName}!</h1>
    <p>Thank you for joining our platform.</p>
    <p><a href="https://yourapp.com/dashboard">Get Started</a></p>
  `

  const text = `
    Welcome ${userName}!
    Thank you for joining our platform.
    Get started: https://yourapp.com/dashboard
  `

  return sendTemplateEmail(userEmail, {
    subject: `Welcome to Our App, ${userName}!`,
    text,
    html
  })
}

// Real email service integration example
export function createEmailService(provider: 'sendgrid' | 'ses' | 'mailgun', config: any) {
  // This would integrate with actual email services
  return {
    async send(options: EmailOptions) {
      console.log(`Sending via ${provider} with config:`, config)
      return sendEmail(options) // Mock implementation
    }
  }
}

// Usage examples
async function examples() {
  // Send single email
  await sendEmail({
    to: 'user@example.com',
    subject: 'Hello',
    text: 'Hello world',
    html: '<p>Hello world</p>'
  })

  // Send to multiple recipients
  await sendEmail({
    to: ['user1@example.com', 'user2@example.com'],
    subject: 'Newsletter',
    text: 'Monthly newsletter',
    html: '<h1>Monthly Newsletter</h1>'
  })

  // Send with attachments (mock)
  await sendEmail({
    to: 'user@example.com',
    subject: 'Report',
    text: 'Monthly report attached',
    attachments: [
      {
        filename: 'report.pdf',
        content: 'Mock PDF content'
      }
    ]
  })

  // Welcome email
  await sendWelcomeEmail('john@example.com', 'John')

  // Queue emails
  await emailQueue.add({
    to: 'user@example.com',
    subject: 'Queued Email',
    text: 'This will be sent via queue'
  })

  // Check queue
  console.log('Queue length:', emailQueue.getQueueLength())
}