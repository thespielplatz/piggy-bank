import { strict as assert } from 'node:assert'
import consola from 'consola'
import { ElectrumClient } from './ElectrumClient'
import type { ElectrumXServer } from './models/ElectrumXServer'
import { addTimeout, TimeoutError } from '~/server/utils/addTimeout'

const DEFAULT_TIMEOUT = 30_000
const DEFAULT_AUTO_RECONNECT_INTERVAL = 1_000

type BitcoinNetwork = 'mainnet' | 'testnet'
type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'reconnecting'
export default class ElectrumConnectionHandler {
  private electrumXServers: ElectrumXServer[]
  private electrumXServerIndex: number = 0
  private clientName: string
  private network: BitcoinNetwork

  private client: ElectrumClient | null
  private connectionState: ConnectionState = 'disconnected'
  private connectionPromise?: Promise<ElectrumClient>
  private connectionResolve?: (client: ElectrumClient) => void
  private autoReconnectInterval: number

  constructor(params: {
    electrumXServers: ElectrumXServer[],
    clientName: string,
    network?: BitcoinNetwork,
    autoReconnectInterval?: number,
  }) {
    this.client = null
    this.electrumXServers = params.electrumXServers
    this.clientName = params.clientName
    this.network = params.network || 'mainnet'
    this.autoReconnectInterval = params.autoReconnectInterval || DEFAULT_AUTO_RECONNECT_INTERVAL
  }

  async getConnectedClient(): Promise<ElectrumClient> {
    if (this.connectionState == 'connected') {
      assert(this.client != null, 'Client is null')
      return this.client
    }

    if (!this.connectionPromise) {
      this.connectionPromise = new Promise((resolve) => {
        this.connectionResolve = resolve
      })
    }

    if (this.connectionState == 'disconnected') {
      this.connect()
    }

    return this.connectionPromise
  }

  private resolveClientConnected(): void {
    if (this.connectionResolve) {
      assert(this.client != null, 'Client is null')
      this.connectionResolve(this.client)
      this.connectionPromise = undefined
      this.connectionResolve = undefined
    }
  }

  connect() {
    this.connectionState = 'connecting'
    setImmediate(async () => {
      await this.innerConnect()
    })
  }

  autoReconnect() {
    if (this.autoReconnectInterval <= 0) {
      this.connectionState = 'disconnected'
      return
    }

    this.connectionState = 'reconnecting'
    setTimeout(() => {
      this.connect()
    }, this.autoReconnectInterval)
  }

  private async innerConnect() {
    assert(this.connectionState == 'connecting', 'Invalid connection state')
    const params = this.getNextConnectionParams()
    const client = new ElectrumClient(params.server, params.port, 'tls')

    consola.info('Connecting to electrumX server', params)
    try {
      await addTimeout(async (): Promise<void> => {
        await client.connect(this.clientName, params.protocolVersion)
      }, DEFAULT_TIMEOUT)
    } catch (error) {
      if (error instanceof TimeoutError) {
        consola.error(`ElectrumConnectionHandler.connect unable to connect to electrumX server: ${DEFAULT_TIMEOUT / 1000} sec timeout reached.`, params, error)
      } else {
        consola.error('Connection Error:', error)
      }
      this.autoReconnect()
      return
    }
    consola.success('Connected to electrumX server')

    client.on('close', this.onConnectionClosed.bind(this))
    client.on('end', this.onConnectionEnd.bind(this))
    client.on('error', this.onConnectionError.bind(this))

    this.client = client
    this.connectionState = 'connected'
    this.resolveClientConnected()
  }

  private onConnectionClosed() {
    consola.info('ElectrumConnectionHandler.onConnectionClosed')
    this.setStateDisconnected()
    this.autoReconnect()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onConnectionEnd(error: any) {
    consola.info('ElectrumConnectionHandler.onConnectionEnd', error)
    this.setStateDisconnected()
    this.autoReconnect()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onConnectionError(error: any) {
    consola.info('ElectrumConnectionHandler.onConnectionError', error)
    this.setStateDisconnected()
    this.autoReconnect()
  }

  private setStateDisconnected() {
    if (this.client != null) {
      this.client = null
    }
    this.connectionState = 'disconnected'
  }

  private getNextConnectionParams(): ElectrumXServer {
    const electrumServersFilteredByNetwork = this.electrumXServers.filter(server => server.isTestnet == (this.network == 'testnet'))
    assert(electrumServersFilteredByNetwork.length >= 1, `No electrumX servers configured for ${this.network}`)

    const electrumXServer = electrumServersFilteredByNetwork[this.electrumXServerIndex]
    this.electrumXServerIndex = (this.electrumXServerIndex + 1) % electrumServersFilteredByNetwork.length
    return electrumXServer
  }
}
