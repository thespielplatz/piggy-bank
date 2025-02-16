import { strict as assert } from 'node:assert'
import ElectrumConnectionHandler from './electrumX/ElectrumConnectionHandler'
import { METHOD } from './electrumX/models/Method'
import { getScriptHash } from './electrumX/lib/getScriptHash'

export default class BlockchainData {
  electrumXClient: ElectrumConnectionHandler | null = null
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
      let electrumXServers
      let network
      if (!isDevelopmentMode()) {
        network = 'mainnet'
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        electrumXServers = config.electrumXServers?.filter(server => !server.isTestnet) || []
      } else {
        network = 'testnet'
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        electrumXServers = config.electrumXServers?.filter(server => server.isTestnet) || []
      }
      assert(electrumXServers.length >= 1, `No electrumX servers configured for ${network}`)
      const connectionParams = electrumXServers[0]
      this.electrumXClient = new ElectrumConnectionHandler(connectionParams)
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
