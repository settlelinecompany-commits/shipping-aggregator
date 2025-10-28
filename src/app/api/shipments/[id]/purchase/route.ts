import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateTrackingNumber } from '@/lib/dummy-data'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const shipmentId = parseInt(id)

    if (isNaN(shipmentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid shipment ID' },
        { status: 400 }
      )
    }

    // Get current shipment
    const { data: shipment, error: fetchError } = await supabase
      .from('shipments')
      .select('*')
      .eq('id', shipmentId)
      .single()

    if (fetchError) {
      console.error('Supabase error:', fetchError)
      return NextResponse.json(
        { success: false, error: fetchError.message },
        { status: 500 }
      )
    }

    if (!shipment) {
      return NextResponse.json(
        { success: false, error: 'Shipment not found' },
        { status: 404 }
      )
    }

    if (shipment.status === 'purchased') {
      return NextResponse.json(
        { success: false, error: 'Shipment already purchased' },
        { status: 400 }
      )
    }

    // Generate tracking number and label URL
    const trackingNumber = generateTrackingNumber(shipment.carrier)
    const labelUrl = `https://labels.example.com/${trackingNumber}.pdf`

    // Update shipment with tracking info
    const { data: updatedShipment, error: updateError } = await supabase
      .from('shipments')
      .update({
        tracking_number: trackingNumber,
        label_url: labelUrl,
        status: 'purchased',
        shipped_date: new Date().toISOString()
      })
      .eq('id', shipmentId)
      .select()
      .single()

    if (updateError) {
      console.error('Supabase error:', updateError)
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      )
    }

    // Update order status to shipped
    await supabase
      .from('orders')
      .update({ status: 'shipped' })
      .eq('id', shipment.order_id)

    return NextResponse.json({
      success: true,
      data: {
        ...updatedShipment,
        tracking_number: trackingNumber,
        label_url: labelUrl,
        status: 'purchased'
      },
      message: 'Shipping label purchased successfully'
    })
  } catch (error) {
    console.error('Error purchasing shipment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to purchase shipment' },
      { status: 500 }
    )
  }
}
