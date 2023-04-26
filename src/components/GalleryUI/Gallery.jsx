import React, { useState, useEffect } from 'react'
import ImageCard from './ImageCard'
import classes from './Gallery.module.css'
import ErrorBoundary from '../Error/ErrorBoundary'

function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getImages()
  }, [])

  const getImages = async () => {
    setLoading(true)
    const res = await fetch('https://jsonplaceholder.typicode.com/photos')
    const data = await res.json()

    setImages(data.slice(0, 12))
    setLoading(false)
  }

  return (
    <div className={classes.container}>
      {loading && <h2>Loading...</h2>}
      {images.map((image) => (
        <ErrorBoundary fallback={<p>Error Displaying Image.</p>} key={image.id}>
          <ImageCard image={image} />
        </ErrorBoundary>
      ))}
    </div>
  )
}

export default Gallery
