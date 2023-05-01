import React, { useContext, useState, useEffect } from 'react'
import classes from './ImageCard.module.css'
import thumb_up from '../../assets/thumb_up.svg'
import share_ from '../../assets/share_.svg'
import { AuthContext } from '../../source/auth-context'
import { Likes, db } from '../../firebase'
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  where,
  query,
  getDocs,
} from 'firebase/firestore'

function ImageCard({ image, title, description, onClick, imageId }) {
  const { currentUser } = useContext(AuthContext)
  const [likeCount, setlikeCount] = useState(null)
  const uid = currentUser ? currentUser.uid : null

  const likeHandler = async (e, uid) => {
    if (!uid) {
      console.log('User not signed in')
      return
    }
    e.stopPropagation()
    const userDocRef = doc(db, 'Likes', imageId)
    try {
      const userDoc = await getDoc(userDocRef)
      if (
        userDoc.exists() &&
        imageId === userDoc.data().imageId &&
        uid === userDoc.data().userId
      ) {
        deleteDoc(userDocRef)
        console.log('Image unliked')
        likeCounter()
      } else {
        await setDoc(userDocRef, {
          imageId,
          userId: uid,
          timestamp: serverTimestamp(),
        })
        console.log('Liked image')
        likeCounter()
      }
    } catch (error) {
      console.log('Error Liking/Unliking Image', error)
    }
  }

  const shareHandler = () => {
    // Copy the image URL or a link to the image's detail page to the user's clipboard.
    // Display a message to inform the user that the link has been copied.
  }

  const likeCounter = async () => {
    // Get the number of likes for this image.
    // Check if imageId exists before querying the Likes collection.
    if (imageId) {
      const q = query(Likes, where('imageId', '==', imageId))
      const querySnapshot = await getDocs(q)
      const likes = querySnapshot.size
      // Display the number of likes.
      setlikeCount(likes)
      console.log(`Likes: ${likes}`)
    } else {
      console.log('imageId is missing, unable to count likes')
      setlikeCount(0)
    }
  }

  useEffect(() => {
    likeCounter()
  }, [imageId])

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
        <img
          className={classes.buttonIcon}
          src={thumb_up}
          alt='Like'
          onClick={(e) => likeHandler(e, uid)}
        />
        {likeCount > 0 ? (
          <p className={classes.likeCount}>{likeCount}</p>
        ) : null}
        <img className={classes.buttonIcon} src={share_} alt='Share' />
      </div>
      <p className={classes.title}>{title}</p>
      <p className={classes.description}>{description}</p>
    </div>
  )
}

export default ImageCard
