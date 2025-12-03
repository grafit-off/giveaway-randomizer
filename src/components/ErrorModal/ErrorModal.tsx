import Modal from 'react-modal'
import { ErrorModalProps } from '../../models/ErrorModalProps'
import styles from './ErrorModal.module.scss'

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  message,
  onClose
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Error Modal"
      className={styles.errorModal}
      overlayClassName={styles.errorModalOverlay}
      ariaHideApp={false}
    >
      <div className={styles.errorModalContent}>
        <h2 className={styles.errorModalTitle}>⚠️ Error</h2>
        <p className={styles.errorModalMessage}>{message}</p>
        <button
          className={styles.errorModalButton}
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </Modal>
  )
}
