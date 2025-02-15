import { z } from 'zod'

export const GetBalanceResult = z.object({
  confirmed: z.number(),
  unconfirmed: z.number(),
})

export type GetBalanceResult = z.infer<typeof GetBalanceResult>
