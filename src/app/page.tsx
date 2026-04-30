'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SplashScreen from '@/components/shared/SplashScreen'
import { getCurrentSession } from '@/lib/auth'
import { SPLASH_DURATION_MS } from '@/lib/constants'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const session = getCurrentSession()
    const target = session ? '/dashboard' : '/login'

    const timer = setTimeout(() => {
      router.push(target)
    }, SPLASH_DURATION_MS)

    return () => clearTimeout(timer)
  }, [router])

  return <SplashScreen />
}
