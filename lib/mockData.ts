// Mock data generator for development without Supabase
export interface MockProduct {
  id: string
  title: string
  sku: string
  description: string
  long_description?: string
  price_gbp: number
  compare_at_price_gbp: number | null
  category_id: string
  condition: 'new' | 'used' | 'refurbished'
  manufacturer?: string
  manufacturer_part_number: string
  warranty_months?: number
  weight_kg?: number
  dimensions_cm?: string
  is_active: boolean
  is_featured: boolean
  created_at: string
  product_images: { id?: string; image_url: string; is_primary: boolean; alt_text?: string; display_order?: number }[]
  inventory: { quantity: number; reserved_quantity: number }[]
  categories: { name: string; slug: string }
  compatibility?: Array<{
    make: string
    model: string
    year_from: number
    year_to: number
    engine?: string
    trim?: string
  }>
}

export interface MockCategory {
  id: string
  name: string
  slug: string
  description: string
  image_url: string | null
  parent_id: string | null
  is_active: boolean
  display_order: number
}

// Categories
export const mockCategories: MockCategory[] = [
  {
    id: '1',
    name: 'Brakes',
    slug: 'brakes',
    description: 'Brake pads, discs, calipers and components',
    image_url: null,
    parent_id: null,
    is_active: true,
    display_order: 1,
  },
  {
    id: '2',
    name: 'Engine Parts',
    slug: 'engine-parts',
    description: 'Filters, belts, spark plugs and engine components',
    image_url: null,
    parent_id: null,
    is_active: true,
    display_order: 2,
  },
  {
    id: '3',
    name: 'Suspension',
    slug: 'suspension',
    description: 'Shock absorbers, springs, bushes and linkages',
    image_url: null,
    parent_id: null,
    is_active: true,
    display_order: 3,
  },
  {
    id: '4',
    name: 'Exhaust',
    slug: 'exhaust',
    description: 'Exhaust systems, catalytic converters and sensors',
    image_url: null,
    parent_id: null,
    is_active: true,
    display_order: 4,
  },
  {
    id: '5',
    name: 'Electrical',
    slug: 'electrical',
    description: 'Batteries, alternators, starters and wiring',
    image_url: null,
    parent_id: null,
    is_active: true,
    display_order: 5,
  },
  {
    id: '6',
    name: 'Cooling',
    slug: 'cooling',
    description: 'Radiators, thermostats, water pumps and hoses',
    image_url: null,
    parent_id: null,
    is_active: true,
    display_order: 6,
  },
  {
    id: '7',
    name: 'Transmission',
    slug: 'transmission',
    description: 'Clutches, gearboxes and transmission parts',
    image_url: null,
    parent_id: null,
    is_active: true,
    display_order: 7,
  },
  {
    id: '8',
    name: 'Lighting',
    slug: 'lighting',
    description: 'Headlights, bulbs, indicators and rear lights',
    image_url: null,
    parent_id: null,
    is_active: true,
    display_order: 8,
  },
]

