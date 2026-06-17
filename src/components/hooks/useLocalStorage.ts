import { useState, useEffect, useCallback } from 'react'

/**
 * useLocalStorage - Hook para persistir estado en localStorage
 *
 * Características:
 * - Lee valor inicial desde localStorage al montar
 * - Persiste cambios automáticamente
 * - Sincroniza con cambios de otras pestañas via StorageEvent
 * - Manejo robusto de errores JSON
 *
 * @param key - La clave para localStorage
 * @param initialValue - Valor por defecto si la key no existe
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Función helper para leer de localStorage — extraída para poder reutilizarla
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }, [key, initialValue])

  const [storedValue, setStoredValue] = useState<T>(readValue)

  // Sincronizar con cambios de otras pestañas
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue))
        } catch {
          console.warn(`Error parsing storage event for key "${key}"`)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  // Setter que soporta both value y updater function (como useState)
  const setValue: (value: T | ((prev: T) => T)) => void = useCallback(
    (value) => {
      try {
        // Support functional updates like useState
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}
