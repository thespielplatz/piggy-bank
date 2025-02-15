/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EventEmitter } from 'node:events'
import type * as util from './util/util'
import type { TCPSocketClient } from './socket_client_tcp'
import type { WebSocketClient } from './socket_client_ws'

export class SocketClient {
  constructor(host: any, port: any, protocol: any, options: any)
  id: number
  host: any
  port: any
  protocol: any
  options: any
  status: number
  callback_message_queue: object
  events: EventEmitter<[never]>
  mp: util.MessageParser
  client: TCPSocketClient | WebSocketClient
  connect(): Promise<any>
  close(): void
  response(msg: any): void
  onMessage(body: any, n: any): void
  onConnect(): void
  onClose(event: any): void
  onRecv(chunk: any): void
  onEnd(error: any): void
  onError(error: any): void
}
