import type { GanttHeader } from './gantt-header.types'

const ganttHeaders: GanttHeader[] = [
  {
    label: 'Titre',
    field: 'title',
    width: 220,
    isVisible: true,
  },
  {
    label: 'Début',
    field: 'startDate',
    width: 180,
    isVisible: true,
  },
  {
    label: 'Fin',
    field: 'endDate',
    width: 180,
    isVisible: true,
  },
  {
    label: 'Durée',
    field: 'duration',
    width: 180,
    isVisible: true,
  },
  {
    label: 'Progression',
    field: 'progression',
    width: 180,
    isVisible: true,
  },
  {
    label: 'Prédécesseur',
    field: 'predecessor',
    width: 180,
    isVisible: false,
  },
  {
    label: 'Successeur',
    field: 'successor',
    width: 180,
    isVisible: false,
  },
]

export default ganttHeaders
