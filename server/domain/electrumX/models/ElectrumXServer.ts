import { z } from 'zod'

export const ElectrumXServer = z.object({
  server: z.string(),
  port: z.number().default(50002),
  protocolVersion: z.string().default('1.4'),
  isTestnet: z.boolean().default(false),
})

export type ElectrumXServer = z.infer<typeof ElectrumXServer>
