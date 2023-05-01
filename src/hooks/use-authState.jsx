import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const useAuthState = () => {
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName || user.email)
      } else {
        setDisplayName('')
      }
    })

    return () => unsubscribe()
  }, [])

  return displayName
}

export default useAuthState
