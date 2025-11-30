import Modal from 'react-modal'
import './ErrorModal.css'

interface ErrorModalProps {
  isOpen: boolean
  message: string
  onClose: () => void
}

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
      className="error-modal"
      overlayClassName="error-modal-overlay"
      ariaHideApp={false}
    >
      <div className="error-modal-content">
        <h2 className="error-modal-title">⚠️ Error</h2>
        <p className="error-modal-message">{message}</p>
        <button
          className="error-modal-button"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </Modal>
  )
}

