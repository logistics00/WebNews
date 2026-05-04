import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const pages: { name: string; column: number; row: number }[] = [
  { column: 1, row: 1, name: 'DHZ' },
  { column: 1, row: 2, name: 'DHZ-Hulp' },
  { column: 1, row: 3, name: 'DHZ-Machine' },
  { column: 1, row: 4, name: 'DHZ-Ruimtes' },
  { column: 1, row: 5, name: 'Gereedschap' },
  { column: 1, row: 6, name: 'Verhuizing' },

  { column: 2, row: 1, name: 'Hobby' },
  { column: 2, row: 2, name: 'Wielrennen' },
  { column: 2, row: 3, name: 'EtenDrinken' },
  { column: 2, row: 4, name: 'Energie' },
  { column: 2, row: 5, name: 'Metamorfose' },
  { column: 2, row: 6, name: 'LivDobZim' },
  { column: 2, row: 7, name: 'Linux' },

  { column: 3, row: 1, name: 'JavaScript-React' },
  { column: 3, row: 2, name: 'NextJS' },
  { column: 3, row: 3, name: 'Software-2' },
  { column: 3, row: 4, name: 'Software-3' },
  { column: 3, row: 5, name: 'Software-4' },
  { column: 3, row: 6, name: 'Deploy-Hosting' },
  { column: 3, row: 7, name: 'AutoHotkey' },

  { column: 4, row: 1, name: 'Packages' },
  { column: 4, row: 2, name: 'Packages-2' },
  { column: 4, row: 3, name: 'Databases' },
  { column: 4, row: 4, name: 'CSS-HTML-HTTP' },
  { column: 4, row: 5, name: 'MS' },
  { column: 4, row: 6, name: 'Web-DB-OS-GitHub' },
  { column: 4, row: 7, name: 'AI' },

  { column: 5, row: 1, name: 'Divers' },
  { column: 5, row: 2, name: 'Moestuin' },
  { column: 5, row: 3, name: 'Tuin' },
  { column: 5, row: 4, name: 'Tuin-Inrichting' },
  { column: 5, row: 5, name: 'AHK_Hero_Group' },
]

async function main() {
  for (const p of pages) {
    await prisma.page.upsert({
      where: { name: p.name },
      update: { column: p.column, row: p.row },
      create: p,
    })
  }
  const total = await prisma.page.count()
  console.log(`Seeded. Total Page rows: ${total}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
