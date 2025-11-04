import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Autospare Hub</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted source for quality car parts across Europe. All makes and models supported.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-primary">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-primary">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-primary">
                  Featured Parts
                </Link>
              </li>
              <li>
                <Link href="/products?condition=new" className="hover:text-primary">
                  New Parts
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-primary">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-primary">
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-primary">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Autospare Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
