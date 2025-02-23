type Reasons = 'no-addresses' | 'no-servers'
export class BlockchainData {
  public reason: Reasons
  protected addresses: {
    address: string,
    sats: number,
  }[]

  constructor(reason: Reasons) {
    this.addresses = []
    this.reason = reason
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
