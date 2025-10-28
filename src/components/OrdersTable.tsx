'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { OrderWithDetails } from '@/lib/supabase'
import { StatusBadge } from './StatusBadge'
import { formatCurrency, formatWeight } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'
import { 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Edit, 
  Trash2, 
  Package,
  User,
  Calendar,
  DollarSign
} from 'lucide-react'

interface OrdersTableProps {
  orders: OrderWithDetails[]
  onViewOrder?: (order: OrderWithDetails) => void
  onEditOrder?: (order: OrderWithDetails) => void
  onDeleteOrder?: (order: OrderWithDetails) => void
  selectedOrders?: number[]
  onSelectionChange?: (selectedIds: number[]) => void
  className?: string
}

export function OrdersTable({ 
  orders, 
  onViewOrder, 
  onEditOrder, 
  onDeleteOrder,
  selectedOrders = [],
  onSelectionChange,
  className 
}: OrdersTableProps) {
  const [sortField, setSortField] = useState<keyof OrderWithDetails>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const handleSort = (field: keyof OrderWithDetails) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange?.(orders.map(order => order.id))
    } else {
      onSelectionChange?.([])
    }
  }

  const handleSelectOrder = (orderId: number, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedOrders, orderId])
    } else {
      onSelectionChange?.(selectedOrders.filter(id => id !== orderId))
    }
  }

  const toggleExpanded = (orderId: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedRows(newExpanded)
  }

  const sortedOrders = [...orders].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const isAllSelected = orders.length > 0 && selectedOrders.length === orders.length
  const isPartiallySelected = selectedOrders.length > 0 && selectedOrders.length < orders.length

  return (
    <div className={cn('bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden', className)}>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isPartiallySelected && !isAllSelected
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('order_number')}
              >
                <div className="flex items-center space-x-1">
                  <span>Order</span>
                  {sortField === 'order_number' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('order_date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  {sortField === 'order_date' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Package
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedOrders.map((order) => (
              <motion.tr
                key={order.id}
                className={cn(
                  'hover:bg-gray-50 transition-colors duration-200',
                  selectedOrders.includes(order.id) && 'bg-blue-50'
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    #{order.order_number}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(order.order_date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{order.customer.name}</div>
                  <div className="text-sm text-gray-500">{order.customer.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatWeight(order.total_weight_lb)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {order.shipments[0]?.package_type || 'Not specified'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} type="order" />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.order_amount, order.order_currency)}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {onViewOrder && (
                      <button
                        onClick={() => onViewOrder(order)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="View Order"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {onEditOrder && (
                      <button
                        onClick={() => onEditOrder(order)}
                        className="text-gray-600 hover:text-gray-800 p-1 rounded"
                        title="Edit Order"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDeleteOrder && (
                      <button
                        onClick={() => onDeleteOrder(order)}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        {sortedOrders.map((order) => (
          <motion.div
            key={order.id}
            className={cn(
              'p-4 border-b border-gray-200 last:border-b-0',
              selectedOrders.includes(order.id) && 'bg-blue-50'
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">#{order.order_number}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.order_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <StatusBadge status={order.status} type="order" />
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{order.customer.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>{order.items.length} items • {formatWeight(order.total_weight_lb)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>{formatCurrency(order.order_amount, order.order_currency)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => toggleExpanded(order.id)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
              >
                <span>View Details</span>
                {expandedRows.has(order.id) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              
              <div className="flex items-center space-x-2">
                {onViewOrder && (
                  <button
                    onClick={() => onViewOrder(order)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                    title="View Order"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                {onEditOrder && (
                  <button
                    onClick={() => onEditOrder(order)}
                    className="text-gray-600 hover:text-gray-800 p-1 rounded"
                    title="Edit Order"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {onDeleteOrder && (
                  <button
                    onClick={() => onDeleteOrder(order)}
                    className="text-red-600 hover:text-red-800 p-1 rounded"
                    title="Delete Order"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedRows.has(order.id) && (
              <motion.div
                className="mt-4 pt-4 border-t border-gray-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Customer</div>
                    <div className="text-sm text-gray-600">{order.customer.email}</div>
                    <div className="text-sm text-gray-600">{order.customer.phone}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Items</div>
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {item.quantity}x {item.title} ({item.sku})
                      </div>
                    ))}
                  </div>
                  
                  {order.shipments.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Shipments</div>
                      {order.shipments.map((shipment, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {shipment.carrier.toUpperCase()} - {shipment.service_level}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <div className="text-lg font-medium mb-2">No orders found</div>
          <div className="text-sm">Create your first order to get started</div>
        </div>
      )}
    </div>
  )
}
