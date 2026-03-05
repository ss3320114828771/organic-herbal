// email/templates/confirmation.ts

interface ConfirmationTemplateProps {
  userName: string
  confirmationLink: string
  email?: string
  expiresIn?: number
  siteName?: string
  supportEmail?: string
  logoUrl?: string
}

export function getConfirmationEmailTemplate({
  userName,
  confirmationLink,
  email = 'user@example.com',
  expiresIn = 24,
  siteName = 'Our App',
  supportEmail = 'support@example.com',
  logoUrl = 'https://via.placeholder.com/150x50'
}: ConfirmationTemplateProps) {
  const subject = `Confirm your email for ${siteName}`
  
  const text = `
Hello ${userName},

Thank you for signing up for ${siteName}! Please confirm your email address to get started.

Click the link below to confirm your email:
${confirmationLink}

This link will expire in ${expiresIn} hours.

If you didn't create an account with ${siteName}, you can safely ignore this email.

Need help? Contact us at ${supportEmail}

Best regards,
The ${siteName} Team
  `

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email</title>
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
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .card {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 40px 30px;
      text-align: center;
    }
    
    .logo {
      max-width: 150px;
      max-height: 50px;
      margin-bottom: 20px;
    }
    
    .header h1 {
      color: white;
      font-size: 28px;
      font-weight: 600;
      margin: 0;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    
    .message {
      color: #4b5563;
      margin-bottom: 30px;
    }
    
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white !important;
      text-decoration: none;
      padding: 14px 30px;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    
    .button:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
    }
    
    .link {
      color: #10b981;
      word-break: break-all;
      margin: 15px 0;
      font-size: 14px;
    }
    
    .expiry {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    .expiry p {
      color: #92400e;
      margin: 0;
    }
    
    .divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 30px 0;
    }
    
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
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
        padding: 30px 20px;
      }
      
      .content {
        padding: 30px 20px;
      }
      
      .button {
        display: block;
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
        <h1>Confirm Your Email</h1>
      </div>
      
      <!-- Content -->
      <div class="content">
        <div class="greeting">
          Hello ${userName},
        </div>
        
        <div class="message">
          <p>Thank you for signing up for ${siteName}! Please confirm your email address to get started.</p>
        </div>
        
        <!-- CTA Button -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center">
              <a href="${confirmationLink}" class="button">
                Confirm Email Address
              </a>
            </td>
          </tr>
        </table>
        
        <!-- Direct Link -->
        <div class="link">
          <p>Or copy and paste this link into your browser:</p>
          <p><a href="${confirmationLink}" style="color: #10b981;">${confirmationLink}</a></p>
        </div>
        
        <!-- Expiry Notice -->
        <div class="expiry">
          <p>⚠️ This confirmation link will expire in ${expiresIn} hours.</p>
        </div>
        
        <!-- Alternative Email Notice -->
        <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 4px;">
          <p style="margin: 0; color: #4b5563; font-size: 14px;">
            <strong>Email sent to:</strong> ${email}<br>
            <small>If this email address is incorrect, please sign up again with the correct email.</small>
          </p>
        </div>
        
        <!-- Divider -->
        <div class="divider"></div>
        
        <!-- Footer -->
        <div class="footer">
          <p>
            If you didn't create an account with ${siteName}, you can safely ignore this email.
          </p>
          <p>
            Need help? Contact us at 
            <a href="mailto:${supportEmail}">${supportEmail}</a>
          </p>
          <p style="margin-top: 20px;">
            &copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.
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

// Simplified version without styling
export function getSimpleConfirmationEmail({
  userName,
  confirmationLink,
  siteName = 'Our App'
}: ConfirmationTemplateProps) {
  const subject = `Confirm your email for ${siteName}`
  
  const text = `
Hello ${userName},

Please confirm your email address by clicking this link:
${confirmationLink}

Thanks,
The ${siteName} Team
  `

  const html = `
<!DOCTYPE html>
<html>
<body>
  <h2>Hello ${userName},</h2>
  <p>Please confirm your email address by clicking the link below:</p>
  <p><a href="${confirmationLink}">Confirm Email</a></p>
  <p>Thanks,<br>The ${siteName} Team</p>
</body>
</html>
  `

  return { subject, text, html }
}

// Example usage
export async function sendConfirmationEmail(user: { name: string; email: string }) {
  const confirmationLink = `https://example.com/confirm?token=${generateToken()}`
  
  const { subject, html, text } = getConfirmationEmailTemplate({
    userName: user.name,
    confirmationLink,
    email: user.email,
    siteName: 'MyApp'
  })

  // Use your email service here
  // await sendEmail({
  //   to: user.email,
  //   subject,
  //   text,
  //   html
  // })
}

function generateToken() {
  return Math.random().toString(36).substring(2, 15)
}