'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const register = () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log(
              'ServiceWorker registration successful with scope: ',
              registration.scope
            )
          },
          (err) => {
            console.log('ServiceWorker registration failed: ', err)
          }
        )
      }

      if (document.readyState === 'complete') {
        register()
      } else {
        window.addEventListener('load', register)
      }
    }
  }, [])

  return null
}
