import { Filter } from 'lucide-react'
import type { GanttHeader } from '../../../entities/gantt-header/gantt-header.types'
import { TableHead } from '../../../shared/ui/table/Table.ui'

type HeaderGanttProps = {
  headers: GanttHeader[]
}
export function HeaderGantt(props: HeaderGanttProps) {
  return (
    <>
      {props.headers.map((header) =>
        header.isVisible ? (
          <TableHead
            key={header.field}
            className="group hover:bg-grey-100 cursor-pointer transition duration-200 ease-in-out"
          >
            <div className="flex items-center justify-between">
              {header.label}
              <span className="text-grey-500 invisible group-hover:visible">
                <Filter className="h-4 w-4" />
              </span>
            </div>
          </TableHead>
        ) : null
      )}
    </>
  )
}
