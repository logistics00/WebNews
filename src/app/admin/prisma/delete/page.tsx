export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // optioneel maar veilig met Prisma

import db from '@/db/db'
import React from 'react'

export default async function PrismaDelete() {
    const data = await db.webNews.deleteMany({
      where: {
        page: 'Gereedschap',
        type: 'Afkortzaag',
        column: 1,
      },
    })

  return <h1>Prisma Delete</h1>
}
