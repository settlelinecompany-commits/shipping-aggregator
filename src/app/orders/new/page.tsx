'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DashboardHeader } from '@/components/DashboardHeader'
import { Customer } from '@/lib/supabase'
import { 
  ArrowLeft, 
  User, 
  Package, 
  Truck, 
  Check,
  Plus,
  Trash2,
  Search
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface OrderItem {
  title: string
  sku: string
  quantity: number
  weight_lb: number
  price: number
}

interface CustomerFormData {
  name: string
  company: string
  email: string
  phone: string
  street_line_1: string
  street_line_2: string
  city: string
  state: string
  zip: string
  country: string
}

export default function NewOrderPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showCustomerForm, setShowCustomerForm] = useState(false)

  // Form data
  const [customerForm, setCustomerForm] = useState<CustomerFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    street_line_1: '',
    street_line_2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  })

  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { title: '', sku: '', quantity: 1, weight_lb: 0, price: 0 }
  ])

  const [packageDetails, setPackageDetails] = useState({
    package_type: 'Box',
    weight_lb: 0,
    length_in: 0,
    width_in: 0,
    height_in: 0
  })

  const [orderDetails, setOrderDetails] = useState({
    order_number: '',
    order_date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      const data = await response.json()
      if (data.success) {
        setCustomers(data.data)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.company && customer.company.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Add new item
  const addItem = () => {
    setOrderItems([...orderItems, { title: '', sku: '', quantity: 1, weight_lb: 0, price: 0 }])
  }

  // Remove item
  const removeItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index))
    }
  }

  // Update item
  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const updatedItems = [...orderItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setOrderItems(updatedItems)
  }

  // Calculate totals
  const totalWeight = orderItems.reduce((sum, item) => sum + (item.weight_lb * item.quantity), 0)
  const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Generate order number
  useEffect(() => {
    if (!orderDetails.order_number) {
      const orderNumber = `ORD-${Date.now()}`
      setOrderDetails(prev => ({ ...prev, order_number: orderNumber }))
    }
  }, [])

  // Submit order
  const handleSubmit = async () => {
    try {
      setLoading(true)

      const orderData = {
        order: {
          order_number: orderDetails.order_number,
          order_date: orderDetails.order_date,
          status: 'pending',
          total_weight_lb: totalWeight,
          total_items: orderItems.reduce((sum, item) => sum + item.quantity, 0),
          order_currency: 'USD',
          order_amount: totalAmount
        },
        customer: selectedCustomer || customerForm,
        items: orderItems
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/orders/${result.data.order.id}`)
      } else {
        alert(`Failed to create order: ${result.error}`)
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Customer', icon: User },
    { number: 2, title: 'Items', icon: Package },
    { number: 3, title: 'Package', icon: Truck },
    { number: 4, title: 'Review', icon: Check }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          <h1 className="text-3xl font-bold text-gray-900">Create New Order</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number

              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center">
                    <div className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200',
                      isActive && 'border-blue-600 bg-blue-600 text-white',
                      isCompleted && 'border-green-600 bg-green-600 text-white',
                      !isActive && !isCompleted && 'border-gray-300 bg-white text-gray-400'
                    )}>
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div className="ml-3">
                      <div className={cn(
                        'text-sm font-medium',
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      )}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      'w-16 h-0.5 mx-4',
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    )} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Customer */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
              
              <div className="space-y-6">
                {/* Customer Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Existing Customer
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or company..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {searchQuery && (
                    <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                      {filteredCustomers.map((customer) => (
                        <button
                          key={customer.id}
                          onClick={() => {
                            setSelectedCustomer(customer)
                            setSearchQuery('')
                          }}
                          className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-600">{customer.email}</div>
                          {customer.company && (
                            <div className="text-sm text-gray-500">{customer.company}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Customer */}
                {selectedCustomer && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{selectedCustomer.name}</div>
                        <div className="text-sm text-gray-600">{selectedCustomer.email}</div>
                        {selectedCustomer.company && (
                          <div className="text-sm text-gray-500">{selectedCustomer.company}</div>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedCustomer(null)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}

                {/* New Customer Form */}
                {!selectedCustomer && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">New Customer</h3>
                      <button
                        onClick={() => setShowCustomerForm(!showCustomerForm)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {showCustomerForm ? 'Cancel' : 'Add New Customer'}
                      </button>
                    </div>

                    {showCustomerForm && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={customerForm.name}
                            onChange={(e) => setCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            value={customerForm.company}
                            onChange={(e) => setCustomerForm(prev => ({ ...prev, company: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={customerForm.email}
                            onChange={(e) => setCustomerForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            value={customerForm.phone}
                            onChange={(e) => setCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            value={customerForm.street_line_1}
                            onChange={(e) => setCustomerForm(prev => ({ ...prev, street_line_1: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address 2
                          </label>
                          <input
                            type="text"
                            value={customerForm.street_line_2}
                            onChange={(e) => setCustomerForm(prev => ({ ...prev, street_line_2: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            value={customerForm.city}
                            onChange={(e) => setCustomerForm(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            value={customerForm.state}
                            onChange={(e) => setCustomerForm(prev => ({ ...prev, state: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            value={customerForm.zip}
                            onChange={(e) => setCustomerForm(prev => ({ ...prev, zip: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <select
                            value={customerForm.country}
                            onChange={(e) => setCustomerForm(prev => ({ ...prev, country: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="US">United States</option>
                            <option value="AE">United Arab Emirates</option>
                            <option value="CA">Canada</option>
                            <option value="GB">United Kingdom</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Items */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
              
              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">Item {index + 1}</h3>
                      {orderItems.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateItem(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SKU *
                        </label>
                        <input
                          type="text"
                          value={item.sku}
                          onChange={(e) => updateItem(index, 'sku', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (lb) *
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={item.weight_lb}
                          onChange={(e) => updateItem(index, 'weight_lb', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.price}
                          onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addItem}
                  className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Item</span>
                </button>
              </div>

              {/* Order Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Weight:</span>
                  <span className="font-medium text-gray-900">{totalWeight.toFixed(1)} lb</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Amount:</span>
                  <span className="font-medium text-gray-900">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Package */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Package Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Type *
                  </label>
                  <select
                    value={packageDetails.package_type}
                    onChange={(e) => setPackageDetails(prev => ({ ...prev, package_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Box">Box</option>
                    <option value="Envelope">Envelope</option>
                    <option value="Poly Mailer">Poly Mailer</option>
                    <option value="Soft Pack">Soft Pack</option>
                    <option value="Express Envelope">Express Envelope</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (lb) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={packageDetails.weight_lb}
                    onChange={(e) => setPackageDetails(prev => ({ ...prev, weight_lb: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Length (in) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={packageDetails.length_in}
                    onChange={(e) => setPackageDetails(prev => ({ ...prev, length_in: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width (in) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={packageDetails.width_in}
                    onChange={(e) => setPackageDetails(prev => ({ ...prev, width_in: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (in) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={packageDetails.height_in}
                    onChange={(e) => setPackageDetails(prev => ({ ...prev, height_in: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Package Preview */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Package Preview</h3>
                <div className="text-sm text-gray-600">
                  <div>Type: {packageDetails.package_type}</div>
                  <div>Weight: {packageDetails.weight_lb} lb</div>
                  <div>Dimensions: {packageDetails.length_in}" × {packageDetails.width_in}" × {packageDetails.height_in}"</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Order</h2>
              
              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Customer</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">
                      {selectedCustomer?.name || customerForm.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedCustomer?.email || customerForm.email}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedCustomer?.phone || customerForm.phone}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Items</h3>
                  <div className="space-y-2">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{item.title}</div>
                          <div className="text-sm text-gray-600">SKU: {item.sku}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            {item.quantity}x ${item.price.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.weight_lb} lb each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Package */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Package</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      <div>Type: {packageDetails.package_type}</div>
                      <div>Weight: {packageDetails.weight_lb} lb</div>
                      <div>Dimensions: {packageDetails.length_in}" × {packageDetails.width_in}" × {packageDetails.height_in}"</div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-medium text-gray-900">{orderDetails.order_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(orderDetails.order_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-medium text-gray-900">
                        {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Weight:</span>
                      <span className="font-medium text-gray-900">{totalWeight.toFixed(1)} lb</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center space-x-3">
              {currentStep < 4 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  )}
                  <span>{loading ? 'Creating...' : 'Create Order'}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
