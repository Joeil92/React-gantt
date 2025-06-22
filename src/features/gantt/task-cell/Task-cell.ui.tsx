import type { Task } from '../../../entities/task/task.types'
import { useEffect, useRef, useState } from 'react'
import useDebouce from '../../../shared/hooks/use-debounce'

type TaskCellProps = {
  displayValue: string | number
  width: number
  fieldName: Omit<keyof Task, 'id' | 'color'>
  onTasksChange: (field: keyof Task, value: string | number) => void
}
export function TaskCell({
  displayValue,
  width,
  fieldName,
  onTasksChange,
}: TaskCellProps) {
  const [value, setValue] = useState(displayValue)
  const [isEditable, setIsEditable] = useState(false)

  const debouncedValue = useDebouce(value, 2000)

  const stringFields = ['title']

  const isString = stringFields.includes(fieldName as string)

  useEffect(() => {
    if (debouncedValue === displayValue || isEditable) return
    onTasksChange(fieldName as keyof Task, debouncedValue)
  }, [debouncedValue, displayValue, onTasksChange, fieldName, isEditable])

  return (
    <div
      className="border-grey-100 hover:bg-primary-100 cursor-default first:border-s"
      style={{ width: width }}
      onDoubleClick={() => setIsEditable(true)}
    >
      {isString && (
        <StringCell
          displayValue={value as string}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          onValueChange={setValue}
        />
      )}
    </div>
  )
}

type StringCellProps = {
  displayValue: string
  isEditable: boolean
  setIsEditable: (isEditable: boolean) => void
  onValueChange: (value: string) => void
}
function StringCell(props: StringCellProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (props.isEditable) {
      inputRef.current?.select()
    }
  }, [props.isEditable])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      props.setIsEditable(false)
      props.onValueChange(props.displayValue)
    }
  }

  return props.isEditable ? (
    <input
      type="text"
      ref={inputRef}
      className="w-full p-4"
      value={props.displayValue}
      autoFocus
      onChange={(e) => props.onValueChange(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={() => props.setIsEditable(false)}
    />
  ) : (
    <div className="p-4">
      <p className="truncate">{props.displayValue}</p>
    </div>
  )
}
