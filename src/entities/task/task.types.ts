import type { z } from 'zod'
import type { taskSchema } from './task.contracts'

export type Task = z.infer<typeof taskSchema>
