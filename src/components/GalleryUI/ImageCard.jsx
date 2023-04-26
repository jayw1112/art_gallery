import React from 'react'
import classes from './ImageCard.module.css'

function ImageCard({ image }) {
  return (
    <div className={classes.card}>
      <img src={image} alt='image' />
      <p>Image Title</p>
    </div>
  )
}

export default ImageCard
