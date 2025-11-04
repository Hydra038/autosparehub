'use client'

import { useState } from 'react'

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [tracking, setTracking] = useState<any>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock tracking data for demonstration
    setTracking({
      orderNumber: orderNumber,
      status: 'In Transit',
      estimatedDelivery: 'Tomorrow by 6pm',
      events: [
        { date: 'Today 14:30', status: 'Out for Delivery', location: 'Birmingham Depot' },
        { date: 'Today 08:15', status: 'In Transit', location: 'Birmingham Sorting Center' },
        { date: 'Yesterday 18:45', status: 'Dispatched', location: 'Warehouse' },
        { date: 'Yesterday 10:20', status: 'Order Processed', location: 'Warehouse' },
      ],
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">Track Your Order</h1>

        {/* Tracking Form */}
        <div className="mb-8 rounded-lg border bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="orderNumber" className="mb-1 block text-sm font-medium">
                Order Number *
              </label>
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g. ORD-123456"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="your@email.com"
                required
              />
            </div>

            <button type="submit" className="w-full btn-primary">
              Track Order
            </button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground">
            You can find your order number in the confirmation email we sent you.
          </p>
        </div>

        {/* Tracking Results */}
        {tracking && (
          <div className="space-y-6">
            {/* Status Overview */}
            <div className="rounded-lg border bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Order #{tracking.orderNumber}</h2>
                  <p className="text-sm text-muted-foreground">Expected: {tracking.estimatedDelivery}</p>
                </div>
                <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-primary">
                  {tracking.status}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative mb-8">
                <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-gray-200" />
                <div className="absolute left-0 top-1/2 h-1 w-3/4 -translate-y-1/2 bg-primary" />
                <div className="relative flex justify-between">
                  <div className="flex flex-col items-center">
                    <div className="z-10 h-8 w-8 rounded-full bg-primary" />
                    <span className="mt-2 text-xs">Processed</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="z-10 h-8 w-8 rounded-full bg-primary" />
                    <span className="mt-2 text-xs">Dispatched</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="z-10 h-8 w-8 rounded-full bg-primary" />
                    <span className="mt-2 text-xs">In Transit</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="z-10 h-8 w-8 rounded-full bg-gray-200" />
                    <span className="mt-2 text-xs">Delivered</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Events */}
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 font-semibold">Tracking History</h3>
              <div className="space-y-4">
                {tracking.events.map((event: any, index: number) => (
                  <div key={index} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{event.status}</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-2 font-semibold">Need Help?</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                If you have any questions about your delivery, please contact us.
              </p>
              <div className="flex gap-3">
                <a href="mailto:support@autosparehub.co.uk" className="btn-secondary text-sm">
                  Email Support
                </a>
                <a href="tel:08001234567" className="btn-secondary text-sm">
                  Call 0800 123 4567
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        {!tracking && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-white p-4">
              <h3 className="mb-2 font-semibold">Order Not Shipped Yet?</h3>
              <p className="text-sm text-muted-foreground">
                Tracking information will be available once your order has been dispatched, usually within 24 hours.
              </p>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <h3 className="mb-2 font-semibold">Can't Find Your Order?</h3>
              <p className="text-sm text-muted-foreground">
                Check your email for the order confirmation. Contact us if you need assistance.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
