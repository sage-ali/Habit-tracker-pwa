'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentSession } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter()
  const session = getCurrentSession()

  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
  }, [session, router])

  if (!session) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute
