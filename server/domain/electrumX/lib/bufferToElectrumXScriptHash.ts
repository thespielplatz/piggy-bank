import { createHash } from 'node:crypto'

export const bufferToElectrumXScriptHash = (buffer: Buffer): string => [
  ...createHash('sha256').update(buffer).digest(),
].reverse().map(x => x.toString(16).padStart(2, '0')).join('')
