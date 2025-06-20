import { Filter } from 'lucide-react'
import type { GanttHeader } from '../../../entities/gantt-header/gantt-header.types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type HeaderGanttProps = {
  header: GanttHeader
}
export function HeaderGantt({ header }: HeaderGanttProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: header.field,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging && {
      opacity: 0.5,
    }),
  }

  return (
    <div
      key={header.field}
      className="border-grey-100 group hover:bg-grey-100 flex flex-1 cursor-pointer items-center justify-between border-y p-4 text-[16px] leading-[24px] font-semibold first:border-s last:border-e"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {header.label}
      <span className="text-grey-500 invisible group-hover:visible">
        <Filter className="h-4 w-4" />
      </span>
    </div>
  )
}
