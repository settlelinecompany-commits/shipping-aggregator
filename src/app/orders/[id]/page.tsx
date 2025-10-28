'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { OrderWithDetails } from '@/lib/supabase'
import { RateCard } from '@/components/RateCard'
import { CustomerCard } from '@/components/CustomerCard'
import { PackageDetails } from '@/components/PackageDetails'
import { StatusBadge } from '@/components/StatusBadge'
import { DashboardHeader } from '@/components/DashboardHeader'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Download,
  Package,
  Truck,
  MapPin,
  Calendar,
  DollarSign,
  Weight,
  Ruler
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatWeight, formatDimensions } from '@/lib/dummy-data'

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<OrderWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasingShipment, setPurchasingShipment] = useState<number | null>(null)

  // Fetch order details
  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setOrder(data.data)
      } else {
        console.error('Failed to fetch order:', data.error)
        router.push('/orders')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      router.push('/orders')
    } finally {
      setLoading(false)
    }
  }

  // Purchase shipping label
  const handlePurchaseLabel = async (shipmentId: number) => {
    try {
      setPurchasingShipment(shipmentId)
      const response = await fetch(`/api/shipments/${shipmentId}/purchase`, {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success) {
        // Refresh order data
        await fetchOrder()
        alert('Shipping label purchased successfully!')
      } else {
        alert(`Failed to purchase label: ${data.error}`)
      }
    } catch (error) {
      console.error('Error purchasing label:', error)
      alert('Failed to purchase label')
    } finally {
      setPurchasingShipment(null)
    }
  }

  // Delete order
  const handleDeleteOrder = async () => {
    if (confirm(`Are you sure you want to delete order #${order?.order_number}?`)) {
      try {
        const response = await fetch(`/api/orders/${params.id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          router.push('/orders')
        } else {
          alert('Failed to delete order')
        }
      } catch (error) {
        console.error('Error deleting order:', error)
        alert('Failed to delete order')
      }
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <button
            onClick={() => router.push('/orders')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Orders
          </button>
        </div>
      </div>
    )
  }

  const totalWeight = order.items.reduce((sum, item) => sum + (item.weight_lb * item.quantity), 0)
  const purchasedShipments = order.shipments.filter(s => s.status === 'purchased')
  const availableShipments = order.shipments.filter(s => s.status === 'pending')

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => router.push('/orders')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Orders</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.order_number}
              </h1>
              <p className="text-gray-600">
                Created on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <StatusBadge status={order.status} type="order" />
              <button
                onClick={() => router.push(`/orders/${order.id}/edit`)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDeleteOrder}
                className="flex items-center space-x-2 px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Summary */}
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Order Date</div>
                      <div className="font-medium text-gray-900">
                        {new Date(order.order_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Total Amount</div>
                      <div className="font-medium text-gray-900">
                        {formatCurrency(order.order_amount, order.order_currency)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Weight className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Total Weight</div>
                      <div className="font-medium text-gray-900">
                        {formatWeight(totalWeight)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Total Items</div>
                      <div className="font-medium text-gray-900">
                        {order.total_items} items
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Items */}
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Items</h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-600">SKU: {item.sku}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(item.price, order.order_currency)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.quantity}x • {formatWeight(item.weight_lb)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Shipping Options */}
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Options</h2>
              
              {availableShipments.length > 0 ? (
                <div className="space-y-4">
                  {availableShipments.map((shipment, index) => (
                    <RateCard
                      key={shipment.id}
                      shipment={shipment}
                      isRecommended={index === 0}
                      onPurchase={handlePurchaseLabel}
                      isPurchased={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <div>No shipping options available</div>
                </div>
              )}

              {purchasedShipments.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchased Labels</h3>
                  <div className="space-y-4">
                    {purchasedShipments.map((shipment) => (
                      <RateCard
                        key={shipment.id}
                        shipment={shipment}
                        isPurchased={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer */}
            <CustomerCard customer={order.customer} />

            {/* Package Details */}
            {order.shipments[0] && (
              <PackageDetails
                packageType={order.shipments[0].package_type}
                weight={order.shipments[0].weight_lb}
                length={order.shipments[0].length_in}
                width={order.shipments[0].width_in}
                height={order.shipments[0].height_in}
              />
            )}

            {/* Quick Actions */}
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <Download className="w-4 h-4" />
                  <span>Download Invoice</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <Package className="w-4 h-4" />
                  <span>Print Packing Slip</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <Truck className="w-4 h-4" />
                  <span>Track Shipment</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
