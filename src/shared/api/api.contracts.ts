import { z } from 'zod'

export const taskDtoSchema = z.object({
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  color: z.string(),
  progression: z.number(),
})
