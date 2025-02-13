export default class BlockchainData {
  addresses: {
    address: string,
    sats: number,
  }[]

  constructor() {
    this.addresses = []
  }

  addAddress(address: string) {
    this.addresses.push({
      address,
      sats: 0,
    })
  }

  async sync() {

  }
}
