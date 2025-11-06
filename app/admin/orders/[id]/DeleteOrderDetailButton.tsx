'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'

interface Props {
  orderId: string
  orderNumber: string
}

export default function DeleteOrderDetailButton({ orderId, orderNumber }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete order ${orderNumber}?\n\nThis will permanently delete:\n- The order\n- All order items\n\nThis action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    const supabase = createClient()

    try {
      // First delete order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId)

      if (itemsError) {
        console.error('Error deleting order items:', itemsError)
        alert(`Failed to delete order items: ${itemsError.message}`)
        setIsDeleting(false)
        return
      }

      // Then delete the order
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId)

      if (orderError) {
        console.error('Error deleting order:', orderError)
        alert(`Failed to delete order: ${orderError.message}`)
        setIsDeleting(false)
        return
      }

      // Success - redirect to orders list
      router.push('/admin/orders')
      router.refresh()
    } catch (error: any) {
      console.error('Unexpected error:', error)
      alert(`An unexpected error occurred: ${error.message || 'Please check console'}`)
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-lg border-2 border-red-600 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? 'Deleting Order...' : 'Delete Order'}
    </button>
  )
}
