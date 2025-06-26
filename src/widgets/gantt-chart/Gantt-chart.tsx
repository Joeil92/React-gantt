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
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  formatDate,
  isToday,
  isWeekend,
  max,
  min,
  subMonths,
  subWeeks,
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

  const headerSize = { height: 60, width: 250 }

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
      <ResizablePanelGroup>
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
    <div>
      <div
        className="bg-grey-100 text-grey-900"
        style={{ height: headerSize.height }}
      >
        {viewGantt === 'day' && (
          <DayView
            width={headerSize.width}
            minDate={minDate}
            maxDate={maxDate}
          />
        )}
        {viewGantt === 'week' && (
          <WeekView
            width={headerSize.width}
            minDate={minDate}
            maxDate={maxDate}
          />
        )}
      </div>
    </div>
  )
}

type HeaderViewsProps = {
  width: number
  minDate: Date
  maxDate: Date
}
function DayView({ width, minDate, maxDate }: HeaderViewsProps) {
  const weeks = useMemo(
    () =>
      eachWeekOfInterval({
        start: subWeeks(minDate, 1),
        end: addWeeks(maxDate, 12),
      }),
    [minDate, maxDate]
  )

  return (
    <div className="flex h-full items-center">
      {weeks.map((week) => {
        const days = eachDayOfInterval({ start: week, end: endOfWeek(week) })
        const widthDay = width / days.length

        return (
          <div key={week.getTime()} className="flex h-full flex-col">
            <HeaderView date={week} format="EEE dd MMM yyyy" />
            <div className="border-grey-200 flex items-center border-e border-b">
              {days.map((day) => (
                <span
                  key={day.getTime()}
                  className={clsx(
                    'border-grey-200 flex-1 px-1.5 pt-1 text-center text-sm',
                    isWeekend(day) ? 'text-primary-300' : '',
                    isToday(day) ? 'bg-warning-100' : ''
                  )}
                  style={{ width: widthDay }}
                >
                  {formatDate(day, 'EEEEE')}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function WeekView({ width, minDate, maxDate }: HeaderViewsProps) {
  const month = useMemo(
    () =>
      eachMonthOfInterval({
        start: subMonths(minDate, 1),
        end: addMonths(maxDate, 12),
      }),
    [minDate, maxDate]
  )

  return (
    <div className="flex h-full items-center">
      {month.map((month) => {
        const week = eachWeekOfInterval({
          start: month,
          end: endOfMonth(month),
        })
        const weekWidth = width / week.length

        return (
          <div key={month.getTime()} className="flex h-full flex-col">
            <HeaderView date={month} format="MMM yyyy" />
            <div className="border-grey-200 flex items-center border-e border-b">
              {week.map((weekDay) => (
                <span
                  key={weekDay.getTime()}
                  className={clsx(
                    'border-grey-200 flex-1 px-1.5 pt-1 text-center text-sm'
                  )}
                  style={{ width: weekWidth }}
                >
                  W{formatDate(weekDay, 'I')}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

type HeaderViewProps = {
  date: Date
  format: string
}
function HeaderView({ date, format }: HeaderViewProps) {
  return (
    <div className="border-grey-200 flex flex-1 items-center justify-center border px-3 py-1.5 text-sm whitespace-nowrap not-first:border-l-0 first:border-l-0">
      <div className="text-center">{formatDate(date, format)}</div>
    </div>
  )
}
