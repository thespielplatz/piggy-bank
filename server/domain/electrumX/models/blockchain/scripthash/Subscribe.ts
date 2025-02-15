import { z } from 'zod'

export const SubscribeParams = z.object({
  method: z.literal('blockchain.scripthash.subscribe'),
  scriptHash: z.string(),
})

export type SubscribeParams = z.infer<typeof SubscribeParams>

export const SubscribeResult = z.string()

export type SubscribeResult = z.infer<typeof SubscribeResult>
