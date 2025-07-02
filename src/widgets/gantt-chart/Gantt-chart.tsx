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
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns'
import clsx from 'clsx'
import { TaskBar } from '../../features/gantt/task-bar/Task-bar.ui'

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
  const taskHeight = 64

  const headerSize = useMemo(() => {
    let height = 60
    let width = 50
    switch (viewGantt) {
      case 'week':
        height = 60
        width = 50
        break
      case 'month':
        height = 60
        width = 100
        break
      case 'year':
        height = 60
        width = 500
        break
      default:
        height = 60
        width = 50
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
            taskHeight={taskHeight}
          />
        </ResizablePanel>
        <ResizablePanelHandle />
        <ResizablePanel>
          <ChartGantt
            headerSize={headerSize}
            tasks={tasks}
            taskHeight={taskHeight}
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
  taskHeight: number
  onTasksChange: React.Dispatch<React.SetStateAction<Task[]>>
  onHeadersChange: React.Dispatch<React.SetStateAction<GanttHeader[]>>
}
function TableGanttChart({
  tasks,
  headers,
  headerSize,
  taskHeight,
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
      <div className="border-grey-200 flex items-center border-t">
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
          <NewHeaderGantt
            headers={headers}
            onHeadersChange={onHeadersChange}
            headerHeight={headerSize.height}
          />
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
            taskHeight={taskHeight}
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
  taskHeight: number
  onTasksChange: (tasks: Task[]) => void
}
function TaskRow({
  task,
  headers,
  tasks,
  taskHeight,
  onTasksChange,
}: TaskRowProps) {
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
            height={taskHeight}
            fieldName={field}
            onTasksChange={handleTasksChange}
          />
        )
      })}
      <div
        className="border-grey-100 flex-1 border-e border-b p-4"
        style={{ minHeight: taskHeight }}
      />
    </div>
  )
}

type ChartGanttProps = {
  headerSize: {
    height: number
    width: number
  }
  tasks: Task[]
  taskHeight: number
  viewGantt: ViewGantt
}
export function ChartGantt({
  headerSize,
  tasks,
  taskHeight,
  viewGantt,
}: ChartGanttProps) {
  const { minDate, maxDate } = useMemo(() => {
    if (!tasks.length) return { minDate: new Date(), maxDate: new Date() }
    const dates = tasks.map((task) => [task.startDate, task.endDate]).flat()
    return {
      minDate: min(dates),
      maxDate: max(dates),
    }
  }, [tasks])

  const { realStart, headers, subHeadersFn, headerFormat, subHeaderFormat } =
    useMemo(() => {
      let realStart = minDate
      let realEnd = maxDate

      switch (viewGantt) {
        case 'week':
          realStart = subMonths(minDate, 1)
          realEnd = addMonths(maxDate, 12)

          return {
            realStart: startOfMonth(realStart),
            headers: eachMonthOfInterval({
              start: realStart,
              end: realEnd,
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
          realStart = subYears(minDate, 1)
          realEnd = addYears(maxDate, 4)

          return {
            realStart: startOfYear(realStart),
            headers: eachYearOfInterval({
              start: realStart,
              end: realEnd,
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
          realStart = subYears(minDate, 1)
          realEnd = addYears(maxDate, 4)

          return {
            realStart: startOfYear(realStart),
            headers: eachYearOfInterval({
              start: realStart,
              end: realEnd,
            }),
            headerFormat: 'yyyy',
          }
        default:
          realStart = subWeeks(minDate, 1)
          realEnd = addWeeks(maxDate, 12)

          return {
            realStart: startOfWeek(realStart),
            headers: eachWeekOfInterval({
              start: realStart,
              end: realEnd,
            }),
            subHeadersFn: (week: Date) =>
              eachDayOfInterval({ start: week, end: endOfWeek(week) }),
            headerFormat: 'EEE dd MMM yyyy',
            subHeaderFormat: 'EEEEE',
          }
      }
    }, [viewGantt, minDate, maxDate])

  return (
    <div className="relative h-full overflow-x-scroll overflow-y-hidden">
      <div className="h-full">
        <TimelineView
          view={viewGantt}
          headers={headers}
          subHeadersFn={subHeadersFn}
          headerFormat={headerFormat}
          subHeaderFormat={subHeaderFormat}
          headerSize={headerSize}
        />
        <div
          className="absolute top-0 left-0 h-full min-w-full"
          style={{ marginTop: headerSize.height }}
        >
          {tasks.map((task) => (
            <TaskBar
              task={task}
              key={task.id}
              height={taskHeight}
              startDate={realStart}
              widthPerHeader={headerSize.width}
              view={viewGantt}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

type TimelineViewProps = {
  headers: Date[]
  subHeadersFn?: (header: Date) => Date[]
  headerFormat: string
  subHeaderFormat?: string
  view: ViewGantt
  headerSize: {
    height: number
    width: number
  }
}
function TimelineView({
  headers,
  subHeadersFn,
  headerFormat,
  subHeaderFormat,
  view,
  headerSize,
}: TimelineViewProps) {
  return (
    <div className="flex h-full items-center">
      {headers.map((header, index) => {
        const subHeaders = subHeadersFn?.(header) || []

        return (
          <div className="flex h-full flex-col" key={header.getTime()}>
            <div
              className="border-grey-200 flex flex-col border-b"
              style={{ height: headerSize.height }}
            >
              <div
                className="border-grey-200 border px-3 py-1.5 text-center text-sm whitespace-nowrap not-first:border-l-0 first:border-l-0"
                style={{
                  width: view === 'year' ? headerSize.width : undefined,
                }}
              >
                <span>{formatDate(header, headerFormat)}</span>
              </div>
              {subHeaders.length ? (
                <div className="flex h-full items-center">
                  {subHeaders.map((subHeader) => (
                    <span
                      key={subHeader.getTime()}
                      className={clsx(
                        'border-grey-200 flex h-full items-center justify-center px-1.5 text-center text-sm last:border-e',
                        isWeekend(subHeader) ? 'text-primary-300' : '',
                        isToday(subHeader) ? 'bg-warning-100' : ''
                      )}
                      style={{ width: headerSize.width }}
                    >
                      {view === 'week' ? 'W' : ''}
                      {formatDate(subHeader, subHeaderFormat || '')}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
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
