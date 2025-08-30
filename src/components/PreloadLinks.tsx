'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 预加载关键路由
export function PreloadLinks() {
  const router = useRouter()

  useEffect(() => {
    // 预加载常用路由
    const routesToPreload = [
      '/list',
      '/login',
      '/register',
      '/admin/login',
      '/admin/dashboard'
    ]

    const preloadRoute = (route: string) => {
      router.prefetch(route)
    }

    // 延迟预加载，避免影响首屏渲染
    const timer = setTimeout(() => {
      routesToPreload.forEach(preloadRoute)
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return null
}