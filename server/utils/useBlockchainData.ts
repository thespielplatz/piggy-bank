import BlockchainData from '../domain/BlockchainData'

let cache: BlockchainData | null = null

export default (): BlockchainData => {
  if (!cache) {
    cache = new BlockchainData()
  }

  return cache
}
