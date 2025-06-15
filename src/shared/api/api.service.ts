import { taskDtoSchema } from './api.contracts'
import type { TaskDto } from './api.types'
import { v4 as uuidv4 } from 'uuid'
import tasks from '../../entities/task/task.api'

export function createTask(taskDto: TaskDto) {
  const uuid = uuidv4()
  const data = taskDtoSchema.parse(taskDto)
  tasks.push({
    id: uuid,
    ...data,
  })

  return {
    id: uuid,
    ...data,
  }
}

export function getTasks() {
  return tasks
}
