'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 p-8 text-center">
      <div className="rounded-full bg-red-100 p-4">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Bir şeyler ters gitti!</h2>
      <p className="text-gray-600 max-w-md">
        İş listesi yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
      </p>
      <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded max-w-md overflow-hidden">
        {error.message || 'Bilinmeyen hata'}
      </div>
      <Button onClick={() => reset()}>Tekrar Dene</Button>
    </div>
  )
}
