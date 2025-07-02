import { getGanttHeaders, getTasks } from '../../shared/api/api.service'
import { GanttChart } from '../../widgets/gantt-chart/Gantt-chart'

export default function Home() {
  const { data: tasks } = getTasks()
  const { data: headers } = getGanttHeaders()

  return (
    <main className="m-8">
      <GanttChart tasks={tasks} headers={headers} />
    </main>
  )
}
