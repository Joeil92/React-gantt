import type { GanttHeader } from './gantt-header.types'

const ganttHeaders: GanttHeader[] = [
  {
    label: 'Titre',
    field: 'title',
    width: 220,
    isVisible: true,
    isEditable: true,
  },
  {
    label: 'Début',
    field: 'startDate',
    width: 180,
    isVisible: true,
    isEditable: true,
  },
  {
    label: 'Fin',
    field: 'endDate',
    width: 180,
    isVisible: true,
    isEditable: true,
  },
  {
    label: 'Durée',
    field: 'duration',
    width: 180,
    isVisible: true,
    isEditable: true,
  },
  {
    label: 'Progression',
    field: 'progress',
    width: 180,
    isVisible: true,
    isEditable: true,
  },
  {
    label: 'Prédécesseur',
    field: 'predecessor',
    width: 180,
    isVisible: false,
    isEditable: true,
  },
  {
    label: 'Successeur',
    field: 'successor',
    width: 180,
    isVisible: false,
    isEditable: true,
  },
]

export default ganttHeaders
