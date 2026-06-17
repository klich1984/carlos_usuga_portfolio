import React, { useState } from 'react'
import { useCart } from './CartContext'
import { useGeoLocation } from './GeoProvider'

// ============================================
// COMPONENT: DrawerCart
// ============================================

export const DrawerCart: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { items, updateQuantity, removeFromCart, getSubtotal } = useCart()
  const { formatPrice } = useGeoLocation()

  const subtotal = getSubtotal()

  return (
    <>
      {/* Botón para abrir el carrito */}
      <button
        data-testid='open-cart'
        onClick={() => setIsOpen(true)}
        aria-label='Abrir carrito'
      >
        Carrito ({items.length})
      </button>

      {/* Overlay / Panel del carrito */}
      {isOpen && (
        <div data-testid='cart-panel' role='dialog' aria-label='Carrito de compras'>
          <div>
            <h2>Tu Carrito</h2>

            {/* Botón cerrar */}
            <button
              data-testid='close-cart'
              onClick={() => setIsOpen(false)}
              aria-label='Cerrar carrito'
            >
              ✕
            </button>
          </div>

          {/* Contenido del carrito */}
          <div>
            {items.length === 0 ? (
              <p data-testid='empty-cart'>Tu carrito está vacío</p>
            ) : (
              <ul>
                {items.map(({ product, quantity }) => (
                  <li key={product.id} data-testid='cart-item'>
                    <div>
                      <span>{product.name}</span>
                      <span data-testid='item-quantity'>{quantity}</span>
                      <span>{formatPrice(product.prices.CO * quantity)}</span>
                    </div>

                    {/* Controles de cantidad */}
                    <div>
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label='Decrementar cantidad'
                      >
                        -
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label='Incrementar cantidad'
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        aria-label='Eliminar producto'
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Subt total */}
            {items.length > 0 && (
              <div>
                <span>Subtotal:</span>
                <span data-testid='subtotal'>{formatPrice(subtotal)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
