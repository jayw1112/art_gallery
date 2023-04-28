import React from 'react'
import classes from './ImageCard.module.css'

function ImageCard({ image, title, description }) {
  return (
    <div className={classes.card}>
      <img src={image} alt='image' />
      <p className={classes.title}>{title}</p>
      <p className={classes.description}>{description}</p>
    </div>
  )
}

export default ImageCard
