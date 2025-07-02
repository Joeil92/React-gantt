import { z } from 'zod'

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  color: z.string(),
  progression: z.number(),
})
