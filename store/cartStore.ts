// Cart store using Zustand for client-side state management

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  product_id: string
  title: string
  sku: string
  price_eur: number
  image_url: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.product_id === item.product_id
          )

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }

          return { items: [...state.items, item] }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.product_id !== productId),
            }
          }

          return {
            items: state.items.map((i) =>
              i.product_id === productId ? { ...i, quantity } : i
            ),
          }
        }),

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.price_eur * item.quantity, 0)
      },

      getTotalItems: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'autospare-cart',
    }
  )
)
