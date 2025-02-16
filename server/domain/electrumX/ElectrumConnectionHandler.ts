import consola from 'consola'
import { ElectrumClient } from './ElectrumClient'
import { addTimeout, TimeoutError } from '~/server/utils/addTimeout'

const DEFAULT_TIMEOUT = 30_000
const DEFAULT_AUTO_RECONNECT_INTERVAL = 1_000

type ConnectionParameters = {
  server: string
  port: number
  protocolVersion: string
}

type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'reconnecting'
export default class ElectrumConnectionHandler {
  connectionParams: ConnectionParameters
  private clientName: string

  private client: ElectrumClient
  private connectionState: ConnectionState = 'disconnected'
  private connectionPromise?: Promise<ElectrumClient>
  private connectionResolve?: (client: ElectrumClient) => void
  private autoReconnectInterval: number

  constructor(params: {
    connectionParams: ConnectionParameters,
    clientName: string,
    autoReconnectInterval?: number,
  }) {
    this.client = new ElectrumClient(params.connectionParams.server, params.connectionParams.port, 'tls')
    this.connectionParams = params.connectionParams
    this.clientName = params.clientName
    this.autoReconnectInterval = params.autoReconnectInterval || DEFAULT_AUTO_RECONNECT_INTERVAL
  }

  async getConnectedClient(): Promise<ElectrumClient> {
    if (this.connectionState == 'connected') {
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
      this.connectionResolve(this.client)
      this.connectionPromise = undefined
      this.connectionResolve = undefined
    }
  }

  connect() {
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
    setTimeout(async () => {
      await this.innerConnect()
    }, this.autoReconnectInterval)
  }

  private async innerConnect() {
    this.connectionState = 'connecting'
    consola.info('Connecting to electrumX server', this.connectionParams)
    try {
      await addTimeout(async (): Promise<void> => {
        await this.client.connect(this.clientName, this.connectionParams.protocolVersion)
      }, DEFAULT_TIMEOUT)
    } catch (error) {
      if (error instanceof TimeoutError) {
        consola.error(`ElectrumConnectionHandler.connect unable to connect to electrumX server: ${DEFAULT_TIMEOUT / 1000} sec timeout reached.`, this.connectionParams, error)
      } else {
        consola.error('Connection Error:', error)
      }
      this.terminateClient()
      this.autoReconnect()
      return
    }
    consola.info('Connected to electrumX server', this.connectionParams)

    this.client.on('close', this.onConnectionClosed)
    this.client.on('error', this.onConnectionError)

    this.connectionState = 'connected'
    this.resolveClientConnected()
  }

  private onConnectionClosed() {
    consola.info('ElectrumConnectionHandler.onConnectionClosed')
    this.connectionState = 'disconnected'
    this.autoReconnect()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onConnectionError(error: any) {
    consola.info('ElectrumConnectionHandler.onConnectionError', error)
    this.connectionState = 'disconnected'
    this.autoReconnect()
  }

  private terminateClient() {
    this.client.close()
    this.connectionState = 'disconnected'
  }
}
