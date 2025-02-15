import { strict as assert } from 'node:assert'
import ElectrumXClient from './electrumX/ElectrumXClient'
import { METHOD } from './electrumX/lib/Method'
import { getScriptHash } from './electrumX/lib/getScriptHash'

export default class BlockchainData {
  electrumXClient: ElectrumXClient | null = null
  public addresses: {
    address: string,
    sats: number,
  }[]

  constructor() {
    this.addresses = []
  }

  addAddress(address: string) {
    this.addresses.push({
      address,
      sats: 0,
    })
  }

  async sync() {
    const client = this.getClient()
    await client.checkConnection()
    await Promise.all(
      this.addresses.map(async (address) => {
        address.sats = await this.getAddressBalance(address.address)
      }),
    )
  }

  private getClient() {
    if (this.electrumXClient == null) {
      const config = useConfig()
      assert(config.electrumXServers, 'No electrumX servers configured')
      assert(config.electrumXServers.length > 0, 'No electrumX servers configured')
      const connectionParams = config.electrumXServers[0]
      this.electrumXClient = new ElectrumXClient(connectionParams)
    }
    return this.electrumXClient
  }

  private async getAddressBalance(address: string) {
    const client = this.getClient()
    const scriptHash = getScriptHash(address)
    if (scriptHash == null) {
      return -1
    }
    const balances = await client.request({
      method: METHOD.BLOCKCHAIN.SCRIPTHASH.GET_BALANCE,
      scriptHash,
    })
    return balances.confirmed
  }
}
