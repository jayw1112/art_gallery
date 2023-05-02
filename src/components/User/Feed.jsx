import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../source/auth-context'
import { db } from '../../firebase'
import { doc, onSnapshot, getDoc } from 'firebase/firestore'
import Spinner from '../UI/Spinner'
import ErrorBoundary from '../Error/ErrorBoundary'
import ImageCard from '../GalleryUI/ImageCard'
import classes from './Feed.module.css'

function Feed() {
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState([])
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    if (currentUser) {
      const feedRef = doc(db, 'Feeds', currentUser.uid)

      const unsubscribe = onSnapshot(feedRef, async (feedDoc) => {
        if (feedDoc.exists()) {
          const feedData = feedDoc.data()
          if (feedData.images) {
            const imageDocs = await Promise.all(
              feedData.images.map((imageId) =>
                getDoc(doc(db, 'ImageMetadata', imageId))
              )
            )

            const fetchedImages = imageDocs.map((imageDoc) => ({
              ...imageDoc.data(),
              id: imageDoc.id,
            }))
            setImages(fetchedImages)
          }
          setLoading(false)
        } else {
          console.log('Feed not found')
          setLoading(false)
        }
      })

      return () => unsubscribe()
    }
  }, [currentUser])

  return (
    <div className={classes.container}>
      {loading ? (
        <Spinner />
      ) : (
        images.map((image) => (
          <ErrorBoundary fallback={<p>Error Displaying Image.</p>} key={image}>
            <ImageCard
              image={image}
              imageId={image.id}
              // imageId={imageId}
            />
          </ErrorBoundary>
        ))
      )}
    </div>
  )
}

export default Feed
