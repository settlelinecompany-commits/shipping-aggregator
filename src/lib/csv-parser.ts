import Papa from 'papaparse'

export interface CSVOrderData {
  order_number: string
  order_date: string
  customer_name: string
  company?: string
  email: string
  phone: string
  street_line_1: string
  street_line_2?: string
  city: string
  state: string
  zip: string
  country: string
  item_title: string
  sku: string
  quantity: number
  item_weight: number
  item_price: number
  order_weight: number
  order_amount: number
}

export interface ParsedOrder {
  order: {
    order_number: string
    order_date: string
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    total_weight_lb: number
    total_items: number
    order_currency: string
    order_amount: number
  }
  customer: {
    name: string
    company?: string
    email: string
    phone: string
    street_line_1: string
    street_line_2?: string
    city: string
    state: string
    zip: string
    country: string
  }
  items: Array<{
    title: string
    sku: string
    quantity: number
    weight_lb: number
    price: number
  }>
}

export interface CSVParseResult {
  success: boolean
  data?: ParsedOrder[]
  errors?: string[]
  warnings?: string[]
}

// Expected CSV columns (matching Shippo format)
const REQUIRED_COLUMNS = [
  'order_number',
  'order_date', 
  'customer_name',
  'email',
  'phone',
  'street_line_1',
  'city',
  'state',
  'zip',
  'country',
  'item_title',
  'sku',
  'quantity',
  'item_weight',
  'item_price',
  'order_weight',
  'order_amount'
]

const OPTIONAL_COLUMNS = [
  'company',
  'street_line_2'
]

// Parse CSV file
export function parseCSVFile(file: File): Promise<CSVParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Normalize header names to match our expected format
        const normalized = header.toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_]/g, '')
        
        // Map common variations to our expected column names
        const headerMap: { [key: string]: string } = {
          'order_numbe': 'order_number',
          'customer_na': 'customer_name',
          'street_line': 'street_line_1',
          'item_title': 'item_title',
          'item_weight': 'item_weight',
          'item_price': 'item_price',
          'order_weight': 'order_weight',
          'order_amoun': 'order_amount'
        }
        
        return headerMap[normalized] || normalized
      },
      complete: (results) => {
        const { data, errors } = results
        
        if (errors.length > 0) {
          resolve({
            success: false,
            errors: errors.map(error => `Row ${error.row}: ${error.message}`)
          })
          return
        }
        
        if (!data || data.length === 0) {
          resolve({
            success: false,
            errors: ['No data found in CSV file']
          })
          return
        }
        
        // Validate headers
        const headers = Object.keys(data[0] as any)
        console.log('CSV Headers found:', headers)
        console.log('Required columns:', REQUIRED_COLUMNS)
        
        const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col))
        
        if (missingColumns.length > 0) {
          resolve({
            success: false,
            errors: [`Missing required columns: ${missingColumns.join(', ')}`]
          })
          return
        }
        
        // Parse and validate data
        const parseResult = parseCSVData(data as any[])
        resolve(parseResult)
      },
      error: (error) => {
        resolve({
          success: false,
          errors: [`CSV parsing error: ${error.message}`]
        })
      }
    })
  })
}

