import ElectrumClientBase from '@keep-network/electrum-client-js'
import consola from 'consola'

const SERVER_PING_INTERVAL = 10_000

export class ElectrumClient extends ElectrumClientBase {
  private keepAliveInterval: number
  private lastPingTime: number = 0

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(host: any, port: any, protocol: any, options?: any) {
    super(host, port, protocol, options)
    this.keepAliveInterval = SERVER_PING_INTERVAL
  }

  async keepAlive(): Promise<void> {
    // Prevent multiple intervals
    if (this.status === 0 || this.keepAliveHandle) {
      return
    }

    this.keepAliveHandle = setInterval(async () => {
      const now = Date.now()

      // Ping if there was no recent activity OR if no ping has been sent in a full keepAliveInterval
      if (
        this.timeLastCall === 0 // No calls ever made
        || now > this.timeLastCall + this.keepAliveInterval / 2 // Half interval rule
        || now > this.lastPingTime + this.keepAliveInterval // Ensure at least one ping every full interval
      ) {
        try {
          consola.info(`Ping to server at ${Date.now().toLocaleString()}`)
          await this.server_ping()
          this.lastPingTime = now
        } catch (err) {
          consola.error(`Ping to server failed: [${err}]`)
          this.stopKeepAlive()
          this.close()
        }
      }
    }, this.keepAliveInterval / 2)
  }

  stopKeepAlive(): void {
    if (this.keepAliveHandle) {
      clearInterval(this.keepAliveHandle)
      this.keepAliveHandle = null
    }
  }

  onClose() {
    super.onClose()
  }
}
