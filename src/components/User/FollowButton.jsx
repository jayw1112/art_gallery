import React from 'react'
import follow_ from '../../assets/follow_.svg'
import unfollow_ from '../../assets/unfollow_.svg'
import classes from './FollowButton.module.css'

function FollowButton(currentUser, profileUser) {
  return (
    <div className={classes.followContainer}>
      <img src={follow_} alt='Follow' />
      <p>Follow</p>
      {/* <img src={unfollow_} alt='Unfollow' />
      <p>Unfollow</p> */}
    </div>
  )
}

export default FollowButton
