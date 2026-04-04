import { useState, useCallback } from 'react'

export function useWeather() {
  const [data,     setData]     = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [locating, setLocating] = useState(false)

  const fetchByCity = useCallback(async (city) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/weather/${encodeURIComponent(city)}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `City "${city}" not found`)
      }
      setData(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchByCoords = useCallback(async (lat, lon) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/weather/coords?lat=${lat}&lon=${lon}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Could not fetch weather for your location')
      }
      setData(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }
    setLocating(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false)
        fetchByCoords(coords.latitude, coords.longitude)
      },
      (err) => {
        setLocating(false)
        setError('Location access denied. Please search manually.')
      }
    )
  }, [fetchByCoords])

  return { data, loading, error, locating, fetchByCity, locate }
}
