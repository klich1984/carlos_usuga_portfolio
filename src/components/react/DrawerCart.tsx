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
        className='fixed top-20 right-4 z-[45] bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg shadow-purple-500/20 font-medium transition'
      >
        Carrito ({items.length})
      </button>

      {/* Overlay oscuro */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-[60]'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel deslizable */}
      <div
        data-testid='cart-panel'
        role='dialog'
        aria-label='Carrito de compras'
        className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl z-[70] transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0'>
          <h2 className='text-lg font-bold'>Tu Carrito</h2>
          <button
            data-testid='close-cart'
            onClick={() => setIsOpen(false)}
            aria-label='Cerrar carrito'
            className='p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition'
          >
            ✕
          </button>
        </div>

        {/* Contenido del carrito */}
        <div className='p-4 overflow-y-auto flex-1'>
          {items.length === 0 ? (
            <p data-testid='empty-cart' className='text-center text-slate-500 py-8'>
              Tu carrito está vacío
            </p>
          ) : (
            <ul className='space-y-3'>
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  data-testid='cart-item'
                  className='bg-slate-50 dark:bg-slate-800 rounded-xl p-3 flex gap-3'
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className='w-16 h-16 rounded-lg object-cover bg-slate-200 dark:bg-slate-700'
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium truncate'>{product.name}</p>
                    <p className='text-sm text-slate-500 dark:text-slate-400'>
                      {formatPrice(product.prices.CO * quantity)}
                    </p>
                    <div className='flex items-center gap-2 mt-2'>
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label='Decrementar cantidad'
                        className='w-7 h-7 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition flex items-center justify-center'
                      >
                        -
                      </button>
                      <span
                        data-testid='item-quantity'
                        className='w-6 text-center font-medium'
                      >
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label='Incrementar cantidad'
                        className='w-7 h-7 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition flex items-center justify-center'
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        aria-label='Eliminar producto'
                        className='ml-auto text-xs text-red-600 dark:text-red-400 hover:underline'
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer con subtotal */}
        {items.length > 0 && (
          <div className='p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0'>
            <div className='flex justify-between items-center'>
              <span className='font-medium'>Subtotal:</span>
              <span
                data-testid='subtotal'
                className='text-xl font-bold text-purple-600 dark:text-purple-400'
              >
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
