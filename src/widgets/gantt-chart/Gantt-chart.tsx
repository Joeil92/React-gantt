import { type Task } from '../../entities/task/task.types'
import { Typography } from '../../shared/ui/typography/Typography.ui'

type GanttChartProps = {
  tasks: Task[]
}

export function GanttChart(props: GanttChartProps) {
  return <BaseGanttChart {...props} />
}

function BaseGanttChart(props: GanttChartProps) {
  console.log(props)

  return (
    <div>
      <Typography tag={'h5'}>Planning</Typography>
    </div>
  )
}
