import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../firebase'
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
} from 'firebase/firestore'
import classes from './Comments.module.css'

function Comments() {
  const { imageId } = useParams()
  const [comments, setComments] = useState([])
  // console.log('imageId:', imageId)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsQuery = query(
          collection(db, 'Comments', imageId, 'Comment'),
          where('imageId', '==', imageId),
          orderBy('timestamp', 'desc')
        )

        const unsubscribe = onSnapshot(commentsQuery, (querySnapshot) => {
          const fetchedComments = querySnapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id }
          })
          setComments(fetchedComments)
        })

        // return () => unsubscribe()
        return unsubscribe
      } catch (error) {
        console.log('Error fetching comments:', error)
      }
    }

    fetchComments()
  }, [imageId])

  return (
    <div className={classes.commentContainer}>
      <ul>
        {comments.map((comment) => {
          return (
            <li key={comment.id} className={classes.comment}>
              <p>{comment.text}</p>
              <p>{comment.username}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Comments
