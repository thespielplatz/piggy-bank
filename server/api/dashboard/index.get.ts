import z from 'zod'
import { UserSchema } from '~/server/domain/config'
import formatSats from '~/utils/formatSats'

export const DashboardDto = z.object({
  name: z.string(),
  sats: z.number(),
})
export type DashboardDto = z.infer<typeof DashboardDto>

export default defineLoggedInEventHandler(async (event, authUser) => {
  const user = authUser as UserSchema
  const config = useConfig()

  const response = await fetch(`${user.lnbits.url}/api/v1/wallet`, {
    headers: {
      'X-Api-Key': user.lnbits.invoiceKey
    },
  })

  if (!response.ok) {
    throw new Error(`Fetch error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json() as { balance: number }
  const sats = Math.floor(data.balance / 1000)

  return DashboardDto.parse({
    name: user.name,
    sats,
  })
})
