import { useState } from 'react'
import classes from './UploadForm.module.css'
import Spinner from '../UI/Spinner'
import { storage, storageRef, ref, uploadBytes } from '../../firebase'

function UploadForm() {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)
  const [imageURL, setImageURL] = useState(null)
  const [loading, setLoading] = useState(false)
  //   const [progress, setProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [successTimeout, setSuccessTimeout] = useState(null)

  const handleFileButtonClick = (e) => {
    e.preventDefault()
    const fileInput = document.getElementById('file')
    fileInput.click()
  }

  const handleFileChange = (e) => {
    const image = e.target.files[0]

    if (success) {
      setSuccess(false)
      clearTimeout(successTimeout)
    }

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
        if (!error) {
          const reader = new FileReader()
          setLoading(true)
          reader.onloadend = () => {
            setImageURL(reader.result)
            setLoading(false)
          }
          reader.readAsDataURL(image)
        } else {
          setImageURL(null)
        }
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

  const handleSubmit = (e) => {
    function generateUniqueId(length = 6) {
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''

      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        )
      }

      return result
    }

    const metadata = {
      name: file.name,
      contentType: file.type,
      timeCreated: new Date().toString(),
      customMetadata: {
        title: title,
        description: description,
        // userID eventually
      },
    }

    e.preventDefault()
    if (file && title && description) {
      const imageRef = ref(storageRef, generateUniqueId() + '-' + title)

      uploadBytes(imageRef, file, metadata).then((snapshot) => {
        console.log('Uploaded Image!')
        // const progress = Math.round(
        //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // )
        // setProgress(progress)

        if (successTimeout) clearTimeout(successTimeout)
        setSuccess(true)
        const newTimeout = setTimeout(() => {
          setSuccess(false)
        }, 5000) // Time limit in milliseconds, adjust to your preference
        setSuccessTimeout(newTimeout)

        setImageURL(null)
        setSuccess(true)
        // setProgress(0)
        setFile(null)
        setTitle('')
        setDescription('')
      })
    } else {
      setError('Please fill out all fields.')
    }
  }

  //     } else {
  //       setError('Please fill out all fields.')
  //     }
  //   }

  return (
    <div className={imageURL ? classes.containerWithImage : classes.container}>
      <form
        className={classes.uploadForm}
        onSubmit={handleSubmit}
        action=''
        method='post'
      >
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
        {success && (
          <div className={classes.successMessage}>
            Image uploaded successfully!
          </div>
        )}
      </form>
      {imageURL && (
        <div className={classes.imageContainer}>
          {loading && <Spinner />}
          <img
            src={imageURL}
            alt='Image Preview'
            className={classes.imagePreview}
          />
        </div>
      )}
      {/* {progress > 0 && (
        <div className={classes.progressContainer}>
          <progress value={progress} max='100' />
          <span>{progress}%</span>
        </div>
      )} */}
    </div>
  )
}

export default UploadForm
