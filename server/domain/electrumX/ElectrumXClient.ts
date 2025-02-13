import ElectrumClient from 'electrum-client'
import consola from 'consola'
import { addTimeout } from '~/server/utils/addTimeout'

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
    this.client = new ElectrumClient(connectionParams.port, connectionParams.server, 'tls')
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
      })
    } catch (error) {
      consola.error('electrumX.getServerConnection unable to connect to electrumX server: 5 sec timeout reached.', this.connectionParams, error)
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
      })
      consola.info(serverVersionResult)
    } catch (error) {
      consola.error('electrumX.getServerConnection unable to connect to electrumX server: 5 sec timeout reached when querying serverProtocolVersions.', this.connectionParams, error)
      this.terminateClient()
      throw error
    }
  }

  async request(method: string, params: (string | number)[]) {
    return await this.client.request(method, params)
  }
}
