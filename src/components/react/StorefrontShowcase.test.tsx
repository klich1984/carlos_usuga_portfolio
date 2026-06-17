import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StorefrontShowcase } from './StorefrontShowcase'

// Limpiar DOM y localStorage antes de cada test
beforeEach(() => {
  cleanup()
  localStorage.clear()
})

describe('StorefrontShowcase', () => {
  // ============================================
  // TEST 1: Renderiza el título del showcase
  // ============================================
  it('muestra el título del showcase', () => {
    render(<StorefrontShowcase />)
    // Usamos heading role para ser específicos al <h2>
    expect(
      screen.getByRole('heading', { name: /storefront showcase/i })
    ).toBeInTheDocument()
  })

  // ============================================
  // TEST 2: Muestra selector de ubicación
  // ============================================
  it('muestra selector de ubicación (CO/US)', () => {
    render(<StorefrontShowcase />)
    // Debe haber botones o selector para cambiar entre CO y US
    expect(screen.getByRole('button', { name: /Colombia/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Estados Unidos/i })).toBeInTheDocument()
  })

  // ============================================
  // TEST 3: Renderiza catálogo de productos
  // ============================================
  it('muestra al menos un producto del catálogo', () => {
    render(<StorefrontShowcase />)
    // El showcase debe tener productos
    expect(screen.getByText('Servicio VTEX')).toBeInTheDocument()
  })

  // ============================================
  // TEST 4: Selector de ubicación cambia moneda en productos
  // ============================================
  it('cambia el precio mostrado al cambiar la ubicación', async () => {
    const user = userEvent.setup()
    render(<StorefrontShowcase />)

    // Inicialmente en CO
    expect(screen.getAllByTestId('price')[0]).toHaveTextContent('COP')

    // Cambiar a US
    await user.click(screen.getByRole('button', { name: /Estados Unidos/i }))

    // Ahora debe mostrar USD
    expect(screen.getAllByTestId('price')[0]).toHaveTextContent('USD')
  })

  // ============================================
  // TEST 5: Botón "Agregar al carrito" actualiza el contador
  // ============================================
  it('actualiza el contador del carrito al agregar producto', async () => {
    const user = userEvent.setup()
    render(<StorefrontShowcase />)

    // Contador inicial: 0
    expect(screen.getByTestId('open-cart')).toHaveTextContent('Carrito (0)')

    // Hay varios productos. Tomamos el primero (el botón del primer ProductCard)
    const addButtons = screen.getAllByRole('button', { name: 'Agregar al carrito' })
    await user.click(addButtons[0])

    // Contador debe ser 1
    expect(screen.getByTestId('open-cart')).toHaveTextContent('Carrito (1)')
  })

  // ============================================
  // TEST 6: Abrir carrito desde el showcase
  // ============================================
  it('abre el carrito al hacer click en el botón del carrito', async () => {
    const user = userEvent.setup()
    render(<StorefrontShowcase />)

    // El panel no debe estar visible inicialmente
    expect(screen.queryByTestId('cart-panel')).not.toBeInTheDocument()

    // Click en abrir carrito
    await user.click(screen.getByTestId('open-cart'))

    // Ahora el panel debe estar visible
    expect(screen.getByTestId('cart-panel')).toBeInTheDocument()
  })

  // ============================================
  // TEST 7: Flujo completo: agregar → abrir carrito → ver producto
  // ============================================
  it('flujo completo: agregar producto y verlo en el carrito', async () => {
    const user = userEvent.setup()
    render(<StorefrontShowcase />)

    // Hay varios productos. Tomamos el primero (Servicio VTEX)
    const addButtons = screen.getAllByRole('button', { name: 'Agregar al carrito' })
    await user.click(addButtons[0])

    // Abrir carrito
    await user.click(screen.getByTestId('open-cart'))

    // El producto debe estar visible DENTRO del carrito (no en el catálogo)
    const cartPanel = screen.getByTestId('cart-panel')
    expect(within(cartPanel).getByText('Servicio VTEX')).toBeInTheDocument()
  })

  // ============================================
  // TEST 8: GeoProvider y CartProvider están disponibles
  // ============================================
  it('provee contextos GeoProvider y CartProvider a sus hijos', () => {
    // Si los providers están disponibles, el selector y el carrito se renderizan
    render(<StorefrontShowcase />)
    // El botón del carrito es del CartContext
    expect(screen.getByTestId('open-cart')).toBeInTheDocument()
    // Los botones de país son del GeoContext
    expect(screen.getByRole('button', { name: /Colombia/i })).toBeInTheDocument()
  })
})
