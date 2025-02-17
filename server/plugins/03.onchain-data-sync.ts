import consola from 'consola'
import { SyncedBlockchainData } from '../domain/SyncedBlockchainData'

export default defineNitroPlugin(() => {
  consola.info('Onchain Data Sync Plugin')
  const blockchainData = useBlockchainData()
  if (blockchainData instanceof SyncedBlockchainData) {
    setImmediate(syncBlockchainData)
    setInterval(syncBlockchainData, 1000 * 15)
  } else {
    consola.info('No onchain addresses found. Skipping onchain data sync.')
  }
})

const syncBlockchainData = async () => {
  consola.start('Running blockchain sync task ...')
  const blockchainData = useBlockchainData()
  if (blockchainData instanceof SyncedBlockchainData) {
    await blockchainData.sync()
  }
  consola.success('Running blockchain sync task finished.')
}
