'use server'

import logging from './logging'

export async function isValidPassword(password: string, hashedPassword: string) {
  // console.log('src/lib/isValidPassword.ts[7]')
  // logging({ rootPath: 'lib/isValidPassword.ts[7]', func: 'isValidPassword' })
  // console.log('src/lib/isValidPassword.ts[9]')
  // Volgende regel voor aanmaken password
  // console.log(await hashPassword(password))
  //   return (await hashPassword(password)) === hashedPassword
  // }

  // async function hashPassword(password: string) {
  //   const arrayBuffer = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(password))

  //   return Buffer.from(arrayBuffer).toString('base64')
  return true
}
