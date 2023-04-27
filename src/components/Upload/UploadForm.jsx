import React from 'react'
import classes from './UploadForm.module.css'

function UploadForm() {
  const handleFileButtonClick = (e) => {
    e.preventDefault()
    const fileInput = document.getElementById('file')
    fileInput.click()
  }

  return (
    <div className={classes.container}>
      <h2>Upload Your Image</h2>
      {/* <p>File should be Jpeg, Png,...</p> */}
      <form className={classes.uploadForm} action='' method='post'>
        <input type='file' name='file' id='file' className={classes.file} />
        <button
          className={classes.customFileButton}
          onClick={handleFileButtonClick}
        >
          Choose Image
        </button>
        <input type='text' name='title' id='title' placeholder='Title' />
        <input type='text' name='tags' id='tags' placeholder='Tags' />
        <input
          type='text'
          name='description'
          id='description'
          placeholder='Description'
        />
        <button type='submit'>Upload</button>
      </form>
    </div>
  )
}

export default UploadForm
