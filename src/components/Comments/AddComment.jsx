import { useParams } from 'react-router-dom'
import { useContext, useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import classes from './AddComment.module.css'
import { AuthContext } from '../../source/auth-context'

function AddComment() {
  const { imageId } = useParams()
  const { currentUser } = useContext(AuthContext)
  const [comment, setComment] = useState('')

  console.log('imageId:', imageId)

  const handleSubmit = async (e) => {
    e.preventDefault()

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
    console.log('Comment added successfully')

    try {
    } catch (error) {
      console.error('Error adding comment: ', error)
    }
  }

  return (
    <div className={classes.newCommentBox}>
      <h3>Add Comment</h3>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Add a comment...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type='submit'>Post</button>
      </form>
    </div>
  )
}

export default AddComment
