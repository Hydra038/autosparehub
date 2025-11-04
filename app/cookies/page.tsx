export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">Cookie Policy</h1>
        <p className="mb-6 text-sm text-muted-foreground">Last updated: November 4, 2025</p>

        <div className="prose max-w-none space-y-6">
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">1. What Are Cookies?</h2>
            <p className="text-muted-foreground">
              Cookies are small text files that are placed on your device when you visit our website. They help us 
              provide you with a better experience by remembering your preferences, analyzing how you use our site, 
              and personalizing content.
            </p>
          </section>

          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">2. Types of Cookies We Use</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="mb-2 font-medium">Essential Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies are necessary for the website to function properly. They enable core functionality 
                  such as security, network management, shopping cart, and accessibility.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  <strong>Duration:</strong> Session or up to 1 year
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="mb-2 font-medium">Functional Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies remember your preferences and choices (such as language, region, or username) to 
                  provide enhanced, personalized features.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  <strong>Duration:</strong> Up to 2 years
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="mb-2 font-medium">Analytics Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies help us understand how visitors interact with our website by collecting and reporting 
                  information anonymously. This helps us improve our website's performance.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  <strong>Examples:</strong> Google Analytics
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Duration:</strong> Up to 2 years
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="mb-2 font-medium">Marketing Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies track your browsing habits to deliver advertisements that are relevant to you and your 
                  interests. They may also be used to limit the number of times you see an ad.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  <strong>Examples:</strong> Facebook Pixel, Google Ads
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Duration:</strong> Up to 2 years
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">3. Specific Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Cookie Name</th>
                    <th className="px-4 py-2 text-left">Purpose</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">session_id</td>
                    <td className="px-4 py-2">Maintains your session</td>
                    <td className="px-4 py-2">Essential</td>
                    <td className="px-4 py-2">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">cart_token</td>
                    <td className="px-4 py-2">Remembers items in your cart</td>
                    <td className="px-4 py-2">Essential</td>
                    <td className="px-4 py-2">7 days</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">user_prefs</td>
                    <td className="px-4 py-2">Stores your preferences</td>
                    <td className="px-4 py-2">Functional</td>
                    <td className="px-4 py-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">_ga</td>
                    <td className="px-4 py-2">Google Analytics visitor tracking</td>
                    <td className="px-4 py-2">Analytics</td>
                    <td className="px-4 py-2">2 years</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">_fbp</td>
                    <td className="px-4 py-2">Facebook Pixel tracking</td>
                    <td className="px-4 py-2">Marketing</td>
                    <td className="px-4 py-2">3 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">4. Third-Party Cookies</h2>
            <p className="mb-3 text-muted-foreground">
              We also use third-party services that may set their own cookies:
            </p>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>
                <strong>Google Analytics:</strong> Helps us understand how visitors use our site
              </li>
              <li>
                <strong>Payment Processors:</strong> Secure payment processing (Stripe, PayPal)
              </li>
              <li>
                <strong>Social Media:</strong> Social sharing features and advertising
              </li>
              <li>
                <strong>Customer Support:</strong> Live chat and support tools
              </li>
            </ul>
          </section>

          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">5. Managing Cookies</h2>
            <h3 className="mb-3 font-medium">Browser Settings</h3>
            <p className="mb-3 text-muted-foreground">
              You can control and delete cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1 text-muted-foreground">
              <li>View what cookies are stored and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block cookies from specific sites</li>
              <li>Block all cookies</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>

            <h3 className="mb-3 font-medium">Browser-Specific Instructions</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</p>
              <p><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</p>
              <p><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</p>
              <p><strong>Edge:</strong> Settings → Cookies and site permissions</p>
            </div>

            <div className="mt-4 rounded-lg bg-yellow-50 p-4">
              <p className="text-sm text-yellow-900">
                ⚠️ <strong>Note:</strong> Blocking or deleting cookies may impact your experience on our website. 
                Some features may not work properly without cookies enabled.
              </p>
            </div>
          </section>

          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">6. Cookie Consent</h2>
            <p className="text-muted-foreground">
              When you first visit our website, you'll see a cookie consent banner. You can choose to accept all 
              cookies, reject non-essential cookies, or customize your preferences. Your choice is saved for 12 months, 
              after which you'll be asked again.
            </p>
          </section>

          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">7. Do Not Track</h2>
            <p className="text-muted-foreground">
              Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that you do not 
              want to be tracked. Currently, there is no industry standard for how to respond to DNT signals. We do not 
              currently respond to DNT signals.
            </p>
          </section>

          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">8. Updates to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our 
              business operations. We will notify you of any significant changes by updating the "Last updated" date at 
              the top of this page.
            </p>
          </section>

          <section className="rounded-lg bg-blue-50 p-6">
            <h2 className="mb-4 text-xl font-semibold">Questions About Cookies?</h2>
            <p className="mb-4 text-muted-foreground">
              If you have any questions about our use of cookies, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> privacy@autosparehub.eu</p>
              <p><strong>Phone:</strong> 0800 123 4567</p>
              <p><strong>Address:</strong> 123 Auto Parts Way, Frankfurt am Main, 60311, Germany</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
