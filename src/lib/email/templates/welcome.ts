// email/templates/welcome.ts

interface WelcomeTemplateProps {
  userName: string
  loginUrl?: string
  email?: string
  siteName?: string
  supportEmail?: string
  logoUrl?: string
  features?: Array<{ name: string; description: string; icon?: string }>
  socialLinks?: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
  }
}

export function getWelcomeEmailTemplate({
  userName,
  loginUrl = 'https://yourapp.com/login',
  email = 'user@example.com',
  siteName = 'Our App',
  supportEmail = 'support@example.com',
  logoUrl = 'https://via.placeholder.com/150x50',
  features = [
    {
      name: 'Manage Your Account',
      description: 'View and edit your profile, settings, and preferences',
      icon: '👤'
    },
    {
      name: 'Explore Features',
      description: 'Discover all the powerful features we offer',
      icon: '✨'
    },
    {
      name: 'Get Support',
      description: '24/7 customer support to help you succeed',
      icon: '💬'
    }
  ],
  socialLinks = {
    twitter: 'https://twitter.com/yourapp',
    facebook: 'https://facebook.com/yourapp',
    instagram: 'https://instagram.com/yourapp',
    linkedin: 'https://linkedin.com/company/yourapp'
  }
}: WelcomeTemplateProps) {
  const subject = `Welcome to ${siteName}, ${userName}!`
  
  const text = `
Welcome to ${siteName}, ${userName}!

We're so excited to have you on board. Your account has been successfully created and you're now ready to start using ${siteName}.

Get Started:
1. Log in to your account: ${loginUrl}
2. Complete your profile
3. Explore all the features we offer

What you can do with ${siteName}:
${features.map(f => `- ${f.name}: ${f.description}`).join('\n')}

Need help? Our support team is here for you 24/7. Contact us at ${supportEmail}

Stay connected with us:
${Object.entries(socialLinks).map(([platform, url]) => `- ${platform}: ${url}`).join('\n')}

Happy exploring!
The ${siteName} Team
  `

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${siteName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .card {
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 48px 30px;
      text-align: center;
    }
    
    .logo {
      max-width: 150px;
      max-height: 50px;
      margin-bottom: 24px;
      filter: brightness(0) invert(1);
    }
    
    .header h1 {
      color: white;
      font-size: 32px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .header p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 18px;
      margin-top: 12px;
    }
    
    .content {
      padding: 48px 30px;
    }
    
    .greeting {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 16px;
    }
    
    .message {
      color: #4b5563;
      font-size: 16px;
      margin-bottom: 32px;
      line-height: 1.8;
    }
    
    .cta-section {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border-radius: 12px;
      padding: 30px;
      margin: 32px 0;
      text-align: center;
    }
    
    .cta-title {
      font-size: 20px;
      font-weight: 600;
      color: #065f46;
      margin-bottom: 16px;
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white !important;
      text-decoration: none;
      padding: 16px 40px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 18px;
      margin: 20px 0;
      box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 10px -1px rgba(16, 185, 129, 0.4);
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin: 40px 0;
    }
    
    .feature-card {
      text-align: center;
      padding: 20px;
      background-color: #f9fafb;
      border-radius: 12px;
      transition: transform 0.2s;
    }
    
    .feature-card:hover {
      transform: translateY(-4px);
    }
    
    .feature-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }
    
    .feature-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .feature-description {
      color: #6b7280;
      font-size: 12px;
      line-height: 1.5;
    }
    
    .quick-tips {
      background-color: #f9fafb;
      border-radius: 12px;
      padding: 30px;
      margin: 40px 0;
    }
    
    .tips-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 20px;
      text-align: center;
    }
    
    .tips-list {
      list-style: none;
      padding: 0;
    }
    
    .tip-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding: 12px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .tip-number {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      flex-shrink: 0;
    }
    
    .tip-text {
      color: #4b5563;
      font-size: 14px;
    }
    
    .social-links {
      text-align: center;
      margin: 40px 0;
      padding: 20px;
      border-top: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .social-title {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 16px;
    }
    
    .social-icons {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
    
    .social-icon {
      display: inline-block;
      width: 40px;
      height: 40px;
      background-color: #f3f4f6;
      border-radius: 50%;
      line-height: 40px;
      text-align: center;
      color: #4b5563;
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .social-icon:hover {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      transform: scale(1.1);
    }
    
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      padding: 32px 20px;
    }
    
    .footer a {
      color: #10b981;
      text-decoration: none;
    }
    
    .footer a:hover {
      text-decoration: underline;
    }
    
    @media only screen and (max-width: 600px) {
      .container {
        padding: 10px;
      }
      
      .header {
        padding: 40px 20px;
      }
      
      .header h1 {
        font-size: 28px;
      }
      
      .content {
        padding: 30px 20px;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      
      .feature-card {
        padding: 16px;
      }
      
      .cta-button {
        display: block;
        padding: 14px 20px;
      }
      
      .social-icons {
        gap: 12px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <!-- Header -->
      <div class="header">
        ${logoUrl ? `<img src="${logoUrl}" alt="${siteName}" class="logo">` : ''}
        <h1>Welcome to ${siteName}!</h1>
        <p>We're thrilled to have you join us</p>
      </div>
      
      <!-- Content -->
      <div class="content">
        <div class="greeting">
          👋 Hello ${userName},
        </div>
        
        <div class="message">
          <p>Thank you for joining ${siteName}! Your account has been successfully created and you're now part of our growing community.</p>
        </div>
        
        <!-- CTA Section -->
        <div class="cta-section">
          <div class="cta-title">Ready to get started?</div>
          <p style="color: #065f46; margin-bottom: 20px;">
            Log in now and explore all the amazing features waiting for you.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center">
                <a href="${loginUrl}" class="cta-button">
                  Log In to Your Account →
                </a>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Features Grid -->
        <div class="features-grid">
          ${features.map(feature => `
            <div class="feature-card">
              <div class="feature-icon">${feature.icon || '✨'}</div>
              <div class="feature-name">${feature.name}</div>
              <div class="feature-description">${feature.description}</div>
            </div>
          `).join('')}
        </div>
        
        <!-- Quick Tips -->
        <div class="quick-tips">
          <div class="tips-title">💡 Quick Tips to Get Started</div>
          <div class="tips-list">
            <div class="tip-item">
              <span class="tip-number">1</span>
              <span class="tip-text">Complete your profile to personalize your experience</span>
            </div>
            <div class="tip-item">
              <span class="tip-number">2</span>
              <span class="tip-text">Explore the dashboard to discover all features</span>
            </div>
            <div class="tip-item">
              <span class="tip-number">3</span>
              <span class="tip-text">Connect with other community members</span>
            </div>
            <div class="tip-item">
              <span class="tip-number">4</span>
              <span class="tip-text">Check out our tutorials and documentation</span>
            </div>
          </div>
        </div>
        
        <!-- Account Info -->
        <div style="background-color: #ecfdf5; border-radius: 8px; padding: 20px; margin: 30px 0;">
          <p style="margin: 0; color: #065f46;">
            <strong>📧 Account Email:</strong> ${email}<br>
            <small>Keep this email handy for account-related communications.</small>
          </p>
        </div>
        
        <!-- Social Links -->
        ${Object.values(socialLinks).some(Boolean) ? `
          <div class="social-links">
            <div class="social-title">Connect with us</div>
            <div class="social-icons">
              ${socialLinks.twitter ? `
                <a href="${socialLinks.twitter}" class="social-icon" target="_blank" rel="noopener noreferrer">𝕏</a>
              ` : ''}
              ${socialLinks.facebook ? `
                <a href="${socialLinks.facebook}" class="social-icon" target="_blank" rel="noopener noreferrer">f</a>
              ` : ''}
              ${socialLinks.instagram ? `
                <a href="${socialLinks.instagram}" class="social-icon" target="_blank" rel="noopener noreferrer">📷</a>
              ` : ''}
              ${socialLinks.linkedin ? `
                <a href="${socialLinks.linkedin}" class="social-icon" target="_blank" rel="noopener noreferrer">in</a>
              ` : ''}
            </div>
          </div>
        ` : ''}
        
        <!-- Footer -->
        <div class="footer">
          <p>
            Need help? Our support team is here for you 24/7.<br>
            Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>
          </p>
          <p style="margin-top: 20px;">
            &copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.<br>
            <small>You're receiving this email because you created an account with ${siteName}.</small>
          </p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `

  return {
    subject,
    text,
    html
  }
}

// Simplified welcome email
export function getSimpleWelcomeEmail({
  userName,
  loginUrl,
  siteName = 'Our App'
}: WelcomeTemplateProps) {
  const subject = `Welcome to ${siteName}, ${userName}!`
  
  const text = `
Welcome to ${siteName}, ${userName}!

Your account has been created successfully.

Log in here: ${loginUrl || 'https://yourapp.com/login'}

Thanks for joining us!

The ${siteName} Team
  `

  const html = `
<!DOCTYPE html>
<html>
<body>
  <h2>Welcome to ${siteName}, ${userName}!</h2>
  <p>Your account has been created successfully.</p>
  <p><a href="${loginUrl || 'https://yourapp.com/login'}">Click here to log in</a></p>
  <p>Thanks for joining us!</p>
  <p>The ${siteName} Team</p>
</body>
</html>
  `

  return { subject, text, html }
}

// Example usage
export async function sendWelcomeEmail(user: { name: string; email: string }) {
  const { subject, html, text } = getWelcomeEmailTemplate({
    userName: user.name,
    loginUrl: 'https://yourapp.com/dashboard',
    email: user.email,
    siteName: 'MyApp',
    features: [
      {
        name: 'Dashboard',
        description: 'Track your progress and activity',
        icon: '📊'
      },
      {
        name: 'Analytics',
        description: 'Get insights and reports',
        icon: '📈'
      },
      {
        name: 'Support',
        description: '24/7 customer support',
        icon: '🎯'
      }
    ]
  })

  // Use your email service here
  // await sendEmail({
  //   to: user.email,
  //   subject,
  //   text,
  //   html
  // })
}