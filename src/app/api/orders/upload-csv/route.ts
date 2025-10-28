import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { parseCSVFileServer, ParsedOrder } from '@/lib/csv-parser'
import { generateDummyShipments } from '@/lib/dummy-data'

export async function POST(request: NextRequest) {
  try {
    console.log('CSV upload API called')
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.log('No file provided')
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.name.endsWith('.csv')) {
      console.log('File is not CSV:', file.name)
      return NextResponse.json(
        { success: false, error: 'File must be a CSV' },
        { status: 400 }
      )
    }

    console.log('Parsing CSV file:', file.name)
    // Parse CSV file
    const fileContent = await file.text()
    const parseResult = parseCSVFileServer(fileContent)

    if (!parseResult.success || !parseResult.data) {
      console.log('CSV parse failed:', parseResult.errors)
      return NextResponse.json({
        success: false,
        error: 'Failed to parse CSV',
        details: parseResult.errors
      }, { status: 400 })
    }

    console.log('CSV parsed successfully, processing orders:', parseResult.data.length)
    const parsedOrders = parseResult.data
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Process each order
    for (const orderData of parsedOrders) {
      try {
        console.log('Processing order:', orderData.order.order_number)
        
        // Upsert customer
        console.log('Upserting customer:', orderData.customer.email)
        
        // First, try to find existing customer by email
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('*')
          .eq('email', orderData.customer.email)
          .single()
        
        let customerData
        if (existingCustomer) {
          // Update existing customer
          console.log('Updating existing customer:', existingCustomer.id)
          const { data: updatedCustomer, error: updateError } = await supabase
            .from('customers')
            .update(orderData.customer)
            .eq('id', existingCustomer.id)
            .select()
            .single()
          
          if (updateError) {
            console.error('Customer update error:', updateError)
            throw new Error(`Customer update error: ${updateError.message}`)
          }
          customerData = updatedCustomer
        } else {
          // Insert new customer
          console.log('Creating new customer')
          const { data: newCustomer, error: insertError } = await supabase
            .from('customers')
            .insert(orderData.customer)
            .select()
            .single()
          
          if (insertError) {
            console.error('Customer insert error:', insertError)
            throw new Error(`Customer insert error: ${insertError.message}`)
          }
          customerData = newCustomer
        }

        console.log('Customer created/found:', customerData.id)

        // Create order
        console.log('Creating order:', orderData.order.order_number)
        const { data: orderDataResult, error: orderError } = await supabase
          .from('orders')
          .insert({
            ...orderData.order,
            customer_id: customerData.id
          })
          .select()
          .single()

        if (orderError) {
          console.error('Order error:', orderError)
          throw new Error(`Order error: ${orderError.message}`)
        }

        console.log('Order created:', orderDataResult.id)

        // Create order items
        if (orderData.items && orderData.items.length > 0) {
          console.log('Creating order items:', orderData.items.length)
          const itemsWithOrderId = orderData.items.map(item => ({
            ...item,
            order_id: orderDataResult.id
          }))

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(itemsWithOrderId)

          if (itemsError) {
            console.error('Items error:', itemsError)
            throw new Error(`Items error: ${itemsError.message}`)
          }

          console.log('Order items created successfully')
        }

        // Generate dummy shipments
        console.log('Generating dummy shipments')
        const shipments = generateDummyShipments(
          orderDataResult.id,
          orderData.order.total_weight_lb
        )

        if (shipments.length > 0) {
          console.log('Creating shipments:', shipments.length)
          const { error: shipmentsError } = await supabase
            .from('shipments')
            .insert(shipments)

          if (shipmentsError) {
            console.warn(`Shipments error for order ${orderData.order.order_number}:`, shipmentsError.message)
          } else {
            console.log('Shipments created successfully')
          }
        }

        results.success++
        console.log('Order processed successfully:', orderData.order.order_number)
      } catch (error) {
        console.error('Error processing order:', orderData.order.order_number, error)
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
      { 
        success: false, 
        error: 'Failed to process CSV upload',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
