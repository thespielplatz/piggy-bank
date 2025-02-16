import consola from 'consola'
import { ElectrumClient } from './ElectrumClient'
import { GetBalanceResult } from './models/blockchain/scripthash/GetBalance'
import type { RequestParams } from './models/RequestParams'
import { isGetBalanceRequest, isSubScribeRequest } from './models/RequestParams'
import { SubscribeResult } from './models/blockchain/scripthash/Subscribe'
import { PROTOCOL_METHOD } from './models/ProtocolMethod'
import { addTimeout } from '~/server/utils/addTimeout'

const DEFAULT_TIMEOUT = 10_000

type ConnectionParameters = {
  server: string
  port: number
  protocolVersion: string
}

type ConnectionState = 'connected' | 'connecting' | 'disconnected'
export default class ElectrumConnectionHandler {
  connectionParams: ConnectionParameters

  private client: ElectrumClient
  private connectionState: ConnectionState = 'disconnected'
  private connectionPromise?: Promise<ElectrumClient>
  private connectionResolve?: (client: ElectrumClient) => void

  constructor(connectionParams: ConnectionParameters) {
    this.client = new ElectrumClient(connectionParams.server, connectionParams.port, 'tls')
    this.connectionParams = connectionParams
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
        await this.client.connect()
      }, DEFAULT_TIMEOUT)
    } catch (error) {
      consola.error(`ElectrumConnectionHandler.connect unable to connect to electrumX server: ${DEFAULT_TIMEOUT / 1000} sec timeout reached.`, this.connectionParams, error)
      this.terminateClient()
      throw error
    }

    await this.checkServerProtocolVersion()
    await this.client.keepAlive()

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

  private async checkServerProtocolVersion() {
    try {
      const serverVersionResult = await addTimeout(async (): Promise<[serverName: string, protocolVersion: string]> => {
        return await this.client.request({
          method: PROTOCOL_METHOD.SERVER.VERSION,
          clientName: 'PiggyBank',
          protocolVersion: this.connectionParams.protocolVersion,
        })
      }, DEFAULT_TIMEOUT)
      consola.info(serverVersionResult)
    } catch (error) {
      consola.error(`ElectrumConnectionHandler.connect unable to connect to electrumX server: ${DEFAULT_TIMEOUT / 1000} sec timeout reached when querying serverProtocolVersions.`, this.connectionParams, error)
      this.terminateClient()
      throw error
    }
  }
}
