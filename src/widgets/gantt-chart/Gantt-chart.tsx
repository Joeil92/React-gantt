import type { GanttHeader } from '../../entities/gantt-header/gantt-header.types'
import { type Task } from '../../entities/task/task.types'
import { HeaderGantt } from '../../features/gantt/header-gantt/Header-gantt.ui'
import { Table, TableHeader } from '../../shared/ui/table/Table.ui'
import { Typography } from '../../shared/ui/typography/Typography.ui'

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
  return (
    <Table>
      <TableHeader>
        <HeaderGantt headers={props.headers} />
      </TableHeader>
    </Table>
  )
}
