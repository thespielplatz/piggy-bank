import z from 'zod'
import type { UserSchema } from '~/server/domain/config'
import getKrakenBtcRate from '~/server/utils/getKrakenBtcRate'

export const DashboardDto = z.object({
  name: z.string(),
  sats: z.number(),
  eur: z.number(),
  rate: z.number(),
  lnurl: z.string().nullable(),
  address: z.string().nullable(),
  payment: z.object({
    sats: z.number(),
    comment: z.string().nullable(),
    time: z.number(),
  }),
})
export type DashboardDto = z.infer<typeof DashboardDto>

export default defineLoggedInEventHandler(async (event, authUser) => {
  const user = authUser as UserSchema
  const balance = await getLnbitsBalance(user)
  const lnurlPay = await getLnbitsLnurlPay(user)
  const payment = await getLastLnbitsPayment(user)
  let address = null

  const sats = Math.floor(balance / 1000)
  const btc = sats / 100_000_000
  const rate = await getKrakenBtcRate()
  const eur = Math.round(btc * rate * 100) / 100

  if (lnurlPay && lnurlPay.username) {
    address = `${lnurlPay.username}@${new URL(user.lnbits.url).hostname}`
  }

  return DashboardDto.parse({
    name: user.name,
    sats,
    eur,
    rate,
    lnurl: lnurlPay?.lnurl,
    address,
    payment: {
      sats: Math.floor((payment?.amount || 0) / 1000),
      comment: payment?.comment || null,
      time: payment?.time || 0,
    },
  })
})

const getLnbitsBalance = async (user: UserSchema) => {
  const response = await fetch(`${user.lnbits.url}/api/v1/wallet`, {
    headers: {
      'X-Api-Key': user.lnbits.invoiceKey,
    },
  })

  if (!response.ok) {
    throw new Error(`Fetch error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json() as { balance: number }
  return data.balance
}

const LnUrlPayItem = z.object({
  username: z.string().nullable(),
  lnurl: z.string(),
})

type LnUrlPayItem = z.infer<typeof LnUrlPayItem>

const LnUrlPayResponse = z.array(LnUrlPayItem)

const getLnbitsLnurlPay = async (user: UserSchema): Promise<LnUrlPayItem | null> => {
  const response = await fetch(`${user.lnbits.url}/lnurlp/api/v1/links`, {
    headers: {
      'X-Api-Key': user.lnbits.invoiceKey,
    },
  })

  if (!response.ok) {
    throw new Error(`Fetch error: ${response.status} ${response.statusText}`)
  }

  const lnurlpays = LnUrlPayResponse.parse(await response.json())
  return lnurlpays.length === 0 ? null : lnurlpays[0]
}

const PaymentItem = z.object({
  amount: z.number(),
  extra: z.object({
    comment: z.array(z.string()).optional(),
  }),
  time: z.number(),
})

type PaymentItem = z.infer<typeof PaymentItem>

const PaymentResponse = z.array(PaymentItem)

const getLastLnbitsPayment = async (user: UserSchema) => {
  const response = await fetch(`${user.lnbits.url}/api/v1/payments?limit=1`, {
    headers: {
      'X-Api-Key': user.lnbits.invoiceKey,
    },
  })

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
