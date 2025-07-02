import { v4 as uuidv4 } from 'uuid'
import tasks from '../../entities/task/task.api'
import ganttHeaders from '../../entities/gantt-header/gantt-header.api'
import type { Task } from '../../entities/task/task.types'

export function createTask(): Task {
  const uuid = uuidv4()

  return {
    id: uuid,
    title: 'Nouvelle tâche',
    startDate: new Date(),
    endDate: new Date(),
    progression: 0,
    color: '#000000',
  }
}

export function getTasks() {
  return {
    data: tasks,
  }
}

export function getGanttHeaders() {
  return {
    data: ganttHeaders,
  }
}

export function updateGanttHeaderVisibility(field: string, isVisible: boolean) {
  const header = ganttHeaders.find((header) => header.field === field)
  if (!header) return { data: [] }

  header.isVisible = isVisible

  return { data: ganttHeaders }
}
