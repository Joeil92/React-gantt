import { differenceInCalendarDays, isSameDay } from 'date-fns'
import type { Task } from '../../../entities/task/task.types'
import type { ViewGantt } from '../toolbar/toolbar.types'
import { useMemo } from 'react'
import { fr } from 'date-fns/locale'
import { registerLocale } from 'react-datepicker'

registerLocale('fr', fr)

type TaskBarProps = {
  task: Task
  height: number
  startDate: Date
  widthPerHeader: number
  view: ViewGantt
}
export function TaskBar({
  task,
  height,
  startDate,
  widthPerHeader,
  view,
}: TaskBarProps) {
  const { left, width } = useMemo(() => {
    switch (view) {
      default:
        return {
          left:
            widthPerHeader *
            differenceInCalendarDays(task.startDate, startDate),
          width:
            widthPerHeader *
            (differenceInCalendarDays(task.endDate, task.startDate) + 1),
        }
    }
  }, [view, widthPerHeader, startDate, task.startDate, task.endDate])

  const isMilestone = isSameDay(task.startDate, task.endDate)

  const style: React.CSSProperties = {
    minHeight: height,
    left: left,
    width: width,
    paddingLeft: widthPerHeader / 2,
    paddingRight: !isMilestone ? widthPerHeader / 2 : 0,
  }

  return (
    <div className="relative flex items-center" style={style}>
      {!isMilestone ? (
        <ProgressBar progression={task.progression} />
      ) : (
        <Milestone />
      )}
      <span className="text-grey-800 absolute -right-15 left-full text-sm whitespace-nowrap">
        {task.title}
      </span>
    </div>
  )
}

type ProgressBarProps = {
  progression: number
}
function ProgressBar({ progression }: ProgressBarProps) {
  return (
    <div className="bg-grey-200 h-6 w-full rounded" data-testid="progress-bar">
      <div
        className="bg-primary-500 h-full rounded"
        style={{ width: `${progression}%` }}
      />
    </div>
  )
}

function Milestone() {
  return (
    <div
      className="bg-warning-500 h-[12px] w-[12px] -translate-x-1/2 translate-y-[2px] rotate-45 transform"
      data-testid="milestone"
    />
  )
}
