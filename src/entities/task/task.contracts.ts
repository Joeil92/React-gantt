import { z } from 'zod'

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  color: z.string(),
  progression: z.number(),
})
