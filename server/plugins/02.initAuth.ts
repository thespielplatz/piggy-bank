import consola from 'consola'
import { userProvider } from '../utils/userProvider'

export default defineNitroPlugin(() => {
  consola.info('Configuring Auth Plugin')
  useUserProvider().set(userProvider)
})
