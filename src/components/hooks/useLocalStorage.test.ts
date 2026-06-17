import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

// Mock localStorage para el entorno jsdom
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    localStorageMock.clear()
    localStorageMock.getItem.mockReset()
    localStorageMock.setItem.mockReset()
    // Por defecto, getItem retorna null (como localStorage real)
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('should read initial value from localStorage', () => {
    // Arrange: guardar un valor en localStorage antes del render
    localStorageMock.getItem.mockReturnValueOnce('"test-value"')

    // Act & Assert
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('test-value')
  })

  it('should return default value when key does not exist', () => {
    const { result } = renderHook(() =>
      useLocalStorage('non-existent-key', 'default-value')
    )
    expect(result.current[0]).toBe('default-value')
  })

  it('should persist new value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('persist-key', 'initial'))

    // Act: actualizar el valor
    act(() => {
      result.current[1]('updated-value')
    })

    // Assert: verificar que se persistió
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'persist-key',
      '"updated-value"'
    )
    expect(result.current[0]).toBe('updated-value')
  })

  it('should support functional updates (like useState)', () => {
    const { result } = renderHook(() => useLocalStorage('counter-key', 0))

    // Act: usar updater function
    act(() => {
      result.current[1]((prev: number) => prev + 1)
    })

    expect(result.current[0]).toBe(1)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('counter-key', '1')
  })

  it('should handle invalid JSON gracefully and return default', () => {
    // localStorage tiene datos corruptos
    localStorageMock.getItem.mockReturnValueOnce('not-valid-json')

    const { result } = renderHook(() => useLocalStorage('corrupt-key', 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })
})
