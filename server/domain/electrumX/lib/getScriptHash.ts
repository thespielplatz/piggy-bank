import { addressToBuffer } from './addressToBuffer'
import { bufferToElectrumXScriptHash } from './bufferToElectrumXScriptHash'

export const getScriptHash = (address: string) => {
  const buffer = addressToBuffer(address)
  if (buffer == null) {
    return null
  }
  return bufferToElectrumXScriptHash(buffer)
}
