'use client'

import { useEffect, useState } from 'react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading...
    </div>
  }

  return (
    <ChakraProvider value={defaultSystem}>
      {children}
    </ChakraProvider>
  )
}