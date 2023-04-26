import React, { useState, useEffect } from 'react'
import ImageCard from './ImageCard'
import classes from './Gallery.module.css'
import ErrorBoundary from '../Error/ErrorBoundary'
import { storage, storageRef } from '../../firebase'
import { ref, listAll, getDownloadURL } from 'firebase/storage'

function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getImages()
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
    <div className={classes.container}>
      {loading && <h2>Loading...</h2>}
      {images.map((image) => (
        <ErrorBoundary fallback={<p>Error Displaying Image.</p>} key={image}>
          <ImageCard image={image} />
        </ErrorBoundary>
      ))}
    </div>
  )
}

export default Gallery
