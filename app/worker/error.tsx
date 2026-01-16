'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error
    console.error(error)
  }, [error])

  return (
    <div className="p-8 text-center bg-red-50 rounded-lg">
      <h2 className="text-xl font-bold text-red-900">Bir şeyler ters gitti!</h2>
      <p className="text-red-700 my-4">
        Sayfa yüklenirken bir hata oluştu.
      </p>
      <div className="text-xs text-red-500 font-mono bg-white p-2 rounded overflow-hidden border border-red-200">
        {error.message || 'Bilinmeyen hata'}
      </div>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Tekrar Dene
      </button>
    </div>
  )
}
