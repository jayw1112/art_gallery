import { useState, useEffect, useContext } from 'react'
import { db, storage } from '../../firebase'
import {
  listAll,
  ref,
  getDownloadURL,
  getMetadata,
  deleteObject,
  updateMetadata,
} from 'firebase/storage'
import { getUserStorageRef } from '../../utility/firebase.utils'
import { AuthContext } from '../../source/auth-context'
import ImageCard from '../GalleryUI/ImageCard'
import classes from './Profile.module.css'
import Spinner from '../UI/Spinner'
import ImageModal from '../UI/ImageModal'
import { useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'

function Profile() {
  const [images, setImages] = useState([])
  const { currentUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [displayName, setDisplayName] = useState()
  const { uid } = useParams()

  const fetchImages = async () => {
    const userStorageRef = getUserStorageRef(storage, currentUser.uid)
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

  const fetchUserData = async (uid) => {
    const userDocRef = doc(db, 'users', uid)
    try {
      const userDoc = await getDoc(userDocRef)
      if (userDoc.exists()) {
        const userData = userDoc.data()
        setDisplayName(userData.displayName)
      } else {
        console.log('User not found')
      }
    } catch (error) {
      console.log('Error fetching user data:', error)
    }
  }

  useEffect(() => {
    if (currentUser?.uid) {
      fetchImages()
      fetchUserData(uid)
    }
  }, [currentUser, uid])

  const openModal = (image) => {
    setIsModalOpen(true)
    setSelectedImage(image)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const updateImageMetadata = async (image, newTitle, newDescription) => {
    const imagePath = image.metadata.fullPath
    const imageRef = ref(storage, imagePath)

    const newMetadata = {
      customMetadata: {
        title: newTitle,
        description: newDescription,
      },
    }

    try {
      await updateMetadata(imageRef, newMetadata)
      console.log('Metadata updated successfully!')
    } catch (error) {
      console.log('Error updating metadata:', error)
    }
  }

  const deleteImage = async (image) => {
    const imagePath = image.metadata.fullPath
    const imageRef = ref(storage, imagePath)

    try {
      await deleteObject(imageRef)
      console.log('Image deleted successfully!')
    } catch (error) {
      console.log('Error deleting image:', error)
    }
  }

  return (
    <>
      <h2 className={classes.title}>
        {displayName ? `${displayName}'s Images` : 'Loading...'}
      </h2>
      <div className={classes.profileContainer}>
        <div>
          {loading ? (
            <Spinner />
          ) : (
            <div className={classes.imageGrid}>
              {images.map((image, index) => (
                <ImageCard
                  key={index}
                  image={image.url}
                  title={image.metadata.customMetadata.title}
                  description={image.metadata.customMetadata.description}
                  onClick={() => openModal(image)}
                />
              ))}
            </div>
          )}
        </div>
        <ImageModal
          selectedImage={selectedImage}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          updateImageMetadata={updateImageMetadata}
          deleteImage={deleteImage}
          fetchImages={fetchImages}
        />
      </div>
    </>
  )
}

export default Profile
