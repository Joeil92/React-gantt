import type { GanttHeader } from './gantt-header.types'

const ganttHeaders: GanttHeader[] = [
  {
    label: 'Titre',
    field: 'title',
    type: 'string',
    width: 220,
    isVisible: true,
    isEditable: true,
  },
  {
    label: 'Début',
    field: 'startDate',
    type: 'date',
    width: 180,
    isVisible: true,
    isEditable: true,
  },
  {
    label: 'Fin',
    field: 'endDate',
    type: 'date',
    width: 180,
    isVisible: true,
    isEditable: true,
  },
  {
    label: 'Durée',
    field: 'duration',
    type: 'number',
    width: 180,
    isVisible: true,
    isEditable: true,
  },
  {
    label: 'Progression',
    field: 'progress',
    type: 'number',
    width: 180,
    isVisible: true,
    isEditable: true,
  },
  {
    label: 'Prédécesseur',
    field: 'predecessor',
    type: 'string',
    width: 180,
    isVisible: false,
    isEditable: true,
  },
  {
    label: 'Successeur',
    field: 'successor',
    type: 'string',
    width: 180,
    isVisible: false,
    isEditable: true,
  },
]

export default ganttHeaders
