import Blocks from 'block-js'
import fs from 'fs-extra'
import Promise from './promise.js'
import regexParser from 'regex-parser'

const stat = Promise.promisify(fs.stat)

function cleanContent (content, dirtyStrings) {
  dirtyStrings.forEach((dirtyString) => {
    content = content.replace(dirtyString, '')
  })
  return content
}

export function takeReplacements (blocks, commentStringStart, commentStringEnd) {
  const replacementsPh = blocks.find(targetBlock => (targetBlock.name === 'replacements'))
  if (replacementsPh) {
    const replacements = {}
    if (replacementsPh.content) {
      const replacementLines = replacementsPh.content.split('\n')
      replacementLines.forEach(
        replacementLine => {
          const tokens = cleanContent(replacementLine, [commentStringStart, commentStringEnd])
            .split(', ')
            .map(token => token.trim())
          const name = tokens[0]
          const regex = tokens[1]
          const value = tokens[2]
          replacements[name] = {
            regex, value
          }
        }
      )
      return replacements
    } else {
      return {}
    }
  } else {
    return undefined
  }
}

function takeStamps (blocks, commentStringStart, commentStringEnd) {
  let stamps = undefined
  const stampsPh = blocks.find(targetBlock => (targetBlock.name === 'stamps'))
  if (stampsPh && stampsPh.content) {
    stamps = regexParser(cleanContent(stampsPh.content, [commentStringStart, commentStringEnd]).trim())
  }
  return stamps
}

export function takeMeta (blocks, commentStringStart, commentStringEnd) {
  const options = {}
  options.replacements = takeReplacements(blocks, commentStringStart, commentStringEnd)
  options.stamps = takeStamps(blocks, commentStringStart, commentStringEnd)
  return options
}

export function getBlocks (filePath, options) {
  let delimiters
  if (options) {
    delimiters = options.delimiters
  }

  // TODO: suppport block array name on blocks to reduce file reading
  const phsBlocksClass = new Blocks(filePath, 'ph', delimiters)
  const stampsBlocksClass = new Blocks(filePath, 'stamp', delimiters)

  return Promise.props({
    phBlocks: phsBlocksClass.extractBlocks(),
    stampBlocks: stampsBlocksClass.extractBlocks(),
    commentStringStart: phsBlocksClass.startBlockString,
    commentStringEnd: phsBlocksClass.endBlockString
  })
}

export default function getMeta (filePath, options) {
  return new Promise(
    (resolve) => {
      const emptyMetaInfo = {
        replacements: {},
        stamps: undefined
      }

      return stat(filePath)
        .then(
          () => {
            return getBlocks(filePath, options)
              .then((results) => {
                let metaInfo = emptyMetaInfo

                if (!options || (!options.replacements && !options.stamps)) {
                  metaInfo = takeMeta(results.phBlocks, results.commentStringStart, results.commentStringEnd)
                } else {
                  const { replacements, stamps } = options
                  Object.assign(metaInfo, {replacements, stamps})
                }

                resolve(metaInfo)
              })
          },
          () => {
            resolve(emptyMetaInfo)
          }
      )
    }
  )
}
