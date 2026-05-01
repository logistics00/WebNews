'use server'

export async function validateColumn(column: string): Promise<boolean> {
  console.log('validateColumn: ', column)
  return /[1-4]{0,1}/.test(column)
}
