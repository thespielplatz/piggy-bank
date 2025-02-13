import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'

const LnBitsSchema = z.object({
  url: z.string(),
  invoiceKey: z.string(),
})

const OnChainSchema = z.union([
  z.string(),
  z.object({
    name: z.string(),
    address: z.string(),
  }),
/*
  z.object({
    name: z.string(),
    xpub: z.string(),
  }),
  */
])

const ElectrumXServerSchemna = z.object({
  server: z.string(),
  port: z.number().default(50002),
  protocolVersion: z.string().default('1.4'),
})

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  accessKey: z.string(),
  lnbits: LnBitsSchema,
  onchain: z.array(OnChainSchema).optional(),
  electrumXServers: z.array(ElectrumXServerSchemna).optional(),
})

export type UserSchema = z.infer<typeof UserSchema>

export const ConfigSchema = z.object({
  users: z.array(UserSchema).default([]).optional(),
})

export type ConfigType = z.infer<typeof ConfigSchema>

export const parseConfig = (): ConfigType => {
  const configFilePath = path.resolve(process.cwd(), 'config.json')

  try {
    const configData = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
    return ConfigSchema.parse(configData)
  } catch (error) {
    console.error('Invalid configuration:', error)
    console.info('Using default configuration')
    return ConfigSchema.parse({})
  }
}
