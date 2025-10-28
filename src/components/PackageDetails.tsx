'use client'

import { motion } from 'framer-motion'
import { Package, Weight, Ruler } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PackageDetailsProps {
  packageType: string
  weight: number
  length: number
  width: number
  height: number
  className?: string
}

export function PackageDetails({ 
  packageType, 
  weight, 
  length, 
  width, 
  height, 
  className 
}: PackageDetailsProps) {
  return (
    <motion.div
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-4 shadow-sm',
        className
      )}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Package className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Package Details</h3>
          <p className="text-sm text-gray-600">{packageType}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Weight className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-sm text-gray-600">Weight</div>
            <div className="font-medium text-gray-900">{weight} lb</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Ruler className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-sm text-gray-600">Dimensions</div>
            <div className="font-medium text-gray-900">
              {length}" × {width}" × {height}"
            </div>
          </div>
        </div>
      </div>

      {/* Visual package representation */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 mb-2">Package Preview:</div>
        <div className="relative">
          <div 
            className="bg-blue-200 border-2 border-blue-300 rounded"
            style={{
              width: `${Math.min(length * 8, 120)}px`,
              height: `${Math.min(height * 8, 80)}px`,
              margin: '0 auto'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-xs text-blue-800 font-medium">
              {packageType.split(' ')[0]}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
