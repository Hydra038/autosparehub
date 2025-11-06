'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'

interface Props {
  orderId: string
  orderNumber: string
}

export default function DeleteOrderButton({ orderId, orderNumber }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete order ${orderNumber}? This action cannot be undone.`)) {
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
        alert('Failed to delete order items')
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
        alert('Failed to delete order')
        setIsDeleting(false)
        return
      }

      // Success - refresh the page
      router.refresh()
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('An unexpected error occurred')
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
      title="Delete order"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}
