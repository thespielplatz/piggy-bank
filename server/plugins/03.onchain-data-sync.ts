import consola from 'consola'
import useBlockchainData from '../utils/useBlockchainData'

export default defineNitroPlugin(() => {
  consola.info('Onchain Data Sync Plugin')

  const config = useConfig()
  const blockchainData = useBlockchainData()
  if (config.users) {
    config.users.flatMap(user => user.onchain ?? []).map(onchain => typeof onchain == 'string' ? onchain : onchain.address).forEach(address => blockchainData.addAddress(address))
  }

  setImmediate(async () => {
    runTask('onchain-sync', {})
  })
})
