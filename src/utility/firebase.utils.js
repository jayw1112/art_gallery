import { ref } from 'firebase/storage'

export const getUserStorageRef = (storage, currentUser) => {
  if (currentUser) {
    return ref(storage, `users/${currentUser.uid}`)
  }
  return null
}
