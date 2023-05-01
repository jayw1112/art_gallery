import { ref } from 'firebase/storage'
import { collection, doc, setDoc } from 'firebase/firestore'

export const getUserStorageRef = (storage, uid) => {
  if (uid) {
    return ref(storage, `users/${uid}`)
  }
  return null
}

export const storeUserData = async (firestore, user, displayName) => {
  const userRef = doc(collection(firestore, 'users'), user.uid)

  try {
    await setDoc(userRef, {
      displayName,
      email: user.email,
      uid: user.uid,
      // Add any other information you want to store
    })
    console.log('User data stored successfully!')
  } catch (error) {
    console.log('Error storing user data:', error)
  }
}

export const updateUserData = async (firestore, user, displayName, email) => {
  const userRef = doc(collection(firestore, 'users'), user.uid)

  try {
    await setDoc(
      userRef,
      {
        displayName,
        email,
        uid: user.uid,
        // Add any other information you want to update
      },
      { merge: true }
    )
    console.log('User data updated successfully!')
  } catch (error) {
    console.log('Error updating user data:', error)
  }
}