// Parse CSV data into structured format
function parseCSVData(csvData: any[]): CSVParseResult {
  const parsedOrders: ParsedOrder[] = []
  const errors: string[] = []
  const warnings: string[] = []
  
  // Group rows by order_number
  const orderGroups = new Map<string, any[]>()
  
  csvData.forEach((row, index) => {
    const orderNumber = row.order_number?.toString().trim()
    
    if (!orderNumber) {
      errors.push(`Row ${index + 1}: Missing order number`)
      return
    }
    
    if (!orderGroups.has(orderNumber)) {
      orderGroups.set(orderNumber, [])
    }
    
    orderGroups.get(orderNumber)!.push(row)
  })
  
  // Process each order group
  orderGroups.forEach((rows, orderNumber) => {
    try {
      const parsedOrder = parseOrderGroup(orderNumber, rows)
      if (parsedOrder) {
        parsedOrders.push(parsedOrder)
      }
    } catch (error) {
      errors.push(`Order ${orderNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })
  
  return {
    success: errors.length === 0,
    data: parsedOrders,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  }
}

// Parse a group of rows for a single order
function parseOrderGroup(orderNumber: string, rows: any[]): ParsedOrder | null {
  if (rows.length === 0) return null
  
  const firstRow = rows[0]
  
  // Validate required fields
  const requiredFields = ['order_date', 'customer_name', 'email', 'phone', 'street_line_1', 'city', 'state', 'zip', 'country']
  for (const field of requiredFields) {
    if (!firstRow[field] || firstRow[field].toString().trim() === '') {
      throw new Error(`Missing required field: ${field}`)
    }
  }
  
  // Parse order data
  const orderDate = parseDate(firstRow.order_date)
  if (!orderDate) {
    throw new Error('Invalid order date format')
  }
  
  const totalWeight = parseFloat(firstRow.order_weight) || 0
  const orderAmount = parseFloat(firstRow.order_amount) || 0
  
  if (totalWeight <= 0) {
    throw new Error('Invalid order weight')
  }
  
  if (orderAmount <= 0) {
    throw new Error('Invalid order amount')
  }
  
  // Parse customer data
  const customer = {
    name: firstRow.customer_name.toString().trim(),
    company: firstRow.company?.toString().trim() || undefined,
    email: firstRow.email.toString().trim(),
    phone: firstRow.phone.toString().trim(),
    street_line_1: firstRow.street_line_1.toString().trim(),
    street_line_2: firstRow.street_line_2?.toString().trim() || undefined,
    city: firstRow.city.toString().trim(),
    state: firstRow.state.toString().trim(),
    zip: firstRow.zip.toString().trim(),
    country: firstRow.country.toString().trim().toUpperCase()
  }
  
  // Parse items
  const items = rows.map(row => {
    const quantity = parseInt(row.quantity) || 1
    const weight = parseFloat(row.item_weight) || 0
    const price = parseFloat(row.item_price) || 0
    
    if (quantity <= 0) {
      throw new Error(`Invalid quantity for item: ${row.item_title}`)
    }
    
    if (weight < 0) {
      throw new Error(`Invalid weight for item: ${row.item_title}`)
    }
    
    if (price < 0) {
      throw new Error(`Invalid price for item: ${row.item_title}`)
    }
    
    return {
      title: row.item_title.toString().trim(),
      sku: row.sku.toString().trim(),
      quantity,
      weight_lb: weight,
      price
    }
  })
  
  return {
    order: {
      order_number: orderNumber,
      order_date: orderDate,
      status: 'pending' as const,
      total_weight_lb: totalWeight,
      total_items: items.reduce((sum, item) => sum + item.quantity, 0),
      order_currency: 'USD',
      order_amount: orderAmount
    },
    customer,
    items
  }
}

// Parse date string to ISO format
function parseDate(dateStr: string): string | null {
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return null
    }
    return date.toISOString().split('T')[0] // Return YYYY-MM-DD format
  } catch {
    return null
  }
}

// Generate CSV template
export function generateCSVTemplate(): string {
  const headers = [
    'Order Number',
    'Order Date',
    'Customer Name',
    'Company',
    'Email',
    'Phone',
    'Street Line 1',
    'Street Line 2',
    'City',
    'State',
    'Zip',
    'Country',
    'Item Title',
    'SKU',
    'Quantity',
    'Item Weight',
    'Item Price',
    'Order Weight',
    'Order Amount'
  ]
  
  const sampleRow = [
    'ORD-1000',
    '2024-01-15',
    'John Doe',
    'Acme Corp',
    'john@acme.com',
    '555-0123',
    '123 Main St',
    'Suite 100',
    'New York',
    'NY',
    '10001',
    'US',
    'Sample Product',
    'SP-001',
    '2',
    '0.5',
    '25.99',
    '1.0',
    '51.98'
  ]
  
  return [headers.join(','), sampleRow.join(',')].join('\n')
}

// Validate CSV data before upload
export function validateCSVData(data: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data || data.length === 0) {
    errors.push('No data found in CSV')
    return { valid: false, errors }
  }
  
  // Check headers
  const headers = Object.keys(data[0])
  const missingHeaders = REQUIRED_COLUMNS.filter(col => !headers.includes(col))
  
  if (missingHeaders.length > 0) {
    errors.push(`Missing required columns: ${missingHeaders.join(', ')}`)
  }
  
  // Check data rows
  data.forEach((row, index) => {
    const rowNum = index + 1
    
    // Check required fields
    REQUIRED_COLUMNS.forEach(col => {
      if (!row[col] || row[col].toString().trim() === '') {
        errors.push(`Row ${rowNum}: Missing ${col}`)
      }
    })
    
    // Validate numeric fields
    const numericFields = ['quantity', 'item_weight', 'item_price', 'order_weight', 'order_amount']
    numericFields.forEach(field => {
      const value = parseFloat(row[field])
      if (isNaN(value) || value < 0) {
        errors.push(`Row ${rowNum}: Invalid ${field} value`)
      }
    })
    
    // Validate email format
    const email = row.email?.toString().trim()
    if (email && !isValidEmail(email)) {
      errors.push(`Row ${rowNum}: Invalid email format`)
    }
  })
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
