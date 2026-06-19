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
    image: '/images/vtex-service.svg',
    tags: ['VTEX-inspired', 'Oferta'],
  },
  {
    id: 'prod-002',
    name: 'Consultoría GraphQL',
    description: 'API GraphQL para e-commerce escalable',
    prices: { CO: 1800000, US: 540 },
    image: '/images/graphql.svg',
    tags: ['GraphQL'],
  },
  {
    id: 'prod-003',
    name: 'Optimización Performance',
    description: 'Auditoría Lighthouse y Core Web Vitals',
    prices: { CO: 1200000, US: 360 },
    image: '/images/perf.svg',
    tags: ['Lighthouse'],
  },
]

// ============================================
// COMPONENT: LocationSelector (interno)
// ============================================

const LocationSelector: React.FC = () => {
  const { location, setLocation } = useGeoLocation()
  return (
    <div
      data-testid='location-selector'
      className='inline-flex bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 gap-1'
    >
      <button
        onClick={() => setLocation('CO')}
        aria-pressed={location === 'CO'}
        className={`px-3 py-1.5 text-sm rounded-md transition ${
          location === 'CO'
            ? 'bg-purple-500 text-white'
            : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        Colombia (COP)
      </button>
      <button
        onClick={() => setLocation('US')}
        aria-pressed={location === 'US'}
        className={`px-3 py-1.5 text-sm rounded-md transition ${
          location === 'US'
            ? 'bg-purple-500 text-white'
            : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
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
          className='bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 text-slate-900 dark:text-slate-100'
        >
          <header className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8'>
            <h2 className='text-xl md:text-2xl font-bold'>Catálogo</h2>
            <LocationSelector />
          </header>

          {/* Catálogo de productos - grilla responsiva */}
          <div
            data-testid='product-catalog'
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
          >
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
