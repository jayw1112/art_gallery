import { useState } from 'react'
import classes from './UploadForm.module.css'

function UploadForm() {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)
  const [imageURL, setImageURL] = useState(null)

  const handleFileButtonClick = (e) => {
    e.preventDefault()
    const fileInput = document.getElementById('file')
    fileInput.click()
  }

  const handleFileChange = (e) => {
    const image = e.target.files[0]

    if (image) {
      const fileType = image.type
      const fileSize = image.size
      const allowedTypes = ['image/jpeg', 'image/png']

      if (!allowedTypes.includes(fileType)) {
        setError('Please upload a JPEG or PNG image.')
        setFile(null)
      } else if (fileSize > 2 * 1024 * 1024) {
        setError('Please upload an image 2MB or less.')
        setFile(null)
      } else {
        setError(null)
        setFile(image)
      }

      if (!error) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImageURL(reader.result)
        }
        reader.readAsDataURL(image)
      } else {
        setImageURL(null)
      }
    }
  }

  const handleTitleChange = (e) => {
    const imageTitle = e.target.value
    setTitle(imageTitle)
  }

  const handleDescriptionChange = (e) => {
    const imageDescription = e.target.value
    setDescription(imageDescription)
  }

  return (
    <div className={imageURL ? classes.containerWithImage : classes.container}>
      <form className={classes.uploadForm} action='' method='post'>
        <h2>Upload Your Image</h2>

        <input
          type='file'
          name='file'
          id='file'
          className={classes.file}
          onChange={handleFileChange}
        />
        {error && <p className={classes.errorMessage}>{error}</p>}
        <button
          className={classes.customFileButton}
          onClick={handleFileButtonClick}
        >
          Choose Image
        </button>
        <input
          type='text'
          name='title'
          id='title'
          placeholder='Title'
          value={title}
          onChange={handleTitleChange}
        />
        {/* <input type='text' name='tags' id='tags' placeholder='Tags' /> */}
        <input
          type='text'
          name='description'
          id='description'
          placeholder='Description'
          value={description}
          onChange={handleDescriptionChange}
        />
        <button type='submit'>Upload</button>
      </form>
      {imageURL && (
        <div className={classes.imageContainer}>
          <img
            src={imageURL}
            alt='Image Preview'
            className={classes.imagePreview}
          />
        </div>
      )}
    </div>
  )
}

export default UploadForm
