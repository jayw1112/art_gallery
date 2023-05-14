import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../source/auth-context'
import { db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import Spinner from '../UI/Spinner'
import ErrorBoundary from '../Error/ErrorBoundary'
import ImageCard from '../GalleryUI/ImageCard'
import classes from './Feed.module.css'
import { fetchFollowing } from '../../utility/firebase.utils'

function Feed() {
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState([])
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    const fetchImages = async () => {
      // Fetch the list of users that the current user is following
      const following = await fetchFollowing(currentUser.uid)

      const feedRef = doc(db, 'Feeds', currentUser.uid)
      const feedDoc = await getDoc(feedRef)
      if (feedDoc.exists()) {
        const feedData = feedDoc.data()
        if (feedData.images) {
          const imageDocs = await Promise.all(
            feedData.images.map((imageId) =>
              getDoc(doc(db, 'ImageMetaData', imageId))
            )
          )

          const fetchedImages = imageDocs
            .map((imageDoc) => {
              if (!imageDoc.exists) {
                console.error(`Document with id ${imageDoc.id} does not exist`)
                return null
              }

              const imageData = imageDoc.data()
              if (!imageData) {
                console.error(`No data for document with id ${imageDoc.id}`)
                return null
              }

              if (!imageData.owner) {
                console.error(
                  `Document with id ${imageDoc.id} does not include an owner field`
                )
                return null
              }

              return {
                ...imageData,
                id: imageDoc.id,
                ownerId: imageData.owner,
              }
            })
            .filter((image) => image !== null) // remove null values

          // Filter the images so that only the ones from followed users are included
          const filteredImages = fetchedImages.filter((image) =>
            following.includes(image.ownerId)
          )

          setImages(filteredImages)
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
        images.map((image) => {
          if (!image) {
            return null
          }

          return (
            <ErrorBoundary
              fallback={<p>Error Displaying Image.</p>}
              key={image.id}
            >
              <ImageCard
                image={image.url}
                imageId={image.id}
                title={image.title}
                description={image.description}
                owner={image.owner}
                displayLink={true}
              />
            </ErrorBoundary>
          )
        })
      )}
    </div>
  )
}

export default Feed
