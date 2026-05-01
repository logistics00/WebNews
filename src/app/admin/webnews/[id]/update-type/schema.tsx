import { z } from 'zod'

import { validateColumn } from './validateColumn'

export const schema = z.object({
  page: z.string().trim(),
  type: z.string().trim(),
  column: z.string().refine(validateColumn, {
    message: 'Column must be 1...4',
  }),
})
