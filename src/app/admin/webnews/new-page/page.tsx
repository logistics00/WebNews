import logging from '@/lib/logging'
import { PageHeader } from '../../_components/PageHeader'
import { AddPageForm } from './AddPageForm'

export default function NewPagePage() {
  logging({ rootPath: 'admin/webnews/new-page/page.tsx', func: 'NewPagePage' })
  return (
    <>
      <PageHeader>Add Page</PageHeader>
      <AddPageForm />
    </>
  )
}
