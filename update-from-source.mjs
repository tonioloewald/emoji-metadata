import fetch from 'node-fetch'
import {writeFile} from 'fs/promises'

const response = await fetch('https://unicode.org/Public/emoji/latest/emoji-test.txt')
const source = await response.text()
const version = source.match(/# Version: (\d+\.\d+)/)[1]

await writeFile('emoji-version.json', JSON.stringify({version}))

let groups = source.split('# group: ')
groups.shift()

groups = groups.map(groupSource => {
  const lines = groupSource.split('\n')
  const name = lines.shift()
  let subGroups = lines.join('\n').split('# subgroup: ')
  subGroups.shift()

  subGroups = subGroups.map(subSource => {
    const lines = subSource.split('\n').filter(line => line !== '')
    const name = lines.shift()
    const emoji = lines.map(line => {
      const fields = line.match(/^([0-9A-F]+( [0-9A-F]+)*)\s+; ([\w-]+)\s+# (.+) E\d+\.\d+ (.+)$/)
      if (fields === null) {
        return null
      } else {
        const [,codes,, status, chars, name] = fields
        return status === 'fully-qualified' ? { codes: codes.split(' ').map(code => `U+${code}`), chars, name } : null
      }
    }).filter(item => item !== null)
    return {
      name,
      emoji
    }
  })

  return {
    name,
    subGroups
  }
})

await writeFile('emoji-groups.json', JSON.stringify(groups, null, 2))

const flattened = groups.map(group => group.subGroups.map(subGroup => subGroup.emoji.map(em => {
  return {category: group.name, subcategory: subGroup.name, ...em}
}))).flat().flat()

await writeFile('emoji-metadata.json', JSON.stringify(flattened, null, 2))

const emojiText = JSON.stringify(flattened.map(emoji => {
  delete emoji.codes
  return emoji
}), null, 2)

await writeFile('emoji.json', emojiText)
await writeFile('emoji.js', 'export default ' + emojiText.replace(/"(category|subcategory|chars|name)":/g, "$1:"))

console.log('parsed version ', version)