// src/components/EditAccountForm/EditAccountForm.js
import { useState, useContext } from 'react'
import classes from './EditAccountForm.module.css'
import {
  getAuth,
  updateEmail,
  updatePassword,
  updateProfile,
  deleteUser,
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../source/auth-context'
import { updateUserData } from '../../utility/firebase.utils'
import { db } from '../../firebase'

function EditAccountForm({ closeModal }) {
  const auth = getAuth()
  const user = auth.currentUser
  const { setUser } = useContext(AuthContext)

  const [displayName, setDisplayName] = useState(user.displayName)
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState('')
  const [warningMessage, setWarningMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await updateProfile(user, { displayName })

      if (email !== user.email || password) {
        // Email or password is being changed
        await updateEmail(user, email)
        if (password) {
          await updatePassword(user, password)
        }

        await auth.currentUser.reload()
      }
      // Update Firestore data
      await updateUserData(db, user, displayName, email)
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setWarningMessage(
          'Please re-authenticate to update your account information.'
        )
        return
      } else {
        setWarningMessage('An error occurred. Please try again.')
        return
      }
    }

    setDisplayName(auth.currentUser)
    closeModal()
    setWarningMessage('')
    await auth.currentUser.reload()
    window.location.reload()
  }

  const navigate = useNavigate()

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )

    if (!confirmation) {
      return
    }

    try {
      await deleteUser(user)
      closeModal()
      navigate('/')
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setWarningMessage(
          'Please log in again before deleting your account or changing your password.'
        )
      } else {
        console.error('Error deleting account:', error)
      }
    }
  }

  return (
    <div className={classes.formContainer}>
      <form onSubmit={handleSubmit}>
        <label htmlFor='displayName'>Display Name:</label>
        <input
          type='text'
          name='displayName'
          id='displayName'
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <label htmlFor='email'>Email:</label>
        <input
          type='email'
          name='email'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor='password'>Password:</label>
        <input
          type='password'
          name='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit'>Save Changes</button>
        <button
          className={classes.deleteButton}
          type='button'
          onClick={handleDeleteAccount}
        >
          Delete Account
        </button>
      </form>
      {warningMessage && <p className={classes.warning}>{warningMessage}</p>}
    </div>
  )
}

export default EditAccountForm
