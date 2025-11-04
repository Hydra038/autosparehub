'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cartStore'
import { formatPrice } from '@/lib/currency'
import Image from 'next/image'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Check authentication on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    
    if (!storedUser) {
      // Redirect to sign in with return URL
      router.push('/sign-in?redirect=/checkout')
    } else {
      const userData = JSON.parse(storedUser)
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        email: userData.email,
        full_name: userData.full_name,
      }))
    }
    
    setIsCheckingAuth(false)
  }, [router])

  const subtotal = getTotalPrice()
  const shippingCost = 5.99
  const taxRate = 0.19 // 19% VAT (Germany standard rate)
  const taxAmount = subtotal * taxRate
  const total = subtotal + shippingCost + taxAmount

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: 'Germany',
    customer_notes: '',
    payment_method: 'paypal' as 'paypal' | 'bank_transfer' | 'iban',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsProcessing(true)

    try {
      // Create order via API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product_id,
            title: item.title,
            sku: item.sku,
            price_eur: item.price_eur,
            image_url: item.image_url,
            quantity: item.quantity,
          })),
          shipping: {
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            address_line1: formData.address_line1,
            address_line2: formData.address_line2,
            city: formData.city,
            postal_code: formData.postal_code,
            country: formData.country,
          },
          customer_notes: formData.customer_notes,
          payment_method: formData.payment_method,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Save order to user's order history in localStorage
      const orderDetails = {
        ...data.order,
        items: items,
        shipping: formData,
        payment_method: formData.payment_method,
        created_at: new Date().toISOString(),
      }

      const userOrders = JSON.parse(localStorage.getItem('user_orders') || '[]')
      userOrders.push(orderDetails)
      localStorage.setItem('user_orders', JSON.stringify(userOrders))

      // Clear cart and redirect to success page
      clearCart()
      router.push(`/order-confirmation?order_id=${data.order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-6 text-muted-foreground">
          Add some products before checking out
        </p>
        <a href="/products" className="btn-primary">
          Browse Products
        </a>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="input w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="input w-full"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Address Line 1 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address_line1}
                  onChange={(e) =>
                    setFormData({ ...formData, address_line1: e.target.value })
                  }
                  className="input w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.address_line2}
                  onChange={(e) =>
                    setFormData({ ...formData, address_line2: e.target.value })
                  }
                  className="input w-full"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    City <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Postal Code <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postal_code}
                    onChange={(e) =>
                      setFormData({ ...formData, postal_code: e.target.value })
                    }
                    className="input w-full"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Country <span className="text-red-600">*</span>
                </label>
                <select
                  required
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="input w-full"
                >
                  <option value="">Select a country</option>
                  <optgroup label="Europe">
                    <option value="Germany">Germany</option>
                    <option value="Austria">Austria</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Greece">Greece</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Italy">Italy</option>
                    <option value="Latvia">Latvia</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Malta">Malta</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Romania">Romania</option>
                    <option value="Slovakia">Slovakia</option>
                    <option value="Slovenia">Slovenia</option>
                    <option value="Spain">Spain</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Norway">Norway</option>
                  </optgroup>
                  <optgroup label="North America">
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Mexico">Mexico</option>
                  </optgroup>
                  <optgroup label="Asia">
                    <option value="China">China</option>
                    <option value="Japan">Japan</option>
                    <option value="South Korea">South Korea</option>
                    <option value="India">India</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Vietnam">Vietnam</option>
                  </optgroup>
                  <optgroup label="Middle East">
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Israel">Israel</option>
                    <option value="Turkey">Turkey</option>
                  </optgroup>
                  <optgroup label="Oceania">
                    <option value="Australia">Australia</option>
                    <option value="New Zealand">New Zealand</option>
                  </optgroup>
                  <optgroup label="South America">
                    <option value="Brazil">Brazil</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Chile">Chile</option>
                    <option value="Colombia">Colombia</option>
                  </optgroup>
                  <optgroup label="Africa">
                    <option value="South Africa">South Africa</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Kenya">Kenya</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>
            <div className="space-y-3">
              <div>
                <label className="flex items-center gap-3 rounded border p-4 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={formData.payment_method === 'paypal'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_method: e.target.value as 'paypal',
                      })
                    }
                    className="h-4 w-4"
                  />
                  <span className="font-medium">PayPal</span>
                </label>
                
                {/* PayPal Details - Show when selected */}
                {formData.payment_method === 'paypal' && (
                  <div className="mt-2 ml-7 rounded-lg bg-blue-50 p-4">
                    <h4 className="mb-2 font-semibold text-blue-900 text-sm">PayPal Payment Instructions</h4>
                    <p className="text-xs text-blue-800 mb-2">
                      Please send your payment to our PayPal account:
                    </p>
                    <div className="rounded bg-white p-2 mb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-700">PayPal Email:</span>
                        <span className="text-xs text-gray-900 font-semibold">payments@autosparehub.eu</span>
                      </div>
                    </div>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p>• Log in to your PayPal account</p>
                      <p>• Send payment to: <strong>payments@autosparehub.eu</strong></p>
                      <p>• Include your order number in the payment note</p>
                      <p>• Payment is usually confirmed within minutes</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-3 rounded border p-4 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={formData.payment_method === 'bank_transfer'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_method: e.target.value as 'bank_transfer',
                      })
                    }
                    className="h-4 w-4"
                  />
                  <span className="font-medium">Bank Transfer</span>
                </label>
                
                {/* Bank Transfer Details - Show when selected */}
                {formData.payment_method === 'bank_transfer' && (
                  <div className="mt-2 ml-7 rounded-lg bg-green-50 p-4">
                    <h4 className="mb-2 font-semibold text-green-900 text-sm">Bank Transfer Details</h4>
                    <p className="text-xs text-green-800 mb-2">
                      Please transfer the total amount to the following bank account:
                    </p>
                    <div className="rounded bg-white p-3 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Bank Name:</span>
                        <span className="text-gray-900">Deutsche Bank AG</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Account Holder:</span>
                        <span className="text-gray-900">Autospare Hub GmbH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">IBAN:</span>
                        <span className="text-gray-900 font-mono text-xs">DE89 3704 0044 0532 0130 00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">BIC/SWIFT:</span>
                        <span className="text-gray-900 font-mono">COBADEFFXXX</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Reference:</span>
                        <span className="text-gray-900 font-mono">Order #[Will be provided]</span>
                      </div>
                    </div>
                    <p className="text-xs text-green-700 mt-2">
                      ⚠️ Please include your order number in the payment reference. Your order will be processed once we receive the payment (usually 1-3 business days).
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-3 rounded border p-4 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="iban"
                    checked={formData.payment_method === 'iban'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_method: e.target.value as 'iban',
                      })
                    }
                    className="h-4 w-4"
                  />
                  <span className="font-medium">IBAN Direct Transfer</span>
                </label>
                
                {/* IBAN Details - Show when selected */}
                {formData.payment_method === 'iban' && (
                  <div className="mt-2 ml-7 rounded-lg bg-purple-50 p-4">
                    <h4 className="mb-2 font-semibold text-purple-900 text-sm">IBAN Direct Transfer Details</h4>
                    <p className="text-xs text-purple-800 mb-2">
                      Transfer payment directly to our IBAN:
                    </p>
                    <div className="rounded bg-white p-3 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Account Holder:</span>
                        <span className="text-gray-900">Autospare Hub GmbH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">IBAN:</span>
                        <span className="text-gray-900 font-mono text-xs">DE89 3704 0044 0532 0130 00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">BIC:</span>
                        <span className="text-gray-900 font-mono">COBADEFFXXX</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Bank:</span>
                        <span className="text-gray-900">Deutsche Bank AG</span>
                      </div>
                    </div>
                    <p className="text-xs text-purple-700 mt-2">
                      💡 Please use your order number as the payment reference for faster processing.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              � Payment processing is currently in demo mode. No actual charges will be made.
            </p>
          </div>

          {/* Order Notes */}
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Order Notes (Optional)</h2>
            <textarea
              value={formData.customer_notes}
              onChange={(e) =>
                setFormData({ ...formData, customer_notes: e.target.value })
              }
              placeholder="Any special instructions for your order?"
              rows={4}
              className="input w-full"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="sticky top-24 rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

            <div className="mb-4 space-y-3">
              {items.map((item) => (
                <div key={item.product_id} className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 rounded bg-gray-100">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-2">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × {formatPrice(item.price_eur)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>VAT (19%)</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>

            {error && (
              <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="btn-primary mt-6 w-full disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>

            <p className="mt-4 text-xs text-center text-muted-foreground">
              By placing an order, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
