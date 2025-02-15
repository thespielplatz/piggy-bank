/* eslint-disable @typescript-eslint/no-explicit-any */
export class WebSocketClient {
  constructor(self: any, host: any, port: any, protocol: any, options: any)
  self: any
  host: any
  port: any
  protocol: any
  options: any
  client: any
  connect(): Promise<any>
  close(): Promise<void>
  send(data: any): void
}
