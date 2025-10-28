import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { OrderWithDetails } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '25')
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('orders')
      .select(`
        *,
        customer:customers(*),
        items:order_items(*),
        shipments:shipments(*)
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer.name.ilike.%${search}%`)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: orders, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // Transform data to match frontend expectations
    const transformedOrders: OrderWithDetails[] = (orders || []).map(order => ({
      ...order,
      customer: order.customer,
      items: order.items || [],
      shipments: order.shipments || []
    }))

    return NextResponse.json({
      success: true,
      data: transformedOrders,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order, customer, items } = body

    // Start transaction
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .upsert(customer, { onConflict: 'email' })
      .select()
      .single()

    if (customerError) {
      console.error('Customer error:', customerError)
      return NextResponse.json(
        { success: false, error: 'Failed to create customer' },
        { status: 500 }
      )
    }

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        ...order,
        customer_id: customerData.id
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order error:', orderError)
      return NextResponse.json(
        { success: false, error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Create order items
    if (items && items.length > 0) {
      const itemsWithOrderId = items.map((item: any) => ({
        ...item,
        order_id: orderData.id
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsWithOrderId)

      if (itemsError) {
        console.error('Items error:', itemsError)
        return NextResponse.json(
          { success: false, error: 'Failed to create order items' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        order: orderData,
        customer: customerData,
        items: items || []
      }
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
