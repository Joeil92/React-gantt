import { v4 as uuidv4 } from 'uuid'

const tasks = [
  {
    id: uuidv4(),
    title: 'Task 1',
    startDate: '2023-01-01',
    endDate: '2023-01-05',
    color: '#00ff00',
    progression: 0.5,
  },
]

export default tasks
