export const getOnchainAddresses = () => {
  const addresses: string[] = []
  const config = useConfig()

  if (config.users) {
    config.users.flatMap(user => user.onchain ?? []).map(onchain => typeof onchain == 'string' ? onchain : onchain.address).forEach(address => addresses.push(address))
  }
  return addresses
}
