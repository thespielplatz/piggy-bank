import { z } from 'zod'
import { METHOD } from './Method'

export const RequestParams = z.union([
  z.object({
    method: z.literal(METHOD.BLOCKCHAIN.SCRIPTHASH.GET_BALANCE),
    scriptHash: z.string(),
  }),
  z.object({
    method: z.string(),
    params: z.array(z.union([z.string(), z.number()])),
  }),
])

export type RequestParams = z.infer<typeof RequestParams>

export const isGetBalanceRequest = (params: RequestParams): params is Extract<RequestParams, { method: typeof METHOD.BLOCKCHAIN.SCRIPTHASH.GET_BALANCE }> => {
  return params.method === METHOD.BLOCKCHAIN.SCRIPTHASH.GET_BALANCE
}
