import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Order creation API route - Saves to Supabase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shipping, payment_method, customer_notes } = body

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

    // Create server-side Supabase client that can read cookies
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Get authenticated user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    console.log('✅ User authenticated:', user.email)

    // Calculate totals
    let subtotal_eur = 0
    for (const item of items) {
      subtotal_eur += (item.price_eur || 0) * (item.quantity || 1)
    }

    const shipping_cost_eur = 5.99
    const tax_amount_eur = subtotal_eur * 0.19 // 19% VAT
    const discount_eur = 0
    const total_eur = subtotal_eur + shipping_cost_eur + tax_amount_eur - discount_eur

    // Generate order number
    const orderNumber = `ASH-${Date.now().toString().slice(-8)}`

    // Create order in Supabase
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        
        // Shipping address (separate columns, not JSONB)
        shipping_full_name: shipping.full_name,
        shipping_email: shipping.email,
        shipping_phone: shipping.phone || null,
        shipping_address_line1: shipping.address_line1,
        shipping_address_line2: shipping.address_line2 || null,
        shipping_city: shipping.city,
        shipping_postal_code: shipping.postal_code,
        shipping_country: shipping.country,
        
        // Order totals
        subtotal_eur: subtotal_eur,
        shipping_eur: shipping_cost_eur,
        tax_eur: tax_amount_eur,
        discount_eur: discount_eur,
        total_eur: total_eur,
        
        // Payment
        payment_method: payment_method || 'paypal',
        payment_status: payment_method === 'iban' || payment_method === 'bank_transfer' ? 'pending' : 'pending',
        status: 'confirmed',
        
        // Notes
        customer_notes: customer_notes || null,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Database error:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order: ' + orderError.message },
        { status: 500 }
      )
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      product_title: item.title,
      product_sku: item.sku,
      product_image_url: item.image_url,
      unit_price_eur: item.price_eur,
      quantity: item.quantity,
      total_price_eur: item.price_eur * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Rollback - delete the order
      await supabase.from('orders').delete().eq('id', orderData.id)
      return NextResponse.json(
        { error: 'Failed to create order items: ' + itemsError.message },
        { status: 500 }
      )
    }

    console.log('✅ Order created in database:', {
      orderNumber,
      orderId: orderData.id,
      items: items.length,
      total: total_eur,
      user: user.email,
      payment: payment_method,
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        order: orderData,
        message: 'Order created successfully',
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
