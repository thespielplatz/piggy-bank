import { EventEmitter } from 'node:events'
import ElectrumClientBase from '@keep-network/electrum-client-js'
import consola from 'consola'
import type { RequestParams } from './models/RequestParams'
import { isGetBalanceRequest, isSubScribeRequest } from './models/RequestParams'
import type { PROTOCOL_METHOD } from './models/ProtocolMethod'
import { GetBalanceResult } from './models/blockchain/scripthash/GetBalance'
import { SubscribeResult } from './models/blockchain/scripthash/Subscribe'
import { isServerVersionRequest, ServerVersionResult } from './models/server/ServerVersion'

const SERVER_PING_INTERVAL = 65_000

type ConnectionEvents = 'connect' | 'close' | 'end' | 'error'

export class ElectrumClient extends ElectrumClientBase {
  private keepAliveInterval: number
  private lastPingTime: number = 0
  private connectionEmitter: EventEmitter = new EventEmitter()

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
          consola.info(`Ping to server at ${new Date().toISOString()}`)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: ConnectionEvents, listener: (...args: any[]) => void): this {
    this.connectionEmitter.on(event, listener)
    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected emitConnectionEvent(event: ConnectionEvents, ...args: any[]): void {
    this.connectionEmitter.emit(event, ...args)
  }

  onConnect() {
    super.onConnect()
    this.emitConnectionEvent('connect')
  }

  onClose() {
    super.onClose()
    this.emitConnectionEvent('close')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEnd(error: any) {
    super.onEnd(error)
    this.emitConnectionEvent('end')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError(error: any) {
    super.onError(error)
    this.emitConnectionEvent('error', error)
  }

  // Function overloads
  async request(params: Extract<RequestParams, { method: typeof PROTOCOL_METHOD.BLOCKCHAIN.SCRIPTHASH.GET_BALANCE }>): Promise<GetBalanceResult>
  async request(params: Extract<RequestParams, { method: typeof PROTOCOL_METHOD.BLOCKCHAIN.SCRIPTHASH.SUBSCRIBE }>): Promise<SubscribeResult>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async request(params: RequestParams): Promise<any>

  async request(params: RequestParams) {
    if (isGetBalanceRequest(params)) {
      const unknownResult = await this.blockchain_scripthash_getBalance(params.scriptHash)
      return GetBalanceResult.parse(unknownResult)
    }
    if (isSubScribeRequest(params)) {
      const unknownResult = await this.blockchain_scripthash_subscribe(params.scriptHash)
      return SubscribeResult.parse(unknownResult)
    }
    if (isServerVersionRequest(params)) {
      const unknownResult = this.server_version(params.clientName, params.protocolVersion)
      return ServerVersionResult.parse(unknownResult)
    }

    return await super.request(params.method, params.params)
  }
}
