import consola from 'consola'
import useBlockchainData from '../utils/useBlockchainData'

export default defineTask({
  meta: {
    name: 'onchain-sync',
    description: 'Syncs all addresses with the bitcoin blockchain',
  },
  async run({ payload, context }) {
    const blockchainData = useBlockchainData()
    consola.start('Running blockchain sync task ...')
    await blockchainData.sync()
    consola.success('Running blockchain sync task finished.')
    return { result: 'Success' }
  },
})
