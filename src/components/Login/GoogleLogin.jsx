import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import createUserDocument from '../../utility/firebase.utils'
import classes from './GoogleLogin.module.css'

function GoogleLogin({ buttonText }) {
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()

    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      console.log(user, 'Logged in with Google')
      await createUserDocument(user, user.displayName)
        .then(() => {
          console.log('Welcome', user.displayName)
          navigate('/')
        })
        .catch((error) => {
          console.log('Error creating user account with Google:', error)
        })
    } catch (error) {
      console.log('Error logging in with Google:', error)
    }
  }

  return (
    <div className={classes.googleContainer}>
      <button className={classes.button} onClick={handleGoogleLogin}>
        <img
          className={classes.image}
          src='https://developers.google.com/identity/images/g-logo.png'
          alt='Google logo'
        />
        {buttonText}
      </button>
    </div>
  )
}

export default GoogleLogin
