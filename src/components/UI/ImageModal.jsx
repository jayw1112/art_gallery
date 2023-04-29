import React from 'react'
import classes from './ImageModal.module.css'
import EditImageForm from '../Upload/EditImageForm'

function ImageModal({
  isModalOpen,
  closeModal,
  selectedImage,
  updateImageMetadata,
  deleteImage,
  fetchImages,
}) {
  if (!isModalOpen) return null

  const handleModalClick = (e) => {
    e.stopPropagation()
  }

  return (
    <div className={classes.backdrop} onClick={closeModal}>
      <div className={classes.modal} onClick={handleModalClick}>
        <button className={classes.close} onClick={closeModal}>
          X
        </button>
        <EditImageForm
          selectedImage={selectedImage}
          closeModal={closeModal}
          updateImageMetadata={updateImageMetadata}
          deleteImage={deleteImage}
          fetchImages={fetchImages}
        />
      </div>
    </div>
  )
}

export default ImageModal
