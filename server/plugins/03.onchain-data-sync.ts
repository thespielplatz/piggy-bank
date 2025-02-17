import consola from 'consola'

export default defineNitroPlugin(() => {
  consola.info('Onchain Data Sync Plugin')
  setImmediate(syncBlockchainData)
  setInterval(syncBlockchainData, 1000 * 15)
})

const syncBlockchainData = async () => {
  consola.start('Running blockchain sync task ...')
  const blockchainData = useBlockchainData()
  await blockchainData.sync()
  consola.success('Running blockchain sync task finished.')
}
