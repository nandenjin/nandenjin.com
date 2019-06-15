/* eslint-disable no-console */
import * as fs from 'fs'
import markdownIt from 'markdown-it'

const md = markdownIt()

export const getPayload = (filePath) => {
  try {
    fs.statSync(filePath)
  } catch (e) {
    return null
  }

  let content = fs.readFileSync(filePath, { encoding: 'utf8' })

  const schemaRegExp = /-+\n([\s\S]+?)\n-+\n/
  if (!content.match(schemaRegExp)) {
    return null
  }

  content = content.replace(schemaRegExp, '')
  const schemaStr = RegExp.$1
  const payload = {}

  const schemaRows = schemaStr.split('\n')
  for (let i = 0; i < schemaRows.length; i++) {
    // eslint-disable-next-line no-useless-escape
    if (schemaRows[i].match(/^([a-zA-Z0-9]+)\s*:\s*(.+)$/m)) {
      payload[RegExp.$1] = RegExp.$2
    }
  }

  payload.content = md.render(content)

  return payload
}
