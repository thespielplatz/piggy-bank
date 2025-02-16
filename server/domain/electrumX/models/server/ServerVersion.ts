import { z } from 'zod'
import type { RequestParams } from '../RequestParams'
import { PROTOCOL_METHOD } from '../ProtocolMethod'

export const ServerVersionResult = z.array(z.string())

export type ServerVersionResult = z.infer<typeof ServerVersionResult>

export const isServerVersionRequest = (params: RequestParams): params is Extract<RequestParams, { method: typeof PROTOCOL_METHOD.SERVER.VERSION }> => {
  return params.method === PROTOCOL_METHOD.SERVER.VERSION
}
