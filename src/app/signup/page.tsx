'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'
import SignupForm from '@/components/auth/SignupForm'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()

  useEffect(() => {
    if (storage.getSession()) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <SignupForm />
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-bold">
          Log In
        </Link>
      </p>
    </div>
  )
}
