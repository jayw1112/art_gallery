import { useState } from 'react'
import AuthForm from '../components/Login/AuthForm'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function Signup() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = (email, password, username) => {
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        console.log(user, 'Signed Up')
        updateProfile(auth.currentUser, {
          displayName: username,
        })
          .then(() => {
            // Profile updated!
            console.log('Welcome', username)
            navigate('/')
          })
          .catch((error) => {
            // An error occurred
            console.log('Error updating display name:', error)
          })
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
