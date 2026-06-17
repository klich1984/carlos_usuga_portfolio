import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Product, CartItem } from './types'

// ============================================
// TIPOS
// ============================================

interface CartState {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getSubtotal: () => number
}

const CartContext = createContext<CartState | null>(null)

// ============================================
// CONSTANTES
// ============================================

const CART_STORAGE_KEY = 'cart'

// ============================================
// HELPER: guardar en localStorage
// ============================================

const saveToStorage = (items: CartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items }))
}

// ============================================
// HELPER: leer desde localStorage
// ============================================

const loadFromStorage = (): CartItem[] => {
  const stored = localStorage.getItem(CART_STORAGE_KEY)
  if (!stored) return []
  try {
    const parsed = JSON.parse(stored)
    return parsed.items || []
  } catch {
    return []
  }
}

// ============================================
// PROVIDER COMPONENT
// ============================================

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => loadFromStorage())

  // Persistir cambios en localStorage
  useEffect(() => {
    saveToStorage(items)
  }, [items])

  // Agregar producto al carrito
  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        // Incrementar cantidad
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      // Nuevo producto
      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  // Remover producto completamente
  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  // Actualizar cantidad (0 = remover)
  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId)
        return
      }
      setItems((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      )
    },
    [removeFromCart]
  )

  // Limpiar carrito
  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  // Calcular subtotal
  const getSubtotal = useCallback(() => {
    return items.reduce((sum, item) => {
      // Usar precio CO por defecto para el cálculo
      const price = item.product.prices.CO
      return sum + price * item.quantity
    }, 0)
  }, [items])

  const value: CartState = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// ============================================
// HOOK: useCart
// ============================================

export const useCart = (): CartState => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
