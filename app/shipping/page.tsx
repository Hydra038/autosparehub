export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">Shipping Information</h1>

        <div className="space-y-8">
          {/* Delivery Options */}
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Delivery Options</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 border-b pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Standard Delivery</h3>
                  <p className="text-sm text-muted-foreground">Estimated 2-3 working days</p>
                  <p className="mt-1 text-sm">Shipping cost determined at checkout</p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-b pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Express Delivery</h3>
                  <p className="text-sm text-muted-foreground">Next working day (order by 2pm)</p>
                  <p className="mt-1 text-sm">Contact us for express shipping rates</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Click & Collect</h3>
                  <p className="text-sm text-muted-foreground">Collect from our Frankfurt warehouse</p>
                  <p className="mt-1 text-sm">Ready in 2 hours - Contact for availability</p>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Areas */}
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Delivery Coverage</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Germany & Austria</span>
                <span className="text-sm text-muted-foreground">- All delivery options available</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">France & Benelux</span>
                <span className="text-sm text-muted-foreground">- 3-5 working days</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Italy & Spain</span>
                <span className="text-sm text-muted-foreground">- 3-5 working days</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Other EU Countries</span>
                <span className="text-sm text-muted-foreground">- 5-7 working days</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              * Shipping costs vary by destination and order size. Final shipping cost will be calculated at checkout.
            </p>
          </section>

          {/* Tracking */}
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Track Your Order</h2>
            <p className="mb-4 text-muted-foreground">
              Once your order is dispatched, you'll receive an email with your tracking number.
              You can also track your order from your account dashboard.
            </p>
            <a href="/track-order" className="btn-primary inline-block">
              Track Order
            </a>
          </section>

          {/* Returns */}
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Returns & Exchanges</h2>
            <p className="text-muted-foreground">
              Changed your mind? No problem. We offer returns within 30 days of delivery.
              Return shipping costs and conditions will be determined on a case-by-case basis.
              Please contact our customer service team to arrange a return.
            </p>
            <a href="/returns" className="mt-4 inline-block text-primary hover:underline">
              View Returns Policy →
            </a>
          </section>

          {/* FAQ */}
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Shipping FAQs</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Do you ship to all EU countries?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Yes, we ship to all European Union member states. Delivery times vary by location.
                </p>
              </div>
              <div>
                <h3 className="font-medium">What if my item is out of stock?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  We'll notify you by email with an estimated restock date. You can choose to wait or cancel your order.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Can I change my delivery address?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Yes, contact our customer service team within 24 hours of placing your order at +49 69 1234 5678
                </p>
              </div>
              <div>
                <h3 className="font-medium">Do you provide installation services?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  We can recommend trusted local mechanics and garages. Contact us for recommendations in your area.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
