// src/components/EditAccountForm/EditAccountForm.js
import { useState, useContext, useEffect } from 'react'
import classes from './EditAccountForm.module.css'
import {
  getAuth,
  updateEmail,
  updatePassword,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../source/auth-context'
import {
  updateUserData,
  getUserStorageRef,
  fetchUser,
  getPicStorageRef,
} from '../../utility/firebase.utils'
import { db, storage, uploadBytes } from '../../firebase'
// import { ref } from '../../firebase'
import { getDownloadURL, ref, deleteObject } from 'firebase/storage'

function EditAccountForm({ closeModal }) {
  const auth = getAuth()
  const user = auth.currentUser
  const { setCurrentUser } = useContext(AuthContext)
  // General
  const [displayName, setDisplayName] = useState(user.displayName)
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState('')
  const [warningMessage, setWarningMessage] = useState('')
  // Profile picture
  const [profilePicUrl, setProfilePicUrl] = useState(user.photoURL)
  const [profilePicFile, setProfilePicFile] = useState(null)
  // Bio
  const [showTextArea, setShowTextArea] = useState(false)
  const [profileInfo, setProfileInfo] = useState('')

  const navigate = useNavigate()

  async function reauthenticate(email, password) {
    const user = auth.currentUser
    const credential = EmailAuthProvider.credential(email, password)

    try {
      await reauthenticateWithCredential(user, credential)
    } catch (error) {
      console.log('Error reauthenticating:', error)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const fileName = `${user.uid}_Profile_Picture`
    let newProfilePicUrl = profilePicUrl // keep the old profile picture URL by default

    // Only delete old profile pic from Firebase Storage if a new one is uploaded
    if (profilePicFile) {
      // Delete old profile pic from Firebase Storage if one exists
      const oldStorageRef = getPicStorageRef(storage, user.uid, fileName)
      try {
        await deleteObject(oldStorageRef)
        console.log('Deleted old profile pic from storage')
      } catch (error) {
        // Ignoring the error if no old profile pic found
      }

      // Save new profile pic to Firebase Storage
      const newStorageRef = getPicStorageRef(storage, user.uid, fileName)
      await uploadBytes(newStorageRef, profilePicFile)
      console.log('Uploaded new profile pic to storage')
      newProfilePicUrl = await getDownloadURL(newStorageRef)
      await updateProfile(user, { photoURL: newProfilePicUrl })
    }

    // Update profile data
    await updateProfile(user, { displayName })
    setDisplayName(user.displayName)
    setProfilePicUrl(newProfilePicUrl)
    setCurrentUser({ ...user, displayName, photoURL: newProfilePicUrl }) // Update context here

    if (email !== user.email || password) {
      // Email or password is being changed
      try {
        await reauthenticate(email, password)
        await updateEmail(user, email)
        if (password) {
          await updatePassword(user, password)
        }
        await auth.currentUser.reload()
        // setCurrentUser(auth.currentUser)
        setCurrentUser({ ...auth.currentUser, email }) // Update context here
      } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
          setWarningMessage('Please log in again before making these changes.')
        } else {
          console.error('Error updating email or password:', error)
        }
      }
    }

    // Update Firestore data
    await updateUserData(
      db,
      user,
      displayName,
      email,
      newProfilePicUrl,
      profileInfo || ''
    )

    setCurrentUser(auth.currentUser)
    closeModal()
    setWarningMessage('')
    // await auth.currentUser.reload()
    // navigate(`profile/${user.uid}`)
  }

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

      // Delete user data from Firestore
      const userRef = ref(db, `users/${user.uid}`)
      await deleteObject(userRef)

      // Delete user profile pic from Firebase Storage if one exists
      const fileName = `${user.uid}_Profile_Picture`
      const storageRef = getPicStorageRef(storage, user.uid, fileName)
      try {
        await deleteObject(storageRef)
      } catch (error) {
        // Ignoring the error if no profile pic found
      }
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

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0]
    if (!file) {
      setWarningMessage('No file selected.')
      return
    }

    // Check for file size (3MB = 3 * 1024 * 1024 bytes)
    if (file.size > 3 * 1024 * 1024) {
      setWarningMessage('Profile picture size cannot exceed 3MB.')
      return
    }

    setWarningMessage('')
    setProfilePicFile(file)
  }

  const handleDeleteProfilePic = async () => {
    const confirmation = window.confirm(
      'Are you sure you want to delete your profile picture?'
    )

    if (!confirmation) {
      return
    }

    try {
      const fileName = `${user.uid}_Profile_Picture`
      const oldStorageRef = getPicStorageRef(storage, user.uid, fileName)
      await deleteObject(oldStorageRef)

      await updateProfile(user, { photoURL: null })
      await updateUserData(db, user, displayName, email, null, fileName)
      setProfilePicUrl(null)
    } catch (error) {
      console.error('Error deleting profile pic:', error)
      setWarningMessage('An error occurred while deleting the profile picture.')
    }
  }

  const handleBioChange = (event) => {
    const newBio = event.target.value
    if (newBio.length >= 200) {
      setWarningMessage('Bio cannot exceed 200 characters.')
    } else {
      setWarningMessage('')
    }
    setProfileInfo(newBio)
  }

  const saveBioChange = async (e) => {
    e.preventDefault()

    try {
      await updateUserData(
        db,
        user,
        displayName,
        email,
        profilePicUrl,
        profileInfo
      )
    } catch (error) {
      console.error('Error updating bio:', error)
      setWarningMessage('An error occurred while updating the bio.')
    }

    setShowTextArea(false)
  }

  useEffect(() => {
    const fetchProfileInfo = async () => {
      const userData = await fetchUser(user.uid)
      if (userData.profileInfo) {
        setProfileInfo(userData.profileInfo)
      }
    }
    fetchProfileInfo()
  }, [user.uid])

  return (
    <div className={classes.formContainer}>
      <form onSubmit={handleSubmit}>
        <div className='inputField'>
          <label htmlFor='displayName'>Display Name:</label>
          <input
            type='text'
            name='displayName'
            id='displayName'
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className='inputField'>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            name='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='inputField'>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            name='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='inputField'>
          <label htmlFor='profilePic'>Profile Picture:</label>
          <input
            type='file'
            className={classes.profilePicInput}
            name='profilePic'
            id='profilePic'
            accept='image/*'
            onChange={handleProfilePicChange}
          />
        </div>

        {showTextArea && (
          <div>
            <textarea
              className={classes.textArea}
              value={profileInfo}
              onChange={handleBioChange}
              onKeyUp={handleBioChange}
              type='text'
              placeholder='Enter your profile information...'
              rows='7'
              cols='37'
              maxLength={200}
            />
          </div>
        )}
        <div className='inputField'>
          <button type='button' onClick={() => setShowTextArea(!showTextArea)}>
            Edit Bio
          </button>
          {showTextArea && <button onClick={saveBioChange}>Save Bio</button>}
        </div>
        <button
          className={classes.deleteButton}
          type='button'
          onClick={handleDeleteProfilePic}
        >
          Remove Profile Picture
        </button>
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
