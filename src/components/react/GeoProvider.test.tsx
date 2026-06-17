import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GeoProvider, useGeoLocation } from './GeoProvider'

// Limpiar el DOM antes de cada test para evitar elementos residuales
beforeEach(() => {
  cleanup()
})

// Component that exposes context values for testing
const TestConsumer = () => {
  const { location, currency, setLocation } = useGeoLocation()
  return (
    <div>
      <span data-testid='location'>{location}</span>
      <span data-testid='currency'>{currency}</span>
      <button onClick={() => setLocation('CO')}>Set CO</button>
      <button onClick={() => setLocation('US')}>Set US</button>
    </div>
  )
}

describe('GeoProvider', () => {
  // ============================================
  // TEST 1: Valor inicial por defecto (CO)
  // ============================================
  // Este test verifica que cuando NO especificamos
  // una ubicación inicial, el默认值 es 'CO' (Colombia)
  it('inicia con ubicación por defecto CO', () => {
    render(
      <GeoProvider>
        <TestConsumer />
      </GeoProvider>
    )
    // esperamos que la ubicación inicial sea 'CO'
    expect(screen.getByTestId('location').textContent).toBe('CO')
  })

  // ============================================
  // TEST 2: Moneda derivada para US = USD
  // ============================================
  // Cuando la ubicación es 'US', la moneda debe ser 'USD'
  // Esto es importante porque los precios se muestran
  // en la moneda correspondiente al país
  it('deriva moneda USD para ubicación US', () => {
    render(
      <GeoProvider defaultLocation='US'>
        <TestConsumer />
      </GeoProvider>
    )
    expect(screen.getByTestId('currency').textContent).toBe('USD')
  })

  // ============================================
  // TEST 3: Cambio de ubicación CO -> US
  // ============================================
  // Verifica que setLocation() cambia el estado
  // y que la moneda se actualiza automáticamente
  it('permite cambiar ubicación de CO a US y actualiza moneda', async () => {
    const user = userEvent.setup()

    render(
      <GeoProvider>
        <TestConsumer />
      </GeoProvider>
    )

    // Estado inicial: CO -> COP
    expect(screen.getByTestId('location').textContent).toBe('CO')
    expect(screen.getByTestId('currency').textContent).toBe('COP')

    // Click en botón "Set US" para cambiar ubicación
    await user.click(screen.getByRole('button', { name: 'Set US' }))

    // Ahora debe ser US -> USD
    expect(screen.getByTestId('location').textContent).toBe('US')
    expect(screen.getByTestId('currency').textContent).toBe('USD')
  })

  // ============================================
  // TEST 4: Cambio de US -> CO (caso inverso)
  // ============================================
  // El contexto debe funcionar en ambas direcciones
  it('permite cambiar de US a CO', async () => {
    const user = userEvent.setup()

    render(
      <GeoProvider defaultLocation='US'>
        <TestConsumer />
      </GeoProvider>
    )

    // Inicia en US
    expect(screen.getByTestId('location').textContent).toBe('US')
    expect(screen.getByTestId('currency').textContent).toBe('USD')

    // Cambiar a CO
    await user.click(screen.getByRole('button', { name: 'Set CO' }))

    expect(screen.getByTestId('location').textContent).toBe('CO')
    expect(screen.getByTestId('currency').textContent).toBe('COP')
  })

  // ============================================
  // TEST 5: Formateo de precio según moneda
  // ============================================
  // Un helper useGeoLocation() debe poder formatear
  // precios correctamente según la ubicación actual
  it('formatea precio correctamente según la moneda', () => {
    // Este test verifica que podemos usar el hook
    // para formatear un precio en la moneda actual
    const TestFormatter = () => {
      const { currency, formatPrice } = useGeoLocation()
      return (
        <div>
          <span data-testid='currency'>{currency}</span>
          <span data-testid='formatted'>{formatPrice(100000)}</span>
        </div>
      )
    }

    render(
      <GeoProvider>
        <TestFormatter />
      </GeoProvider>
    )

    // Formato COP: $100.000 COP (símbolo primero, código al final)
    expect(screen.getByTestId('formatted').textContent).toBe('$100.000 COP')
  })
})
