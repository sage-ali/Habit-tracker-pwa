'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/lib/auth'

const LoginForm: React.FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const result = loginUser(email, password)

    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-6 shadow-md"
    >
      <h2 className="text-center text-2xl font-bold">Log In</h2>
      {error && <p className="text-center text-sm text-red-500">{error}</p>}
      <div className="flex flex-col gap-1">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="auth-login-email"
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
          data-testid="auth-login-password"
          className="rounded border p-2"
          required
        />
      </div>
      <button
        type="submit"
        data-testid="auth-login-submit"
        className="bg-primary rounded p-2 font-bold text-white transition-opacity hover:opacity-90"
      >
        Log In
      </button>
    </form>
  )
}

export default LoginForm
