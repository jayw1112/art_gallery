import React from 'react'
import ImagePage from '../components/Image/ImagePage'
import { useParams } from 'react-router-dom'

function ImageWebPage() {
  const { imageId } = useParams()

  return (
    <>
      <ImagePage imageId={imageId} />
    </>
  )
}

export default ImageWebPage
