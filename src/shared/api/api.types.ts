import type { z } from 'zod'
import type { taskDtoSchema } from './api.contracts'

export type TaskDto = z.infer<typeof taskDtoSchema>
