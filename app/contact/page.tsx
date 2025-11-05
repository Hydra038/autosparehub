export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">Contact Us</h1>
        
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {/* Contact Information */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="mb-3 text-lg font-semibold sm:mb-4 sm:text-xl">Get in Touch</h2>
              <p className="mb-4 text-sm text-muted-foreground sm:text-base">
                Have a question about a part? Need help with your order? Our expert team is here to help.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium sm:text-base">Phone</h3>
                  <p className="text-sm text-muted-foreground">+49 69 1234 5678</p>
                  <p className="text-xs text-muted-foreground sm:text-sm">Mon-Fri: 9am-6pm, Sat: 9am-5pm</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium sm:text-base">Email</h3>
                  <p className="text-sm text-muted-foreground">support@autosparehub.eu</p>
                  <p className="text-xs text-muted-foreground sm:text-sm">We'll reply within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium sm:text-base">Address</h3>
                  <p className="text-sm text-muted-foreground">
                    123 Auto Parts Way<br />
                    Birmingham<br />
                    B1 1AA, Germany
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-lg border bg-white p-4 sm:p-6">
            <h2 className="mb-3 text-lg font-semibold sm:mb-4 sm:text-xl">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-md border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-md border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="mb-1 block text-sm font-medium">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full rounded-md border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-medium">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full rounded-md border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-6">
              <h3 className="mb-2 font-semibold">How do I find the right part?</h3>
              <p className="text-sm text-muted-foreground">
                Use our search function with your vehicle make, model, and year. You can also browse by category or contact our team for assistance.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="mb-2 font-semibold">What are your delivery times?</h3>
              <p className="text-sm text-muted-foreground">
                Standard UK delivery takes 2-3 working days. Next-day delivery is available for orders placed before 2pm on weekdays.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="mb-2 font-semibold">Do you offer warranty?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! All new parts come with manufacturer warranty. Refurbished parts have a 12-month warranty, and used parts have a 6-month warranty.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="mb-2 font-semibold">Can I return a part?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, we offer a 30-day return policy. Parts must be unused and in original packaging. See our Returns Policy for full details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
