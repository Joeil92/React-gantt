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
import { useState } from 'react'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { NewHeaderGantt } from '../../features/gantt/new-header-gantt/New-header-gantt'

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
  )
}
