export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">Returns Policy</h1>

        <div className="space-y-6 sm:space-y-8">
          {/* Overview */}
          <section className="rounded-lg border bg-white p-4 sm:p-6">
            <h2 className="mb-3 text-lg font-semibold sm:mb-4 sm:text-xl">Our Returns Guarantee</h2>
            <p className="mb-4 text-muted-foreground">
              We want you to be completely satisfied with your purchase. If you're not happy with your order, 
              we offer a hassle-free 30-day return policy for most items.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <div className="mb-2 text-2xl font-bold text-primary">30 Days</div>
                <div className="text-sm text-muted-foreground">Return window</div>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <div className="mb-2 text-2xl font-bold text-primary">Easy</div>
                <div className="text-sm text-muted-foreground">Return process</div>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <div className="mb-2 text-2xl font-bold text-primary">Fast</div>
                <div className="text-sm text-muted-foreground">Refund processing</div>
              </div>
            </div>
          </section>

          {/* Eligible Returns */}
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">What Can Be Returned?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-medium">Unused Parts</h3>
                  <p className="text-sm text-muted-foreground">
                    Parts in original packaging, unused and in resaleable condition
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-medium">Faulty or Damaged Items</h3>
                  <p className="text-sm text-muted-foreground">
                    Items that arrive damaged or develop faults within warranty period
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-medium">Incorrect Orders</h3>
                  <p className="text-sm text-muted-foreground">
                    Wrong item sent due to our error
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Non-Returnable */}
          <section className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-red-900">Non-Returnable Items</h2>
            <ul className="space-y-2 text-sm text-red-900">
              <li className="flex items-start gap-2">
                <span>✗</span>
                <span>Electrical items that have been fitted or used</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✗</span>
                <span>Brake fluid, oils, and other consumable liquids (unless faulty)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✗</span>
                <span>Parts ordered specifically to customer specification</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✗</span>
                <span>Items with damaged or missing original packaging</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✗</span>
                <span>Clearance or sale items (unless faulty)</span>
              </li>
            </ul>
          </section>

          {/* How to Return */}
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">How to Return an Item</h2>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Contact Us</h3>
                  <p className="text-sm text-muted-foreground">
                    Email support@autosparehub.eu or call +49 69 1234 5678 within 30 days of delivery. 
                    Provide your order number and reason for return.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Get Authorization</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll provide you with a Returns Authorization Number (RAN) and return instructions.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Package the Item</h3>
                  <p className="text-sm text-muted-foreground">
                    Securely package the item in its original packaging. Include your RAN and order details.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-medium">Send It Back</h3>
                  <p className="text-sm text-muted-foreground">
                    Send via tracked delivery to the address provided. Keep your tracking receipt.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white font-semibold">
                  5
                </div>
                <div>
                  <h3 className="font-medium">Get Your Refund</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll process your refund within 5-7 working days of receiving the return.
                  </p>
                </div>
              </li>
            </ol>
          </section>

          {/* Return Costs */}
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Return Costs</h2>
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Return shipping costs and conditions are determined on a case-by-case basis by our admin team.
                Please contact customer service to discuss your specific return situation.
              </p>
              <div className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="font-medium">Faulty or Damaged Items:</span>
                  <span className="text-sm text-muted-foreground"> Return costs typically covered by us</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="font-medium">Change of Mind:</span>
                  <span className="text-sm text-muted-foreground"> Return costs to be discussed with our team</span>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Methods */}
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Refund Processing</h2>
            <p className="mb-4 text-muted-foreground">
              Refunds are processed to your original payment method:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Credit/Debit Card: 5-7 working days after approval</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>PayPal: 3-5 working days after approval</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>You'll receive an email confirmation once refund is processed</span>
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="rounded-lg bg-blue-50 p-6 text-center">
            <h2 className="mb-2 text-xl font-semibold">Need Help?</h2>
            <p className="mb-4 text-muted-foreground">
              Our customer service team is here to help with your return
            </p>
            <div className="flex justify-center gap-4">
              <a href="mailto:support@autosparehub.eu" className="btn-primary">
                Email Us
              </a>
              <a href="tel:+496912345678" className="btn-secondary">
                Call +49 69 1234 5678
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
