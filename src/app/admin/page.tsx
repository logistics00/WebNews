import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import db from '@/db/db'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import Link from 'next/link'
import logging from '@/lib/logging'

async function getSalesData() {
  logging({ rootPath: 'admin/page.tsx[7]', func: 'getSalesData' })
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  })
  await wait(2000)

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  }
}

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

async function getUserData() {
  logging({ rootPath: 'admin/page.tsx[25]', func: 'getUserData' })
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ])

  return {
    userCount,
    averageValuePerUser: userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  }
}

async function getProductData() {
  logging({ rootPath: 'admin/page.tsx[40]', func: 'getProductData' })
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ])

  return { activeCount, inactiveCount }
}

async function getWebNewsData() {
  logging({ rootPath: 'admin/page.tsx[50]', func: 'getWebNewsData' })
  const webnews = await db.webNews.findMany()
  const pages = [...new Set(webnews.map((webnew) => webnew.page))]

  let webnewsPagesTypes = []
  let webnewsTypes = []

  for (let i = 0; i < pages.length; i++) {
    // Get amount of records on each page
    const pageRecords = await db.webNews.findMany({
      where: {
        page: pages[i],
      },
    })
    const amountPage = '/' + pageRecords.length + ' '

    // Get amount of records on each type
    const types = [...new Set(pageRecords.map((record) => record.type))]

    for (let j = 0; j < types.length; j++) {
      const typeRecords = await db.webNews.count({
        where: {
          type: types[j],
        },
      })
      const amountType = '/' + typeRecords + ' '
      webnewsTypes.push(types[j])
      webnewsTypes.push(amountType)
    }
    const pageLink = <Link className="text-pink-600"href={`/admin/webnews/${pages[i]}/display`}>{pages[i]}{amountPage}</Link>

    webnewsPagesTypes.push([pageLink, webnewsTypes])
    webnewsTypes = []
  }

  for (let k = pages.length; k < 20; k++) {
    webnewsPagesTypes.push([])
  }
  return { webnewsPagesTypes }
}

export default async function AdminDashboard() {
  logging({ rootPath: 'admin/page.tsx[50]', func: 'AdminDashboard' })
  const [salesData, userData, productData, webnewsData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
    getWebNewsData(),
  ])

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      <DashboardCard
        title='Sales'
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title='Customers'
        subtitle={`${formatCurrency(userData.averageValuePerUser)} Average Value`}
        body={formatNumber(userData.userCount)}
      />
      <DashboardCard
        title='Active Products'
        subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
        body={formatNumber(productData.activeCount)}
      />
      <WebNewsCard
        title='WebNews'
        subtitle='De webnews gegevens staan per blad op een nieuwe regel'
        body={webnewsData.webnewsPagesTypes}
      />
      {/* <DashboardCard title='Active WebNews' subtitle={''} body={formatNumber(webnewsData.countWebnews)} /> */}
    </div>
  )
}

type DashboardCardProps = {
  title: string
  subtitle: string
  body: string
}

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  logging({ rootPath: 'admin/page.tsx[81]', func: 'DashboardCard' })
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col'>
        <p>{body}</p>
      </CardContent>
    </Card>
  )
}

type WebNewsCardProps = {
  title: string
  subtitle: string
  body: any
}

function WebNewsCard({ title, subtitle, body }: WebNewsCardProps) {
  logging({ rootPath: 'admin/page.tsx[81]', func: 'DashboardCard' })
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col'>
        <ul>
          <li key={body[27].page}>{body[27]}</li>
          <li key={body[26].page}>{body[26]}</li>
          <li key={body[25].page}>{body[25]}</li>
          <li key={body[24].page}>{body[24]}</li>
          <li key={body[23].page}>{body[23]}</li>
          <li key={body[22].page}>{body[22]}</li>
          <li key={body[21].page}>{body[21]}</li>
          <li key={body[20].page}>{body[20]}</li>
          <li key={body[16].page}>{body[16]}</li>
          <li key={body[20].page}>{body[20]}</li>
          <li key={body[19].page}>{body[19]}</li>
          <li key={body[18].page}>{body[18]}</li>
          <li key={body[17].page}>{body[17]}</li>
          <li key={body[16].page}>{body[16]}</li>
          <li key={body[15].page}>{body[15]}</li>
          <li key={body[14].page}>{body[14]}</li>
          <li key={body[13].page}>{body[13]}</li>
          <li key={body[12].page}>{body[12]}</li>
          <li key={body[11].page}>{body[11]}</li>
          <li key={body[10].page}>{body[10]}</li>
          <li key={body[9].page}>{body[9]}</li>
          <li key={body[8].page}>{body[8]}</li>
          <li key={body[7].page}>{body[7]}</li>
          <li key={body[6].page}>{body[6]}</li>
          <li key={body[5].page}>{body[5]}</li>
          <li key={body[4].page}>{body[4]}</li>
          <li key={body[3].page}>{body[3]}</li>
          <li key={body[2].page}>{body[2]}</li>
          <li key={body[1].page}>{body[1]}</li>
          <li key={body[0].page}>{body[0]}</li>
        </ul>
      </CardContent>
    </Card>
  )
}
2
