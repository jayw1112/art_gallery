import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../source/auth-context'
import { db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import Spinner from '../UI/Spinner'
import ErrorBoundary from '../Error/ErrorBoundary'
import ImageCard from '../GalleryUI/ImageCard'
import classes from './Feed.module.css'

function Feed() {
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState([])
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    const fetchImages = async () => {
      const feedRef = doc(db, 'Feeds', currentUser.uid)
      const feedDoc = await getDoc(feedRef)
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
    }
    fetchImages()
  }, [currentUser])

  return (
    <div className={classes.container}>
      {loading ? (
        <Spinner />
      ) : (
        images.map((image) => (
          <ErrorBoundary
            fallback={<p>Error Displaying Image.</p>}
            key={image.id}
          >
            <ImageCard
              image={image.url}
              imageId={image.id}
              title={image.title}
              description={image.description}
              displayLink={true}
            />
          </ErrorBoundary>
        ))
      )}
    </div>
  )
}

export default Feed
