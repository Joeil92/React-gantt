import {
  DndContext,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import type { GanttHeader } from '../../entities/gantt-header/gantt-header.types'
import { type Task } from '../../entities/task/task.types'
import { HeaderGantt } from '../../features/gantt/header-gantt/Header-gantt.ui'
import { Typography } from '../../shared/ui/typography/Typography.ui'
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable'
import { useCallback, useState } from 'react'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { NewHeaderGantt } from '../../features/gantt/new-header-gantt/New-header-gantt'
import { TaskCell } from '../../features/gantt/task-cell/Task-cell.ui'

type GanttChartProps = {
  tasks: Task[]
  headers: GanttHeader[]
}

export function GanttChart(props: GanttChartProps) {
  return <BaseGanttChart {...props} />
}

function BaseGanttChart(props: GanttChartProps) {
  return (
    <div>
      <Typography tag={'h5'} className="mb-8">
        Planning
      </Typography>
      <TableGanttChart tasks={props.tasks} headers={props.headers} />
    </div>
  )
}

function TableGanttChart(props: GanttChartProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [tasks, setTasks] = useState(props.tasks)
  const [headers, setHeaders] = useState(props.headers)
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setHeaders((headers) => {
        const oldIndex = headers.findIndex(
          (header) => header.field === active.id
        )
        const newIndex = headers.findIndex((header) => header.field === over.id)

        return arrayMove(headers, oldIndex, newIndex)
      })
    }
  }

  return (
    <div>
      {/* Headers */}
      <div className="flex items-center">
        <DndContext
          sensors={sensors}
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={headers.map((header) => header.field)}
            strategy={horizontalListSortingStrategy}
            disabled={isResizing}
          >
            {headers.map((header) =>
              header.isVisible ? (
                <HeaderGantt
                  key={header.field}
                  header={header}
                  headers={headers}
                  isResizing={isResizing}
                  onResizingChange={setIsResizing}
                  onHeadersChange={setHeaders}
                />
              ) : null
            )}
          </SortableContext>
          <NewHeaderGantt headers={headers} onHeadersChange={setHeaders} />
        </DndContext>
      </div>
      {/* Tasks */}
      <div>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            headers={headers.filter((h) => h.isVisible)}
            task={task}
            tasks={tasks}
            onTasksChange={setTasks}
          />
        ))}
      </div>
    </div>
  )
}

type TaskRowProps = {
  headers: GanttHeader[]
  task: Task
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
}
function TaskRow({ task, headers, tasks, onTasksChange }: TaskRowProps) {
  const handleTasksChange = useCallback(
    (field: keyof Task, value: unknown) => {
      const updatedTasks = tasks.map((t) => {
        if (t.id === task.id) {
          return { ...t, [field]: value }
        }
        return t
      })
      onTasksChange(updatedTasks)
    },
    [onTasksChange, tasks, task.id]
  )

  return (
    <div className="border-grey-100 flex items-stretch">
      {headers.map((header) => {
        const { width, field } = header

        return (
          <TaskCell
            key={`${task.id}-${header.field}`}
            task={task}
            displayValue={task[field as keyof Task]}
            width={width}
            fieldName={field}
            onTasksChange={handleTasksChange}
          />
        )
      })}
      <div className="border-grey-100 w-[250px] border-e border-b p-4"></div>
    </div>
  )
}
