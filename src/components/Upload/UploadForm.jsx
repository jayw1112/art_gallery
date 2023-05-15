import { useState, useContext } from 'react'
import classes from './UploadForm.module.css'
import Spinner from '../UI/Spinner'
import { storage, storageRef, ref, uploadBytes, db } from '../../firebase'
import { getUserStorageRef } from '../../utility/firebase.utils'
import { AuthContext } from '../../source/auth-context'
import { updateFollowersFeeds } from '../../utility/firebase.utils'
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'

function UploadForm() {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)
  const [imageURL, setImageURL] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [successTimeout, setSuccessTimeout] = useState(null)
  const [progressTimeout, setProgressTimeout] = useState(null)

  const { currentUser } = useContext(AuthContext)

  const uid = currentUser ? currentUser.uid : null

  const storeImageMetadata = async (imageId, metadata, downloadURL) => {
    const metadataRef = doc(db, 'ImageMetaData', imageId)
    await setDoc(metadataRef, {
      ...metadata,
      url: downloadURL, // store the URL in Firestore
    })

    // Create a document in the 'users' collection
    const userDocRef = doc(db, 'users', currentUser.uid) // Replace 'currentUser.uid' with the appropriate user ID
    await setDoc(
      userDocRef,
      {
        // Add any fields you want to store for the user document
        uid: currentUser.uid, // Replace 'currentUser.uid' with the appropriate user ID
        displayName: currentUser.displayName,
        // photoURL: currentUser.photoURL,
        email: currentUser.email,
      },
      { merge: true }
    ) // Use the 'merge' option to avoid overwriting existing data
  }

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
      } else if (fileSize > 3 * 1024 * 1024) {
        setError('Please upload an image 3MB or less.')
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
    } else {
      setError('Failed to upload image. Please try again.')
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

  // const handleSubmit = (e) => {
  //   function generateUniqueId(length = 6) {
  //     const characters =
  //       'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  //     let result = ''

  //     for (let i = 0; i < length; i++) {
  //       result += characters.charAt(
  //         Math.floor(Math.random() * characters.length)
  //       )
  //     }

  //     return result
  //   }

  //   const metadata = {
  //     name: file.name,
  //     contentType: file.type,
  //     timeCreated: new Date().toString(),
  //     customMetadata: {
  //       title: title,
  //       description: description,
  //       owner: currentUser.uid, // the user ID of the uploader
  //       // url: imageURL,
  //     },
  //   }

  //   e.preventDefault()
  //   if (file && title && description) {
  //     const userStorageRef = getUserStorageRef(storage, uid)
  //     console.log('userStorageRef:', userStorageRef) // Debugging line
  //     console.log('uid:', uid) // Debugging line
  //     const imageRef = ref(userStorageRef, `${generateUniqueId()}-${title}`)

  //     uploadBytes(imageRef, file, metadata).then(async (snapshot) => {
  //       console.log('Uploaded Image!')
  //       // const progress = Math.round(
  //       //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //       // )
  //       // setProgress(progress)

  //       const imageId = imageRef.fullPath
  //       // const downloadURL = await getDownloadURL(snapshot.ref)
  //       // await updateFollowersFeeds(
  //       //   db,
  //       //   currentUser.uid,
  //       //   imageId,
  //       //   metadata,
  //       //   downloadURL
  //       // )

  //       const downloadURL = await getDownloadURL(snapshot.ref)
  //       await storeImageMetadata(
  //         imageId,
  //         {
  //           title: metadata.customMetadata.title,
  //           description: metadata.customMetadata.description,
  //           path: imageRef.fullPath,
  //           owner: metadata.customMetadata.owner,
  //           timeCreated: metadata.timeCreated,
  //         },
  //         downloadURL
  //       )
  //       await updateFollowersFeeds(
  //         db,
  //         currentUser.uid,
  //         imageId,
  //         metadata,
  //         downloadURL
  //       )

  //       if (successTimeout) clearTimeout(successTimeout)
  //       setSuccess(true)
  //       const newTimeout = setTimeout(() => {
  //         setSuccess(false)
  //       }, 5000) // Time limit in milliseconds, adjust to your preference
  //       setSuccessTimeout(newTimeout)

  //       setImageURL(null)
  //       setSuccess(true)
  //       // setProgress(0)
  //       setFile(null)
  //       setTitle('')
  //       setDescription('')
  //       setError(null)
  //     })
  //   } else {
  //     setError('Please fill out all fields.')
  //   }
  // }

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
        owner: currentUser.uid, // the user ID of the uploader
        // url: imageURL,
      },
    }

    e.preventDefault()
    if (file && title && description) {
      const userStorageRef = getUserStorageRef(storage, uid)
      const imageRef = ref(userStorageRef, `${generateUniqueId()}-${title}`)

      // Create the upload task
      const uploadTask = uploadBytesResumable(imageRef, file, metadata)

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          )
          console.log('Upload is ' + progress + '% done')
          // Progress state here
          setProgress(progress)

          if (progress === 100) {
            if (progressTimeout) clearTimeout(progressTimeout)
            const newProgressTimeout = setTimeout(() => {
              setProgress(0)
            }, 10000) // 10 seconds
            setProgressTimeout(newProgressTimeout)
          }
        },
        (error) => {
          console.log('Error occurred during upload: ', error)
          setError('An error occurred during upload. Please try again.')
        },
        async () => {
          // Upload completed successfully, now we can get the download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          console.log('File available at', downloadURL)

          const imageId = imageRef.fullPath
          await storeImageMetadata(
            imageId,
            {
              title: metadata.customMetadata.title,
              description: metadata.customMetadata.description,
              path: imageRef.fullPath,
              owner: metadata.customMetadata.owner,
              timeCreated: metadata.timeCreated,
            },
            downloadURL
          )
          await updateFollowersFeeds(
            db,
            currentUser.uid,
            imageId,
            metadata,
            downloadURL
          )

          if (successTimeout) clearTimeout(successTimeout)
          setSuccess(true)
          const newTimeout = setTimeout(() => {
            setSuccess(false)
          }, 10000)
          setSuccessTimeout(newTimeout)

          setImageURL(null)
          setSuccess(true)
          setFile(null)
          setTitle('')
          setDescription('')
          setError(null)
        }
      )
    } else {
      setError('Please fill out all fields.')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.type !== 'textarea') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className={imageURL ? classes.containerWithImage : classes.container}>
      <form
        className={classes.uploadForm}
        onSubmit={handleSubmit}
        action=''
        method='post'
        onKeyDown={handleKeyPress}
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
        {progress > 0 && (
          <div className={classes.progressContainer}>
            <progress value={progress} max='100' />
            <span> {progress}%</span>
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
    </div>
  )
}

export default UploadForm
