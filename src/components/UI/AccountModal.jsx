import React from 'react'
import classes from '../UI/ImageModal.module.css'
import EditAccountForm from '../Login/EditAccountForm'

function AccountModal({ isModalOpen, closeModal }) {
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
        <EditAccountForm closeModal={closeModal} />
      </div>
    </div>
  )
}

export default AccountModal
