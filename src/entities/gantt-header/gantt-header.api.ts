import type { GanttHeader } from './gantt-header.types'

const ganttHeaders: GanttHeader[] = [
  {
    label: 'Titre',
    field: 'title',
    type: 'string',
    isVisible: true,
    isEditable: true,
  },
  {
    label: 'Début',
    field: 'startDate',
    type: 'date',
    isVisible: true,
    isEditable: true,
  },
  {
    label: 'Fin',
    field: 'endDate',
    type: 'date',
    isVisible: true,
    isEditable: true,
  },
  {
    label: 'Durée',
    field: 'duration',
    type: 'number',
    isVisible: true,
    isEditable: true,
  },
  {
    label: 'Progression',
    field: 'progress',
    type: 'number',
    isVisible: true,
    isEditable: true,
  },
  {
    label: 'Prédécesseur',
    field: 'predecessor',
    type: 'string',
    isVisible: false,
    isEditable: true,
  },
  {
    label: 'Successeur',
    field: 'successor',
    type: 'string',
    isVisible: false,
    isEditable: true,
  },
]

export default ganttHeaders
