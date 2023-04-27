import { useState } from 'react'
import AuthForm from '../components/Login/AuthForm'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

function Signup() {
  const [error, setError] = useState('')

  const handleSignup = (email, password) => {
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        // ...
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        setError(errorMessage)
        // ..
      })
  }

  return (
    <div>
      <AuthForm
        formType='signup'
        onSubmit={handleSignup}
        errorMessage={error}
      />
    </div>
  )
}

export default Signup
