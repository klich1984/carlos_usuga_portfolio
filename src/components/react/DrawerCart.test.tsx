import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider, useCart } from './CartContext'
import { GeoProvider } from './GeoProvider'
import { DrawerCart } from './DrawerCart'
import type { Product } from './types'

// ============================================
// MOCK: productos de ejemplo
// ============================================

const mockProduct: Product = {
  id: 'prod-001',
  name: 'Servicio VTEX',
  description: 'Desarrollo storefront',
  prices: { CO: 2500000, US: 750 },
  image: '/images/vtex.jpg',
  tags: ['Oferta'],
}

const mockProduct2: Product = {
  id: 'prod-002',
  name: 'Consultoría GraphQL',
  description: 'API GraphQL para e-commerce',
  prices: { CO: 1800000, US: 540 },
  image: '/images/graphql.jpg',
  tags: [],
}

// ============================================
// HELPERS
// ============================================

const openCart = async (user: ReturnType<typeof userEvent.setup>) => {
  const openButton = screen.getByTestId('open-cart')
  await user.click(openButton)
  await screen.findByTestId('cart-panel')
}

// ============================================
// CLEANUP
// ============================================

beforeEach(() => {
  cleanup()
  localStorage.clear()
})

describe('DrawerCart', () => {

  // ============================================
  // TEST 1: Carrito vacío muestra mensaje
  // ============================================
  it('muestra mensaje cuando el carrito está vacío', async () => {
    const user = userEvent.setup()
    render(
      <GeoProvider>
        <CartProvider>
          <DrawerCart />
        </CartProvider>
      </GeoProvider>
    )

    await openCart(user)
    expect(screen.getByTestId('empty-cart')).toBeInTheDocument()
  })

  // ============================================
  // TEST 2: Agregar producto al carrito
  // ============================================
  it('agrega producto al carrito y muestra su información', async () => {
    const user = userEvent.setup()

    const AddButton = () => {
      const { addToCart } = useCart()
      return <button onClick={() => addToCart(mockProduct)}>Agregar</button>
    }

    render(
      <GeoProvider>
        <CartProvider>
          <AddButton />
          <DrawerCart />
        </CartProvider>
      </GeoProvider>
    )

    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    await openCart(user)

    expect(screen.getByText('Servicio VTEX')).toBeInTheDocument()
    expect(screen.getByTestId('item-quantity')).toHaveTextContent('1')
  })

  // ============================================
  // TEST 3: Incrementar cantidad
  // ============================================
  it('incrementa la cantidad cuando se hace click en +', async () => {
    const user = userEvent.setup()

    const AddButton = () => {
      const { addToCart } = useCart()
      return <button onClick={() => addToCart(mockProduct)}>Agregar</button>
    }

    render(
      <GeoProvider>
        <CartProvider>
          <AddButton />
          <DrawerCart />
        </CartProvider>
      </GeoProvider>
    )

    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    await openCart(user)

    const incrementButton = screen.getByRole('button', { name: 'Incrementar cantidad' })
    await user.click(incrementButton)

    expect(screen.getByTestId('item-quantity')).toHaveTextContent('2')
  })

  // ============================================
  // TEST 4: Decrementar cantidad (llega a 0 = remover)
  // ============================================
  it('remueve producto cuando la cantidad llega a 0', async () => {
    const user = userEvent.setup()

    const AddButton = () => {
      const { addToCart } = useCart()
      return <button onClick={() => addToCart(mockProduct)}>Agregar</button>
    }

    render(
      <GeoProvider>
        <CartProvider>
          <AddButton />
          <DrawerCart />
        </CartProvider>
      </GeoProvider>
    )

    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    await openCart(user)

    const decrementButton = screen.getByRole('button', { name: 'Decrementar cantidad' })
    await user.click(decrementButton)

    expect(screen.getByTestId('empty-cart')).toBeInTheDocument()
  })

  // ============================================
  // TEST 5: Eliminar producto
  // ============================================
  it('elimina producto directamente del carrito', async () => {
    const user = userEvent.setup()

    const AddButton = () => {
      const { addToCart } = useCart()
      return <button onClick={() => addToCart(mockProduct)}>Agregar</button>
    }

    render(
      <GeoProvider>
        <CartProvider>
          <AddButton />
          <DrawerCart />
        </CartProvider>
      </GeoProvider>
    )

    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    await openCart(user)

    const removeButton = screen.getByRole('button', { name: 'Eliminar producto' })
    await user.click(removeButton)

    expect(screen.getByTestId('empty-cart')).toBeInTheDocument()
  })

  // ============================================
  // TEST 6: Cálculo de subtotal
  // ============================================
  it('calcula correctamente el subtotal de múltiples productos', async () => {
    const user = userEvent.setup()

    const AddButtons = () => {
      const { addToCart } = useCart()
      return (
        <div>
          <button onClick={() => addToCart(mockProduct)}>Agregar Prod 1</button>
          <button onClick={() => addToCart(mockProduct2)}>Agregar Prod 2</button>
        </div>
      )
    }

    render(
      <GeoProvider>
        <CartProvider>
          <AddButtons />
          <DrawerCart />
        </CartProvider>
      </GeoProvider>
    )

    await user.click(screen.getByRole('button', { name: 'Agregar Prod 1' }))
    await user.click(screen.getByRole('button', { name: 'Agregar Prod 2' }))
    await openCart(user)

    expect(screen.getByText('Servicio VTEX')).toBeInTheDocument()
    expect(screen.getByText('Consultoría GraphQL')).toBeInTheDocument()

    // Subtotal: 2.500.000 + 1.800.000 = 4.300.000 COP
    expect(screen.getByTestId('subtotal')).toHaveTextContent('$4.300.000 COP')
  })

  // ============================================
  // TEST 7: Persistencia en LocalStorage
  // ============================================
  it('persiste el carrito en LocalStorage y lo recupera al recargar', async () => {
    const user = userEvent.setup()

    const AddButton = () => {
      const { addToCart } = useCart()
      return <button onClick={() => addToCart(mockProduct)}>Agregar</button>
    }

    render(
      <GeoProvider>
        <CartProvider>
          <AddButton />
          <DrawerCart />
        </CartProvider>
      </GeoProvider>
    )

    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    // Verificar que se guardó en localStorage
    const savedCart = localStorage.getItem('cart')
    expect(savedCart).toBeTruthy()

    // Simular reload
    cleanup()

    render(
      <GeoProvider>
        <CartProvider>
          <DrawerCart />
        </CartProvider>
      </GeoProvider>
    )

    await openCart(user)
    expect(screen.getByText('Servicio VTEX')).toBeInTheDocument()
  })
})