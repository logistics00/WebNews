import { z } from 'zod'

import { validatePage } from './validatePage'

export const schema = z.object({
  page: z.string().trim().refine(validatePage, {
    message: 'Page must contain at least 1 Character',
  }),
})
