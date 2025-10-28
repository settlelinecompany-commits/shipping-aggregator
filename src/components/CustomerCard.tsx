'use client'

import { motion } from 'framer-motion'
import { Customer } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { MapPin, Mail, Phone, Building } from 'lucide-react'

interface CustomerCardProps {
  customer: Customer
  className?: string
  showActions?: boolean
  onEdit?: (customer: Customer) => void
  onView?: (customer: Customer) => void
}

export function CustomerCard({ 
  customer, 
  className, 
  showActions = false,
  onEdit,
  onView 
}: CustomerCardProps) {
  return (
    <motion.div
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200',
        className
      )}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
          {customer.company && (
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Building className="w-4 h-4 mr-1" />
              {customer.company}
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(customer)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
            )}
            {onView && (
              <button
                onClick={() => onView(customer)}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                View
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2 text-gray-400" />
          <span>{customer.email}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2 text-gray-400" />
          <span>{customer.phone}</span>
        </div>
        
        <div className="flex items-start text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <div>{customer.street_line_1}</div>
            {customer.street_line_2 && <div>{customer.street_line_2}</div>}
            <div>{customer.city}, {customer.state} {customer.zip}</div>
            <div className="font-medium">{customer.country}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
