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
  const [sortOrder, setSortOrder] = useState('desc')
  // console.log('imageId:', imageId)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsQuery = query(
          collection(db, 'Comments', imageId, 'Comment'),
          where('imageId', '==', imageId),
          orderBy('timestamp', sortOrder)
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
  }, [imageId, sortOrder])

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === 'desc' ? 'asc' : 'desc'))
  }

  return (
    <div className={classes.commentContainer}>
      <button onClick={toggleSortOrder}>
        Sort Order ({sortOrder === 'desc' ? 'Descending' : 'Ascending'})
      </button>
      <ul>
        {comments.map((comment) => {
          return (
            <li key={comment.id} className={classes.comment}>
              <p>{comment.text}</p>
              <p>{comment.username}</p>
              <p>
                {comment.timestamp
                  ? comment.timestamp.toDate().toLocaleString()
                  : 'No timestamp available'}
              </p>{' '}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Comments
