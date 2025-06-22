import { Filter } from 'lucide-react'
import type { GanttHeader } from '../../../entities/gantt-header/gantt-header.types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ResizableContainer } from '../../../shared/ui/resizable-container/Resizable-container.ui'
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuList,
  ContextMenuToggle,
} from '../../../shared/ui/context-menu/Context-menu.ui'

type HeaderGanttProps = {
  header: GanttHeader
  isResizing?: boolean
  onResizingChange?: (isResizing: boolean) => void
  headers: GanttHeader[]
  onHeadersChange: (headers: GanttHeader[]) => void
}
export function HeaderGantt({
  header,
  isResizing,
  onResizingChange,
  headers,
  onHeadersChange,
}: HeaderGanttProps) {
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
    ...(isDragging &&
      !isResizing && {
        opacity: 0.5,
      }),
    width: header.width,
  }

  const onResize = (width: number) => {
    const updatedHeaders = headers.map((h) =>
      h.field === header.field ? { ...header, width } : h
    )
    onHeadersChange(updatedHeaders)
  }

  return (
    <div
      className="border-grey-100 group hover:bg-grey-100 cursor-pointer border-y text-[16px] leading-[24px] first:border-s last:border-e"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <ResizableContainer
        minWidth={100}
        onResize={onResize}
        onResizeStart={() => onResizingChange?.(true)}
        onResizeEnd={() => onResizingChange?.(false)}
      >
        <ContextMenu>
          <ContextMenuToggle className="flex items-center justify-between gap-4 p-4 font-semibold">
            <span>{header.label}</span>
            <span className="text-grey-500 invisible group-hover:visible">
              <Filter className="h-4 w-4" />
            </span>
          </ContextMenuToggle>
          <ContextMenuList>
            <ContextMenuItem onClick={() => console.log('Edit')}>
              Cacher la colonne
            </ContextMenuItem>
          </ContextMenuList>
        </ContextMenu>
      </ResizableContainer>
    </div>
  )
}
