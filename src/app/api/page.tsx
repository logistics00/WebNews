import type, { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Table = {
  name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let tables
  try {
    // Voer een ruwe SQL-query uit om de tabelnamen op te vragen
    tables = await prisma.$queryRaw<Table[]>`
      SELECT name FROM sqlite_master WHERE type='table'
    `
    // Verstuur de lijst van tabellen als JSON-respons
  } catch (error) {
    console.error('Error fetching tables:', error)
    return JSON.stringify({ error: 'Failed to fetch tables' })
  } finally {
    await prisma.$disconnect()
  }

  return tables.map((table) => `${table.name}, `)
}
