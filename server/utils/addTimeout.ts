import { setTimeout } from 'node:timers/promises'

export class TimeoutError extends Error {
  constructor(message = 'Operation timed out') {
    super(message)
    this.name = 'TimeoutError'
  }
}

export const addTimeout = async <R>(
  callback: () => Promise<R>,
  timeout = 5000,
): Promise<R> => {
  return Promise.race([
    callback(),
    (async () => {
      await setTimeout(timeout)
      throw new TimeoutError()
    })(),
  ])
}
