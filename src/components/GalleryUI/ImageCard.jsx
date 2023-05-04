import React, { useContext, useState, useEffect, useRef } from 'react'
import classes from './ImageCard.module.css'
import thumb_up from '../../assets/thumb_up.svg'
import share_ from '../../assets/share_.svg'
import { AuthContext } from '../../source/auth-context'
import { ImageLikes, db } from '../../firebase'
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  where,
  query,
  getDocs,
  collection,
  onSnapshot,
} from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'

function ImageCard({ image, title, description, onClick, imageId, owner }) {
  const { currentUser } = useContext(AuthContext)
  const [likeCount, setlikeCount] = useState(null)
  const uid = currentUser ? currentUser.uid : null
  const isFirstRender = useRef(true)
  const navigate = useNavigate()

  console.log('ImageCard', imageId, owner, title, description)

  const likeHandler = async (e, uid) => {
    if (!uid) {
      console.log('User not signed in')
      return
    }
    e.stopPropagation()

    const likeId = `${uid}_${imageId}`
    const likeDocRef = doc(ImageLikes, likeId)

    try {
      const likeDoc = await getDoc(likeDocRef)
      if (likeDoc.exists()) {
        await deleteDoc(likeDocRef)
      } else {
        await setDoc(likeDocRef, {
          imageId,
          userId: uid,
          timestamp: serverTimestamp(),
        })
      }
    } catch (error) {
      console.log('Error Liking/Unliking Image', error)
    }
  }

  // create a share handler that shares url to the image

  const shareHandler = async (e) => {
    e.stopPropagation()
    navigate(`/image/${imageId}`)
  }

  // const likeCounter = async () => {
  //   if (imageId) {
  //     const q = query(ImageLikes, where('imageId', '==', imageId))
  //     const querySnapshot = await getDocs(q)
  //     const likes = querySnapshot.size
  //     setlikeCount(likes)
  //     console.log(`Likes: ${likes}`)
  //   } else {
  //     console.log('imageId is missing, unable to count likes')
  //     setlikeCount(0)
  //   }
  // }

  useEffect(() => {
    if (!imageId) return
    const q = query(ImageLikes, where('imageId', '==', imageId))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (isFirstRender.current) {
        isFirstRender.current = false
      }

      // Update the like count directly within the onSnapshot callback
      const likes = querySnapshot.size
      setlikeCount(likes)
      console.log(`Likes: ${likes}`)
    })

    return () => {
      unsubscribe()
    }
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
        <img
          className={classes.buttonIcon}
          src={share_}
          alt='Share'
          onClick={shareHandler}
        />
      </div>
      <p className={classes.title}>{title}</p>
      <p className={classes.description}>{description}</p>
      <Link
        to={{
          pathname: `/image/${owner}/${imageId}`,
          state: {
            imageId: imageId,
            owner: owner,
            title: title,
            description: description,
          },
          log: console.log('ImageCard', imageId, owner, title, description),
        }}
      >
        <button className={classes.viewImage}>View Image</button>
      </Link>
    </div>
  )
}

export default ImageCard