// Product templates by category
const productTemplates = {
  brakes: [
    { name: 'Brake Pads Set', price: [25, 85], desc: 'High-quality brake pads for reliable stopping power', img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop' },
    { name: 'Brake Discs Pair', price: [45, 120], desc: 'Premium brake discs with excellent heat dissipation', img: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=400&fit=crop' },
    { name: 'Brake Caliper', price: [65, 180], desc: 'Reconditioned brake caliper with warranty', img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop' },
    { name: 'Brake Fluid', price: [8, 15], desc: 'DOT 4 brake fluid for all vehicles', img: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=400&h=400&fit=crop' },
    { name: 'Handbrake Cable', price: [15, 35], desc: 'Replacement handbrake cable', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop' },
    { name: 'Brake Master Cylinder', price: [55, 150], desc: 'Complete brake master cylinder assembly', img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=400&fit=crop' },
  ],
  'engine-parts': [
    { name: 'Oil Filter', price: [5, 15], desc: 'High-efficiency oil filter for engine protection', img: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=400&h=400&fit=crop' },
    { name: 'Air Filter', price: [8, 25], desc: 'Performance air filter for optimal airflow', img: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop' },
    { name: 'Spark Plugs Set', price: [15, 45], desc: 'Premium spark plugs for better combustion', img: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400&h=400&fit=crop' },
    { name: 'Timing Belt Kit', price: [45, 150], desc: 'Complete timing belt kit with tensioners', img: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=400&fit=crop' },
    { name: 'Water Pump', price: [35, 95], desc: 'Replacement water pump for cooling system', img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop' },
    { name: 'Fuel Pump', price: [65, 180], desc: 'Electric fuel pump with high flow rate', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop' },
    { name: 'Alternator', price: [85, 250], desc: 'Reconditioned alternator with warranty', img: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop' },
    { name: 'Starter Motor', price: [75, 220], desc: 'Reliable starter motor replacement', img: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400&h=400&fit=crop' },
  ],
  suspension: [
    { name: 'Shock Absorbers Pair', price: [55, 140], desc: 'Gas-filled shock absorbers for smooth ride', img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop' },
    { name: 'Coil Springs', price: [45, 110], desc: 'Heavy-duty coil springs', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop' },
    { name: 'Anti-Roll Bar Links', price: [12, 30], desc: 'Stabilizer bar drop links', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop' },
    { name: 'Track Rod Ends', price: [15, 40], desc: 'Steering track rod ends with ball joints', img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=400&fit=crop' },
    { name: 'Control Arm Bushes', price: [18, 45], desc: 'Polyurethane control arm bushings', img: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=400&fit=crop' },
    { name: 'Ball Joints', price: [20, 55], desc: 'Heavy-duty suspension ball joints', img: 'https://images.unsplash.com/photo-1581092918484-8313e1f6e825?w=400&h=400&fit=crop' },
  ],
  exhaust: [
    { name: 'Exhaust Manifold', price: [85, 220], desc: 'Cast iron exhaust manifold', img: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400&h=400&fit=crop' },
    { name: 'Catalytic Converter', price: [150, 450], desc: 'Euro 6 compliant catalytic converter', img: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=400&h=400&fit=crop' },
    { name: 'Centre Exhaust Box', price: [65, 140], desc: 'Stainless steel exhaust silencer', img: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400&h=400&fit=crop' },
    { name: 'Rear Exhaust Box', price: [55, 130], desc: 'Rear silencer with chrome tailpipe', img: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=400&fit=crop' },
    { name: 'Lambda Sensor', price: [35, 85], desc: 'Oxygen sensor for emissions control', img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop' },
    { name: 'EGR Valve', price: [95, 240], desc: 'Exhaust gas recirculation valve', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop' },
  ],
  electrical: [
    { name: 'Car Battery', price: [55, 140], desc: 'Maintenance-free car battery with 3-year warranty', img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=400&fit=crop' },
    { name: 'Alternator', price: [85, 250], desc: 'High-output alternator', img: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop' },
    { name: 'Starter Motor', price: [75, 220], desc: 'Heavy-duty starter motor', img: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400&h=400&fit=crop' },
    { name: 'Ignition Coil Pack', price: [45, 120], desc: 'Multi-spark ignition coil', img: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400&h=400&fit=crop' },
    { name: 'Wiper Motor', price: [35, 95], desc: 'Front windscreen wiper motor', img: 'https://images.unsplash.com/photo-1581092918484-8313e1f6e825?w=400&h=400&fit=crop' },
    { name: 'Window Regulator', price: [55, 130], desc: 'Electric window regulator with motor', img: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=400&fit=crop' },
  ],
  cooling: [
    { name: 'Radiator', price: [75, 180], desc: 'Aluminum radiator with high cooling capacity', img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop' },
    { name: 'Water Pump', price: [35, 95], desc: 'Coolant circulation pump', img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=400&fit=crop' },
    { name: 'Thermostat', price: [12, 30], desc: 'Engine thermostat with gasket', img: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=400&h=400&fit=crop' },
    { name: 'Cooling Fan', price: [45, 110], desc: 'Electric cooling fan assembly', img: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400&h=400&fit=crop' },
    { name: 'Expansion Tank', price: [18, 45], desc: 'Coolant expansion tank with cap', img: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=400&h=400&fit=crop' },
    { name: 'Radiator Hoses', price: [15, 40], desc: 'Upper and lower radiator hose set', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop' },
  ],
  transmission: [
    { name: 'Clutch Kit', price: [120, 320], desc: 'Complete clutch kit with bearing', img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop' },
    { name: 'Flywheel', price: [95, 240], desc: 'Solid mass flywheel', img: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=400&fit=crop' },
    { name: 'Gearbox Oil', price: [18, 45], desc: 'Synthetic transmission fluid', img: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=400&h=400&fit=crop' },
    { name: 'CV Joint', price: [45, 110], desc: 'Constant velocity joint with boot', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop' },
    { name: 'Drive Shaft', price: [85, 200], desc: 'Complete drive shaft assembly', img: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=400&fit=crop' },
    { name: 'Clutch Cable', price: [15, 35], desc: 'Replacement clutch cable', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop' },
  ],
  lighting: [
    { name: 'Headlight Assembly', price: [65, 180], desc: 'Complete headlight unit with lens', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop' },
    { name: 'LED Bulb Set', price: [25, 65], desc: 'H7 LED headlight bulbs pair', img: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400&h=400&fit=crop' },
    { name: 'Tail Light', price: [35, 85], desc: 'Rear light cluster assembly', img: 'https://images.unsplash.com/photo-1581092918484-8313e1f6e825?w=400&h=400&fit=crop' },
    { name: 'Fog Light', price: [28, 70], desc: 'Front fog lamp with bulb', img: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=400&fit=crop' },
    { name: 'Indicator Bulbs', price: [5, 12], desc: 'Amber indicator bulbs set of 2', img: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400&h=400&fit=crop' },
    { name: 'Number Plate Lights', price: [8, 18], desc: 'LED number plate light units', img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop' },
  ],
}

const conditions: ('new' | 'used' | 'refurbished')[] = ['new', 'used', 'refurbished']
const manufacturers = ['Bosch', 'Mann Filter', 'Brembo', 'NGK', 'Denso', 'Febi', 'TRW', 'Sachs', 'Monroe', 'OEM']

// Generate products for each category
export const mockProducts: MockProduct[] = []

mockCategories.forEach((category, catIndex) => {
  const templates = productTemplates[category.slug as keyof typeof productTemplates] || []
  
  templates.forEach((template, templateIndex) => {
    // Create 2-3 variants of each product (different conditions/manufacturers)
    const variants = Math.floor(Math.random() * 2) + 2
    
    for (let v = 0; v < variants; v++) {
      const condition = conditions[Math.floor(Math.random() * conditions.length)]
      const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)]
      const priceRange = template.price
      const price = (Math.random() * (priceRange[1] - priceRange[0]) + priceRange[0]).toFixed(2)
      const isFeatured = Math.random() > 0.7 // 30% chance of being featured
      const stock = Math.floor(Math.random() * 50) + 5
      
      const productId = `${catIndex + 1}-${templateIndex}-${v}`
      const sku = `SKU-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      const comparePrice = condition === 'new' && Math.random() > 0.6 
        ? parseFloat((parseFloat(price) * 1.2).toFixed(2)) 
        : null
      
      // Random vehicle compatibility
      const vehicleMakes = ['VW', 'Audi', 'BMW', 'Ford', 'Toyota', 'Honda']
      const models: Record<string, string[]> = {
        VW: ['Golf', 'Polo', 'Passat', 'Tiguan'],
        Audi: ['A3', 'A4', 'Q5', 'TT'],
        BMW: ['3 Series', '5 Series', 'X3', 'X5'],
        Ford: ['Focus', 'Fiesta', 'Mondeo', 'Kuga'],
        Toyota: ['Corolla', 'Yaris', 'RAV4', 'Camry'],
        Honda: ['Civic', 'Accord', 'CR-V', 'Jazz'],
      }
      
      const compatibility = []
      const numCompatible = Math.floor(Math.random() * 3) + 2
      for (let i = 0; i < numCompatible; i++) {
        const make = vehicleMakes[Math.floor(Math.random() * vehicleMakes.length)]
        const model = models[make][Math.floor(Math.random() * models[make].length)]
        const yearFrom = 2010 + Math.floor(Math.random() * 10)
        compatibility.push({
          make,
          model,
          year_from: yearFrom,
          year_to: yearFrom + Math.floor(Math.random() * 5) + 1,
          engine: ['1.4 TSI', '2.0 TDI', '1.6 HDi', '2.0i', '1.8 TFSI'][Math.floor(Math.random() * 5)],
          trim: Math.random() > 0.5 ? ['S', 'SE', 'Sport', 'GT'][Math.floor(Math.random() * 4)] : undefined,
        })
      }
      
      mockProducts.push({
        id: productId,
        sku,
        title: `${template.name}`,
        description: `${template.desc}. ${condition === 'new' ? 'Brand new in original packaging.' : condition === 'refurbished' ? 'Professionally refurbished with 12-month warranty.' : 'Good used condition, tested and guaranteed.'} Made by ${manufacturer}. Compatible with multiple makes and models. Fast UK delivery available.`,
        long_description: `This high-quality ${template.name.toLowerCase()} from ${manufacturer} is designed to meet or exceed OEM specifications. ${condition === 'new' ? 'Manufactured using premium materials and latest production techniques.' : condition === 'refurbished' ? 'Carefully refurbished by certified technicians to ensure optimal performance.' : 'Sourced from reliable suppliers and thoroughly tested before dispatch.'}\n\nKey Features:\n• ${manufacturer} quality and reliability\n• Easy to install with standard tools\n• Comprehensive fitment information included\n• Backed by our quality guarantee\n\nDelivery: We offer fast UK delivery with next-day options available. All orders are carefully packaged to ensure your parts arrive in perfect condition.`,
        price_gbp: parseFloat(price),
        compare_at_price_gbp: comparePrice,
        category_id: category.id,
        condition,
        manufacturer,
        manufacturer_part_number: `${manufacturer.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        warranty_months: condition === 'new' ? 24 : condition === 'refurbished' ? 12 : 6,
        weight_kg: parseFloat((Math.random() * 10 + 0.5).toFixed(2)),
        dimensions_cm: `${Math.floor(Math.random() * 30 + 10)} x ${Math.floor(Math.random() * 20 + 5)} x ${Math.floor(Math.random() * 15 + 5)}`,
        is_active: true,
        is_featured: isFeatured,
        created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        product_images: [
          {
            id: `img-${productId}-1`,
            image_url: template.img,
            is_primary: true,
            alt_text: `${template.name}`,
            display_order: 1,
          },
        ],
        inventory: [
          {
            quantity: stock,
            reserved_quantity: Math.floor(Math.random() * 3),
          },
        ],
        categories: {
          name: category.name,
          slug: category.slug,
        },
        compatibility,
      })
    }
  })
})

// Helper functions
export function getMockCategories(): MockCategory[] {
  return mockCategories
}

export function getMockProducts(filters?: {
  category?: string
  condition?: string
  minPrice?: number
  maxPrice?: number
  featured?: boolean
  search?: string
  limit?: number
}): MockProduct[] {
  let filtered = [...mockProducts]

  if (filters?.category) {
    const category = mockCategories.find((c) => c.slug === filters.category)
    if (category) {
      filtered = filtered.filter((p) => p.category_id === category.id)
    }
  }

  if (filters?.condition) {
    filtered = filtered.filter((p) => p.condition === filters.condition)
  }

  if (filters?.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price_gbp >= filters.minPrice!)
  }

  if (filters?.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price_gbp <= filters.maxPrice!)
  }

  if (filters?.featured) {
    filtered = filtered.filter((p) => p.is_featured)
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
    )
  }

  if (filters?.limit) {
    filtered = filtered.slice(0, filters.limit)
  }

  return filtered
}

export function getMockProductById(id: string): MockProduct | undefined {
  return mockProducts.find((p) => p.id === id)
}
