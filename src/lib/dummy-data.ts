import { CustomerInsert, OrderInsert, OrderItemInsert, ShipmentInsert } from './supabase'

// Carrier configurations
export const CARRIERS = {
  ups: {
    name: 'UPS',
    logo: '🚚',
    services: [
      { name: 'UPS Ground', days: '1-5', baseRate: 8.50 },
      { name: 'UPS 2nd Day Air', days: '2', baseRate: 16.00 },
      { name: 'UPS Next Day Air', days: '1', baseRate: 25.00 },
      { name: 'UPS Express', days: '1-2', baseRate: 35.00 }
    ]
  },
  usps: {
    name: 'USPS',
    logo: '📮',
    services: [
      { name: 'USPS Ground Advantage', days: '2-5', baseRate: 7.50 },
      { name: 'USPS Priority Mail', days: '1-3', baseRate: 8.85 },
      { name: 'USPS Priority Mail Express', days: '1-2', baseRate: 26.95 },
      { name: 'USPS First Class', days: '1-3', baseRate: 4.50 }
    ]
  },
  fedex: {
    name: 'FedEx',
    logo: '📦',
    services: [
      { name: 'FedEx Ground', days: '1-5', baseRate: 9.25 },
      { name: 'FedEx 2Day', days: '2', baseRate: 18.50 },
      { name: 'FedEx Standard Overnight', days: '1', baseRate: 28.75 },
      { name: 'FedEx International', days: '1-3', baseRate: 45.00 }
    ]
  },
  dhl: {
    name: 'DHL',
    logo: '🌍',
    services: [
      { name: 'DHL Express', days: '1-2', baseRate: 22.00 },
      { name: 'DHL Ground', days: '2-4', baseRate: 12.50 },
      { name: 'DHL International', days: '2-5', baseRate: 35.00 },
      { name: 'DHL Same Day', days: '1', baseRate: 55.00 }
    ]
  },
  aramex: {
    name: 'Aramex',
    logo: '🚛',
    services: [
      { name: 'Aramex Standard', days: '2-4', baseRate: 15.00 },
      { name: 'Aramex Express', days: '1-2', baseRate: 25.00 },
      { name: 'Aramex International', days: '3-7', baseRate: 40.00 },
      { name: 'Aramex Same Day', days: '1', baseRate: 50.00 }
    ]
  }
} as const

export type Carrier = keyof typeof CARRIERS

// Generate tracking number based on carrier
export function generateTrackingNumber(carrier: Carrier): string {
  const prefixes = {
    ups: '1Z',
    usps: '9400',
    fedex: '1234',
    dhl: '1234567890',
    aramex: 'AR'
  }
  
  const randomDigits = Math.random().toString().slice(2, 12)
  return `${prefixes[carrier]}${randomDigits}`
}

// Calculate shipping rate based on weight and dimensions
export function calculateShippingRate(
  carrier: Carrier,
  serviceIndex: number,
  weight: number,
  length: number,
  width: number,
  height: number
): number {
  const carrierConfig = CARRIERS[carrier]
  const service = carrierConfig.services[serviceIndex]
  
  if (!service) return 0
  
  // Base rate calculation
  let rate = service.baseRate
  
  // Weight surcharge (over 1lb)
  if (weight > 1) {
    rate += (weight - 1) * 2.50
  }
  
  // Dimensional weight calculation
  const dimensionalWeight = (length * width * height) / 139
  if (dimensionalWeight > weight) {
    rate += (dimensionalWeight - weight) * 1.50
  }
  
  // Distance factor (simplified)
  rate *= 1.1
  
  return Math.round(rate * 100) / 100
}

// Generate dummy customer data
export function generateDummyCustomers(): CustomerInsert[] {
  return [
    {
      name: 'Simon Kreuz',
      company: 'Shippo',
      email: 'info@goshippo.com',
      phone: '415-123-4567',
      street_line_1: '965 Mission Street',
      street_line_2: 'Apt. #203',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
      country: 'US'
    },
    {
      name: 'Ahmed Al-Rashid',
      company: 'Tech Solutions LLC',
      email: 'ahmed@techsolutions.ae',
      phone: '+971-50-123-4567',
      street_line_1: 'Sheikh Zayed Road',
      street_line_2: 'Tower 1, Floor 15',
      city: 'Dubai',
      state: 'Dubai',
      zip: '12345',
      country: 'AE'
    },
    {
      name: 'Sarah Johnson',
      company: 'E-commerce Plus',
      email: 'sarah@ecommerceplus.com',
      phone: '555-0123',
      street_line_1: '123 Business Ave',
      street_line_2: 'Suite 200',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'US'
    },
    {
      name: 'Mohammed Hassan',
      company: 'Digital Ventures',
      email: 'mohammed@digitalventures.ae',
      phone: '+971-4-567-8900',
      street_line_1: 'Jumeirah Beach Road',
      street_line_2: 'Villa 45',
      city: 'Dubai',
      state: 'Dubai',
      zip: '54321',
      country: 'AE'
    },
    {
      name: 'Emily Chen',
      company: 'Global Logistics',
      email: 'emily@globallogistics.com',
      phone: '555-0456',
      street_line_1: '456 Commerce St',
      street_line_2: 'Floor 8',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90210',
      country: 'US'
    }
  ]
}

