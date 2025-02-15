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
    const blockchainData = useBlockchainData()
    consola.start('Running blockchain sync task ...')
    await blockchainData.sync()
    consola.success('Running blockchain sync task finished.')
    return { result: 'Success' }
  })
})
