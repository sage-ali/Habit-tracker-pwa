'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signupUser } from '@/lib/auth'

const SignupForm: React.FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const result = signupUser(email, password)

    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Signup failed')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-6 shadow-md"
    >
      <h2 className="text-center text-2xl font-bold">Sign Up</h2>
      {error && <p className="text-center text-sm text-red-500">{error}</p>}
      <div className="flex flex-col gap-1">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="auth-signup-email"
          className="rounded border p-2"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="auth-signup-password"
          className="rounded border p-2"
          required
        />
      </div>
      <button
        type="submit"
        data-testid="auth-signup-submit"
        className="bg-primary rounded p-2 font-bold text-white transition-opacity hover:opacity-90"
      >
        Sign Up
      </button>
    </form>
  )
}

export default SignupForm
