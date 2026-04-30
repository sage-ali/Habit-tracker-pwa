'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'
import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    if (storage.getSession()) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <LoginForm />
      <p className="mt-4 text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-primary font-bold">
          Sign Up
        </Link>
      </p>
    </div>
  )
}
