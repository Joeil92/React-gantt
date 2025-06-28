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
import { useCallback, useMemo, useState } from 'react'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { NewHeaderGantt } from '../../features/gantt/new-header-gantt/New-header-gantt'
import { TaskCell } from '../../features/gantt/task-cell/Task-cell.ui'
import { Toolbar } from '../../features/gantt/toolbar/Toolbar.ui'
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizablePanelHandle,
} from '../../shared/ui/resizable-panel/Resizable-panel.ui'
import type { ViewGantt } from '../../features/gantt/toolbar/toolbar.types'
import {
  addMonths,
  addWeeks,
  addYears,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  formatDate,
  isToday,
  isWeekend,
  max,
  min,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns'
import clsx from 'clsx'

type GanttChartProps = {
  tasks: Task[]
  headers: GanttHeader[]
}

export function GanttChart(props: GanttChartProps) {
  return <BaseGanttChart {...props} />
}

function BaseGanttChart(props: GanttChartProps) {
  const [tasks, setTasks] = useState(props.tasks)
  const [headers, setHeaders] = useState(props.headers)
  const [viewGantt, setViewGantt] = useState<ViewGantt>('day')

  const headerSize = useMemo(() => {
    let height = 60
    let width = 250
    switch (viewGantt) {
      case 'week':
        height = 60
        width = 250
        break
      case 'month':
        height = 60
        width = 1000
        break
      case 'year':
        height = 60
        width = 800
        break
      default:
        height = 60
        width = 250
        break
    }

    return { height: height, width: width }
  }, [viewGantt])

  return (
    <div>
      <Typography tag={'h5'} className="mb-8">
        Planning
      </Typography>
      <Toolbar
        onTasksChange={setTasks}
        viewGantt={viewGantt}
        onViewGanttChange={setViewGantt}
      />
      <ResizablePanelGroup className="min-h-screen">
        <ResizablePanel>
          <TableGanttChart
            tasks={tasks}
            headers={headers}
            headerSize={headerSize}
            onTasksChange={setTasks}
            onHeadersChange={setHeaders}
          />
        </ResizablePanel>
        <ResizablePanelHandle />
        <ResizablePanel>
          <ChartGantt
            headerSize={headerSize}
            tasks={tasks}
            viewGantt={viewGantt}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

type TableGanttChartProps = {
  tasks: Task[]
  headers: GanttHeader[]
  headerSize: {
    height: number
    width: number
  }
  onTasksChange: React.Dispatch<React.SetStateAction<Task[]>>
  onHeadersChange: React.Dispatch<React.SetStateAction<GanttHeader[]>>
}
function TableGanttChart({
  tasks,
  headers,
  headerSize,
  onTasksChange,
  onHeadersChange,
}: TableGanttChartProps) {
  const [isResizing, setIsResizing] = useState(false)
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
      onHeadersChange((headers) => {
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
      <div className="border-grey-200 flex items-center border-y">
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
                  headerSize={headerSize}
                  isResizing={isResizing}
                  onResizingChange={setIsResizing}
                  onHeadersChange={onHeadersChange}
                />
              ) : null
            )}
          </SortableContext>
          <NewHeaderGantt headers={headers} onHeadersChange={onHeadersChange} />
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
            onTasksChange={onTasksChange}
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
      <div className="border-grey-100 flex-1 border-e border-b p-4"></div>
    </div>
  )
}

type ChartGanttProps = {
  headerSize: {
    height: number
    width: number
  }
  tasks: Task[]
  viewGantt: ViewGantt
}
export function ChartGantt({ headerSize, tasks, viewGantt }: ChartGanttProps) {
  const { minDate, maxDate } = useMemo(() => {
    if (!tasks.length) return { minDate: new Date(), maxDate: new Date() }
    const dates = tasks.map((task) => [task.startDate, task.endDate]).flat()
    return {
      minDate: min(dates),
      maxDate: max(dates),
    }
  }, [tasks])

  return (
    <div className="h-full overflow-x-scroll">
      <div className="h-full">
        <TimelineView
          view={viewGantt}
          maxDate={maxDate}
          minDate={minDate}
          headerSize={headerSize}
        />
      </div>
    </div>
  )
}

type TimelineViewProps = {
  view: ViewGantt
  headerSize: {
    height: number
    width: number
  }
  minDate: Date
  maxDate: Date
}
function TimelineView({
  view,
  headerSize,
  minDate,
  maxDate,
}: TimelineViewProps) {
  const { headers, subHeadersFn, headerFormat, subHeaderFormat } =
    useMemo(() => {
      switch (view) {
        case 'week':
          return {
            headers: eachMonthOfInterval({
              start: subMonths(minDate, 1),
              end: addMonths(maxDate, 12),
            }),
            subHeadersFn: (month: Date) =>
              eachWeekOfInterval({
                start: month,
                end: endOfMonth(month),
              }),
            headerFormat: 'MMM yyyy',
            subHeaderFormat: 'I',
          }
        case 'month':
          return {
            headers: eachYearOfInterval({
              start: subYears(minDate, 1),
              end: addYears(maxDate, 4),
            }),
            subHeadersFn: (year: Date) =>
              eachMonthOfInterval({
                start: year,
                end: endOfYear(year),
              }),
            headerFormat: 'yyyy',
            subHeaderFormat: 'MMM',
          }
        case 'year':
          return {
            headers: eachYearOfInterval({
              start: subYears(minDate, 1),
              end: addYears(maxDate, 4),
            }),
            headerFormat: 'yyyy',
          }
        default:
          return {
            headers: eachWeekOfInterval({
              start: subWeeks(minDate, 1),
              end: addWeeks(maxDate, 12),
            }),
            subHeadersFn: (week: Date) =>
              eachDayOfInterval({ start: week, end: endOfWeek(week) }),
            headerFormat: 'EEE dd MMM yyyy',
            subHeaderFormat: 'EEEEE',
          }
      }
    }, [view, minDate, maxDate])

  return (
    <div className="flex h-full items-center">
      {headers.map((header, index) => {
        const subHeaders = subHeadersFn?.(header) || []
        const width = headerSize.width / subHeaders.length

        return (
          <div className="flex h-full flex-col" key={header.getTime()}>
            <div
              className="border-grey-200 border px-3 py-1.5 text-center text-sm whitespace-nowrap not-first:border-l-0 first:border-l-0"
              style={{
                minWidth: view === 'year' ? headerSize.width : undefined,
              }}
            >
              <span>{formatDate(header, headerFormat)}</span>
            </div>
            {subHeaders.length ? (
              <div className="border-grey-200 flex items-center border-e border-b">
                {subHeaders.map((subHeader) => (
                  <span
                    key={subHeader.getTime()}
                    className={clsx(
                      'border-grey-200 flex-1 px-1.5 pt-1 text-center text-sm',
                      isWeekend(subHeader) ? 'text-primary-300' : '',
                      isToday(subHeader) ? 'bg-warning-100' : ''
                    )}
                    style={{ minWidth: width }}
                  >
                    {view === 'week' ? 'W' : ''}
                    {formatDate(subHeader, subHeaderFormat || '')}
                  </span>
                ))}
              </div>
            ) : null}
            <div
              className={clsx(
                'border-grey-200 flex-1 border-r',
                index % 2 === 0 ? 'bg-grey-100' : 'bg-white'
              )}
            />
          </div>
        )
      })}
    </div>
  )
}
