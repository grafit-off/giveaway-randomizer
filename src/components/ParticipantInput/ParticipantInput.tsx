import { useState, FormEvent } from 'react'
import { ParticipantInputProps } from '../../models/ParticipantInputProps'
import styles from './ParticipantInput.module.scss'

export const ParticipantInput: React.FC<ParticipantInputProps> = ({
  onAddParticipant,
  disabled
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedName = inputValue.trim()
    if (trimmedName && !disabled) {
      onAddParticipant(trimmedName)
      setInputValue('')
    }
  }

  return (
    <form className={styles.participantInput} onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter participant name..."
        disabled={disabled}
        className={styles.participantInputField}
      />
      <button
        type="submit"
        disabled={disabled || !inputValue.trim()}
        className={styles.participantInputButton}
      >
        Add
      </button>
    </form>
  )
}
