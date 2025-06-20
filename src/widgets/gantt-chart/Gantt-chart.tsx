import {
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
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
  const [headers, setHeaders] = useState(props.headers)
  const [activeHeader, setActiveHeader] = useState<UniqueIdentifier>()
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveHeader(active.id)
  }

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

    setActiveHeader(undefined)
  }

  return (
    <div className="flex items-center justify-between">
      <DndContext
        sensors={sensors}
        modifiers={[restrictToHorizontalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={headers.map((header) => header.field)}
          strategy={horizontalListSortingStrategy}
        >
          {headers.map((header) =>
            header.isVisible ? (
              <HeaderGantt key={header.field} header={header} />
            ) : null
          )}
        </SortableContext>
        <NewHeaderGantt headers={headers} onHeadersChange={setHeaders} />
        <DragOverlay>
          {activeHeader ? (
            <HeaderGantt
              header={headers.find((header) => header.field === activeHeader)!}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
