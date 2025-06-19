import { v4 as uuidv4 } from 'uuid'
import type { Task } from './task.types'

const tasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Task 1',
    startDate: '2023-01-01',
    endDate: '2023-01-05',
    color: '#00ff00',
    progression: 0,
  },
]

export default tasks
