import { useState, FormEvent } from 'react'
import './ParticipantInput.css'

interface ParticipantInputProps {
  onAddParticipant: (name: string) => void
  disabled: boolean
}

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
    <form className="participant-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter participant name..."
        disabled={disabled}
        className="participant-input-field"
      />
      <button
        type="submit"
        disabled={disabled || !inputValue.trim()}
        className="participant-input-button"
      >
        Add
      </button>
    </form>
  )
}

