'use server'

/**
 * Validates the given page string.
 * Checks if the page string contains at least one alphanumeric character
 * (letters a-z or A-Z and numbers 1-9).
 *
 * @param {string} page - The page string to validate.
 * @returns {Promise<boolean>} - A promise that resolves to true if the page
 * string is valid, otherwise false.
 */
export async function validatePage(page: string): Promise<boolean> {
  return /[a-z,A-Z,1-9]+/.test(page)
}
