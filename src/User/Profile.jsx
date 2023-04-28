import { useState, useEffect, useContext } from 'react'
import { storage } from '../firebase'
import { listAll, ref, getDownloadURL, getMetadata } from 'firebase/storage'
import { getUserStorageRef } from '../utility/firebase.utils'
import { AuthContext } from '../source/auth-context'
import ImageCard from '../components/GalleryUI/ImageCard'
import classes from './Profile.module.css'
import Spinner from '../components/UI/Spinner'

function Profile() {
  const [images, setImages] = useState([])
  const { currentUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
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
      setImages(fetchedImages)
      setLoading(false)
    }

    if (currentUser) {
      fetchImages()
    }
  }, [currentUser])

  return (
    <div className={classes.profileContainer}>
      <h2 className={classes.title}>{currentUser.displayName}'s Images</h2>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          {images.map((image, index) => (
            <ImageCard
              key={index}
              image={image.url}
              title={image.metadata.customMetadata.title}
              description={image.metadata.customMetadata.description}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile
