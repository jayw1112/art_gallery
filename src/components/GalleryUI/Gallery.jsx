import React, { useState, useEffect } from 'react'
import ImageCard from './ImageCard'
import classes from './Gallery.module.css'
import ErrorBoundary from '../Error/ErrorBoundary'
import { storage, storageRef } from '../../firebase'
import { ref, listAll, getDownloadURL } from 'firebase/storage'
import Spinner from '../UI/Spinner'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [displayName, setDisplayName] = useState('')

  // First useEffect hook - Fetching images
  useEffect(() => {
    getImages()
  }, [])

  // Second useEffect hook - Handling user's auth state
  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, update the displayName state
        setDisplayName(user.displayName || user.email)
      } else {
        // User is signed out
        setDisplayName('')
      }
    })
    // Cleanup the listener on unmount
    return () => unsubscribe()
  }, [])

  const getImages = async () => {
    setLoading(true)

    const imageUrls = []
    const imageRef = ref(storage, 'default_pics')
    const imageNames = await listAll(imageRef)

    const fetchUrls = imageNames.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef)
      imageUrls.push(url)
    })

    await Promise.all(fetchUrls)
    setImages(imageUrls)
    setLoading(false)
  }

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
              key={image}
            >
              <ImageCard image={image} />
            </ErrorBoundary>
          ))
        )}
      </div>
    </>
  )
}

export default Gallery
