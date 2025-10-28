import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types for TypeScript
export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: number
          name: string
          company: string | null
          email: string
          phone: string
          street_line_1: string
          street_line_2: string | null
          city: string
          state: string
          zip: string
          country: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          company?: string | null
          email: string
          phone: string
          street_line_1: string
          street_line_2?: string | null
          city: string
          state: string
          zip: string
          country?: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          company?: string | null
          email?: string
          phone?: string
          street_line_1?: string
          street_line_2?: string | null
          city?: string
          state?: string
          zip?: string
          country?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: number
          order_number: string
          order_date: string
          customer_id: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_weight_lb: number
          total_items: number
          order_currency: string
          order_amount: number
          created_at: string
        }
        Insert: {
          id?: number
          order_number: string
          order_date: string
          customer_id: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_weight_lb: number
          total_items: number
          order_currency?: string
          order_amount: number
          created_at?: string
        }
        Update: {
          id?: number
          order_number?: string
          order_date?: string
          customer_id?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_weight_lb?: number
          total_items?: number
          order_currency?: string
          order_amount?: number
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          title: string
          sku: string
          quantity: number
          weight_lb: number
          price: number
        }
        Insert: {
          id?: number
          order_id: number
          title: string
          sku: string
          quantity: number
          weight_lb: number
          price: number
        }
        Update: {
          id?: number
          order_id?: number
          title?: string
          sku?: string
          quantity?: number
          weight_lb?: number
          price?: number
        }
      }
      shipments: {
        Row: {
          id: number
          order_id: number
          carrier: 'ups' | 'usps' | 'fedex' | 'dhl' | 'aramex'
          service_level: string
          tracking_number: string | null
          label_url: string | null
          package_type: string
          weight_lb: number
          length_in: number
          width_in: number
          height_in: number
          rate_amount: number
          rate_currency: string
          status: 'pending' | 'purchased' | 'in_transit' | 'delivered'
          shipped_date: string | null
          delivered_date: string | null
          created_at: string
        }
        Insert: {
          id?: number
          order_id: number
          carrier: 'ups' | 'usps' | 'fedex' | 'dhl' | 'aramex'
          service_level: string
          tracking_number?: string | null
          label_url?: string | null
          package_type: string
          weight_lb: number
          length_in: number
          width_in: number
          height_in: number
          rate_amount: number
          rate_currency?: string
          status?: 'pending' | 'purchased' | 'in_transit' | 'delivered'
          shipped_date?: string | null
          delivered_date?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          order_id?: number
          carrier?: 'ups' | 'usps' | 'fedex' | 'dhl' | 'aramex'
          service_level?: string
          tracking_number?: string | null
          label_url?: string | null
          package_type?: string
          weight_lb?: number
          length_in?: number
          width_in?: number
          height_in?: number
          rate_amount?: number
          rate_currency?: string
          status?: 'pending' | 'purchased' | 'in_transit' | 'delivered'
          shipped_date?: string | null
          delivered_date?: string | null
          created_at?: string
        }
      }
    }
  }
}

// Helper types for API responses
export type Customer = Database['public']['Tables']['customers']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Shipment = Database['public']['Tables']['shipments']['Row']

export type OrderWithDetails = Order & {
  customer: Customer
  items: OrderItem[]
  shipments: Shipment[]
}

export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']
export type ShipmentInsert = Database['public']['Tables']['shipments']['Insert']
