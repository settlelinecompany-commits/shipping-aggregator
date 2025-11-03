'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  Package,
  Truck,
  TrendingUp,
  Calendar,
  Plus,
  Search,
  MoreVertical,
  ArrowRight,
  Box,
  MapPin,
  FileText,
  Globe,
  Clock,
  RotateCcw,
  DollarSign,
  Route,
  Zap,
  CheckCircle,
} from 'lucide-react'

interface ServiceCard {
  icon: any
  title: string
  description: string
  category: 'shipment' | 'delivery' | 'operations'
}

interface Delivery {
  trackingNumber: string
  date: string
  time: string
  status: 'PENDING' | 'IN TRANSIT' | 'OUT FOR DELIVERY'
  destination?: string
  carrier?: string
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days')
  const [activeTab, setActiveTab] = useState<'deliveries' | 'recent'>('deliveries')

  // Service Cards organized by category
  const serviceCards: ServiceCard[] = [
    // Shipment Management
    { icon: Plus, title: 'Create Shipment', description: 'Create new shipments, compare rates, generate labels', category: 'shipment' },
    { icon: Box, title: 'Bulk Upload', description: 'Upload CSV, process multiple shipments at once', category: 'shipment' },
    { icon: Package, title: 'Track Packages', description: 'Real-time tracking across all carriers', category: 'shipment' },
    { icon: TrendingUp, title: 'Rate Comparison', description: 'Compare rates and choose best carrier', category: 'shipment' },
    
    // Delivery Operations
    { icon: Calendar, title: 'Schedule Deliveries', description: 'Flexible delivery scheduling and rescheduling', category: 'delivery' },
    { icon: MapPin, title: 'Manage Addresses', description: 'Store, validate, and manage customer addresses', category: 'delivery' },
    { icon: RotateCcw, title: 'Handle Returns', description: 'Generate return labels, track return shipments', category: 'delivery' },
    { icon: FileText, title: 'Customs Documentation', description: 'Automated customs forms and compliance', category: 'delivery' },
    
    // Operations
    { icon: Globe, title: 'Carrier Management', description: 'Manage carrier integrations and settings', category: 'operations' },
    { icon: Route, title: 'Route Optimization', description: 'AI-powered routing and delivery optimization', category: 'operations' },
    { icon: DollarSign, title: 'Cost Analytics', description: 'Track shipping costs and identify savings', category: 'operations' },
    { icon: Zap, title: 'Automated Notifications', description: 'WhatsApp, Email, SMS updates', category: 'operations' },
  ]

  const deliveries: Delivery[] = [
    { trackingNumber: 'SHUAE-123456', date: 'Today', time: '2:00PM', status: 'OUT FOR DELIVERY', destination: 'Dubai Marina', carrier: 'Aramex' },
    { trackingNumber: 'SHUAE-123457', date: 'Tomorrow', time: '10:00AM', status: 'IN TRANSIT', destination: 'Abu Dhabi', carrier: 'DHL' },
    { trackingNumber: 'SHUAE-123458', date: 'Tomorrow', time: '3:00PM', status: 'PENDING', destination: 'Sharjah', carrier: 'FedEx' },
    { trackingNumber: 'SHUAE-123459', date: 'Jan 18', time: '11:00AM', status: 'IN TRANSIT', destination: 'Dubai Downtown', carrier: 'UPS' },
    { trackingNumber: 'SHUAE-123460', date: 'Jan 18', time: '4:00PM', status: 'OUT FOR DELIVERY', destination: 'Ajman', carrier: 'Aramex' },
  ]

  const shipmentCards = serviceCards.filter(c => c.category === 'shipment')
  const deliveryCards = serviceCards.filter(c => c.category === 'delivery')
  const operationsCards = serviceCards.filter(c => c.category === 'operations')

  return (
    <DashboardLayout>
      <div className="p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back, here&apos;s an overview of your shipping activity.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">Search shipments</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-400 to-purple-500 text-white rounded-lg font-semibold hover:from-sky-500 hover:to-purple-600 transition-all duration-200 shadow-sm hover:shadow-md">
              <Plus className="w-4 h-4" />
              <span>New Shipment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Total Shipments</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-xs text-gray-600 border border-gray-300 rounded px-2 py-1 bg-white"
            >
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Today</option>
            </select>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">1,247</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>22%</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Avg. 42 shipments/day</div>
            </div>
            <Package className="w-10 h-10 text-gray-300" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">In Transit</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-xs text-gray-600 border border-gray-300 rounded px-2 py-1 bg-white"
            >
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Today</option>
            </select>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">183</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>8%</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Expected delivery: 2.3 days avg.</div>
            </div>
            <Truck className="w-10 h-10 text-gray-300" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Delivered</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-xs text-gray-600 border border-gray-300 rounded px-2 py-1 bg-white"
            >
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Today</option>
            </select>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">1,048</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>15%</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">98.4% on-time delivery</div>
            </div>
            <CheckCircle className="w-10 h-10 text-gray-300" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Service Cards */}
        <div className="lg:col-span-2 space-y-8">
          {/* Performance Metrics Charts */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cost Savings */}
              <div className="bg-gradient-to-br from-sky-50 to-purple-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-2">35%</div>
                  <div className="text-sm font-medium text-gray-700">Average Cost Savings</div>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-sky-400 to-purple-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>

              {/* Delivery Time Reduction */}
              <div className="bg-gradient-to-br from-sky-50 to-purple-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-2">28%</div>
                  <div className="text-sm font-medium text-gray-700">Reduction in Delivery Time</div>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-sky-400 to-purple-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
              </div>

              {/* Customer Satisfaction */}
              <div className="bg-gradient-to-br from-sky-50 to-purple-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-2">96%</div>
                  <div className="text-sm font-medium text-gray-700">Customer Satisfaction Rate</div>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-sky-400 to-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipment Management Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Shipment Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shipmentCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-sky-200 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-sky-50 to-purple-50 rounded-lg flex items-center justify-center group-hover:from-sky-100 group-hover:to-purple-100 transition-colors">
                        <Icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
                        <p className="text-sm text-gray-600">{card.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Delivery Operations Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveryCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-sky-200 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-sky-50 to-purple-50 rounded-lg flex items-center justify-center group-hover:from-sky-100 group-hover:to-purple-100 transition-colors">
                        <Icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
                        <p className="text-sm text-gray-600">{card.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Operations Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {operationsCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-sky-200 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-sky-50 to-purple-50 rounded-lg flex items-center justify-center group-hover:from-sky-100 group-hover:to-purple-100 transition-colors">
                        <Icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
                        <p className="text-sm text-gray-600">{card.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Upcoming Deliveries/Recent Shipments */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('deliveries')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'deliveries'
                    ? 'text-gray-900 border-b-2 border-sky-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Upcoming Deliveries
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'recent'
                    ? 'text-gray-900 border-b-2 border-sky-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Recent Shipments
              </button>
            </div>

            <div className="p-4 space-y-3">
              {activeTab === 'deliveries' && deliveries.map((delivery, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{delivery.trackingNumber}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{delivery.date} - {delivery.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          delivery.status === 'OUT FOR DELIVERY' ? 'bg-orange-100 text-orange-700' :
                          delivery.status === 'IN TRANSIT' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {delivery.status}
                        </span>
                        {delivery.destination && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>{delivery.destination}</span>
                          </div>
                        )}
                        {delivery.carrier && (
                          <div className="text-xs text-gray-600">
                            • {delivery.carrier}
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
              {activeTab === 'recent' && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No recent shipments</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  )
}

