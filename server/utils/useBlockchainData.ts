import BlockchainData from '../domain/BlockchainData'
import ElectrumConnectionHandler from '../domain/electrumX/ElectrumConnectionHandler'

let blockchainData: BlockchainData | null = null

export const useBlockchainData = () => {
  if (blockchainData) {
    return blockchainData
  }

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

  return blockchainData
}
