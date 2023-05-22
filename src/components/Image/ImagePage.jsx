import React, { useEffect, useState, useContext } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { ref, getDownloadURL } from 'firebase/storage'
import { db, imageDataUsers, storage } from '../../firebase'
import ImageCard from '../GalleryUI/ImageCard'
import { Link, useLocation, useParams } from 'react-router-dom'
import classes from './ImagePage.module.css'
import Spinner from '../UI/Spinner'
import Comments from '../Comments/Comments'
import AddComment from '../Comments/AddComment'
import { AuthContext } from '../../source/auth-context'
import { getImageStorageRef } from '../../utility/firebase.utils'

function ImagePage({ displayLink }) {
  const { imageId, ownerId } = useParams()
  const { currentUser } = useContext(AuthContext)
  const location = useLocation()
  const imageDetails = location.state || {}
  const { owner = '', title = '', description = '' } = imageDetails
  // console.log('imageId:', imageId, 'ownerId:', ownerId)
  // console.log('owner:', owner, 'title:', title, 'description:', description)
  //   console.log('state:', state)
  // console.log('location:', location)
  //   console.log('owner:', owner)
  // console.log('location.state:', location.state)
  const [imageData, setImageData] = useState({
    image: null,
    title: '',
    description: '',
    owner: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isCommentsLoading, setIsCommentsLoading] = useState(false)

  // const [commentsRefreshKey, setCommentsRefreshKey] = useState(0)

  // const refreshComments = () => {
  //   setCommentsRefreshKey((prevKey) => prevKey + 1)
  // }

  // useEffect(() => {
  //   const fetchImageData = async () => {
  //     setIsLoading(true)
  //     if (imageId) {
  //       try {
  //         const docRef = doc(db, 'ImageMetaData', 'users', ownerId, imageId)
  //         console.log('docRef:', docRef) // debugging

  //         const imageDoc = await getDoc(docRef)
  //         console.log('imageDoc:', imageDoc)

  //         if (imageDoc.exists()) {
  //           const data = imageDoc.data()
  //           console.log('imageData:', data) // debugging

  //           const imageUrl = await getDownloadURL(
  //             ref(storage, `ImageMetaData/${data.path}`)
  //           )
  //           setImageData({
  //             image: imageUrl,
  //             title: data.title,
  //             description: data.description,
  //             owner: data.owner,
  //           })
  //         } else {
  //           console.log('Image document does not exist') // debugging
  //         }
  //       } catch (error) {
  //         console.log('Error fetching image data:', error)
  //       }
  //     }
  //     setIsLoading(false) // Move this line inside the async function
  //   }

  //   fetchImageData()
  // }, [imageId])

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true)
      try {
        // console.log('imageId:', imageId) // debugging
        // console.log('ownerId:', ownerId) // debugging

        const imageRef = getImageStorageRef(storage, ownerId, imageId)
        if (imageRef) {
          const imageUrl = await getDownloadURL(imageRef)

          const docRef = doc(db, 'ImageMetaData', 'users', ownerId, imageId)
          // console.log('docRef:', docRef) // debugging

          const imageDoc = await getDoc(docRef)
          // console.log('imageDoc:', imageDoc) // debugging

          if (imageDoc.exists()) {
            const data = imageDoc.data()
            setImageData({
              image: imageUrl,
              title: data.title,
              description: data.description,
              owner: data.owner,
            })
            // console.log('imageData:', imageData)
          } else {
            console.error('Image document does not exist')
          }
        } else {
          console.error('Image reference is null')
        }
      } catch (error) {
        console.error('Error fetching image:', error)
      }
      setIsLoading(false)
    }

    fetchImage()
  }, [imageId, ownerId])

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && (
        <div className={classes.imageContainer}>
          <ImageCard
            image={imageData.image}
            title={imageData.title}
            description={imageData.description}
            imageId={imageId}
            owner={imageData.owner}
            displayLink={displayLink}
          />
          <Link className={classes.profile} to={`/profile/${ownerId}`}>
            Go to Profile
          </Link>
        </div>
      )}
      {isCommentsLoading && <Spinner />}
      {currentUser && (
        <div className={classes.commentSection}>
          <AddComment
            imageId={imageId}
            setIsCommentsLoading={setIsCommentsLoading}
          />
          <div className={classes.commentContainer}>
            <Comments
              imageId={imageId}
              setIsCommentsLoading={setIsCommentsLoading}
            />
          </div>
        </div>
      )}
    </>
  )
}
export default ImagePage
