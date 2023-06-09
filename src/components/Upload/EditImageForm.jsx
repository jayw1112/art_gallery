import { useState } from 'react'
import classes from './EditImageForm.module.css'

function EditImageForm({
  selectedImage,
  closeModal,
  updateImageMetadata,
  deleteImage,
  fetchImages,
}) {
  const [title, setTitle] = useState(
    selectedImage.metadata.customMetadata.title
  )
  const [description, setDescription] = useState(
    selectedImage.metadata.customMetadata.description
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    await updateImageMetadata(selectedImage, title, description)
    // Handle form submission here (e.g., update the image metadata)
    // console.log(title, description)
    closeModal()
    fetchImages()
  }

  const handleDelete = async () => {
    // Handle image deletion here
    await deleteImage(selectedImage)
    closeModal()
    fetchImages()
  }

  const handleEdit = (e) => {
    if (e.target.name === 'title') {
      setTitle(e.target.value)
    } else if (e.target.name === 'description') {
      setDescription(e.target.value)
    }
  }

  // Check if the current user is the owner of the image
  // const isOwner =
  //   currentUser.uid === selectedImage.metadata.customMetadata.owner

  return (
    <div className={classes.formContainer}>
      <form onSubmit={handleSubmit}>
        <h2>Edit Image</h2>
        <div className='labelContainer'>
          <label htmlFor='title'>
            Title:
            <input
              type='text'
              name='title'
              id='title'
              value={title}
              onChange={handleEdit}
            />
          </label>
          <label htmlFor='description'>
            Description:
            <input
              type='text'
              name='description'
              id='description'
              value={description}
              onChange={handleEdit}
            />
          </label>
        </div>
        <div className={classes.buttons}>
          <button type='submit'>Save</button>
          <button type='button' onClick={handleDelete}>
            Delete
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditImageForm
