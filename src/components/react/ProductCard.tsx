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
    <div data-testid='product-card'>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span data-testid='price'>{formatPrice(currentPrice)}</span>
      <div>
        {product.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <button onClick={() => onAddToCart(product)}>Agregar al carrito</button>
    </div>
  )
}
