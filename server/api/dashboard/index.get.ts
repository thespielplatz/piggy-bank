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
  onchain: z.array(z.object({
    label: z.string(),
    address: z.string(),
  })),
})
export type DashboardDto = z.infer<typeof DashboardDto>

export default defineLoggedInEventHandler(async (event, authUser) => {
  const user = authUser as UserSchema
  const lnbits = new LnBits({
    apiKey: user.lnbits.invoiceKey,
    url: user.lnbits.url,
  })
  const lnbitsBalance = await lnbits.getBalance()
  const lnurlPs = await lnbits.getLnurlPs()
  const lastLnbitsPayment = await lnbits.getLastPayment()
  const lnbitsSats = Math.floor(lnbitsBalance / 1000)

  const blockchainData = useBlockchainData()
  let onchainSats = 0
  user.onchain?.forEach((onchain) => {
    if (typeof onchain === 'string') {
      onchainSats += blockchainData.getBalance(onchain)
    } else {
      onchainSats += blockchainData.getBalance(onchain.address)
    }
  })

  const sats = lnbitsSats + onchainSats

  const btc = sats / 100_000_000
  const rate = await getKrakenBtcRate()
  const eur = Math.round(btc * rate * 100) / 100

  let address: string | null = null
  let lnurl: string | null = null

  if (lnurlPs && lnurlPs.length > 0 && lnurlPs[0].username) {
    lnurl = lnurlPs[0].lnurl
    address = `${lnurlPs[0].username}@${new URL(user.lnbits.url).hostname}`
  }

  let payment = null
  if (lastLnbitsPayment) {
    payment = {
      sats: Math.floor((lastLnbitsPayment.amount || 0) / 1000),
      comment: lastLnbitsPayment.comment || null,
      time: lastLnbitsPayment.time || 0,
    }
  }

  const onchain = user.onchain?.map((onchain) => {
    if (typeof onchain === 'string') {
      return { label: 'OnChain', address: onchain }
    }
    return onchain
  })

  return DashboardDto.parse({
    name: user.name,
    sats,
    eur,
    rate,
    lnurl,
    address,
    payment,
    onchain,
  })
})
