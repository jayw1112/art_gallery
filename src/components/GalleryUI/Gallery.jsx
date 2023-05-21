import React, { useState, useEffect } from 'react'
import ImageCard from './ImageCard'
import classes from './Gallery.module.css'
import ErrorBoundary from '../Error/ErrorBoundary'
import { db, storage, storageRef } from '../../firebase'
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage'
import Spinner from '../UI/Spinner'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import useAuthState from '../../hooks/use-authState'
import { collection, getDocs } from 'firebase/firestore'

function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  // const [displayName, setDisplayName] = useState('')
  const displayName = useAuthState()

  // First useEffect hook - Fetching images
  useEffect(() => {
    getImages()
  }, [])

  // Fetch selected images from featuredUsers collection

  const getImages = async () => {
    setLoading(true)

    try {
      const imageDetails = []
      const featuredUsersSnapshot = await getDocs(
        collection(db, 'featuredUsers')
      )

      for (const doc of featuredUsersSnapshot.docs) {
        const { images: featuredImages } = doc.data()
        const userId = doc.id
        const imageRef = ref(storage, `users/${userId}`)

        const fetchImageDetails = featuredImages.map(async (imageName) => {
          try {
            const imgRef = ref(imageRef, imageName)
            const [url, metadata] = await Promise.allSettled([
              getDownloadURL(imgRef),
              getMetadata(imgRef),
            ])

            // Check if both promises fulfilled
            if (url.status === 'fulfilled' && metadata.status === 'fulfilled') {
              return { url: url.value, metadata: metadata.value, imageName }
            } else {
              console.error(`Failed to fetch details for image ${imageName}`)
            }
          } catch (error) {
            console.error(
              `Failed to fetch details for image ${imageName}: ${error}`
            )
          }
        })

        const imageDetailsForUser = (
          await Promise.allSettled(fetchImageDetails)
        )
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value)

        imageDetails.push(...imageDetailsForUser)
      }

      setImages(imageDetails)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching image details:', error)
      setLoading(false)
    }
  }

  // const getImages = async () => {
  //   setLoading(true)

  //   const imageUrls = []
  //   const imageRef = ref(storage, 'default_pics')
  //   const imageNames = await listAll(imageRef)

  //   const fetchUrls = imageNames.items.map(async (itemRef) => {
  //     const url = await getDownloadURL(itemRef)
  //     imageUrls.push(url)
  //   })

  //   await Promise.all(fetchUrls)
  //   setImages(imageUrls)
  //   setLoading(false)
  // }

  return (
    <>
      {displayName && (
        <h3 className={classes.display}>Welcome, {displayName}!</h3>
      )}
      <div className={classes.container}>
        {loading ? (
          <Spinner />
        ) : (
          images.map((image) => (
            <ErrorBoundary
              fallback={<p>Error Displaying Image.</p>}
              key={image.url} // Updated this line to use image.url as the key
            >
              <ImageCard
                image={image.url} // Fetching the image URL from the image object
                title={image.metadata.customMetadata?.title}
                description={image.metadata.customMetadata?.description}
                owner={image.metadata.customMetadata?.owner}
                displayLink={true}
                imageId={image.imageName}
              />
            </ErrorBoundary>
          ))
        )}
      </div>
    </>
  )
}

export default Gallery
