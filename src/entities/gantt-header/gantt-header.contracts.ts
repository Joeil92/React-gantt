import { z } from 'zod'

export const ganttHeaderSchema = z.object({
  field: z.string(),
  label: z.string(),
  type: z.enum(['string', 'number', 'date']),
  width: z.number(),
  isVisible: z.boolean(),
  isEditable: z.boolean(),
})
