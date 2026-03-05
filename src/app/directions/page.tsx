'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DirectionsPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedTab, setSelectedTab] = useState('store')
  const [travelMode, setTravelMode] = useState('driving')
  const [startLocation, setStartLocation] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('')

  useEffect(() => {
    setMounted(true)
    // Simulate getting estimated time based on mode
    if (travelMode === 'driving') setEstimatedTime('25-35 min')
    else if (travelMode === 'transit') setEstimatedTime('45-55 min')
    else if (travelMode === 'walking') setEstimatedTime('2.5 hours')
    else if (travelMode === 'bicycling') setEstimatedTime('1 hour 15 min')
  }, [travelMode])

  const locations = [
    {
      id: 'store',
      name: 'Main Store',
      address: '123 Herbal Lane, Natural Valley, CA 94567',
      phone: '+1 (555) 123-4567',
      hours: 'Mon-Fri: 9am-6pm, Sat: 10am-4pm',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    {
      id: 'warehouse',
      name: 'Distribution Center',
      address: '456 Wellness Way, Industrial Park, CA 94568',
      phone: '+1 (555) 890-1234',
      hours: 'Mon-Fri: 8am-5pm',
      coordinates: { lat: 37.7849, lng: -122.4094 }
    },
    {
      id: 'office',
      name: 'Corporate Office',
      address: '789 Harmony Blvd, Downtown, CA 94569',
      phone: '+1 (555) 567-8901',
      hours: 'Mon-Fri: 9am-5pm',
      coordinates: { lat: 37.7949, lng: -122.4294 }
    }
  ]

  const parkingInfo = [
    { type: 'Free Parking', spots: 50, status: 'available', icon: '🅿️' },
    { type: 'EV Charging', spots: 10, status: 'limited', icon: '⚡' },
    { type: 'Handicap Accessible', spots: 5, status: 'available', icon: '♿' },
    { type: 'Bike Parking', spots: 20, status: 'available', icon: '🚲' }
  ]

  const landmarks = [
    { name: 'Natural Valley Park', distance: '0.5 miles', direction: 'North' },
    { name: 'Organic Farmers Market', distance: '1.2 miles', direction: 'East' },
    { name: 'Wellness Center', distance: '0.8 miles', direction: 'South' },
    { name: 'Natural Valley Library', distance: '1.5 miles', direction: 'West' }
  ]

  const transitOptions = [
    { route: 'Bus #42', stop: 'Herbal Lane & Main St', frequency: 'Every 15 min', fare: '$2.50' },
    { route: 'Bus #27', stop: 'Wellness Way & Harmony', frequency: 'Every 20 min', fare: '$2.50' },
    { route: 'Shuttle', stop: 'Downtown Transit Center', frequency: 'Every 30 min', fare: 'Free' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
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

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-gradient">
              Directions & Location
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find your way to our stores, distribution centers, and offices. 
            Multiple locations to serve you better.
          </p>
        </div>

        {/* Location Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-2 inline-flex shadow-lg">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedTab(loc.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedTab === loc.id
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          
          {/* Location Details */}
          <div className="lg:col-span-1 space-y-6">
            {locations.filter(l => l.id === selectedTab).map((location) => (
              <div key={location.id} className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-green-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{location.name}</h2>
                
                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 text-xl mt-1">📍</span>
                    <div>
                      <p className="text-gray-500 text-sm">Address</p>
                      <p className="text-gray-800 font-medium">{location.address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 text-xl mt-1">📞</span>
                    <div>
                      <p className="text-gray-500 text-sm">Phone</p>
                      <p className="text-gray-800 font-medium">{location.phone}</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 text-xl mt-1">🕒</span>
                    <div>
                      <p className="text-gray-500 text-sm">Hours</p>
                      <p className="text-gray-800 font-medium">{location.hours}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <a
                    href={`tel:${location.phone}`}
                    className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-xl text-green-700 hover:bg-green-100 transition-colors"
                  >
                    <span>📞</span>
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-xl text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <span>🗺️</span>
                    <span>Navigate</span>
                  </a>
                </div>
              </div>
            ))}

            {/* Parking Information */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🅿️</span>
                Parking Information
              </h3>
              <div className="space-y-3">
                {parkingInfo.map((info) => (
                  <div key={info.type} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{info.icon}</span>
                      <span className="text-gray-700">{info.type}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{info.spots} spots</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        info.status === 'available' ? 'bg-green-500/20 text-green-700' :
                        info.status === 'limited' ? 'bg-yellow-500/20 text-yellow-700' :
                        'bg-red-500/20 text-red-700'
                      }`}>
                        {info.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Landmarks */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🏛️</span>
                Nearby Landmarks
              </h3>
              <div className="space-y-3">
                {landmarks.map((landmark) => (
                  <div key={landmark.name} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <span className="text-gray-700">{landmark.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{landmark.distance}</span>
                      <span className="text-xs text-green-600">{landmark.direction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map and Directions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-green-100">
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center relative overflow-hidden">
                {/* Map Grid Overlay */}
                <div className="absolute inset-0 bg-[url('/map-grid.svg')] bg-center opacity-20"></div>
                
                {/* Map Pins */}
                <div className="relative w-full h-full">
                  {/* Main Store Pin */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-bounce">
                        📍
                      </div>
                      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-sm font-semibold text-gray-800">Herbal Heaven</p>
                        <p className="text-xs text-gray-500">Main Store</p>
                      </div>
                    </div>
                  </div>

                  {/* Warehouse Pin */}
                  <div className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 group">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg shadow-lg">
                      🏭
                    </div>
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs font-semibold text-gray-800">Distribution Center</p>
                    </div>
                  </div>

                  {/* Office Pin */}
                  <div className="absolute top-2/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 group">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-lg shadow-lg">
                      🏢
                    </div>
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs font-semibold text-gray-800">Corporate Office</p>
                    </div>
                  </div>
                </div>

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                    <span className="text-gray-600">Main Store</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <span className="text-gray-600">Distribution</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                    <span className="text-gray-600">Corporate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Get Directions */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Get Directions</h3>
              
              {/* Starting Point */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Starting Point
                </label>
                <input
                  type="text"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  placeholder="Enter your address or location"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Travel Mode */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Travel Mode
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { mode: 'driving', icon: '🚗', label: 'Driving' },
                    { mode: 'transit', icon: '🚌', label: 'Transit' },
                    { mode: 'walking', icon: '🚶', label: 'Walking' },
                    { mode: 'bicycling', icon: '🚲', label: 'Bicycling' }
                  ].map((mode) => (
                    <button
                      key={mode.mode}
                      onClick={() => setTravelMode(mode.mode)}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                        travelMode === mode.mode
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent'
                          : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{mode.icon}</div>
                      <div className="text-sm font-medium">{mode.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Route Info */}
              {startLocation && (
                <div className="bg-green-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Estimated Time</p>
                      <p className="text-2xl font-bold text-green-700">{estimatedTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Distance</p>
                      <p className="text-2xl font-bold text-green-700">12.5 mi</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Route Steps */}
              {startLocation && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">Route Steps</h4>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex items-start space-x-3 p-2 hover:bg-green-50 rounded-lg transition-colors">
                        <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-sm font-bold flex-shrink-0">
                          {step}
                        </span>
                        <p className="text-sm text-gray-600">
                          {step === 1 && 'Head north on Main St toward Wellness Way'}
                          {step === 2 && 'Turn right onto Herbal Lane'}
                          {step === 3 && 'Continue straight for 2.5 miles'}
                          {step === 4 && 'Destination will be on your left'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Transit Options */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🚌</span>
                Public Transit Options
              </h3>
              <div className="space-y-3">
                {transitOptions.map((option) => (
                  <div key={option.route} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-800">{option.route}</p>
                      <p className="text-sm text-gray-500">{option.stop}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">{option.frequency}</p>
                      <p className="text-xs text-gray-400">{option.fare}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-xl font-bold mb-2">Free Parking</h3>
            <p className="text-white/80 text-sm">Ample free parking available at all locations. EV charging stations available.</p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4">♿</div>
            <h3 className="text-xl font-bold mb-2">Accessibility</h3>
            <p className="text-white/80 text-sm">All locations are wheelchair accessible with designated parking spots.</p>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4">🚲</div>
            <h3 className="text-xl font-bold mb-2">Bike Friendly</h3>
            <p className="text-white/80 text-sm">Secure bike parking and repair stations available at main store.</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-green-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">What are your store hours?</h3>
              <p className="text-gray-600 text-sm mb-4">Main store: Mon-Fri 9am-6pm, Sat 10am-4pm, Sun Closed. Distribution center: Mon-Fri 8am-5pm.</p>
              
              <h3 className="font-semibold text-gray-800 mb-2">Is there parking available?</h3>
              <p className="text-gray-600 text-sm mb-4">Yes, free parking is available at all locations. EV charging stations are available at the main store.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Do you offer delivery?</h3>
              <p className="text-gray-600 text-sm mb-4">Yes, we offer local delivery within 10 miles. Shipping is also available nationwide.</p>
              
              <h3 className="font-semibold text-gray-800 mb-2">Are the stores wheelchair accessible?</h3>
              <p className="text-gray-600 text-sm mb-4">All our locations are fully wheelchair accessible with designated parking spots.</p>
            </div>
          </div>
        </div>

        {/* Admin Note */}
        <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-green-100">
          <p className="text-gray-600 text-sm text-center">
            <span className="text-yellow-600 mr-1">👑</span>
            For special directions or assistance, contact our administrator:{' '}
            <a href="mailto:sajid.syed@gmail.com" className="text-green-700 hover:text-green-800 font-semibold">
              Hafiz Sajid Syed
            </a>
            {' | '}
            <a href="tel:+15551234567" className="text-green-700 hover:text-green-800">
              +1 (555) 123-4567
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
      `}</style>
    </div>
  )
}