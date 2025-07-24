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
  memo: z.string().nullable().optional(),
  extra: z.object({
    comment: z.string().optional().nullable(),
  }),
  time: z
    .string()
    .transform((val) => {
      const [datePart] = val.split('.')
      return new Date(datePart).getTime() / 1000
    })
    .describe('Transaction time'),
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
    console.log('LnBits getLastPayment response:', json)
    const data = PaymentResponse.parse(json)
    if (data.length == 0) {
      return null
    }
    const comment = data[0].extra.comment || data[0].memo || null
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
