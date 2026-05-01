'use server'

import fs from 'fs'
import path from 'path'

type LoggingProps = {
  rootPath: string // The path from the root and name[lineNr] of component
  func: string // The name of the function within the component
}

export default async function logging({ rootPath, func }: LoggingProps) {
  const goLogging = true

  if (goLogging) {
    const dateTime = DateTime()
    const filePath = path.join(process.cwd(), '/logging/logging.json')

    try {
      fs.appendFileSync(filePath, `,{"datetime":"${dateTime}","rootPath":"${rootPath}","func":"${func}"}`)
    } catch (err) {}
  }
}

function DateTime() {
  const dateNew = new Date()
  const month = Char(dateNew.getMonth())
  const date = Char(dateNew.getDate())
  const hours = Char(dateNew.getHours())
  const minutes = Char(dateNew.getMinutes())
  const secs = dateNew.getSeconds()
  const milisecs = dateNew.getMilliseconds()

  const datetime = `${month}/${date} - ${hours}:${minutes} - ${(secs + milisecs / 1000).toFixed(3)}`
  return datetime
}

function Char(input: number) {
  return input < 10 ? `0${input}` : `${input}`
}

function GetLocalData() {
  const filePath = path.join(process.cwd(), '/logging/logging.json')
  const fd = fs.openSync(filePath, 'r')
  const fileSize = fs.fstatSync(fd).size
  const buffer = Buffer.alloc(fileSize)
  const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0)
  fs.closeSync(fd)

  const fileContent = buffer.toString('utf8')
  return JSON.parse(fileContent)
}

function SetLocalData({ inputData }: any) {
  const filePath = path.join(process.cwd(), '/logging/logging.json')
  const fd = fs.openSync(filePath, 'w')
  const bytesWritten = fs.writeSync(fd, JSON.stringify(inputData))
  fs.closeSync(fd)
}
