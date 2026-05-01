import db from '@/db/db'
import React from 'react'

type recordType = {
  page: string
  type: string
  column: number
  filePath: string
  core: string
}

export default async function ExistingPage({ params: { id } }: { params: { id: string } }) {
  const record = await db.webNews.findUnique({
    where: { id: id },
  })

  const { page, type, column, filePath, core } = record as recordType

  return (
    <>
      <div className='flex basis-full justify-center text-6xl text-yellow-200'>
        The record is already in WebNews
      </div>
      <div className='flex flex-col gap-2 ml-80 text-yellow-200'>
        <div className='flex text-3xl'>
          <p className='w-36 text-3xl'>Page:</p>
          <p className='text-3xl'>{page}</p>
        </div>
        <div className='flex text-3xl'>
          <p className='w-36 text-3xl'>Type:</p>
          <p className='text-3xl'>{type}</p>
        </div>
        <div className='flex text-6xl'>
          <p className='w-36 text-3xl'>Column:</p>
          <p className='text-3xl'>{column}</p>
        </div>
        <div className='flex text-6xl'>
          <p className='w-36 text-3xl'>filePath:</p>
          <p className='text-3xl'>{filePath}</p>
        </div>
        <div className='flex text-6xl'>
          <p className='w-36 text-3xl'>core:</p>
          <p className='text-3xl'>{core}</p>
        </div>
      </div>
    </>
  )
}

