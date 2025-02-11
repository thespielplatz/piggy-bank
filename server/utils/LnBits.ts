import { z } from 'zod'

const LnUrlPayItem = z.object({
  username: z.string().nullable(),
  lnurl: z.string(),
})

type LnUrlPayItem = z.infer<typeof LnUrlPayItem>

const LnUrlPayResponse = z.array(LnUrlPayItem)

type LnUrlPayResponse = z.infer<typeof LnUrlPayResponse>

const PaymentItem = z.object({
  amount: z.number(),
  extra: z.object({
    comment: z.array(z.string()).optional(),
  }),
  time: z.number(),
})

type PaymentItem = z.infer<typeof PaymentItem>

const PaymentResponse = z.array(PaymentItem)

export default class LnBits {
  apiKey: string
  url: string

  constructor({ apiKey, url }: { apiKey: string, url: string }) {
    this.apiKey = apiKey
    this.url = url
  }

  async getBalance() {
    const response = await fetch(`${this.url}/api/v1/wallet`, this.getFetchOptions())

    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json() as { balance: number }
    return data.balance
  }

  async getLnurlPs(): Promise<LnUrlPayResponse | null> {
    const response = await fetch(`${this.url}/lnurlp/api/v1/links`, this.getFetchOptions())

    if (!response.ok) {
      // If there are no lnurlp or extension installed it return 403
      return null
    }

    return LnUrlPayResponse.parse(await response.json())
  }

  async getLastPayment() {
    const response = await fetch(`${this.url}/api/v1/payments?limit=1`, this.getFetchOptions())

    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status} ${response.statusText}`)
    }

    const json = await response.json()
    const data = PaymentResponse.parse(json)
    if (data.length == 0) {
      return null
    }
    const comment = data[0].extra.comment?.join(' ') || null
    return {
      amount: data[0].amount,
      comment,
      time: data[0].time,
    }
  }

  private getFetchOptions = () => ({
    headers: {
      'X-Api-Key': this.apiKey,
    },
  })
}
