import React from 'react'
import { APP_NAME } from '@/lib/constants'

const SplashScreen: React.FC = () => {
  return (
    <div
      className="bg-primary flex h-screen w-screen flex-col items-center justify-center"
      data-testid="splash-screen"
    >
      <h1 className="text-4xl font-bold text-white">{APP_NAME}</h1>
    </div>
  )
}

export default SplashScreen
