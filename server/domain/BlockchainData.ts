type State = 'no-addresses' | 'no-servers' | 'ok'
export class BlockchainData {
  public reason: State
  protected addresses: {
    address: string,
    sats: number,
  }[]

  constructor(reason: State) {
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
