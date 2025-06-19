import type { GanttHeader } from './gantt-header.types'
import { v4 as uuidv4 } from 'uuid'

const ganttHeaders: GanttHeader[] = [
  {
    id: uuidv4(),
    label: 'Titre',
    type: 'string',
    isVisible: true,
    isEditable: true,
  },
  {
    id: uuidv4(),
    label: 'Début',
    type: 'date',
    isVisible: true,
    isEditable: true,
  },
  {
    id: uuidv4(),
    label: 'Fin',
    type: 'date',
    isVisible: true,
    isEditable: true,
  },
  {
    id: uuidv4(),
    label: 'Durée',
    type: 'number',
    isVisible: true,
    isEditable: true,
  },
  {
    id: uuidv4(),
    label: 'Progression',
    type: 'number',
    isVisible: true,
    isEditable: true,
  },
]

export default { data: ganttHeaders }
