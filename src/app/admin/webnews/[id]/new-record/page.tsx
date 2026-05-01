import logging from '@/lib/logging'
import { PageHeader } from '../../../_components/PageHeader'
import { WebNewsForm } from '../../_components/WebNewsForm'

/**
 * This function renders a page to add a new webnews record for a given type.
 * It takes a string parameter "id" which is type for which the webnews record
 * should be entered.
 *
 * The component renders a RegistrationForm component which submits a form to the
 * onFormAction function.
 *
 * The onFormAction function processes the submitted form data and
 * enters the webnews record in the database.
 *
 * If the form data is invalid, the onFormAction function returns an object
 * with a message and an array of issues. The RegistrationForm component displays
 * this message and the issues in an error message.
 *
 * If the form data is valid, the onFormAction function redirects to the /admin/webnews/[page]/display
 * page.
 *
 * @param {{ params: { id: string } }} props - The id parameter is a string containing
 * the type for which the webnews record should be entered.
 * @returns {React.ReactElement} The component
 */
export default function NewProductPage() {
  logging({ rootPath: 'admin/webnews/[page]/new/page.tsx[28]', func: 'NewProductPage' })
  return (
    <>
      <PageHeader>Add WebNews</PageHeader>
      <WebNewsForm />
    </>
  )
}
