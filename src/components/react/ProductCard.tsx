import React from 'react'
import type { Product } from './types'
import { useGeoLocation } from './GeoProvider'

// ============================================
// PROPS
// ============================================

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

// ============================================
// COMPONENT: ProductCard
// ============================================

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { location, formatPrice } = useGeoLocation()

  // Obtener el precio según la ubicación actual del contexto
  const currentPrice = product.prices[location]

return (
    <div
      data-testid='product-card'
      className='bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100'
    >
      <img
        src={product.image}
        alt={product.name}
        className='w-full h-48 object-cover bg-slate-100 dark:bg-slate-900'
      />
      <div className='p-4 flex flex-col gap-2 flex-1'>
        <h3 className='font-semibold text-lg'>{product.name}</h3>
        <p className='text-sm text-slate-600 dark:text-slate-400'>{product.description}</p>
        <span data-testid='price' className='text-xl font-bold text-purple-600 dark:text-purple-400'>
          {formatPrice(currentPrice)}
        </span>
        <div className='flex flex-wrap gap-1'>
          {product.tags.map(tag => (
            <span
              key={tag}
              className='text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-200 rounded-md'
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={() => onAddToCart(product)}
        className='w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 transition'
      >
        Agregar al carrito
      </button>
    </div>
  )
}
