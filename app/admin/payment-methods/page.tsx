import { createServerClient } from '@/lib/supabaseServer'
import PaymentMethodsClient from './PaymentMethodsClient'

async function getPaymentMethods() {
  const supabase = await createServerClient()
  
  const { data: methods, error } = await supabase
    .from('payment_methods')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching payment methods:', error)
    return []
  }

  return methods || []
}

export default async function PaymentMethodsPage() {
  const paymentMethods = await getPaymentMethods()

  return <PaymentMethodsClient initialMethods={paymentMethods} />
}
