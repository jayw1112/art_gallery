import React from 'react'
import classes from './ErrorPageCard.module.css'

function ErrorPageCard({ error }) {
  return (
    <div className={classes.card}>
      <h2>
        {error.status} {error.statusText}
      </h2>
      <p>{error.data}</p>
    </div>
  )
}

export default ErrorPageCard
