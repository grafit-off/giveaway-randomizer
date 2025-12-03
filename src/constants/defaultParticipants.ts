import { Participant } from '../models/Participant'
import { generateRandomColor } from '../functions/generateRandomColor'

const DEFAULT_PARTICIPANT_NAMES = [
  'grafit_off',
  'change',
  'abema',
  'psrage',
  'qden',
  'Aqueazy',
  'mymovoli',
  'Lindtt',
  'ADKJ',
  'МОРОЗ',
  'Andrij Sadowy',
  'Alya',
  'НАЗАРЧИК',
  'L1pTon3',
  'honey_billy',
  'intense',
  'Orion',
  'Bulochka',
  'bebrik',
]

export const getDefaultParticipants = (): Participant[] => {
  return DEFAULT_PARTICIPANT_NAMES.map((name, index) => ({
    id: `default-${index}-${Date.now()}`,
    name,
    color: generateRandomColor()
  }))
}

