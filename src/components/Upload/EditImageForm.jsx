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
    console.log(title, description)
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

  return (
    <div className={classes.formContainer}>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='title'
          id='title'
          value={title}
          onChange={handleEdit}
        />
        <input
          type='text'
          name='description'
          id='description'
          value={description}
          onChange={handleEdit}
        />
        <button type='submit'>Save</button>
        <button type='button' onClick={handleDelete}>
          Delete
        </button>
      </form>
    </div>
  )
}

export default EditImageForm
