import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '../../firebase'
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  doc,
  getDoc,
} from 'firebase/firestore'
import classes from './Comments.module.css'
import { AuthContext } from '../../source/auth-context'
import person from '../../assets/person.svg'

function Comments({ setIsCommentsLoading }) {
  // { refreshKey }
  const { imageId } = useParams()
  const { currentUser } = useContext(AuthContext)
  const [comments, setComments] = useState([])
  const [sortOrder, setSortOrder] = useState('desc')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editedComment, setEditedComment] = useState('')
  // const [commentsRefreshKey, setCommentsRefreshKey] = useState(0)
  // console.log('imageId:', imageId)

  useEffect(() => {
    setIsCommentsLoading(true)
    const fetchComments = async () => {
      try {
        const commentsQuery = query(
          collection(db, 'Comments', imageId, 'Comment'),
          where('imageId', '==', imageId),
          orderBy('timestamp', sortOrder)
        )

        const unsubscribe = onSnapshot(commentsQuery, async (querySnapshot) => {
          const fetchedComments = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const commentData = doc.data()
              const profilePicUrl = await fetchUserProfilePic(
                commentData.userId
              )
              return { ...commentData, id: doc.id, profilePicUrl }
            })
          )
          setComments(fetchedComments)
          setIsCommentsLoading(false)
        })
        // return () => unsubscribe()
        return unsubscribe
      } catch (error) {
        console.log('Error fetching comments:', error)
      }
    }

    fetchComments()
  }, [imageId, sortOrder])
  // ,refreshKey

  // const toggleSortOrder = () => {
  //   setSortOrder((prevSortOrder) => (prevSortOrder === 'desc' ? 'asc' : 'desc'))
  //   setCommentsRefreshKey((prevKey) => prevKey + 1)
  // }

  const deleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const commentRef = doc(db, 'Comments', imageId, 'Comment', commentId)
        await deleteDoc(commentRef)
        // setCommentsRefreshKey((prevKey) => prevKey + 1)
        console.log('Deleting comment...')
      } catch (error) {
        console.error('Error deleting comment: ', error)
      }
    }
  }

  const toggleEditComment = (commentId, commentText) => {
    setEditingCommentId(commentId)
    setEditedComment(commentText)
  }

  const saveEditedComment = async (commentId) => {
    if (editedComment.trim() === '') return

    try {
      const commentRef = doc(db, 'Comments', imageId, 'Comment', commentId)
      await updateDoc(commentRef, {
        text: editedComment,
        editedTimestamp: serverTimestamp(),
        username: currentUser.displayName,
      })
      setEditingCommentId(null)
      setEditedComment('')
      // setCommentsRefreshKey((prevKey) => prevKey + 1)
    } catch (error) {
      console.error('Error updating comment: ', error)
    }
  }

  const handleEditSubmit = (e, commentId) => {
    e.preventDefault()
    saveEditedComment(commentId)
  }

  const fetchUserProfilePic = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      return userDoc.data().photoURL || person || ''
    } catch (error) {
      console.error('Error fetching user profile picture: ', error)
      return ''
    }
  }

  // refresh comments whehn a comment is added or deleted
  // useEffect(() => {
  //   setCommentsRefreshKey((prevKey) => prevKey + 1)
  // }, [comments])

  return (
    <div className={classes.commentContainer}>
      {/* <button onClick={toggleSortOrder}>
        Sort Order ({sortOrder === 'desc' ? 'Descending' : 'Ascending'})
      </button> */}
      <ul>
        {comments.map((comment) => {
          return (
            <li key={comment.id} className={classes.comment}>
              <div className={classes.commentContent}>
                <img
                  src={comment.profilePicUrl}
                  alt={`${comment.username}'s Profile Pic`}
                  className={classes.commentProfilePic}
                />
                <p className={classes.text}>{comment.text}</p>

                <p className={classes.name}>
                  <Link to={`/profile/${comment.userId}`}>
                    {comment.username}
                  </Link>
                </p>
              </div>
              <small className={classes.date}>
                {comment.editedTimestamp
                  ? `Edited at: ${comment.editedTimestamp
                      .toDate()
                      .toLocaleString()}`
                  : comment.timestamp
                  ? `Created at: ${comment.timestamp.toDate().toLocaleString()}`
                  : 'No timestamp available'}
              </small>
              {currentUser && currentUser.uid === comment.userId && (
                <>
                  {editingCommentId === comment.id ? (
                    <>
                      <form onSubmit={(e) => handleEditSubmit(e, comment.id)}>
                        <input
                          type='text'
                          value={editedComment}
                          onChange={(e) => setEditedComment(e.target.value)}
                          maxLength={100}
                        />
                        <button onClick={() => saveEditedComment(comment.id)}>
                          Save
                        </button>
                        <button onClick={() => setEditingCommentId(null)}>
                          Cancel
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className={classes.buttonContainer}>
                      <button
                        onClick={() =>
                          toggleEditComment(comment.id, comment.text)
                        }
                      >
                        Edit
                      </button>
                      <button onClick={() => deleteComment(comment.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Comments
