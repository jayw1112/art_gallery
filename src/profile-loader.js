import { storage } from './firebase'
import { fetchImages } from './image-loader'

export const profileLoader = async (currentUser) => {
  if (currentUser) {
    const images = await fetchImages(storage, currentUser)
    return images
  }
  return []
}
