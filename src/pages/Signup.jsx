import { useState } from 'react'
import AuthForm from '../components/Login/AuthForm'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function Signup() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = (email, password) => {
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        console.log(user, 'signed up')
        navigate('/')
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
