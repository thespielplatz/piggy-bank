import z from 'zod'
import type { UserSchema } from '~/server/domain/config'
import getKrakenBtcRate from '~/server/utils/getKrakenBtcRate'
import LnBits from '~/server/utils/LnBits'

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
  }).nullable(),
})
export type DashboardDto = z.infer<typeof DashboardDto>

export default defineLoggedInEventHandler(async (event, authUser) => {
  const user = authUser as UserSchema
  const lnbits = new LnBits({
    apiKey: user.lnbits.invoiceKey,
    url: user.lnbits.url,
  })
  const balance = await lnbits.getBalance()
  const lnurlPs = await lnbits.getLnurlPs()
  const lastPayment = await lnbits.getLastPayment()
  let address: string | null = null
  let lnurl: string | null = null

  const sats = Math.floor(balance / 1000)
  const btc = sats / 100_000_000
  const rate = await getKrakenBtcRate()
  const eur = Math.round(btc * rate * 100) / 100

  if (lnurlPs && lnurlPs.length > 0 && lnurlPs[0].username) {
    lnurl = lnurlPs[0].lnurl
    address = `${lnurlPs[0].username}@${new URL(user.lnbits.url).hostname}`
  }

  let payment = null
  if (lastPayment) {
    payment = {
      sats: Math.floor((lastPayment.amount || 0) / 1000),
      comment: lastPayment.comment || null,
      time: lastPayment.time || 0,
    }
  }

  return DashboardDto.parse({
    name: user.name,
    sats,
    eur,
    rate,
    lnurl,
    address,
    payment,
  })
})
