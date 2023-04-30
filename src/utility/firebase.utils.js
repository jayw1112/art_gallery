import { ref } from 'firebase/storage'

export const getUserStorageRef = (storage, uid) => {
  if (uid) {
    return ref(storage, `users/${uid}`)
  }
  return null
}
