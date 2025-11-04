// Database queries for orders
import { createServerClient } from '@/lib/supabaseServer'
import { createClient } from '@/lib/supabaseClient'

export interface Order {
  id: string
  order_number: string
  user_id: string
  subtotal_eur: number
  shipping_eur: number
  tax_eur: number
  discount_eur: number
  total_eur: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: 'stripe' | 'paypal' | 'bank_transfer' | null
  payment_intent_id: string | null
  shipping_full_name: string
  shipping_email: string
  shipping_phone: string | null
  shipping_address_line1: string
  shipping_address_line2: string | null
  shipping_city: string
  shipping_postal_code: string
  shipping_country: string
  customer_notes: string | null
  tracking_number: string | null
  carrier: string | null
  created_at: string
  updated_at: string
  confirmed_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_title: string
  product_sku: string
  product_image_url: string | null
  unit_price_eur: number
  quantity: number
  total_price_eur: number
  created_at: string
}

// Create a new order
export async function createOrder(orderData: {
  user_id: string
  items: Array<{
    product_id: string
    product_title: string
    product_sku: string
    product_image_url: string | null
    unit_price_eur: number
    quantity: number
  }>
  subtotal_eur: number
  shipping_eur: number
  tax_eur: number
  total_eur: number
  payment_method: 'stripe' | 'paypal' | 'bank_transfer'
  shipping_full_name: string
  shipping_email: string
  shipping_phone?: string
  shipping_address_line1: string
  shipping_address_line2?: string
  shipping_city: string
  shipping_postal_code: string
  shipping_country: string
  customer_notes?: string
}) {
  const supabase = await createServerClient()
  
  // Generate order number
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
  
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: orderData.user_id,
      subtotal_eur: orderData.subtotal_eur,
      shipping_eur: orderData.shipping_eur,
      tax_eur: orderData.tax_eur,
      discount_eur: 0,
      total_eur: orderData.total_eur,
      status: 'pending',
      payment_status: 'pending',
      payment_method: orderData.payment_method,
      shipping_full_name: orderData.shipping_full_name,
      shipping_email: orderData.shipping_email,
      shipping_phone: orderData.shipping_phone || null,
      shipping_address_line1: orderData.shipping_address_line1,
      shipping_address_line2: orderData.shipping_address_line2 || null,
      shipping_city: orderData.shipping_city,
      shipping_postal_code: orderData.shipping_postal_code,
      shipping_country: orderData.shipping_country,
      customer_notes: orderData.customer_notes || null,
    })
    .select()
    .single()

  if (orderError) throw orderError

  // Create order items
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    product_title: item.product_title,
    product_sku: item.product_sku,
    product_image_url: item.product_image_url,
    unit_price_eur: item.unit_price_eur,
    quantity: item.quantity,
    total_price_eur: item.unit_price_eur * item.quantity,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw itemsError

  return order
}

// Get orders by user ID
export async function getOrdersByUserId(userId: string) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Order[]
}

// Get order by ID
export async function getOrderById(orderId: string) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .eq('id', orderId)
    .single()

  if (error) throw error
  return data as Order
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .eq('order_number', orderNumber)
    .single()

  if (error) throw error
  return data as Order
}

// Client-side: Get user's orders
export async function getUserOrdersClient(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Order[]
}
