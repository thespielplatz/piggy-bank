import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'

let fileContent: string | false | null = null

export default defineEventHandler(async (event): Promise<string> => {
  if (fileContent == null) {
    try {
      const filePath = resolve(process.cwd(), 'data/imprint.html')
      fileContent = await fs.readFile(filePath, 'utf-8')
    } catch {
      fileContent = false
    }
  }

  if (fileContent === false) {
    throw new Error('Imprint not found')
  }

  setHeader(event, 'Content-Type', 'text/html')
  return fileContent
})
