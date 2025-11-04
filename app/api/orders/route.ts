import { NextRequest, NextResponse } from 'next/server'

// Order creation API route - DEMO MODE (no database)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shipping, payment_method } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty cart items' },
        { status: 400 }
      )
    }

    if (!shipping || !shipping.full_name || !shipping.email || !shipping.address_line1) {
      return NextResponse.json(
        { error: 'Missing required shipping information' },
        { status: 400 }
      )
    }

    // Calculate totals
    let subtotal = 0
    for (const item of items) {
      subtotal += (item.price_eur || 0) * (item.quantity || 1)
    }

    const shipping_eur = 5.99
    const tax_eur = subtotal * 0.19 // 19% VAT
    const discount_eur = 0
    const total_eur = subtotal + shipping_eur + tax_eur - discount_eur

    // Generate mock order
    const orderId = `mock-${Date.now()}`
    const orderNumber = `ASH-${Date.now().toString().slice(-8)}`

    // Simulate successful order creation
    console.log('Order created (DEMO MODE):', {
      orderNumber,
      items: items.length,
      total: total_eur,
      shipping: shipping.email,
      payment: payment_method,
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        order: {
          id: orderId,
          order_number: orderNumber,
          total_eur: total_eur,
          status: 'confirmed',
          payment_status: 'pending',
        },
        message: 'Demo mode: Order created successfully (not saved to database)',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
