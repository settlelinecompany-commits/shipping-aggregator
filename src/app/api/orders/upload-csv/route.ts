import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { parseCSVFile, ParsedOrder } from '@/lib/csv-parser'
import { generateDummyShipments } from '@/lib/dummy-data'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { success: false, error: 'File must be a CSV' },
        { status: 400 }
      )
    }

    // Parse CSV file
    const parseResult = await parseCSVFile(file)

    if (!parseResult.success || !parseResult.data) {
      return NextResponse.json({
        success: false,
        error: 'Failed to parse CSV',
        details: parseResult.errors
      }, { status: 400 })
    }

    const parsedOrders = parseResult.data
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Process each order
    for (const orderData of parsedOrders) {
      try {
        // Upsert customer
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .upsert(orderData.customer, { onConflict: 'email' })
          .select()
          .single()

        if (customerError) {
          throw new Error(`Customer error: ${customerError.message}`)
        }

        // Create order
        const { data: orderDataResult, error: orderError } = await supabase
          .from('orders')
          .insert({
            ...orderData.order,
            customer_id: customerData.id
          })
          .select()
          .single()

        if (orderError) {
          throw new Error(`Order error: ${orderError.message}`)
        }

        // Create order items
        if (orderData.items && orderData.items.length > 0) {
          const itemsWithOrderId = orderData.items.map(item => ({
            ...item,
            order_id: orderDataResult.id
          }))

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(itemsWithOrderId)

          if (itemsError) {
            throw new Error(`Items error: ${itemsError.message}`)
          }
        }

        // Generate dummy shipments
        const shipments = generateDummyShipments(
          orderDataResult.id,
          orderData.order.total_weight_lb
        )

        if (shipments.length > 0) {
          const { error: shipmentsError } = await supabase
            .from('shipments')
            .insert(shipments)

          if (shipmentsError) {
            console.warn(`Shipments error for order ${orderData.order.order_number}:`, shipmentsError.message)
          }
        }

        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(
          `Order ${orderData.order.order_number}: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      }
    }

    return NextResponse.json({
      success: results.failed === 0,
      message: `Processed ${parsedOrders.length} orders: ${results.success} successful, ${results.failed} failed`,
      results: {
        total: parsedOrders.length,
        successful: results.success,
        failed: results.failed,
        errors: results.errors
      }
    })
  } catch (error) {
    console.error('Error processing CSV upload:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process CSV upload' },
      { status: 500 }
    )
  }
}
