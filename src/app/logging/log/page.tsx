'use server'

import fs from 'fs'
import path from 'path'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

/**
 * This is a Next.js server component, which renders a page with a table.
 * The table displays the logging records from the file logging.json.
 * The page is reachable at /logging/log.
 * The component reads the content of the logging.json file, and parses it
 * as a JSON array.
 * The component then renders the table with the logging records.
 * The table has three columns: "Datum-Tijd", "Pad, component en regelNr" and
 * "Functie", which correspond to the datetime, rootPath and func properties
 * of each logging record.
 * @return {JSX.Element} The rendered page
 */
export default async function LogPage() {
  // Read the content of json/data.json
  const filePath = path.join(process.cwd(), '/logging/logging.json')
  let fd = fs.openSync(filePath, 'r')
  const fileSize = fs.fstatSync(fd).size
  const buffer = Buffer.alloc(fileSize)
  const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0)
  fs.closeSync(fd)
  const fileContent = buffer.toString('utf8')
  const logData = JSON.parse(`[${fileContent}]`)
  const result = logData.shift()

  return (
    <div className='mt-10 max-w-7xl w-full mx-auto space-y-4 text-pink-500 bg-slate-200 p-8'>
      <h1 className='text-2xl font-bold'>Function Logrecords</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Datum-Tijd</TableHead>
            <TableHead>Pad, component en regelNr</TableHead>
            <TableHead>Functie</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logData.map(({ datetime, rootPath, func }: { datetime: string; rootPath: string; func: string }) => (
            <TableRow key={rootPath}>
              <TableCell>{datetime}</TableCell>
              <TableCell>/{rootPath}</TableCell>
              <TableCell>{func}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
