// ============================================
// TIPOS COMPARTIDOS PARA STOREFRONT COMPONENTS
// ============================================

export type LocationCode = 'CO' | 'US'
export type Currency = 'COP' | 'USD'

export interface Product {
  id: string
  name: string
  description: string
  prices: Record<LocationCode, number>
  image: string
  tags: string[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface GeoLocationState {
  location: LocationCode
  currency: Currency
  setLocation: (location: LocationCode) => void
  formatPrice: (price: number) => string
}
