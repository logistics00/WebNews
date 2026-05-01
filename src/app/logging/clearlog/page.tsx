'use server'

import fs from 'fs'
import path from 'path'
import BackPreviousPage from '@/components/back-previous-page'

/**
 * This is a Next.js server component, which clears the file logging.json by
 * overwriting it with a single dummy log record.
 * The component renders a page with a button to go back to the previous page.
 *
 * @return {JSX.Element} The rendered page
 */
export default async function LogPage() {
  const filePath = path.join(process.cwd(), '/logging/logging.json')
  const fd = fs.openSync(filePath, 'w')
  // const logNew = '{"dummy":"dummy"}'
  const bytesWritten = fs.writeSync(fd, '{"dummy":"dummy"}')
  fs.closeSync(fd)

  return <BackPreviousPage />
}
