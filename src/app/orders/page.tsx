'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { OrderWithDetails } from '@/lib/supabase'
import { OrdersTable } from '@/components/OrdersTable'
import { CSVUploadModal } from '@/components/CSVUploadModal'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Plus, 
  Upload, 
  Search, 
  Filter, 
  Download,
  RefreshCw,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  X,
  Truck,
  MapPin
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [showCSVModal, setShowCSVModal] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0
  })

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '25'
      })
      
      if (searchQuery) params.append('search', searchQuery)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const response = await fetch(`/api/orders?${params}`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.data)
        setTotalPages(data.pagination.pages)
        calculateStats(data.data)
      } else {
        console.error('Failed to fetch orders:', data.error)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const calculateStats = (ordersData: OrderWithDetails[]) => {
    const stats = {
      total: ordersData.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0
    }

    ordersData.forEach(order => {
      switch (order.status) {
        case 'pending':
          stats.pending++
          break
        case 'processing':
          stats.processing++
          break
        case 'shipped':
          stats.shipped++
          break
        case 'delivered':
          stats.delivered++
          break
      }
    })

    setStats(stats)
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
  }

  // Handle CSV upload
  const handleCSVUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/orders/upload-csv', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        // Refresh orders
        await fetchOrders()
      }

      return result
    } catch (error) {
      console.error('CSV upload error:', error)
      return {
        success: false,
        message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  // Handle order actions
  const handleViewOrder = (order: OrderWithDetails) => {
    router.push(`/orders/${order.id}`)
  }

  const handleEditOrder = (order: OrderWithDetails) => {
    router.push(`/orders/${order.id}/edit`)
  }

  const handleDeleteOrder = async (order: OrderWithDetails) => {
    if (confirm(`Are you sure you want to delete order #${order.order_number}?`)) {
      try {
        const response = await fetch(`/api/orders/${order.id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await fetchOrders()
        } else {
          alert('Failed to delete order')
        }
      } catch (error) {
        console.error('Error deleting order:', error)
        alert('Failed to delete order')
      }
    }
  }

  // Handle bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedOrders.length === 0) return

    try {
      const response = await fetch('/api/orders/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderIds: selectedOrders,
          action
        })
      })

      if (response.ok) {
        await fetchOrders()
        setSelectedOrders([])
      } else {
        alert('Bulk action failed')
      }
    } catch (error) {
      console.error('Error performing bulk action:', error)
      alert('Bulk action failed')
    }
  }

  // Effects
  useEffect(() => {
    fetchOrders()
  }, [page, searchQuery, statusFilter])

  const statusOptions = [
    { value: 'all', label: 'All Orders', count: stats.total },
    { value: 'pending', label: 'Pending', count: stats.pending },
    { value: 'processing', label: 'Processing', count: stats.processing },
    { value: 'shipped', label: 'Shipped', count: stats.shipped },
    { value: 'delivered', label: 'Delivered', count: stats.delivered }
  ]

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 bg-white min-h-screen w-full max-w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your shipments and orders</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCSVModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <Upload className="w-4 h-4" />
                <span>Upload CSV</span>
              </button>
              <button
                onClick={() => router.push('/orders/new')}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-400 to-purple-500 text-white rounded-lg font-semibold hover:from-sky-500 hover:to-purple-600 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>New Order</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-r from-sky-50 to-purple-50 rounded-lg">
                <Package className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-600 mt-0.5">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-yellow-50 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-xs text-gray-600 mt-0.5">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-50 rounded-lg">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.processing}</p>
                <p className="text-xs text-gray-600 mt-0.5">Processing</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-purple-50 rounded-lg">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.shipped}</p>
                <p className="text-xs text-gray-600 mt-0.5">Shipped</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.delivered}</p>
                <p className="text-xs text-gray-600 mt-0.5">Delivered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders, tracking numbers..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleSearch(e.target.value)
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                />
              </div>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                    statusFilter === option.value
                      ? 'bg-gradient-to-r from-sky-400 to-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>

            {/* Bulk Actions */}
            {selectedOrders.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedOrders.length} selected
                </span>
                <button
                  onClick={() => handleBulkAction('update_status')}
                  className="px-3 py-1 text-sm bg-sky-100 text-sky-700 rounded hover:bg-sky-200 transition-colors"
                >
                  Update Status
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Export
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable
          orders={orders}
          onViewOrder={handleViewOrder}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
          selectedOrders={selectedOrders}
          onSelectionChange={setSelectedOrders}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {page} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-sky-200 border-t-sky-600"></div>
          </div>
        )}
      </div>

      {/* CSV Upload Modal */}
      <CSVUploadModal
        isOpen={showCSVModal}
        onClose={() => setShowCSVModal(false)}
        onUpload={handleCSVUpload}
      />
    </DashboardLayout>
  )
}
