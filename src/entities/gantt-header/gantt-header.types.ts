import type { z } from 'zod'
import type { ganttHeaderSchema } from './gantt-header.contracts'

export type GanttHeader = z.infer<typeof ganttHeaderSchema>
