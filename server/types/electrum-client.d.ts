declare module 'electrum-client' {
  class ElectrumClient {
    constructor(port: number, hostname: string, type: string)
    async connect(): Promise<void>
    async close(): Promise<void>
    async server_version(clientName: string, protocolVersion: string): Promise<[serverName: string, protocolVersion: string]>
    async request(method: string, arguments: Array<string | number>): Promise<unknown>
  }
  export default ElectrumClient
}
