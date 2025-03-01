import { BlockchainData } from '../domain/BlockchainData'
import ElectrumConnectionHandler from '../domain/electrumX/ElectrumConnectionHandler'
import { SyncedBlockchainData } from '../domain/SyncedBlockchainData'
import { getOnchainAddresses } from './getOnchainAddresses'

let blockchainData: BlockchainData | null = null

export const useBlockchainData = () => {
  if (blockchainData) {
    return blockchainData
  }

  const addresses = getOnchainAddresses()
  if (addresses.length === 0) {
    blockchainData = new BlockchainData('no-addresses')
    return blockchainData
  }

  const config = useConfig()

  const electrumXServers = config.electrumXServers || []

  if (electrumXServers.length === 0) {
    blockchainData = new BlockchainData('no-servers')
    return blockchainData
  }

  const connectionHandler = new ElectrumConnectionHandler({
    electrumXServers,
    clientName: 'Piggy Bank',
    network: !isDevelopmentMode() ? 'mainnet' : 'testnet',
  })

  const syncedBlockchainData = new SyncedBlockchainData(connectionHandler)
  addresses.forEach(address => syncedBlockchainData?.addAddress(address))

  blockchainData = syncedBlockchainData
  return blockchainData
}
