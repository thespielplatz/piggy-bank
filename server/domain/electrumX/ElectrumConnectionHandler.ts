import consola from 'consola'
import { ElectrumClient } from './ElectrumClient'
import { addTimeout, TimeoutError } from '~/server/utils/addTimeout'

const DEFAULT_TIMEOUT = 10_000

type ConnectionParameters = {
  server: string
  port: number
  protocolVersion: string
}

type ConnectionState = 'connected' | 'connecting' | 'disconnected'
export default class ElectrumConnectionHandler {
  connectionParams: ConnectionParameters
  private clientName: string

  private client: ElectrumClient
  private connectionState: ConnectionState = 'disconnected'
  private connectionPromise?: Promise<ElectrumClient>
  private connectionResolve?: (client: ElectrumClient) => void

  constructor(connectionParams: ConnectionParameters, clientName: string) {
    this.client = new ElectrumClient(connectionParams.server, connectionParams.port, 'tls')
    this.connectionParams = connectionParams
    this.clientName = clientName
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

    if (this.connectionState != 'connecting') {
      setImmediate(async () => {
        await this.connect()
      })
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

  async connect() {
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
      throw error
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
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onConnectionError(error: any) {
    consola.info('ElectrumConnectionHandler.onConnectionError', error)
    this.connectionState = 'disconnected'
  }

  private terminateClient() {
    this.client.close()
    this.connectionState = 'disconnected'
  }
}
