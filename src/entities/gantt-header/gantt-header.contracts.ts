import { z } from 'zod'

export const ganttHeaderSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['string', 'number', 'date']),
  isVisible: z.boolean(),
  isEditable: z.boolean(),
})
