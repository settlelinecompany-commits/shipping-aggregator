'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { OrderWithDetails } from '@/lib/supabase'
import { OrdersTable } from '@/components/OrdersTable'
import { CSVUploadModal } from '@/components/CSVUploadModal'
import { DashboardHeader } from '@/components/DashboardHeader'
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
  CheckCircle
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
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        onNewOrder={() => router.push('/orders/new')}
        onUploadCSV={() => setShowCSVModal(true)}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-3xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shipped</p>
                <p className="text-3xl font-bold text-purple-600">{stats.shipped}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                    statusFilter === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {selectedOrders.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedOrders.length} selected
                  </span>
                  <button
                    onClick={() => handleBulkAction('update_status')}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => handleBulkAction('export')}
                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    Export
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowCSVModal(true)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <Upload className="w-4 h-4" />
                <span>Upload CSV</span>
              </button>

              <button
                onClick={() => router.push('/orders/new')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>New Order</span>
              </button>
            </div>
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
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        )}
      </main>

      {/* CSV Upload Modal */}
      <CSVUploadModal
        isOpen={showCSVModal}
        onClose={() => setShowCSVModal(false)}
        onUpload={handleCSVUpload}
      />
    </div>
  )
}
