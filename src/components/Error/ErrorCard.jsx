import React from 'react'
import classes from './ErrorCard.module.css'

function ErrorCard({ error, fallback }) {
  return (
    <div className={classes.card}>
      {fallback ? <p>{fallback}</p> : <p>{error}</p>}
    </div>
  )
}

export default ErrorCard
