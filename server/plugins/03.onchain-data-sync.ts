import { strict as assert } from 'node:assert'
import consola from 'consola'
import ElectrumConnectionHandler from '../domain/electrumX/ElectrumConnectionHandler'
import BlockchainData from '../domain/BlockchainData'

let blockchainData: BlockchainData | null = null

export default defineNitroPlugin(() => {
  consola.info('Onchain Data Sync Plugin')

  const config = useConfig()

  const electrumXServers = config.electrumXServers || []

  const connectionHandler = new ElectrumConnectionHandler({
    electrumXServers,
    clientName: 'Piggy Bank',
    network: !isDevelopmentMode() ? 'mainnet' : 'testnet',
  })

  blockchainData = new BlockchainData(connectionHandler)

  if (config.users) {
    config.users.flatMap(user => user.onchain ?? []).map(onchain => typeof onchain == 'string' ? onchain : onchain.address).forEach(address => blockchainData?.addAddress(address))
  }

  setImmediate(syncBlockchainData)
  setTimeout(syncBlockchainData, 1000 * 45)
})

const syncBlockchainData = async () => {
  consola.start('Running blockchain sync task ...')
  assert(blockchainData != null, 'Blockchain data is not initialized')
  await blockchainData.sync()
  consola.success('Running blockchain sync task finished.')
  return { result: 'Success' }
}
