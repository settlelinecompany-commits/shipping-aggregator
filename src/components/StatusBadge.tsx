'use client'

import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  type?: 'order' | 'shipment'
  className?: string
}

export function StatusBadge({ status, type = 'order', className }: StatusBadgeProps) {
  const getStatusConfig = (status: string, type: string) => {
    if (type === 'order') {
      switch (status) {
        case 'pending':
          return {
            label: 'Pending',
            className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
          }
        case 'processing':
          return {
            label: 'Processing',
            className: 'bg-blue-100 text-blue-800 border-blue-200'
          }
        case 'shipped':
          return {
            label: 'Shipped',
            className: 'bg-purple-100 text-purple-800 border-purple-200'
          }
        case 'delivered':
          return {
            label: 'Delivered',
            className: 'bg-green-100 text-green-800 border-green-200'
          }
        case 'cancelled':
          return {
            label: 'Cancelled',
            className: 'bg-red-100 text-red-800 border-red-200'
          }
        default:
          return {
            label: status,
            className: 'bg-gray-100 text-gray-800 border-gray-200'
          }
      }
    } else {
      switch (status) {
        case 'pending':
          return {
            label: 'Pending',
            className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
          }
        case 'purchased':
          return {
            label: 'Purchased',
            className: 'bg-blue-100 text-blue-800 border-blue-200'
          }
        case 'in_transit':
          return {
            label: 'In Transit',
            className: 'bg-purple-100 text-purple-800 border-purple-200'
          }
        case 'delivered':
          return {
            label: 'Delivered',
            className: 'bg-green-100 text-green-800 border-green-200'
          }
        default:
          return {
            label: status,
            className: 'bg-gray-100 text-gray-800 border-gray-200'
          }
      }
    }
  }

  const config = getStatusConfig(status, type)

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
