import { useEffect, useRef, useState } from 'react'

function useDebouce<T>(
  value: T,
  delay: number,
  callback?: (debouncedValue: T) => void
) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
      callback?.(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay])

  return debouncedValue
}

export default useDebouce
