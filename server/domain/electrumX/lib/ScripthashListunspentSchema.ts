import { z } from 'zod'

export const ScripthashListunspentSchema = z.array(
  z.object({
    tx_pos: z.number(),
    tx_hash: z.string(),
    height: z.number(),
    value: z.number(),
  }),
)
