import { z } from 'zod'
import { PROTOCOL_METHOD } from './ProtocolMethod'

export const RequestParams = z.union([
  z.object({
    method: z.literal(PROTOCOL_METHOD.SERVER.VERSION),
    clientName: z.string(),
    protocolVersion: z.string().default('1.4'),
  }),
  z.object({
    method: z.literal(PROTOCOL_METHOD.BLOCKCHAIN.SCRIPTHASH.GET_BALANCE),
    scriptHash: z.string(),
  }),
  z.object({
    method: z.literal(PROTOCOL_METHOD.BLOCKCHAIN.SCRIPTHASH.SUBSCRIBE),
    scriptHash: z.string(),
  }),
  z.object({
    method: z.string(),
    params: z.array(z.union([z.string(), z.number()])),
  }),
])

export type RequestParams = z.infer<typeof RequestParams>

export const isGetBalanceRequest = (params: RequestParams): params is Extract<RequestParams, { method: typeof PROTOCOL_METHOD.BLOCKCHAIN.SCRIPTHASH.GET_BALANCE }> => {
  return params.method === PROTOCOL_METHOD.BLOCKCHAIN.SCRIPTHASH.GET_BALANCE
}

export const isSubScribeRequest = (params: RequestParams): params is Extract<RequestParams, { method: typeof PROTOCOL_METHOD.BLOCKCHAIN.SCRIPTHASH.SUBSCRIBE }> => {
  return params.method === PROTOCOL_METHOD.BLOCKCHAIN.SCRIPTHASH.SUBSCRIBE
}
