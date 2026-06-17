import React, { createContext, useContext, useState, useCallback } from 'react'

// ============================================
// TIPOS (TypeScript)
// ============================================

export type LocationCode = 'CO' | 'US'
export type Currency = 'COP' | 'USD'

export interface GeoLocationState {
  location: LocationCode
  currency: Currency
  setLocation: (location: LocationCode) => void
  formatPrice: (price: number) => string
}

// ============================================
// CONTEXTO
// ============================================

const GeoLocationContext = createContext<GeoLocationState | null>(null)

// Mapa de ubicación → moneda
const LOCATION_TO_CURRENCY: Record<LocationCode, Currency> = {
  CO: 'COP',
  US: 'USD',
}

// ============================================
// HELPER: formatear precio según moneda
// ============================================

const formatPriceByCurrency = (price: number, currency: Currency): string => {
  const formatted = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)

  // Formato: $100.000 COP (símbolo primero, código al final)
  if (currency === 'COP') {
    return `$${formatted} COP`
  }
  // USD: $100.00 USD
  return `$${formatted} USD`
}

// ============================================
// PROVIDER COMPONENT
// ============================================

interface GeoProviderProps {
  children: React.ReactNode
  defaultLocation?: LocationCode
}

export const GeoProvider: React.FC<GeoProviderProps> = ({
  children,
  defaultLocation = 'CO',
}) => {
  const [location, setLocationState] = useState<LocationCode>(defaultLocation)

  // Derivar la moneda automáticamente según la ubicación
  const currency = LOCATION_TO_CURRENCY[location]

  // Setter que actualiza ubicación y mantiene sincronizado
  const setLocation = useCallback((newLocation: LocationCode) => {
    setLocationState(newLocation)
  }, [])

  // Helper para formatear precios en la moneda actual
  const formatPrice = useCallback(
    (price: number) => formatPriceByCurrency(price, currency),
    [currency]
  )

  const value: GeoLocationState = {
    location,
    currency,
    setLocation,
    formatPrice,
  }

  return (
    <GeoLocationContext.Provider value={value}>{children}</GeoLocationContext.Provider>
  )
}

// ============================================
// HOOK: useGeoLocation
// ============================================

export const useGeoLocation = (): GeoLocationState => {
  const context = useContext(GeoLocationContext)
  if (!context) {
    throw new Error('useGeoLocation must be used within a GeoProvider')
  }
  return context
}
