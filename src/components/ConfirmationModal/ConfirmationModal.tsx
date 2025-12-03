import Modal from 'react-modal'
import { ConfirmationModalProps } from '../../models/ConfirmationModalProps'
import styles from './ConfirmationModal.module.scss'

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      contentLabel="Confirmation Modal"
      className={styles.confirmationModal}
      overlayClassName={styles.confirmationModalOverlay}
      ariaHideApp={false}
    >
      <div className={styles.confirmationModalContent}>
        <h2 className={styles.confirmationModalTitle}>{title}</h2>
        <p className={styles.confirmationModalMessage}>{message}</p>
        <div className={styles.confirmationModalButtons}>
          <button
            className={`${styles.confirmationModalButton} ${styles.confirmationModalButtonCancel}`}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`${styles.confirmationModalButton} ${styles.confirmationModalButtonConfirm}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
