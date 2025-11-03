'use client'

import LandingHeader from '@/components/LandingHeader'
import {
  Package,
  Truck,
  MapPin,
  Globe,
  Clock,
  Shield,
  FileText,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  MessageSquare,
  Mail,
  Phone,
  Check,
  X,
  TrendingUp,
  DollarSign,
  Route,
  Box,
  Zap,
  Calendar,
  RotateCcw,
} from 'lucide-react'
import { useState } from 'react'

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<number>(1) // WhatsApp tab is default active

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  // Product Suite Cards - Shipping focused
  const productCards = [
    {
      icon: TrendingUp,
      title: 'Rate Comparison',
      description: 'Compare shipping rates from top UAE carriers instantly and choose the best option for your needs.',
    },
    {
      icon: Package,
      title: 'Package Tracking',
      description: 'Real-time tracking for all shipments across multiple carriers with automated status updates.',
    },
    {
      icon: Truck,
      title: 'Multi-Carrier Support',
      description: 'Connect with Aramex, DHL, FedEx, UPS, and more UAE shipping partners in one platform.',
    },
    {
      icon: Clock,
      title: 'Same-Day Delivery',
      description: 'Schedule and manage same-day deliveries across all Emirates with real-time tracking.',
    },
    {
      icon: Globe,
      title: 'International Shipping',
      description: 'Handle cross-border shipments with customs documentation and duty calculation automation.',
    },
    {
      icon: FileText,
      title: 'Customs Handling',
      description: 'Automated customs documentation, duty calculation, and compliance checking for UAE regulations.',
    },
    {
      icon: Calendar,
      title: 'Delivery Scheduling',
      description: 'Flexible delivery scheduling with automatic customer notifications and route optimization.',
    },
    {
      icon: RotateCcw,
      title: 'Returns Management',
      description: 'Streamline return requests, generate return labels, and track return shipments end-to-end.',
    },
    {
      icon: Box,
      title: 'Bulk Shipping',
      description: 'Upload and process bulk shipments via CSV, automate label generation, and manage mass deliveries.',
    },
    {
      icon: MapPin,
      title: 'Address Management',
      description: 'Store and manage customer addresses, validate addresses, and optimize delivery routes.',
    },
    {
      icon: Zap,
      title: 'AI-Powered Routing',
      description: 'Intelligent route optimization and delivery time predictions powered by AI.',
    },
  ]

  // Why Choose Pillars
  const pillars = [
    {
      icon: CheckCircle,
      title: 'Automate at Scale',
      description: 'Simplify shipping operations by automating label generation, tracking updates, and customer notifications, freeing your team to focus on strategic growth.',
    },
    {
      icon: CheckCircle,
      title: 'Cost Optimization',
      description: 'Compare rates across carriers instantly and choose the most cost-effective shipping options for every package.',
    },
    {
      icon: CheckCircle,
      title: 'Unified Platform',
      description: 'Manage all shipments, carriers, and customer communications within a single, unified platform for maximum efficiency.',
    },
    {
      icon: CheckCircle,
      title: '24/7 Tracking',
      description: 'Provide real-time package tracking and automated status updates, ensuring customers always know where their shipments are.',
    },
  ]

  // FAQ Items
  const faqs = [
    {
      question: 'What is ShipUAE?',
      answer: 'ShipUAE is a shipping aggregator platform that centralizes operations—comparing rates, tracking packages, managing deliveries, and handling customs—across multiple UAE carriers in one unified hub.',
    },
    {
      question: 'Which shipping carriers does ShipUAE support?',
      answer: 'ShipUAE supports major UAE shipping carriers including Aramex, DHL, FedEx, UPS, Emirates Post, and other regional carriers operating in the UAE.',
    },
    {
      question: 'How does ShipUAE help save money on shipping?',
      answer: 'By comparing rates across multiple carriers instantly, you can choose the most cost-effective option for each shipment. Our bulk shipping features also help negotiate better rates.',
    },
    {
      question: 'Does ShipUAE handle international shipping?',
      answer: 'Yes, ShipUAE supports international shipping with automated customs documentation, duty calculation, and compliance checking for UAE export regulations.',
    },
    {
      question: 'Can I track multiple shipments at once?',
      answer: 'Absolutely—ShipUAE provides real-time tracking for all your shipments across different carriers in one dashboard, with automated status updates sent to customers.',
    },
    {
      question: 'How does bulk shipping work?',
      answer: 'Upload a CSV file with your shipment data, and ShipUAE automatically generates labels, compares rates, and manages the entire shipping process for multiple packages.',
    },
    {
      question: 'Does ShipUAE support same-day delivery?',
      answer: 'Yes, ShipUAE integrates with same-day delivery services across all Emirates, allowing you to schedule and track same-day deliveries with real-time updates.',
    },
    {
      question: 'How does returns management work?',
      answer: 'ShipUAE streamlines the returns process by generating return labels, tracking return shipments, and managing the entire returns workflow automatically.',
    },
    {
      question: 'Can ShipUAE integrate with my existing e-commerce platform?',
      answer: 'Yes, ShipUAE offers API integrations and plugins for major e-commerce platforms, allowing seamless synchronization of orders and shipments.',
    },
    {
      question: 'What kind of customer notifications does ShipUAE send?',
      answer: 'ShipUAE automatically sends notifications via SMS, Email, and WhatsApp for shipment creation, tracking updates, delivery confirmations, and delivery attempts.',
    },
    {
      question: 'How does address validation work?',
      answer: 'ShipUAE validates and standardizes UAE addresses to ensure accurate delivery, reducing failed delivery attempts and improving customer satisfaction.',
    },
    {
      question: 'What kind of ROI can I expect?',
      answer: 'Clients report 30-40% reduction in shipping costs through rate comparison, 50% reduction in manual processing time, and improved customer satisfaction through real-time tracking.',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Always-On Shipping Aggregation Across the UAE
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Seamlessly compare rates from Aramex, DHL, FedEx, UPS, and more UAE carriers. Track packages in real-time and automate your entire shipping workflow.
          </p>
          <div className="mt-10">
            <a
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-400 to-purple-500 text-white font-semibold rounded-lg hover:from-sky-500 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Product Suite Section */}
      <section id="platform" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Product suite</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              AI that Powers Every Stage of the Shipping Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Harness intelligent automation to transform every shipment into a seamless, efficient, and cost-optimized experience across all UAE carriers.
            </p>
          </div>

          {/* 3x4 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {productCards.map((card, index) => {
              const Icon = card.icon
              return (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <Icon className="w-8 h-8 text-gray-900 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{card.description}</p>
                  <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-700 inline-flex items-center gap-1">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Integrations</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Connected to your ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From Aramex to DHL, FedEx to UPS, ShipUAE syncs instantly with the carriers you already use.
            </p>
          </div>

          {/* Integrations Diagram */}
          <div className="max-w-6xl mx-auto mt-12">
            <div className="bg-gradient-to-b from-sky-100 to-purple-100 rounded-2xl p-12 shadow-xl relative">
              {/* Connection lines */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <svg viewBox="0 0 800 400" className="w-full h-full" preserveAspectRatio="none">
                  <line x1="400" y1="200" x2="180" y2="80" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="2" />
                  <line x1="400" y1="200" x2="180" y2="140" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="2" />
                  <line x1="400" y1="200" x2="180" y2="200" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="2" />
                  <line x1="400" y1="200" x2="180" y2="260" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="2" />
                  <line x1="400" y1="200" x2="620" y2="80" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="2" />
                  <line x1="400" y1="200" x2="620" y2="140" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="2" />
                  <line x1="400" y1="200" x2="620" y2="200" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="2" />
                  <line x1="400" y1="200" x2="620" y2="260" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="2" />
                </svg>
              </div>

              {/* Central ShipUAE Box */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="bg-gradient-to-r from-sky-400 to-purple-500 rounded-lg px-8 py-4 shadow-2xl">
                  <span className="text-2xl font-bold text-white">ShipUAE</span>
                </div>
              </div>

              {/* Integration Cards */}
              <div className="relative flex justify-between items-start z-10 min-h-[400px] pt-8">
                {/* Left Column */}
                <div className="flex flex-col gap-4 w-[200px]">
                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600">A</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">Aramex</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-red-600">D</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">DHL</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-orange-600">F</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">FedEx</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600">U</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">UPS</span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4 w-[200px]">
                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-green-600">EP</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">Emirates Post</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">WhatsApp</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">Email</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                        <Globe className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">E-commerce</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Omnichannel Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-4">
              CONSISTENT, CONNECTED NOTIFICATIONS
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Omnichannel Notifications, Singular Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ShipUAE seamlessly manages package notifications across WhatsApp, email, SMS, and tracking pages, so customers get consistent, instant updates without repetition.
            </p>
          </div>

          {/* Communication Interface Simulation */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-gradient-to-b from-sky-100 to-purple-100 rounded-2xl p-8 shadow-xl">
              {/* Tabs */}
              <div className="flex gap-4 mb-6">
                {['Email', 'WhatsApp', 'SMS', 'Tracking'].map((tab, index) => {
                  const isActive = activeTab === index
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(index)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-900 bg-transparent hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  )
                })}
              </div>

              {/* Content Area */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8">
                {/* WhatsApp Interface (activeTab === 1) */}
                {activeTab === 1 && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp with ShipUAE</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Automatically sends package updates • Real-time tracking links • Delivery notifications 24/7
                      </p>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-start">
                        <div className="bg-green-500 rounded-lg p-3 max-w-xs rounded-tl-none">
                          <p className="text-white text-sm">Hi! Where is my package? Tracking #123456789</p>
                          <p className="text-xs text-green-100 mt-1">10:23 AM</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <div className="bg-gradient-to-r from-sky-400 to-purple-500 rounded-lg p-3 max-w-xs rounded-tr-none text-white">
                          <p className="text-sm">Your package is in transit and will arrive tomorrow by 2 PM. Track it here: shipuae.ae/track/123456789</p>
                          <p className="text-xs text-white/80 mt-1">10:23 AM ✓✓</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <div className="bg-gradient-to-r from-sky-400 to-purple-500 rounded-lg p-3 max-w-xs rounded-tr-none text-white">
                          <p className="text-sm">Great news! Your package has been delivered. Confirm receipt: shipuae.ae/confirm/123456789</p>
                          <p className="text-xs text-white/80 mt-1">2:15 PM ✓✓</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 border-t border-gray-200 pt-4">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                      />
                      <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Email Interface */}
                {activeTab === 0 && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Update</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-gray-500">To:</span> <span className="text-gray-900 font-medium">customer@email.com</span>
                        </div>
                        <div>
                          <span className="text-gray-500">From:</span> <span className="text-gray-900 font-medium">ShipUAE</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Subject:</span> 
                          <span className="text-gray-900 font-medium">Your Package #123456789 is Out for Delivery</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <p className="text-gray-900 mb-2">
                        Hi! Your package is on its way and will arrive today by 2 PM.
                      </p>
                      <p className="text-gray-900 mb-4">
                        Track your shipment in real-time: <a href="#" className="text-purple-600 hover:underline">shipuae.ae/track/123456789</a>
                      </p>
                      <p className="text-gray-900">
                        If you won&apos;t be available, you can reschedule the delivery or authorize a neighbor to receive it.
                      </p>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-sky-400 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-sky-500 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl">
                      Send Notification
                    </button>
                  </div>
                )}

                {/* SMS Interface */}
                {activeTab === 2 && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Notification</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Automated SMS updates for package tracking and delivery
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <p className="text-gray-900 text-sm">
                        ShipUAE: Your package #123456789 is out for delivery today by 2 PM. Track: shipuae.ae/track/123456789
                      </p>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-sky-400 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-sky-500 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl">
                      Send SMS
                    </button>
                  </div>
                )}

                {/* Tracking Interface */}
                {activeTab === 3 && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Page</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Real-time package tracking with automated status updates
                      </p>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Package Created</p>
                          <p className="text-xs text-gray-500">Jan 15, 2025 10:00 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">In Transit</p>
                          <p className="text-xs text-gray-500">Jan 15, 2025 2:30 PM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-purple-500"></div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Out for Delivery</p>
                          <p className="text-xs text-gray-500">Jan 16, 2025 8:00 AM</p>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-sky-400 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-sky-500 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl">
                      View Full Tracking
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Centralized Operations Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              CENTRALIZE YOUR SHIPPING
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need In One Platform
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              ShipUAE centralizes shipping operations with rate comparison, package tracking, and automated notifications, built for businesses to streamline logistics and reduce costs.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-400 to-purple-500 text-white font-semibold rounded-lg hover:from-sky-500 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Learn More <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Comparison</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              How ShipUAE Compares
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ShipUAE does more and better. Everything you need, in one intelligent platform.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="max-w-5xl mx-auto mt-12">
            <div className="bg-gradient-to-b from-sky-100 to-purple-100 rounded-2xl p-8 shadow-xl overflow-hidden">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-white/50">
                {/* Table Header */}
                <div className="grid grid-cols-3 bg-gray-900 text-white">
                  <div className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Feature</div>
                  <div className="px-6 py-4 bg-gradient-to-r from-sky-400 to-purple-500 font-semibold text-sm uppercase tracking-wider">
                    ShipUAE
                  </div>
                  <div className="px-6 py-4 bg-gray-700 font-semibold text-sm uppercase tracking-wider">Others</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-200">
                  {[
                    {
                      feature: 'Carrier Integration',
                      shipuae: 'Aramex, DHL, FedEx, UPS, Emirates Post, and more UAE carriers',
                      others: 'Limited to single carrier or basic integrations',
                    },
                    {
                      feature: 'Rate Comparison',
                      shipuae: 'Real-time rate comparison across all carriers instantly',
                      others: 'Manual rate checking or single-carrier quotes',
                    },
                    {
                      feature: 'Unified Tracking',
                      shipuae: 'Track all packages across carriers in one dashboard',
                      others: 'Separate tracking for each carrier',
                    },
                    {
                      feature: 'Bulk Shipping',
                      shipuae: 'CSV upload, automated label generation, mass processing',
                      others: 'Manual entry only',
                    },
                    {
                      feature: 'Customs Handling',
                      shipuae: 'Automated documentation, duty calculation, UAE compliance',
                      others: 'Manual customs paperwork',
                    },
                    {
                      feature: 'Customer Notifications',
                      shipuae: 'Automated WhatsApp, Email, SMS updates across all channels',
                      others: 'Limited or single-channel notifications',
                    },
                    {
                      feature: '24/7 Automation',
                      shipuae: 'Always-on tracking, notifications, and customer support',
                      others: 'Business hours only',
                    },
                  ].map((row, index) => (
                    <div key={index} className="grid grid-cols-3 hover:bg-gray-50 transition-colors">
                      <div className="px-6 py-4 font-semibold text-gray-900">{row.feature}</div>
                      <div className="px-6 py-4 bg-gradient-to-r from-sky-50 to-purple-50">
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{row.shipuae}</span>
                        </div>
                      </div>
                      <div className="px-6 py-4 bg-gray-50">
                        <div className="flex items-start gap-2">
                          <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{row.others}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section id="solutions" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              WHY BUSINESSES CHOOSE SHIPUAE
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Smarter Shipping, Seamless Operations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ShipUAE helps businesses connect with customers through automation, cost optimization, and 24/7 tracking, freeing teams to focus on growth.
            </p>
          </div>

          {/* 4 Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{pillar.title}</h3>
                  <p className="text-gray-600">{pillar.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Proof in the Results</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how ShipUAE revolutionizes shipping, logistics, and customer experience, delivering measurable results for our clients.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                quote: 'ShipUAE reduced our shipping costs by 35% through intelligent rate comparison, and our customers love the real-time tracking updates.',
                company: 'Dubai E-commerce Retailer',
              },
              {
                quote: 'The bulk shipping feature has saved us 10 hours per week. Uploading 500 shipments takes minutes instead of days.',
                company: 'Abu Dhabi Logistics Company',
              },
              {
                quote: 'ShipUAE\'s automated notifications via WhatsApp and email have improved our customer satisfaction scores by 40%.',
                company: 'UAE Online Marketplace',
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-700 mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                <p className="text-sm font-semibold text-gray-900">{testimonial.company}</p>
                <a href="#" className="text-sm text-purple-600 hover:text-purple-700 mt-2 inline-flex items-center gap-1">
                  Read More <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">FAQ</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                      openFaq === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Platform Overview</a></li>
                <li><a href="#" className="hover:text-white">Carriers</a></li>
                <li><a href="#" className="hover:text-white">Tracking</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Features</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Rate Comparison</a></li>
                <li><a href="#" className="hover:text-white">Bulk Shipping</a></li>
                <li><a href="#" className="hover:text-white">Customs Handling</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Solutions</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">E-commerce</a></li>
                <li><a href="#" className="hover:text-white">Enterprise</a></li>
                <li><a href="#" className="hover:text-white">SMB</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p className="mb-2">AI-Driven Innovation for Shipping & Logistics</p>
            <p>© 2025 ShipUAE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

