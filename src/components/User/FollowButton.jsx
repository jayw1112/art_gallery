import React, { useState, useEffect } from 'react'
import follow_ from '../../assets/follow_.svg'
import unfollow_ from '../../assets/unfollow_.svg'
import classes from './FollowButton.module.css'
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { followersRef, followingRef, db } from '../../firebase'
import { fetchUserName } from '../../utility/firebase.utils'

function FollowButton({ currentUser, userId }) {
  const [isFollowing, setIsFollowing] = useState(false)
  const uid = currentUser ? currentUser.uid : null
  const pUId = userId

  const checkIfFollowing = async () => {
    if (!uid || !pUId) return

    const followingDocRef = doc(followingRef, uid)
    const followingDoc = await getDoc(followingDocRef)
    const followingData = followingDoc.data()

    if (followingData && followingData.following.includes(pUId)) {
      setIsFollowing(true)
    } else {
      setIsFollowing(false)
    }
  }

  useEffect(() => {
    checkIfFollowing()
  }, [uid, pUId])

  const followHandler = async (e, uid, pUId) => {
    e.stopPropagation()

    if (!uid) {
      console.log('User not signed in')
      return
    }
    if (uid === pUId) {
      console.log('User cannot follow themselves')
      return
    }

    try {
      const followersDocRef = doc(followersRef, pUId)
      const followingDocRef = doc(followingRef, uid)

      if (isFollowing) {
        await setDoc(
          followersDocRef,
          {
            followers: arrayRemove(uid),
          },
          { merge: true }
        )
        await setDoc(
          followingDocRef,
          {
            following: arrayRemove(pUId),
          },
          { merge: true }
        )
        setIsFollowing(false)
        console.log(`User ${uid} unfollowed ${pUId}`)
      } else {
        await setDoc(
          followersDocRef,
          {
            followers: arrayUnion(uid),
          },
          { merge: true }
        )
        await setDoc(
          followingDocRef,
          {
            following: arrayUnion(pUId),
          },
          { merge: true }
        )
        setIsFollowing(true)
        console.log(`User ${uid} followed ${pUId}`)
      }

      // Fetch and display the name of the user being followed/unfollowed
      const displayName = await fetchUserName(pUId)
      if (displayName) {
        const message = isFollowing
          ? `You have unfollowed ${displayName}.`
          : `You have followed ${displayName}.`
        alert(message) // Replace this with preferred method for displaying a popup message
      }
    } catch (error) {
      console.log('Error Following/Unfollowing User', error)
    }
  }

  return (
    <div className={classes.followContainer}>
      {!isFollowing ? (
        <>
          <img
            src={follow_}
            alt='Follow'
            onClick={(e) => followHandler(e, uid, pUId)}
          />
          <p>Follow</p>
        </>
      ) : (
        <>
          <img
            src={unfollow_}
            alt='Unfollow'
            onClick={(e) => followHandler(e, uid, pUId)}
          />
          <p>Unfollow</p>
        </>
      )}
    </div>
  )
}

export default FollowButton
