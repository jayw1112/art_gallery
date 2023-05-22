import { useParams } from 'react-router-dom'
import { useContext, useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import classes from './AddComment.module.css'
import { AuthContext } from '../../source/auth-context'

function AddComment({ setIsCommentsLoading }) {
  // { onCommentAdded }
  const { imageId } = useParams()
  const { currentUser } = useContext(AuthContext)
  const [comment, setComment] = useState('')

  // console.log('imageId:', imageId)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsCommentsLoading(true)
    if (!imageId) {
      console.error('imageId is undefined')
      return
    }

    if (comment.trim() === '') return
    // Add comment to firestore
    const commentRef = collection(db, 'Comments', imageId, 'Comment')
    await addDoc(commentRef, {
      text: comment,
      username: currentUser.displayName,
      imageId: imageId,
      timestamp: serverTimestamp(),
      userId: currentUser.uid,
      commentId: currentUser.uid + Date.now(),
    })

    setComment('')
    // onCommentAdded()
    setIsCommentsLoading(false)
    console.log('Comment added successfully')

    try {
    } catch (error) {
      console.error('Error adding comment: ', error)
    }
  }

  return (
    <div className={classes.newCommentBox}>
      {/* <h4>Add Comment</h4> */}
      <form name='add-comment-form' onSubmit={handleSubmit}>
        <input
          id='add-comment'
          type='text'
          placeholder='Add a comment...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={100}
        />
        <button type='submit'>Post</button>
      </form>
    </div>
  )
}

export default AddComment
