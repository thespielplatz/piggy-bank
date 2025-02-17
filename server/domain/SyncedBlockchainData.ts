import type ElectrumConnectionHandler from './electrumX/ElectrumConnectionHandler'
import { PROTOCOL_METHOD } from './electrumX/models/ProtocolMethod'
import { getScriptHash } from './electrumX/lib/getScriptHash'
import { BlockchainData } from './BlockchainData'

export class SyncedBlockchainData extends BlockchainData {
  connectionHandler: ElectrumConnectionHandler

  constructor(connectionHandler: ElectrumConnectionHandler) {
    super()
    this.connectionHandler = connectionHandler
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
