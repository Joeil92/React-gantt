import type { Task } from '../../../entities/task/task.types'
import { useEffect, useRef, useState } from 'react'
import useDebouce from '../../../shared/hooks/use-debounce'
import {
  differenceInBusinessDays,
  formatDate,
  isWithinInterval,
  parse,
  subDays,
} from 'date-fns'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { fr } from 'date-fns/locale'
import { ProgressBar } from '../../../shared/ui/progress-bar/Progress-bar.ui'

registerLocale('fr', fr)

type TaskCellProps = {
  task: Task
  displayValue: unknown
  width: number
  fieldName: Omit<keyof Task, 'id' | 'color'>
  onTasksChange: (field: keyof Task, value: unknown) => void
}
export function TaskCell({
  task,
  displayValue,
  width,
  fieldName,
  onTasksChange,
}: TaskCellProps) {
  const [value, setValue] = useState(displayValue)
  const [isEditable, setIsEditable] = useState(false)

  const onDebouncedCallback = (debouncedValue: boolean) => {
    if (value === displayValue || debouncedValue) return
    onTasksChange(fieldName as keyof Task, value)
  }

  useDebouce(isEditable, 2000, onDebouncedCallback)

  const stringFields = ['title']
  const dateFields = ['startDate', 'endDate']

  const isString = stringFields.includes(fieldName as string)
  const isDate = dateFields.includes(fieldName as string)
  const isDuration = fieldName === 'duration'
  const isProgression = fieldName === 'progression'

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLElement>
  ) => {
    if (e.key === 'Enter') {
      setIsEditable(false)
    }
  }

  const handleBlur = () => {
    setIsEditable(false)
  }

  const getDateContraints = () => {
    switch (fieldName) {
      case 'startDate':
        return {
          includeDateIntervals: [
            {
              start: new Date(0),
              end: task.endDate,
            },
          ],
        }
      case 'endDate':
        return {
          excludeDateIntervals: [
            {
              start: new Date(0),
              end: subDays(task.startDate, 1),
            },
          ],
        }
      default:
        return undefined
    }
  }

  return (
    <div
      className="border-grey-100 hover:bg-primary-100 cursor-default border-b first:border-s"
      style={{ width: width, minWidth: width }}
      onDoubleClick={() => setIsEditable(true)}
    >
      {isString && (
        <StringCell
          displayValue={value as string}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          onValueChange={setValue}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      )}
      {isDate && (
        <DateCell
          displayValue={value as Date}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          onValueChange={setValue}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          {...getDateContraints()}
        />
      )}
      {isDuration && (
        <DurationCell
          displayValue={
            differenceInBusinessDays(task.endDate, task.startDate) + 2
          } // Add first day and last day
        />
      )}
      {isProgression && (
        <ProgressionCell
          displayValue={value as number}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          onValueChange={setValue}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      )}
    </div>
  )
}

type TypeCellProps<T, Y> = {
  displayValue: T
  isEditable: boolean
  setIsEditable: (isEditable: boolean) => void
  onValueChange: (value: T) => void
  onKeyDown: (e: React.KeyboardEvent<Y>) => void
  onBlur: () => void
}
function StringCell(props: TypeCellProps<string, HTMLInputElement>) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (props.isEditable) {
      inputRef.current?.select()
    }
  }, [props.isEditable])

  return props.isEditable ? (
    <input
      type="text"
      ref={inputRef}
      className="w-full p-4"
      value={props.displayValue}
      autoFocus
      onChange={(e) => props.onValueChange(e.target.value)}
      onKeyDown={props.onKeyDown}
      onBlur={props.onBlur}
    />
  ) : (
    <div className="p-4">
      <p className="truncate">{props.displayValue}</p>
    </div>
  )
}

type DateCellProps = {
  excludeDateIntervals?: { start: Date; end: Date }[]
  includeDateIntervals?: { start: Date; end: Date }[]
}
function DateCell(props: TypeCellProps<Date, HTMLElement> & DateCellProps) {
  const handleChangeRaw = (
    e:
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.KeyboardEvent<HTMLElement>
      | undefined
  ) => {
    if (!e) return

    const input = (e.target as HTMLInputElement).value
    if (!input) return

    const parsedDate = parse(input, 'dd/MM/yyyy', new Date(), { locale: fr })
    if (isNaN(parsedDate.getTime()) || parsedDate.getFullYear() < 1900) return

    if (props.excludeDateIntervals) {
      const isWithinIntervals = props.excludeDateIntervals.some((interval) =>
        isWithinInterval(parsedDate, interval)
      )
      if (isWithinIntervals) return
    }

    if (props.includeDateIntervals) {
      const isWithinIntervals = props.includeDateIntervals.some((interval) =>
        isWithinInterval(parsedDate, interval)
      )
      if (!isWithinIntervals) return
    }
    props.onValueChange(parsedDate)
  }

  return props.isEditable ? (
    <DatePicker
      dateFormat={'dd/MM/yyyy'}
      selected={props.displayValue}
      autoFocus
      onChange={(date) => date && props.onValueChange(date)}
      onChangeRaw={handleChangeRaw}
      className="w-full p-4"
      locale={'fr'}
      includeDateIntervals={props.includeDateIntervals}
      excludeDateIntervals={props.excludeDateIntervals}
      onKeyDown={props.onKeyDown}
      onBlur={props.onBlur}
    />
  ) : (
    <p className="truncate p-4">
      {formatDate(props.displayValue, 'dd/MM/yyyy')}
    </p>
  )
}

function DurationCell(
  props: Pick<TypeCellProps<number, HTMLElement>, 'displayValue'>
) {
  return <p className="truncate p-4">{props.displayValue}j</p>
}

function ProgressionCell(props: TypeCellProps<number, HTMLElement>) {
  return props.isEditable ? (
    <input
      type="number"
      className="w-full p-4"
      value={props.displayValue}
      autoFocus
      onChange={(e) => props.onValueChange(e.target.valueAsNumber)}
      onKeyDown={props.onKeyDown}
      onBlur={props.onBlur}
    />
  ) : (
    <div className="w-full px-4 py-5">
      <ProgressBar
        progression={props.displayValue}
        displayValue
        rounded="full"
        size="sm"
      />
    </div>
  )
}
