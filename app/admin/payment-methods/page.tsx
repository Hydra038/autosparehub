import { createServerClient } from '@/lib/supabaseServer'
import PaymentMethodsClient from './PaymentMethodsClient'

async function getPaymentMethods() {
  const supabase = await createServerClient()
  
  const { data: methods, error } = await supabase
    .from('payment_methods')
    .select('*')
    .order('id', { ascending: true }) // Use id instead of display_order as fallback

  if (error) {
    console.error('Error fetching payment methods:', error)
    return []
  }

  // Sort by display_order if it exists, otherwise keep database order
  if (methods && methods.length > 0) {
    return methods.sort((a, b) => {
      const orderA = a.display_order ?? 999
      const orderB = b.display_order ?? 999
      return orderA - orderB
    })
  }

  return methods || []
}

export default async function PaymentMethodsPage() {
  const paymentMethods = await getPaymentMethods()

  return <PaymentMethodsClient initialMethods={paymentMethods} />
}
