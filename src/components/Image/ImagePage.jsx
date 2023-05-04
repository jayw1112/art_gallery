import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { ref, getDownloadURL } from 'firebase/storage'
import { db, imageDataUsers, storage } from '../../firebase'
import ImageCard from '../GalleryUI/ImageCard'
import { useLocation, useParams } from 'react-router-dom'

function ImagePage() {
  const { imageId, ownerId } = useParams()
  const location = useLocation()
  const imageDetails = location.state || {}
  const { owner = '', title = '', description = '' } = imageDetails
  console.log('imageId:', imageId, 'ownerId:', ownerId)
  console.log('owner:', owner, 'title:', title, 'description:', description)
  //   console.log('state:', state)
  console.log('location:', location)
  //   console.log('owner:', owner)
  console.log('location.state:', location.state)
  const [imageData, setImageData] = useState({
    image: null,
    title: '',
    description: '',
    owner: '',
  })

  useEffect(() => {
    const fetchImageData = async () => {
      if (imageId) {
        try {
          const docRef = doc(db, 'ImageMetadata', 'users', ownerId, imageId)
          console.log('docRef:', docRef) // Add this line for debugging

          const imageDoc = await getDoc(docRef)
          console.log('imageDoc:', imageDoc)

          if (imageDoc.exists()) {
            const data = imageDoc.data()
            console.log('imageData:', data) // Add this line for debugging

            const imageUrl = await getDownloadURL(ref(storage, data.url))
            setImageData({
              image: imageUrl,
              title: data.title,
              description: data.description,
              owner: data.owner,
            })
          } else {
            console.log('Image document does not exist') // Add this line for debugging
          }
        } catch (error) {
          console.log('Error fetching image data:', error)
        }
      }
    }

    fetchImageData()
  }, [imageId])

  return (
    <div>
      <ImageCard
        image={imageData.image}
        title={imageData.title}
        description={imageData.description}
        imageId={imageId}
        owner={imageData.owner}
      />
    </div>
  )
}

export default ImagePage
