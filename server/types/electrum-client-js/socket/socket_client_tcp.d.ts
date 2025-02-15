/* eslint-disable @typescript-eslint/no-explicit-any */
import type net from 'node:net'

export class TCPSocketClient {
  constructor(self: any, host: any, port: any, protocol: any, options: any)
  host: any
  port: any
  client: net.Socket | import('tls').TLSSocket
  connect(): Promise<any>
  close(): Promise<void>
  send(data: any): void
}
