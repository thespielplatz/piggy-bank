import z from 'zod'
import type { UserSchema } from '~/server/domain/config'
import getKrakenBtcRate from '~/server/utils/getKrakenBtcRate'

export const DashboardDto = z.object({
  name: z.string(),
  sats: z.number(),
  eur: z.number(),
  rate: z.number(),
})
export type DashboardDto = z.infer<typeof DashboardDto>

export default defineLoggedInEventHandler(async (event, authUser) => {
  const user = authUser as UserSchema
  const response = await fetch(`${user.lnbits.url}/api/v1/wallet`, {
    headers: {
      'X-Api-Key': user.lnbits.invoiceKey,
    },
  })

  if (!response.ok) {
    throw new Error(`Fetch error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json() as { balance: number }
  const sats = Math.floor(data.balance / 1000)
  const btc = sats / 100_000_000
  const rate = await getKrakenBtcRate()
  const eur = Math.round(btc * rate * 100) / 100

  return DashboardDto.parse({
    name: user.name,
    sats,
    eur,
    rate,
  })
})
