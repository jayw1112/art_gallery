import { useState } from 'react'
import AuthForm from '../components/Login/AuthForm'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import createUserDocument from '../utility/firebase.utils'

function Login() {
  //   const [loggedIn, setLoggedIn] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (email, password) => {
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user

        // Call createUserDocument to ensure the user document is created
        await createUserDocument(user)

        console.log(user, 'Logged In')
        navigate('/')
        // ...
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        setError(errorMessage)
      })
  }

  return (
    <div>
      <AuthForm formType='login' onSubmit={handleLogin} errorMessage={error} />
    </div>
  )
}

export default Login
