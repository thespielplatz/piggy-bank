import { z } from 'zod'

export const SubscribeParams = z.object({
  method: z.literal('blockchain.scripthash.subscribe'),
  scriptHash: z.string(),
})

export type SubscribeParams = z.infer<typeof SubscribeParams>

export const SubscribeResult = z.union([
  z.string().describe('For script hashes that exist in tx\'s'),
  z.null().describe('For script hashes that do not exist in the blockchain'),
])

export type SubscribeResult = z.infer<typeof SubscribeResult>
