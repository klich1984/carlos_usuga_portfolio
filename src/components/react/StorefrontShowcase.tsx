import React from 'react'
import { GeoProvider, useGeoLocation } from './GeoProvider'
import { CartProvider, useCart } from './CartContext'
import { ProductCard } from './ProductCard'
import { DrawerCart } from './DrawerCart'
import type { Product } from './types'

// ============================================
// CATÁLOGO DE PRODUCTOS (mock data)
// ============================================

const PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Servicio VTEX',
    description: 'Implementación de storefront VTEX con React y TypeScript',
    prices: { CO: 2500000, US: 750 },
    image: '/images/vtex-service.jpg',
    tags: ['VTEX-inspired', 'Oferta'],
  },
  {
    id: 'prod-002',
    name: 'Consultoría GraphQL',
    description: 'API GraphQL para e-commerce escalable',
    prices: { CO: 1800000, US: 540 },
    image: '/images/graphql.jpg',
    tags: ['GraphQL'],
  },
  {
    id: 'prod-003',
    name: 'Optimización Performance',
    description: 'Auditoría Lighthouse y Core Web Vitals',
    prices: { CO: 1200000, US: 360 },
    image: '/images/perf.jpg',
    tags: ['Lighthouse'],
  },
]

// ============================================
// COMPONENT: LocationSelector (interno)
// ============================================

const LocationSelector: React.FC = () => {
  const { location, setLocation } = useGeoLocation()
  return (
    <div data-testid='location-selector'>
      <button onClick={() => setLocation('CO')} aria-pressed={location === 'CO'}>
        Colombia (COP)
      </button>
      <button onClick={() => setLocation('US')} aria-pressed={location === 'US'}>
        Estados Unidos (USD)
      </button>
    </div>
  )
}

// ============================================
// COMPONENT: StorefrontShowcase (la isla)
// ============================================

export const StorefrontShowcase: React.FC = () => {
  return (
    <GeoProvider>
      <CartProvider>
        <section
          data-testid='storefront-showcase'
          aria-label='Storefront E-Commerce Showcase'
        >
          <header>
            <h2>Storefront Showcase</h2>
            <LocationSelector />
          </header>

          {/* Catálogo de productos */}
          <div data-testid='product-catalog'>
            {PRODUCTS.map((product) => (
              <ProductCardWrapper key={product.id} product={product} />
            ))}
          </div>

          {/* Carrito lateral */}
          <DrawerCart />
        </section>
      </CartProvider>
    </GeoProvider>
  )
}

// ============================================
// WRAPPER: pasa onAddToCart usando useCart
// ============================================

const ProductCardWrapper: React.FC<{ product: Product }> = ({ product }) => {
  // ProductCardWrapper está dentro de CartProvider (en StorefrontShowcase)
  // por lo que useCart() funciona correctamente
  const { addToCart } = useCart()
  return <ProductCard product={product} onAddToCart={addToCart} />
}
