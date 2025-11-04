# Autospare Hub 🚗

A production-ready e-commerce platform for car spare parts built with Next.js 14, Supabase, and TypeScript. Sell quality car parts for all makes and models with a modern, responsive interface.

## 🚀 Features

### Customer Features
- **Advanced Search & Filtering**: Search by part name, SKU, or vehicle compatibility (make, model, year)
- **Product Catalog**: Browse products by category with sorting and filtering options
- **Vehicle Compatibility**: Each product shows detailed compatibility tables for different car models
- **Shopping Cart**: Client-side cart with persistent storage using Zustand
- **Secure Checkout**: Multi-step checkout process with order tracking
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Admin Features
- **Product Management**: Full CRUD operations for products
- **Image Upload**: Upload multiple product images to Supabase Storage
- **Inventory Management**: Real-time stock tracking with automatic reservation
- **Order Management**: View and manage orders with status updates
- **Dashboard Analytics**: Overview of sales, orders, and inventory

### Technical Features
- **Server Components**: Next.js 14 App Router with RSC for optimal performance
- **Database**: PostgreSQL via Supabase with full-text search, RLS policies
- **Authentication**: Supabase Auth with role-based access (customer/admin)
- **Type Safety**: TypeScript strict mode with auto-generated database types
- **Payment Integration**: Stripe/PayPal placeholder for easy integration
- **Currency Support**: All prices in British Pounds (GBP) with proper formatting

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Deployment**: [Vercel](https://vercel.com/)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd carparts
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**

   a. Create a new Supabase project at [supabase.com](https://supabase.com)
   
   b. Run the SQL schema:
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase/schema.sql`
   - Execute the SQL to create all tables, indexes, and functions
   
   c. Set up Storage:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called `product-images`
   - Make it public
   - Set allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

4. **Configure environment variables**

   Copy `.env.example` to `.env.local`:
   ```bash
   copy .env.example .env.local
   ```

   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   CURRENCY_CODE=GBP
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=Autospare Hub
   ```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
carparts/
├── app/                      # Next.js 14 App Router
│   ├── admin/               # Admin dashboard pages
│   │   ├── products/        # Product management
│   │   └── page.tsx         # Admin dashboard home
│   ├── api/                 # API routes
│   │   └── orders/          # Order creation endpoint
│   ├── cart/                # Shopping cart page
│   ├── checkout/            # Checkout flow
│   ├── products/            # Product pages
│   │   ├── [id]/           # Product detail page
│   │   └── page.tsx        # Product listing
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── AddToCartButton.tsx
│   ├── CartIcon.tsx
│   ├── FiltersPanel.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── ImageCarousel.tsx
│   ├── ProductCard.tsx
│   └── SearchBar.tsx
├── lib/                     # Utilities
│   ├── currency.ts         # GBP formatting
│   ├── supabaseClient.ts   # Client-side Supabase
│   └── supabaseServer.ts   # Server-side Supabase
├── store/                   # State management
│   └── cartStore.ts        # Zustand cart store
├── types/                   # TypeScript types
│   └── database.ts         # Supabase types
├── supabase/               # Database schema
│   └── schema.sql          # Complete SQL schema
├── .env.example            # Environment variables template
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vercel.json             # Vercel deployment config
└── package.json            # Dependencies
```

## 🗄️ Database Schema

The platform includes comprehensive database tables:

- **users**: Extended user profiles with roles
- **products**: Product catalog with full-text search
- **product_images**: Multiple images per product
- **inventory**: Stock management with reservation system
- **compatibility**: Vehicle compatibility tables
- **categories**: Hierarchical category structure
- **suppliers**: Supplier information
- **orders**: Order management with status tracking
- **order_items**: Order line items with price snapshots

See `supabase/schema.sql` for complete schema with indexes, triggers, and RLS policies.

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   Add these in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CURRENCY_CODE=GBP`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel URL)
   - `NEXT_PUBLIC_SITE_NAME=Autospare Hub`

4. **Deploy**
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`

## 💳 Payment Integration

The checkout process includes placeholders for Stripe and PayPal. To integrate real payments:

### Stripe Integration

1. Install Stripe:
```bash
npm install @stripe/stripe-js stripe
```

2. Add environment variables:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

3. Update `app/api/orders/route.ts` to create Stripe PaymentIntent
4. Add Stripe checkout elements to `app/checkout/page.tsx`

### PayPal Integration

1. Install PayPal SDK:
```bash
npm install @paypal/react-paypal-js
```

2. Add environment variables:
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id
```

3. Integrate PayPal buttons in checkout

## 🔐 Security

- **Row Level Security (RLS)**: All tables have RLS policies enabled
- **Service Role Key**: Used only in API routes, never exposed to client
- **Input Validation**: All forms validate on client and server
- **SQL Injection Protection**: Parameterized queries via Supabase client
- **XSS Protection**: React automatically escapes output

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme colors
- Update `app/globals.css` for global styles
- Component styles use Tailwind utility classes

### Currency
- Change `CURRENCY_CODE` in `.env.local`
- Update `lib/currency.ts` for different currency formatting

### Categories
- Add/edit categories via Supabase dashboard
- Or create admin UI for category management

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@autosparehub.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- Vercel for seamless deployment

---

**Built with ❤️ for the automotive industry**
