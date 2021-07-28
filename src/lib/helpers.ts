import { join } from 'path'
const contentDistRoot = join('/_nuxt', 'content')

/** Get the content URL for a given file
 * @param {string} path asset path inside content directory
 * @returns {string} URL for the asset
 */
export const toContentURL = (path: string): string =>
  join(contentDistRoot, path)

export const formatDate = (date: Date | string, format: string): string => {
  if (date.constructor !== Date) {
    date = new Date(date)
  }

  format = format.replace(/yyyy/g, date.getFullYear().toString())
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2))
  format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2))
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3))
  return format
}
