import { z } from 'zod'

export const SubscribeParams = z.object({
  method: z.literal('blockchain.scripthash.subscribe'),
  scriptHash: z.string(),
})

export type SubscribeParams = z.infer<typeof SubscribeParams>
