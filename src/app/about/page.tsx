'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('story')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
        <div className="absolute bottom-40 right-40 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-6000"></div>

        {/* Herbal Pattern */}
        <div className="absolute inset-0 bg-[url('/leaf-pattern.png')] bg-repeat opacity-5"></div>

        {/* Floating Leaves */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-10 animate-float-leaf"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatLeaf ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {i % 3 === 0 ? '🌿' : i % 3 === 1 ? '🍃' : '🌱'}
          </div>
        ))}
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

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Bismillah at Top */}
        <div className="text-center mb-12 transform hover:scale-105 transition-all duration-500">
          <div className="inline-block bg-white/80 backdrop-blur-lg px-8 py-4 rounded-2xl border border-green-200 shadow-2xl">
            <p className="text-green-800 text-3xl font-arabic animate-glow">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-gradient">
              About Herbal Heaven
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the story behind your trusted source for premium organic herbal products, 
            where nature's wisdom meets modern wellness.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'story', label: 'Our Story', icon: '📖' },
            { id: 'mission', label: 'Mission & Vision', icon: '🎯' },
            { id: 'values', label: 'Our Values', icon: '💚' },
            { id: 'team', label: 'Our Team', icon: '👥' },
            { id: 'quality', label: 'Quality Promise', icon: '✨' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
          
          {/* Our Story Tab */}
          {activeTab === 'story' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Journey</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Founded in 2020 by <span className="font-semibold text-green-700">Hafiz Sajid Syed</span>, 
                    Herbal Heaven began with a simple vision: to bring the purest, most potent herbal remedies 
                    from nature's pharmacy to people seeking natural wellness solutions.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    What started as a small collection of traditional family recipes has grown into a 
                    comprehensive range of over 200 organic products, each carefully crafted to support 
                    your health journey naturally.
                  </p>
                  <div className="flex items-center space-x-4 pt-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-white flex items-center justify-center text-white font-bold"
                        >
                          {['HS', 'AS', 'RK', 'MJ'][i-1]}
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-500">+ 50 team members</p>
                  </div>
                </div>
                <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <Image
                    src="/about-story.jpg"
                    alt="Our Story"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="pt-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Timeline</h3>
                <div className="relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-400 to-emerald-600 rounded-full"></div>
                  {[
                    { year: '2020', title: 'Founded', desc: 'Started with 10 products' },
                    { year: '2021', title: 'Expanded', desc: 'Grew to 50 products' },
                    { year: '2022', title: 'Certified', desc: 'USDA Organic Certification' },
                    { year: '2023', title: 'Global', desc: 'Shipped to 20+ countries' },
                    { year: '2024', title: 'Innovation', desc: 'Launched 100+ new products' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`relative flex items-center mb-8 ${
                        index % 2 === 0 ? 'md:flex-row-reverse' : ''
                      }`}
                    >
                      <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                        <div className="bg-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
                          <span className="text-3xl font-bold text-green-600">{item.year}</span>
                          <h4 className="text-xl font-semibold text-gray-800 mt-2">{item.title}</h4>
                          <p className="text-gray-600 mt-1">{item.desc}</p>
                        </div>
                      </div>
                      <div className="w-12 flex justify-center">
                        <div className="w-4 h-4 bg-green-600 rounded-full ring-4 ring-green-200"></div>
                      </div>
                      <div className="flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mission & Vision Tab */}
          {activeTab === 'mission' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl transform hover:scale-105 transition-all duration-500">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-4xl">🎯</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To empower individuals on their wellness journey by providing the highest quality 
                  organic herbal products, backed by traditional wisdom and modern science, while 
                  promoting sustainable farming practices and supporting local communities.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {[
                    { number: '100%', label: 'Organic' },
                    { number: '50+', label: 'Herbs' },
                    { number: '10k+', label: 'Customers' },
                    { number: '20+', label: 'Countries' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stat.number}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-3xl transform hover:scale-105 transition-all duration-500">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-4xl">👁️</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To become the world's most trusted name in organic herbal wellness, creating a 
                  global community where natural health solutions are accessible to everyone, and 
                  where traditional healing practices are preserved and celebrated.
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    'Global leader in organic herbs',
                    'Sustainable farming network',
                    'Research & innovation hub',
                    'Community wellness programs',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Our Values Tab */}
          {activeTab === 'values' && (
            <div className="space-y-12">
              <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">The Principles That Guide Us</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: '🌱',
                    title: 'Purity',
                    desc: '100% organic, non-GMO, and free from harmful additives',
                    color: 'from-green-500 to-emerald-500',
                  },
                  {
                    icon: '🤝',
                    title: 'Integrity',
                    desc: 'Honest sourcing, transparent practices, fair trade',
                    color: 'from-blue-500 to-cyan-500',
                  },
                  {
                    icon: '🌍',
                    title: 'Sustainability',
                    desc: 'Eco-friendly packaging, carbon-neutral operations',
                    color: 'from-teal-500 to-green-500',
                  },
                  {
                    icon: '❤️',
                    title: 'Compassion',
                    desc: 'Supporting communities, giving back, ethical treatment',
                    color: 'from-red-500 to-pink-500',
                  },
                  {
                    icon: '🔬',
                    title: 'Innovation',
                    desc: 'Modern research meets traditional wisdom',
                    color: 'from-purple-500 to-indigo-500',
                  },
                  {
                    icon: '🌟',
                    title: 'Excellence',
                    desc: 'Rigorous quality control, customer satisfaction',
                    color: 'from-yellow-500 to-orange-500',
                  },
                ].map((value, index) => (
                  <div
                    key={index}
                    className="group relative bg-white rounded-3xl p-8 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${value.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                    <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform`}>
                      <span className="text-3xl">{value.icon}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Our Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-12">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Leadership</h2>
                <p className="text-lg text-gray-600">
                  Dedicated experts passionate about bringing you the best in natural wellness
                </p>
              </div>

              {/* Founder */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white transform hover:scale-105 transition-all duration-500">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute inset-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-6xl">👑</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-4xl font-bold mb-2">Hafiz Sajid Syed</h3>
                    <p className="text-xl text-white/90 mb-4">Founder & Chief Herbalist</p>
                    <p className="text-white/80 mb-6">
                      With over 20 years of experience in herbal medicine and organic farming, 
                      Hafiz leads our mission to bring authentic, effective herbal solutions to the world.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <span className="px-4 py-2 bg-white/20 rounded-full text-sm">🌿 Herbal Expert</span>
                      <span className="px-4 py-2 bg-white/20 rounded-full text-sm">📚 Traditional Medicine</span>
                      <span className="px-4 py-2 bg-white/20 rounded-full text-sm">🌱 Organic Farming</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Dr. Aisha Khan', role: 'Head of Research', icon: '🔬', bg: 'from-purple-500 to-pink-500' },
                  { name: 'Omar Rahman', role: 'Master Herbalist', icon: '🌿', bg: 'from-green-500 to-emerald-500' },
                  { name: 'Fatima Ahmed', role: 'Quality Control', icon: '✓', bg: 'from-blue-500 to-cyan-500' },
                  { name: 'Yusuf Ali', role: 'Supply Chain', icon: '📦', bg: 'from-orange-500 to-red-500' },
                  { name: 'Zainab Malik', role: 'Customer Wellness', icon: '❤️', bg: 'from-pink-500 to-rose-500' },
                  { name: 'Ibrahim Hassan', role: 'Product Innovation', icon: '💡', bg: 'from-yellow-500 to-amber-500' },
                ].map((member, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                  >
                    <div className={`w-20 h-20 bg-gradient-to-r ${member.bg} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                      <span className="text-3xl">{member.icon}</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 text-center">{member.name}</h4>
                    <p className="text-green-600 text-center font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-500 text-sm text-center">
                      Dedicated to excellence in {member.role.toLowerCase()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quality Promise Tab */}
          {activeTab === 'quality' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Quality Promise</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Every product you receive meets our stringent quality standards
                </p>
              </div>

              {/* Quality Icons */}
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { icon: '🧪', title: 'Lab Tested', desc: 'Third-party verified' },
                  { icon: '🌿', title: '100% Organic', desc: 'USDA certified' },
                  { icon: '📜', title: 'Traditional Recipe', desc: 'Generations of wisdom' },
                  { icon: '🔍', title: 'Traceable Source', desc: 'Farm to bottle' },
                ].map((item, i) => (
                  <div key={i} className="text-center p-6 bg-white/50 rounded-2xl">
                    <div className="text-5xl mb-3">{item.icon}</div>
                    <h4 className="font-bold text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Quality Process */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6 text-center">Our Quality Control Process</h3>
                <div className="grid md:grid-cols-5 gap-4">
                  {[
                    { step: '1', title: 'Sourcing', desc: 'Ethical farms only' },
                    { step: '2', title: 'Testing', desc: 'Lab verification' },
                    { step: '3', title: 'Processing', desc: 'Gentle methods' },
                    { step: '4', title: 'Packaging', desc: 'Eco-friendly' },
                    { step: '5', title: 'Shipping', desc: 'Fresh delivery' },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                        {item.step}
                      </div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-white/70 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { cert: 'USDA Organic', icon: '🌱', desc: 'Certified organic' },
                  { cert: 'Non-GMO Verified', icon: '✓', desc: 'No GMOs' },
                  { cert: 'GMP Certified', icon: '🏭', desc: 'Good manufacturing' },
                ].map((cert, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-xl">
                    <div className="text-4xl">{cert.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-800">{cert.cert}</h4>
                      <p className="text-sm text-gray-500">{cert.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Ready to Start Your Wellness Journey?</h3>
          <p className="text-lg text-gray-600 mb-8">Explore our range of organic products today</p>
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group"
          >
            <span>Shop Now</span>
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Admin Note */}
        <div className="mt-8 p-4 bg-white/80 rounded-xl border border-green-200">
          <p className="text-gray-600 text-sm text-center">
            <span className="text-yellow-600 mr-1">👑</span>
            For inquiries, contact our administrator:{' '}
            <a href="mailto:sajid.syed@gmail.com" className="text-green-700 hover:text-green-800 font-semibold">
              Hafiz Sajid Syed
            </a>
            {' '}|{' '}
            <a href="mailto:sajid.syed@gmail.com" className="text-green-700 hover:text-green-800">
              sajid.syed@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Custom Animations CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        
        @keyframes floatLeaf {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
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
        
        .animate-float-leaf {
          animation: floatLeaf 15s linear infinite;
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