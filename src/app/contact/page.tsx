'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    priority: 'normal'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('general')

  useEffect(() => {
    setMounted(true)
  }, [])

  const topics = [
    { id: 'general', label: 'General Inquiry', icon: '📧', color: 'from-blue-500 to-cyan-500' },
    { id: 'product', label: 'Product Question', icon: '🌿', color: 'from-green-500 to-emerald-500' },
    { id: 'order', label: 'Order Support', icon: '📦', color: 'from-purple-500 to-pink-500' },
    { id: 'wholesale', label: 'Wholesale', icon: '🤝', color: 'from-yellow-500 to-orange-500' },
    { id: 'feedback', label: 'Feedback', icon: '💭', color: 'from-indigo-500 to-purple-500' },
    { id: 'complaint', label: 'Complaint', icon: '⚠️', color: 'from-red-500 to-pink-500' }
  ]

  const faqs = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer 30-day returns on all unopened products. Please contact us for return authorization.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 50 countries worldwide. Shipping costs and times vary by location.'
    },
    {
      question: 'Are your products certified organic?',
      answer: 'Yes, all our products are USDA certified organic and third-party tested for purity.'
    }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (!formData.message.trim()) {
      setError('Message is required')
      return false
    }
    if (formData.message.length < 10) {
      setError('Message must be at least 10 characters')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setError('')

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Form submitted:', { ...formData, topic: selectedTopic })
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        priority: 'normal'
      })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
        <div className="absolute bottom-40 right-40 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-6000"></div>
      </div>

      {/* Stars Effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              background: `hsl(${Math.random() * 60 + 80}, 80%, 70%)`,
              borderRadius: '50%',
              boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`,
              animation: `twinkle ${Math.random() * 4 + 2}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Bismillah at Top */}
        <div className="text-center mb-12 transform hover:scale-105 transition-all duration-500">
          <div className="inline-block bg-white/80 backdrop-blur-lg px-8 py-4 rounded-2xl border border-green-200 shadow-2xl">
            <p className="text-green-800 text-3xl font-arabic animate-glow">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-gradient">
              Get in Touch
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our products? Need help with an order? We're here to help!
            Reach out to us and we'll respond within 24 hours.
          </p>
        </div>

        {/* Quick Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-green-100">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📍</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Visit Us</h3>
            <p className="text-gray-600">123 Herbal Lane<br />Natural Valley, CA 94567</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-green-100">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📞</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Call Us</h3>
            <p className="text-gray-600">+1 (555) 123-4567<br />Mon-Fri, 9am-6pm</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-green-100">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✉️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Email Us</h3>
            <p className="text-gray-600">support@herbalheaven.com<br />info@herbalheaven.com</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-green-100">
              
              {!isSubmitted ? (
                <>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                  
                  {/* Topic Selection */}
                  <div className="mb-8">
                    <label className="block text-gray-700 font-semibold mb-3">What can we help you with?</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {topics.map((topic) => (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => setSelectedTopic(topic.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedTopic === topic.id
                              ? `bg-gradient-to-r ${topic.color} text-white border-transparent`
                              : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
                          }`}
                        >
                          <div className="text-2xl mb-1">{topic.icon}</div>
                          <div className="text-sm font-medium">{topic.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-sm flex items-center">
                        <span className="mr-2">⚠️</span>
                        {error}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    {/* Phone and Subject Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Phone Number <span className="text-gray-400 text-sm">(optional)</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What's this about?"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Please describe your question or concern in detail..."
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors resize-none"
                        disabled={isSubmitting}
                      />
                      <p className="text-right text-sm text-gray-400 mt-1">
                        {formData.message.length} / 500
                      </p>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Priority</label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                        disabled={isSubmitting}
                      >
                        <option value="low">Low - General inquiry</option>
                        <option value="normal">Normal - Need assistance</option>
                        <option value="high">High - Urgent matter</option>
                        <option value="critical">Critical - Emergency</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          Send Message
                          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                      )}
                    </button>

                    <p className="text-sm text-gray-400 text-center">
                      <span className="text-red-500">*</span> Required fields
                    </p>
                  </form>
                </>
              ) : (
                /* Success Message */
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce">
                    <span className="text-5xl">✓</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Your message has been sent successfully. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* FAQ Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">❓</span>
                Frequently Asked
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/faq"
                className="mt-4 inline-flex items-center text-green-600 hover:text-green-700 font-semibold"
              >
                View all FAQs
                <span className="ml-1">→</span>
              </Link>
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-2xl mr-2">🕒</span>
                Business Hours
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
              <p className="mt-4 text-white/80 text-sm">
                We respond to emails within 24 hours during business days.
              </p>
            </div>

            {/* Social Links */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Connect With Us</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: '📘', name: 'Facebook', color: 'from-blue-600 to-blue-700' },
                  { icon: '📷', name: 'Instagram', color: 'from-purple-600 to-pink-600' },
                  { icon: '🐦', name: 'Twitter', color: 'from-sky-500 to-blue-500' },
                  { icon: '📱', name: 'TikTok', color: 'from-gray-900 to-gray-800' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`aspect-square bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center text-white text-2xl transform hover:scale-110 transition-all duration-300`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Admin Contact */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">👑 Administrator</h3>
              <p className="text-lg font-semibold">Hafiz Sajid Syed</p>
              <a 
                href="mailto:sajid.syed@gmail.com" 
                className="text-white/90 hover:text-white mt-2 block"
              >
                sajid.syed@gmail.com
              </a>
              <p className="text-white/80 text-sm mt-4">
                                For urgent matters or business inquiries, please contact our administrator directly.
              </p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-green-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Find Us Here</h2>
            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🗺️</div>
                <p className="text-gray-600">Interactive Map</p>
                <p className="text-sm text-gray-500 mt-2">123 Herbal Lane, Natural Valley, CA 94567</p>
                <a 
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🔒', text: 'Secure Contact' },
            { icon: '⚡', text: 'Fast Response' },
            { icon: '🌿', text: 'Expert Support' },
            { icon: '✓', text: 'Verified Business' }
          ].map((badge, index) => (
            <div key={index} className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">{badge.icon}</div>
              <p className="text-sm text-gray-600">{badge.text}</p>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-green-100">
          <p className="text-gray-600 text-sm text-center">
            We typically respond within 24 hours. For immediate assistance, please call our support line.
          </p>
        </div>
      </div>

      {/* Custom Animations CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        
        @keyframes glow {
          from { text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #4ade80; }
          to { text-shadow: 0 0 20px #fff, 0 0 30px #86efac, 0 0 40px #4ade80; }
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  )
}