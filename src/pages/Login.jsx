import { useState } from 'react'
import AuthForm from '../components/Login/AuthForm'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function Login() {
  //   const [loggedIn, setLoggedIn] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (email, password) => {
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        console.log(user, 'logged in')
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