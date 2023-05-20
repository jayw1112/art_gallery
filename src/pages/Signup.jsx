import { useState } from 'react'
import AuthForm from '../components/Login/AuthForm'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import createUserDocument, {
  handleFirebaseError,
  storeUserData,
} from '../utility/firebase.utils'
// import { db } from '../firebase'
import GoogleLogin from '../components/Login/GoogleLogin'

function Signup() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = (email, password, username) => {
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user
        console.log(user)

        // storeUserData(db, user, username)

        // Call createUserDocument instead of storeUserData

        console.log(user, 'Signed Up')
        updateProfile(auth.currentUser, {
          displayName: username,
        })
        await createUserDocument(user, username)
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
        const errorMessage = handleFirebaseError(error)
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
      <GoogleLogin buttonText='Sign up with Google' />
    </div>
  )
}

export default Signup
