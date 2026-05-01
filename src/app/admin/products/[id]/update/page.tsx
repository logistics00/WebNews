import React from 'react'
import db from '../../../../../db/db'
import { PageHeader } from '../../../_components/PageHeader'
import { ProductForm } from '../../_components/ProductForm'
import logging from '../../../../../lib/logging'

export default async function UpdateProductPage({ params: { id } }: { params: { id: string } }) {
  logging({ rootPath: 'admin/products/[id]/update]/page.tsx[11]', func: 'UpdateProductPage' })
  const product = await db.product.findUnique({ where: { id } })
  return (
    <>
      <PageHeader>Update Product</PageHeader>
      <ProductForm product={product} />
    </>
  )
}
