import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { ElectrumXServer } from './electrumX/models/ElectrumXServer'

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
])

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  accessKey: z.string(),
  lnbits: LnBitsSchema,
  onchain: z.array(OnChainSchema).optional(),
})

export type UserSchema = z.infer<typeof UserSchema>

export const ConfigSchema = z.object({
  users: z.array(UserSchema).default([]).optional(),
  electrumXServers: z.array(ElectrumXServer).optional(),
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
