import { strict as assert } from 'node:assert'
import ElectrumConnectionHandler from './electrumX/ElectrumConnectionHandler'
import { PROTOCOL_METHOD } from './electrumX/models/ProtocolMethod'
import { getScriptHash } from './electrumX/lib/getScriptHash'

export default class BlockchainData {
  clientConnection: ElectrumConnectionHandler | null = null
  public addresses: {
    address: string,
    sats: number,
  }[]

  constructor() {
    this.addresses = []
    this.initClient()
  }

  addAddress(address: string) {
    this.addresses.push({
      address,
      sats: 0,
    })
  }

  async sync() {
    await Promise.all(
      this.addresses.map(async (address) => {
        address.sats = await this.getAddressBalance(address.address)
      }),
    )
  }

  private initClient() {
    if (this.clientConnection == null) {
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
      this.clientConnection = new ElectrumConnectionHandler(connectionParams)
    }
    return this.clientConnection
  }

  private async getAddressBalance(address: string) {
    const client = await this.clientConnection?.getConnectedClient()
    if (client == null) {
      throw new Error('No connected electrum client found')
    }
    const scriptHash = getScriptHash(address)
    if (scriptHash == null) {
      return -1
    }
    const balances = await client.request({
      method: PROTOCOL_METHOD.BLOCKCHAIN.SCRIPTHASH.GET_BALANCE,
      scriptHash,
    })
    return balances.confirmed
  }
}
