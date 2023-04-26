import React from 'react'
import classes from './ImageCard.module.css'

function ImageCard({ image }) {
  return (
    <div className={classes.card}>
      <img src={image.url} alt={image.title} />
      <p>{image.title}</p>
    </div>
  )
}

export default ImageCard
