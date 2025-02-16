/* eslint-disable @typescript-eslint/no-explicit-any */
import { SocketClient } from '../socket/socket_client'

declare module '@keep-network/electrum-client-js' {
  class ElectrumClient extends SocketClient {
    constructor(host: any, port: any, protocol: any, options?: any)
    connect(clientName?: any, electrumProtocolVersion?: any, persistencePolicy?: { maxRetry: number; callback: any }): Promise<void>

    timeLastCall: number
    request(method: any, params: any): Promise<any>
    /**
     * Ping the server to ensure it is responding, and to keep the session alive.
     * The server may disconnect clients that have sent no requests for roughly 10
     * minutes. It sends a ping request every 2 minutes. If the request fails it
     * logs an error and closes the connection.
     */
    keepAlive(): Promise<void>
    keepAliveHandle: NodeJS.Timeout | null
    onClose(): void
    server_version(client_name: any, protocol_version: any): Promise<any>
    server_banner(): Promise<any>
    server_ping(): Promise<any>
    server_addPeer(features: any): Promise<any>
    server_donation_address(): Promise<any>
    server_features(): Promise<any>
    server_peers_subscribe(): Promise<any>
    blockchain_address_getProof(address: any): Promise<any>
    blockchain_scripthash_getBalance(scripthash: any): Promise<any>
    blockchain_scripthash_getHistory(scripthash: any): Promise<any>
    blockchain_scripthash_getMempool(scripthash: any): Promise<any>
    blockchain_scripthash_listunspent(scripthash: any): Promise<any>
    blockchain_scripthash_subscribe(scripthash: any): Promise<any>
    blockchain_scripthash_unsubscribe(scripthash: any): Promise<any>
    blockchain_block_header(height: any, cpHeight?: number): Promise<any>
    blockchain_block_headers(startHeight: any, count: any, cpHeight?: number): Promise<any>
    blockchainEstimatefee(number: any): Promise<any>
    blockchain_headers_subscribe(): Promise<any>
    blockchain_relayfee(): Promise<any>
    blockchain_transaction_broadcast(rawtx: any): Promise<any>
    blockchain_transaction_get(tx_hash: any, verbose: any): Promise<any>
    blockchain_transaction_getMerkle(tx_hash: any, height: any): Promise<any>
    mempool_getFeeHistogram(): Promise<any>
    blockchain_utxo_getAddress(tx_hash: any, index: any): Promise<any>
    blockchain_numblocks_subscribe(): Promise<any>
    blockchain_block_getChunk(index: any): Promise<any>
    blockchain_address_getBalance(address: any): Promise<any>
    blockchain_address_getHistory(address: any): Promise<any>
    blockchain_address_getMempool(address: any): Promise<any>
    blockchain_address_listunspent(address: any): Promise<any>
    blockchain_address_subscribe(address: any): Promise<any>
  }
}
