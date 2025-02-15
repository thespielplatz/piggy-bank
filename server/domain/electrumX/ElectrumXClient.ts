import ElectrumClient from '@keep-network/electrum-client-js'
import consola from 'consola'
import { GetBalanceResult } from './models/blockchain/scripthash/GetBalance'
import type { RequestParams } from './models/RequestParams'
import { isGetBalanceRequest, isSubScribeRequest } from './models/RequestParams'
import { SubscribeParams, SubscribeResult } from './models/blockchain/scripthash/Subscribe'
import { METHOD } from './models/Method'
import { addTimeout } from '~/server/utils/addTimeout'

const DEFUALT_TIMEOUT = 10_000

type ConnectionParameters = {
  server: string
  port: number
  protocolVersion: string
}

export default class ElectrumXClient {
  client: ElectrumClient
  connectionParams: ConnectionParameters
  connected = false

  constructor(connectionParams: ConnectionParameters) {
    this.client = new ElectrumClient(connectionParams.server, connectionParams.port, 'tls')
    this.connectionParams = connectionParams
  }

  async checkConnection() {
    if (this.connected) {
      return
    }

    await this.connect()
  }

  async connect() {
    consola.info('Connecting to electrumX server', this.connectionParams)
    try {
      await addTimeout(async (): Promise<void> => {
        await this.client.connect()
      }, DEFUALT_TIMEOUT)
    } catch (error) {
      consola.error(`ElectrumXClient.connect unable to connect to electrumX server: ${DEFUALT_TIMEOUT / 1000} sec timeout reached.`, this.connectionParams, error)
      this.terminateClient()
      throw error
    }
    this.connected = true
    await this.checkServerProtocolVersion()
  }

  private terminateClient() {
    this.connected = false
    this.client.close()
  }

  private async checkServerProtocolVersion() {
    try {
      const serverVersionResult = await addTimeout(async (): Promise<[serverName: string, protocolVersion: string]> => {
        return await this.client.server_version('PiggyBank', this.connectionParams.protocolVersion)
      }, DEFUALT_TIMEOUT)
      consola.info(serverVersionResult)
    } catch (error) {
      consola.error(`ElectrumXClient.connect unable to connect to electrumX server: ${DEFUALT_TIMEOUT / 1000} sec timeout reached when querying serverProtocolVersions.`, this.connectionParams, error)
      this.terminateClient()
      throw error
    }

    this.client.events.on(METHOD.BLOCKCHAIN.SCRIPTHASH.SUBSCRIBE, console.log)
  }

  // Function overloads
  async request(params: Extract<RequestParams, { method: typeof METHOD.BLOCKCHAIN.SCRIPTHASH.GET_BALANCE }>): Promise<GetBalanceResult>
  async request(params: Extract<RequestParams, { method: typeof METHOD.BLOCKCHAIN.SCRIPTHASH.SUBSCRIBE }>): Promise<SubscribeResult>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async request(params: RequestParams): Promise<any>

  async request(params: RequestParams) {
    if (isGetBalanceRequest(params)) {
      const unknownResult = await this.client.blockchain_scripthash_getBalance(params.scriptHash)
      return GetBalanceResult.parse(unknownResult)
    }
    if (isSubScribeRequest(params)) {
      const unknownResult = await this.client.blockchain_scripthash_subscribe(params.scriptHash)
      return SubscribeResult.parse(unknownResult)
    }

    return await this.client.request(params.method, params.params)
  }
}
