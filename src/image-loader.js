import { listAll, getDownloadURL, getMetadata } from 'firebase/storage'
import { getUserStorageRef } from './utility/firebase.utils'

export const fetchImages = async (storage, currentUser) => {
  const userStorageRef = getUserStorageRef(storage, currentUser)
  const imageList = await listAll(userStorageRef)
  const fetchedImages = await Promise.all(
    imageList.items.map(async (item) => {
      const url = await getDownloadURL(item)
      const metadata = await getMetadata(item)
      return {
        url,
        metadata,
      }
    })
  )
  return fetchedImages
}
