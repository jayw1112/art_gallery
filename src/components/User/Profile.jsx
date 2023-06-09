import { useState, useEffect, useContext } from 'react'
import { db, storage, followersRef, followingRef } from '../../firebase'
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
import { Link, useParams } from 'react-router-dom'
import { getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import FollowButton from './FollowButton'

function Profile() {
  const [images, setImages] = useState([])
  const { currentUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [displayName, setDisplayName] = useState()
  const { uid } = useParams()
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  const [profilePicUrl, setProfilePicUrl] = useState(null)
  const [bio, setBio] = useState('')

  const fetchImages = async () => {
    const userStorageRef = getUserStorageRef(storage, uid)
    const imageList = await listAll(userStorageRef)
    const fetchedImages = await Promise.all(
      imageList.items.map(async (item) => {
        const url = await getDownloadURL(item)
        const metadata = await getMetadata(item)
        // console.log(metadata)
        return {
          url,
          metadata,
        }
      })
    )
    setImages(fetchedImages)
    setLoading(false)
    // console.log(fetchedImages)
  }

  const fetchUserData = async (uid) => {
    const userDocRef = doc(db, 'users', uid)
    try {
      const userDoc = await getDoc(userDocRef)
      if (userDoc.exists()) {
        const userData = userDoc.data()
        // console.log('Fetched user data:', userData)
        setDisplayName(userData.displayName)

        setProfilePicUrl(userData.photoURL)
        // console.log('Fetched photoURL:', userData.photoURL)

        setBio(userData.profileInfo)
        // console.log('Fetched profileInfo:', userData.profileInfo)
      } else {
        console.log('User not found')
        setDisplayName(null)
      }
    } catch (error) {
      console.log('Error fetching user data:', error)
    }
  }

  useEffect(() => {
    // if (currentUser?.uid) {
    fetchImages()
    fetchUserData(uid)
    fetchFollowData(uid)
    // }
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
        owner: currentUser?.uid,
      },
    }

    try {
      await updateMetadata(imageRef, newMetadata)
      console.log('Metadata updated successfully!')

      // Update metadata in Firestore
      const imageId = image.metadata.name
      const ownerId = currentUser?.uid
      const imageDocRef = doc(db, 'ImageMetaData', 'users', ownerId, imageId)

      await updateDoc(imageDocRef, {
        title: newTitle,
        description: newDescription,
      })
      console.log('Firestore metadata updated successfully!')
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

      // Delete the image metadata
      const imageId = image.metadata.name
      const ownerId = currentUser?.uid
      const imageDocRef = doc(db, 'ImageMetaData', 'users', ownerId, imageId)
      await deleteDoc(imageDocRef)
      console.log('Firestore metadata deleted successfully!')
    } catch (error) {
      console.log('Error deleting image or its metadata:', error)
    }
  }

  const fetchFollowData = async (uid) => {
    const followersDocRef = doc(followersRef, uid)
    const followingDocRef = doc(followingRef, uid)

    try {
      const [followersDoc, followingDoc] = await Promise.all([
        getDoc(followersDocRef),
        getDoc(followingDocRef),
      ])

      if (followersDoc.exists()) {
        const followersData = followersDoc.data()
        setFollowersCount(followersData.followers.length)
      } else {
        setFollowersCount(0)
      }

      if (followingDoc.exists()) {
        const followingData = followingDoc.data()
        setFollowingCount(followingData.following.length)
      } else {
        setFollowingCount(0)
      }
    } catch (error) {
      console.log('Error fetching follow data:', error)
    }
  }

  return (
    <>
      <h2 className={classes.title}>
        {displayName !== undefined
          ? displayName
            ? `${displayName}'s Images`
            : 'No profile found'
          : 'Loading...'}
      </h2>
      {profilePicUrl && (
        <img
          className={classes.profilePic}
          src={profilePicUrl}
          alt={`${displayName}'s profile`}
          onError={(e) => {
            e.target.onerror = null // prevent infinite loop if default image also fails to load
            e.target.src = 'default_profile_pic_url'
          }}
        />
      )}
      {currentUser && currentUser.uid !== uid && (
        <FollowButton currentUser={currentUser} userId={uid} />
      )}

      {/* <h3 className={classes.followInfo}>
        {`Following: ${followingCount} | Followers: ${followersCount}`}
      </h3> */}

      <div className={classes.followInfo}>
        <Link to={`/following/${uid}`}>Following: {followingCount}</Link>
        <span> | </span>
        <Link to={`/followers/${uid}`}>Followers: {followersCount}</Link>
      </div>

      <div className={classes.profileContainer}>
        <div>
          {loading ? (
            <Spinner />
          ) : (
            <div className={classes.imageGrid}>
              {images.map((image, index) => {
                return (
                  <ImageCard
                    key={index}
                    image={image.url}
                    title={image.metadata.customMetadata?.title || ''}
                    description={
                      image.metadata.customMetadata?.description || ''
                    }
                    imageId={image.metadata.name}
                    owner={image.metadata.customMetadata?.owner || ''}
                    displayLink={true}
                    onClick={
                      currentUser &&
                      currentUser.uid === image.metadata.customMetadata?.owner
                        ? () => {
                            openModal(image)
                          }
                        : null
                    }
                  />
                )
              })}
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
      {bio && (
        <div className={classes.bio}>
          <h3>{displayName}</h3>
          <p>{bio}</p>
        </div>
      )}
    </>
  )
}

export default Profile
