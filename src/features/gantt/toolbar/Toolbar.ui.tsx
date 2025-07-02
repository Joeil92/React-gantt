import type { Task } from '../../../entities/task/task.types'
import { createTask } from '../../../shared/api/api.service'
import { Button } from '../../../shared/ui/button/Button.ui'
import { ToggleButton } from '../../../shared/ui/toggle-button/Toggle-button.ui'
import type { ViewGantt } from './toolbar.types'

type ToolbarProps = {
  onTasksChange: React.Dispatch<React.SetStateAction<Task[]>>
  viewGantt: ViewGantt
  onViewGanttChange: (view: ViewGantt) => void
}
export function Toolbar({
  onTasksChange,
  viewGantt,
  onViewGanttChange,
}: ToolbarProps) {
  const onCreateTask = () => {
    const task = createTask()
    onTasksChange((tasks) => [...tasks, task])
  }

  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <Button onClick={onCreateTask}>Ajouter une tâche</Button>
      </div>
      <ViewFilters
        viewGantt={viewGantt}
        onViewGanttChange={onViewGanttChange}
      />
    </div>
  )
}

type ViewFiltersProps = {
  viewGantt: ViewGantt
  onViewGanttChange: (view: ViewGantt) => void
}
function ViewFilters({ viewGantt, onViewGanttChange }: ViewFiltersProps) {
  return (
    <div>
      <ToggleButton
        isActive={viewGantt === 'day'}
        onClick={() => onViewGanttChange('day')}
      >
        Jours
      </ToggleButton>
      <ToggleButton
        isActive={viewGantt === 'week'}
        onClick={() => onViewGanttChange('week')}
      >
        Semaine
      </ToggleButton>
      <ToggleButton
        isActive={viewGantt === 'month'}
        onClick={() => onViewGanttChange('month')}
      >
        Mois
      </ToggleButton>
      <ToggleButton
        isActive={viewGantt === 'year'}
        onClick={() => onViewGanttChange('year')}
      >
        Année
      </ToggleButton>
    </div>
  )
}
