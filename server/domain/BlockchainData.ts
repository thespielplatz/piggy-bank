import type ElectrumConnectionHandler from './electrumX/ElectrumConnectionHandler'
import { PROTOCOL_METHOD } from './electrumX/models/ProtocolMethod'
import { getScriptHash } from './electrumX/lib/getScriptHash'

export default class BlockchainData {
  connectionHandler: ElectrumConnectionHandler
  private addresses: {
    address: string,
    sats: number,
  }[]

  constructor(connectionHandler: ElectrumConnectionHandler) {
    this.connectionHandler = connectionHandler
    this.addresses = []
  }

  addAddress(address: string) {
    if (this.addresses.find(a => a.address === address)) {
      return
    }

    this.addresses.push({
      address,
      sats: 0,
    })
  }

  getBalance(address: string): number {
    return this.addresses.find(a => a.address === address)?.sats ?? 0
  }

  async sync() {
    await Promise.all(
      this.addresses.map(async (address) => {
        address.sats = await this.getAddressBalance(address.address)
      }),
    )
  }

  private async getAddressBalance(address: string) {
    const client = await this.connectionHandler.getConnectedClient()
    if (client == null) {
      throw new Error('No connected electrum client found')
    }
    const scriptHash = getScriptHash(address)
    if (scriptHash == null) {
      return -1
    }
    const balances = await client.typedRequest({
      method: PROTOCOL_METHOD.BLOCKCHAIN.SCRIPTHASH.GET_BALANCE,
      scriptHash,
    })
    return balances.confirmed
  }
}
