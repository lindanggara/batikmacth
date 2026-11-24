import { useState } from 'react'
import { searchByImage } from '../api/search'

export function useSearch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const search = async ({ file, topK = 5, daerah = '' }) => {
    setLoading(true); setError(null); setResult(null)
    try {
      const data = await searchByImage({ file, topK, daerah })
      setResult(data)
      return data
    } catch (err) {
      const message = err?.message || 'Gagal mencari. Coba lagi.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, result, search }
}
