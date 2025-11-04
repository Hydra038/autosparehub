// Database types for Supabase
// Generated from the schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'customer' | 'admin'
export type ProductCondition = 'new' | 'refurbished' | 'used'
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type PaymentMethod = 'stripe' | 'paypal' | 'bank_transfer'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: UserRole
          phone: string | null
          address_line1: string | null
          address_line2: string | null
          city: string | null
          postal_code: string | null
          country: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: UserRole
          phone?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: UserRole
          phone?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          image_url: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      suppliers: {
        Row: {
          id: string
          name: string
          contact_name: string | null
          email: string | null
          phone: string | null
          address: string | null
          website: string | null
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          contact_name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          website?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact_name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          website?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          sku: string
          title: string
          description: string | null
          long_description: string | null
          category_id: string | null
          supplier_id: string | null
          price_gbp: number
          compare_at_price_gbp: number | null
          condition: ProductCondition
          weight_kg: number | null
          dimensions_cm: string | null
          manufacturer: string | null
          manufacturer_part_number: string | null
          warranty_months: number
          is_active: boolean
          is_featured: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sku: string
          title: string
          description?: string | null
          long_description?: string | null
          category_id?: string | null
          supplier_id?: string | null
          price_gbp: number
          compare_at_price_gbp?: number | null
          condition?: ProductCondition
          weight_kg?: number | null
          dimensions_cm?: string | null
          manufacturer?: string | null
          manufacturer_part_number?: string | null
          warranty_months?: number
          is_active?: boolean
          is_featured?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sku?: string
          title?: string
          description?: string | null
          long_description?: string | null
          category_id?: string | null
          supplier_id?: string | null
          price_gbp?: number
          compare_at_price_gbp?: number | null
          condition?: ProductCondition
          weight_kg?: number | null
          dimensions_cm?: string | null
          manufacturer?: string | null
          manufacturer_part_number?: string | null
          warranty_months?: number
          is_active?: boolean
          is_featured?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          alt_text: string | null
          display_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          alt_text?: string | null
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          alt_text?: string | null
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          product_id: string
          quantity: number
          reserved_quantity: number
          reorder_level: number
          reorder_quantity: number
          last_restocked_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          quantity?: number
          reserved_quantity?: number
          reorder_level?: number
          reorder_quantity?: number
          last_restocked_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          quantity?: number
          reserved_quantity?: number
          reorder_level?: number
          reorder_quantity?: number
          last_restocked_at?: string | null
          updated_at?: string
        }
      }
      compatibility: {
        Row: {
          id: string
          product_id: string
          make: string
          model: string
          year_from: number
          year_to: number
          engine: string | null
          trim: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          make: string
          model: string
          year_from: number
          year_to: number
          engine?: string | null
          trim?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          make?: string
          model?: string
          year_from?: number
          year_to?: number
          engine?: string | null
          trim?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string
          subtotal_gbp: number
          shipping_gbp: number
          tax_gbp: number
          discount_gbp: number
          total_gbp: number
          status: OrderStatus
          payment_status: PaymentStatus
          payment_method: PaymentMethod | null
          payment_intent_id: string | null
          shipping_full_name: string
          shipping_email: string
          shipping_phone: string | null
          shipping_address_line1: string
          shipping_address_line2: string | null
          shipping_city: string
          shipping_postal_code: string
          shipping_country: string
          billing_full_name: string | null
          billing_address_line1: string | null
          billing_address_line2: string | null
          billing_city: string | null
          billing_postal_code: string | null
          billing_country: string | null
          customer_notes: string | null
          admin_notes: string | null
          tracking_number: string | null
          carrier: string | null
          created_at: string
          updated_at: string
          confirmed_at: string | null
          shipped_at: string | null
          delivered_at: string | null
          cancelled_at: string | null
        }
        Insert: {
          id?: string
          order_number: string
          user_id: string
          subtotal_gbp: number
          shipping_gbp?: number
          tax_gbp?: number
          discount_gbp?: number
          total_gbp: number
          status?: OrderStatus
          payment_status?: PaymentStatus
          payment_method?: PaymentMethod | null
          payment_intent_id?: string | null
          shipping_full_name: string
          shipping_email: string
          shipping_phone?: string | null
          shipping_address_line1: string
          shipping_address_line2?: string | null
          shipping_city: string
          shipping_postal_code: string
          shipping_country?: string
          billing_full_name?: string | null
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_postal_code?: string | null
          billing_country?: string | null
          customer_notes?: string | null
          admin_notes?: string | null
          tracking_number?: string | null
          carrier?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          cancelled_at?: string | null
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string
          subtotal_gbp?: number
          shipping_gbp?: number
          tax_gbp?: number
          discount_gbp?: number
          total_gbp?: number
          status?: OrderStatus
          payment_status?: PaymentStatus
          payment_method?: PaymentMethod | null
          payment_intent_id?: string | null
          shipping_full_name?: string
          shipping_email?: string
          shipping_phone?: string | null
          shipping_address_line1?: string
          shipping_address_line2?: string | null
          shipping_city?: string
          shipping_postal_code?: string
          shipping_country?: string
          billing_full_name?: string | null
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_postal_code?: string | null
          billing_country?: string | null
          customer_notes?: string | null
          admin_notes?: string | null
          tracking_number?: string | null
          carrier?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          cancelled_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_title: string
          product_sku: string
          product_image_url: string | null
          unit_price_gbp: number
          quantity: number
          total_price_gbp: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_title: string
          product_sku: string
          product_image_url?: string | null
          unit_price_gbp: number
          quantity: number
          total_price_gbp: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_title?: string
          product_sku?: string
          product_image_url?: string | null
          unit_price_gbp?: number
          quantity?: number
          total_price_gbp?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      reserve_inventory: {
        Args: {
          p_product_id: string
          p_quantity: number
        }
        Returns: boolean
      }
      release_inventory: {
        Args: {
          p_product_id: string
          p_quantity: number
        }
        Returns: void
      }
      fulfill_inventory: {
        Args: {
          p_product_id: string
          p_quantity: number
        }
        Returns: void
      }
    }
    Enums: {
      user_role: UserRole
      product_condition: ProductCondition
      order_status: OrderStatus
      payment_status: PaymentStatus
      payment_method: PaymentMethod
    }
  }
}
