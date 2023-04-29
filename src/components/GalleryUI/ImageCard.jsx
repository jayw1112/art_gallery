import React from 'react'
import classes from './ImageCard.module.css'

function ImageCard({ image, title, description, onClick }) {
  return (
    <div className={classes.card} onClick={onClick}>
      <img src={image} alt='image' />
      <p className={classes.title}>{title}</p>
      <p className={classes.description}>{description}</p>
    </div>
  )
}

export default ImageCard
