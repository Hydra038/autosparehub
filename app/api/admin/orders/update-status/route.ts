import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabaseServer'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId and status' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // Update order status in database
    const supabase = await createServerClient()
    
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      console.error('Error updating order status:', error)
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      order: data,
      message: `Order status updated to ${status}`,
    })
  } catch (error: any) {
    console.error('Error in update-status API:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
