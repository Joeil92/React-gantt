import type { Task } from '../../../entities/task/task.types'
import { createTask } from '../../../shared/api/api.service'
import { Button } from '../../../shared/ui/button/Button.ui'

type ToolbarProps = {
  onTasksChange: React.Dispatch<React.SetStateAction<Task[]>>
}
export function Toolbar({ onTasksChange }: ToolbarProps) {
  const onCreateTask = () => {
    const task = createTask()
    onTasksChange((tasks) => [...tasks, task])
  }

  return (
    <div className="mb-4">
      <Button onClick={onCreateTask}>Ajouter une tâche</Button>
    </div>
  )
}
