export class BlockchainData {
  protected addresses: {
    address: string,
    sats: number,
  }[]

  constructor() {
    this.addresses = []
  }

  addAddress(address: string) {
    if (this.addresses.find(a => a.address === address)) {
      return
    }

    this.addresses.push({
      address,
      sats: 0,
    })
  }

  getBalance(address: string): number {
    return this.addresses.find(a => a.address === address)?.sats ?? 0
  }
}
