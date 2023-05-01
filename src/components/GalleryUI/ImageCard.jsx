import React from 'react'
import classes from './ImageCard.module.css'
import thumb_up from '../../assets/thumb_up.svg'
import share_ from '../../assets/share_.svg'

function ImageCard({ image, title, description, onClick }) {
  return (
    <div className={classes.card}>
      <img
        className={onClick ? classes.clickableImage : ''}
        src={image}
        alt='image'
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      />
      <div className={classes.buttons}>
        <img className={classes.buttonIcon} src={thumb_up} alt='Like' />
        <img className={classes.buttonIcon} src={share_} alt='Share' />
      </div>
      <p className={classes.title}>{title}</p>
      <p className={classes.description}>{description}</p>
    </div>
  )
}

export default ImageCard
