'use client'

import { motion } from 'framer-motion'
import { getCarrierIcon, getDeliveryEstimate, formatCurrency } from '@/lib/dummy-data'
import { Shipment } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface RateCardProps {
  shipment: Shipment
  isRecommended?: boolean
  onPurchase?: (shipmentId: number) => void
  isPurchased?: boolean
  className?: string
}

export function RateCard({ 
  shipment, 
  isRecommended = false, 
  onPurchase, 
  isPurchased = false,
  className 
}: RateCardProps) {
  const carrierIcon = getCarrierIcon(shipment.carrier)
  const deliveryEstimate = getDeliveryEstimate(shipment.carrier, shipment.service_level)
  const isPending = shipment.status === 'pending'

  return (
    <motion.div
      className={cn(
        'relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg',
        isRecommended 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 bg-white hover:border-gray-300',
        isPurchased && 'border-green-500 bg-green-50',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isRecommended && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          RECOMMENDED
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{carrierIcon}</div>
          <div>
            <h3 className="font-semibold text-gray-900 capitalize">
              {shipment.carrier.toUpperCase()}
            </h3>
            <p className="text-sm text-gray-600">{shipment.service_level}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(shipment.rate_amount, shipment.rate_currency)}
          </div>
          <div className="text-sm text-gray-500">{deliveryEstimate}</div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex justify-between">
          <span>Package:</span>
          <span className="font-medium">{shipment.package_type}</span>
        </div>
        <div className="flex justify-between">
          <span>Weight:</span>
          <span className="font-medium">{shipment.weight_lb} lb</span>
        </div>
        <div className="flex justify-between">
          <span>Dimensions:</span>
          <span className="font-medium">
            {shipment.length_in}" × {shipment.width_in}" × {shipment.height_in}"
          </span>
        </div>
      </div>

      {shipment.tracking_number && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-1">Tracking Number:</div>
          <div className="font-mono text-sm text-gray-900">{shipment.tracking_number}</div>
        </div>
      )}

      <div className="flex space-x-2">
        {isPurchased ? (
          <div className="flex-1 bg-green-100 text-green-800 text-center py-2 px-4 rounded-lg font-medium">
            ✓ Label Purchased
          </div>
        ) : (
          <button
            onClick={() => onPurchase?.(shipment.id)}
            disabled={!isPending}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200',
              isPending
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            {isPending ? 'Buy Label' : 'Unavailable'}
          </button>
        )}
        
        {shipment.label_url && (
          <a
            href={shipment.label_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            View Label
          </a>
        )}
      </div>
    </motion.div>
  )
}