// Generate dummy order items
export function generateDummyOrderItems(orderId: number): OrderItemInsert[] {
  const items = [
    { title: 'Wireless Headphones', sku: 'WH-001', weight: 0.5, price: 29.99 },
    { title: 'Phone Case', sku: 'PC-002', weight: 0.2, price: 15.00 },
    { title: 'Charging Cable', sku: 'CC-003', weight: 0.1, price: 12.99 },
    { title: 'Laptop Stand', sku: 'LS-004', weight: 1.0, price: 45.00 },
    { title: 'Mouse Pad', sku: 'MP-005', weight: 0.2, price: 8.00 },
    { title: 'USB Hub', sku: 'UH-006', weight: 0.8, price: 25.50 },
    { title: 'Monitor', sku: 'MON-007', weight: 2.5, price: 120.00 },
    { title: 'Keyboard', sku: 'KB-008', weight: 0.7, price: 50.00 },
    { title: 'Webcam', sku: 'WC-009', weight: 0.8, price: 35.75 },
    { title: 'Microphone', sku: 'MIC-010', weight: 0.7, price: 10.00 }
  ]
  
  // Randomly select 1-4 items for this order
  const numItems = Math.floor(Math.random() * 4) + 1
  const selectedItems = items.sort(() => 0.5 - Math.random()).slice(0, numItems)
  
  return selectedItems.map(item => ({
    order_id: orderId,
    title: item.title,
    sku: item.sku,
    quantity: Math.floor(Math.random() * 3) + 1,
    weight_lb: item.weight,
    price: item.price
  }))
}

// Generate dummy shipments with rates
export function generateDummyShipments(orderId: number, totalWeight: number): ShipmentInsert[] {
  const carriers: Carrier[] = ['ups', 'usps', 'fedex', 'dhl', 'aramex']
  const packageTypes = ['Express Envelope', 'Poly Mailer', 'Soft Pack', 'Box', 'Pouch']
  
  // Generate 2-4 shipping options per order
  const numOptions = Math.floor(Math.random() * 3) + 2
  const selectedCarriers = carriers.sort(() => 0.5 - Math.random()).slice(0, numOptions)
  
  return selectedCarriers.map(carrier => {
    const carrierConfig = CARRIERS[carrier]
    const serviceIndex = Math.floor(Math.random() * carrierConfig.services.length)
    const service = carrierConfig.services[serviceIndex]
    
    // Random package dimensions
    const length = Math.random() * 10 + 8 // 8-18 inches
    const width = Math.random() * 8 + 6   // 6-14 inches
    const height = Math.random() * 6 + 2  // 2-8 inches
    
    const rate = calculateShippingRate(carrier, serviceIndex, totalWeight, length, width, height)
    
    return {
      order_id: orderId,
      carrier,
      service_level: service.name,
      package_type: packageTypes[Math.floor(Math.random() * packageTypes.length)],
      weight_lb: totalWeight,
      length_in: Math.round(length * 10) / 10,
      width_in: Math.round(width * 10) / 10,
      height_in: Math.round(height * 10) / 10,
      rate_amount: rate,
      rate_currency: 'USD',
      status: 'pending' as const
    }
  })
}

// Generate delivery estimate
export function getDeliveryEstimate(carrier: Carrier, serviceLevel: string): string {
  const carrierConfig = CARRIERS[carrier]
  const service = carrierConfig.services.find(s => s.name === serviceLevel)
  return service ? `${service.days} days` : '3-5 days'
}

// Generate status color
export function getStatusColor(status: string): string {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

// Generate carrier logo/icon
export function getCarrierIcon(carrier: Carrier): string {
  return CARRIERS[carrier].logo
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Format weight
export function formatWeight(weight: number): string {
  return `${weight.toFixed(1)} lb`
}

// Format dimensions
export function formatDimensions(length: number, width: number, height: number): string {
  return `${length}" × ${width}" × ${height}"`
}
