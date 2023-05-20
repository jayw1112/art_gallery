import { useState } from 'react'
import AuthForm from '../components/Login/AuthForm'
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import createUserDocument, {
  handleFirebaseError,
} from '../utility/firebase.utils'
import GoogleLogin from '../components/Login/GoogleLogin'
import classes from '../components/Login/AuthForm.module.css'

function Login() {
  //   const [loggedIn, setLoggedIn] = useState(true)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [showReset, setShowReset] = useState(false)

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
        const errorMessage = handleFirebaseError(error)
        setError(errorMessage)
      })
  }

  const handlePasswordReset = (email) => {
    const auth = getAuth()
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('Password reset email sent!')
        setEmail('')
        setShowReset(false)
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = handleFirebaseError(error)
        setError(errorMessage)
      })
  }

  // create a function to conditionally render the password reset form

  const handleShowReset = () => {
    setShowReset((prevState) => !prevState)
  }

  return (
    <div>
      <AuthForm formType='login' onSubmit={handleLogin} errorMessage={error} />
      <GoogleLogin buttonText='Log in with Google' />

      <button className={classes.reset} onClick={handleShowReset}>
        Forgot your password?
      </button>

      {showReset && (
        <form
          className={classes.form}
          onSubmit={(e) => {
            e.preventDefault()
            handlePasswordReset(email)
          }}
        >
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter email for password reset'
            className={classes.input}
          />
          <button className={classes.submit} type='submit'>
            Reset Password
          </button>
        </form>
      )}
    </div>
  )
}

export default Login
