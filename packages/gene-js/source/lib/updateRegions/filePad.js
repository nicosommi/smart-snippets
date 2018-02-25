import Blocks from 'block-js'
import semver from 'semver'
import fs from 'fs'
import readline from 'readline'
import { getDelimiters } from 'block-js'
import regexParser from 'regex-parser'
import { takeReplacements } from '../getMeta'

export default class FilePad {
  constructor() {
    this.stamps = []
    this.phs = []
  }

  async initialize (filePath) {
    this.filePath = filePath
    if(filePath && fs.existsSync(filePath)) {
      try {
        this.delimiters = getDelimiters(filePath)
        // TODO: take this to block js, along with other useful functions to manipulate code
        this.delimiters.inlineRegex = this.delimiters.inline.replace(/\//g, '\\\/')
        let blocks = (await (new Blocks(filePath, 'archetype')).extractBlocks())
        this._archetype = blocks[0].name
        Object.defineProperty(this, 'archetype', {
          get: () => (this._archetype.trim()),
          set: v => { this._archetype = v }
        })
        blocks = (await (new Blocks(filePath, 'version')).extractBlocks())
        this._version = blocks[0].name
        Object.defineProperty(this, 'version', {
          get: () => (this._version.trim()),
          set: v => { this._version = v }
        })
        this.phs = await (new Blocks(filePath, 'ph')).extractBlocks()
        this.stamps = await (new Blocks(filePath, 'stamp')).extractBlocks()
        this.replacements = takeReplacements(this.phs, this.delimiters.start, this.delimiters.end)
      } catch(e) {
        console.error(e)
        throw Error(`Invalid region format when parsing ${filePath}`)
      }
    }
  }

  hasDifferentArchetypeThan(basePad) {
    return (this.archetype && this.archetype !== basePad.archetype)
  }

  isOlderVersion(basePad) {
    return (this.version && semver.compare(this.version, basePad.version) >= 0)
  }

  isMissingArchetype () {
    return (
      (!this.archetype && this.version)
    )
  }
  
  isMissingVersion () {
    return (
      (this.archetype && !this.version)
    )
  }
  
  isNew () {
    return (!this.archetype && !this.version)
  }

  isPhWithin (ln) {
    return (this.phs.find(ph => (ln > ph.from && ln < ph.to) ) !== undefined)
  }
  
  isStampWithin (ln) {
    return (this.stamps.find(stamp => (ln > stamp.from && ln < stamp.to) ) !== undefined)
  }
  
  isPhEnd (ln) {
    return (this.phs.find(ph => (ln === ph.to) ) !== undefined)
  }
  
  isStampEnd (ln) {
    return (this.stamps.find(stamp => (ln === stamp.to) ) !== undefined)
  }
  
  checkValid () {
    if(this.isMissingArchetype()) {
      throw Error(`Missing archetype on ${this.filePath}`)
    }
    if(this.isMissingVersion()) {
      throw Error(`Missing version on ${this.filePath}`)
    }
  }
  
  checkCanBeUpdatedBy (basePad) {
    this.checkValid()
    basePad.checkValid()
    if (this.hasDifferentArchetypeThan(basePad)) {
      throw Error('Cannot update. Archetype mismatch')
    } else if (this.isOlderVersion(basePad)) {
      throw Error('Cannot update. Target archetype version is newer than origin')
    }
  }
  
  getPh(sph) {
    let res = this.phs.find(ph => ph.name === sph.name)
    if (!res) {
      return Object.assign({}, sph)
    } else {
      return Object.assign({}, sph, { content: res.content, flags: res.flags })
    }
  }
  
  getPhByLineNumber (ln) {
    return this.phs.find(ph => ph.from === ln)
  }
  
  getStampByLineNumber (ln) {
    return this.stamps.find(stamp => stamp.from === ln)
  }

  commentContent(content) {
    const lines = content.split('\n')
    let initialChunk
    return lines.map(l => {
      if(l.trim().indexOf(this.delimiters.inline) === 0) {
        return l
      }
      const re = new RegExp(`^(\\s*)(.*)`)
      const beginning = re.exec(l)
      if(!initialChunk) {
        initialChunk = beginning[1]
      }
      let pad = ''
      if(beginning[1].length > initialChunk.length) {
        pad = ' '.repeat(beginning[1].length - initialChunk.length)
      }
      return `${initialChunk}${this.delimiters.inline}${pad} ${beginning[2]}`
    }).join('\n')
  }
  
  uncommentContent(content) {
    const lines = content.split('\n')
    return lines.map(l => {
      if(l.trim().indexOf(this.delimiters.inline) === 0) {
        const re = new RegExp(`^(\\s*)${this.delimiters.inlineRegex}\\s(.*)`)
        const beginning = re.exec(l)
        return `${beginning[1]}${beginning[2]}`
      }
      return l
    }).join('\n')
  }

  isBlockIgnored(block) {
    return (block.flags !== undefined && block.flags.indexOf('ignored') >= 0)
  }

  getStamp(sstamp) {
    let found = this.stamps.find(stamp => stamp.name === sstamp.name)
    let res = Object.assign({}, sstamp)
    if (found) {
      let content = sstamp.content
      if(this.isBlockIgnored(found) && !this.isBlockIgnored(sstamp)) {
        content = this.commentContent(sstamp.content)
      } else if(!this.isBlockIgnored(found) && this.isBlockIgnored(sstamp)) {
        content = this.uncommentContent(sstamp.content)
      }
      res = Object.assign({}, sstamp, { content, flags: found.flags })
    }
    return res
  }

  replicateReplacements() {
    const basePadKeys = Object.keys(this.basePad.replacements || {})
    const thisPadKeys = Object.keys(this.replacements || {})
    // iterate base replacements
    const resultingReplacements = basePadKeys.reduce(
      (acc, basePadKey) => {
        // find on this
        const thisPadKey = thisPadKeys.find(tpk => tpk === basePadKey)
        if(thisPadKey) {
          // if found, preserve
          return Object.assign(acc, {
            [basePadKey]: {
              regex: this.replacements[thisPadKey].regex,
              value: this.replacements[thisPadKey].value,
            }
          })
        } else {
          // if new, assign and push
          return Object.assign(acc, {
            [basePadKey]: {
              regex: this.basePad.replacements[basePadKey].regex,
              value: this.basePad.replacements[basePadKey].value,
            }
          })
        }
      }, {}
    )
    if(Object.keys(resultingReplacements).length > 0) {
      // override replacement ph
      this.phs = this.phs.map(ph => {
        if(ph.name === 'replacements') {
          const content = this.joinReplacements(resultingReplacements)
          return Object.assign(ph, {
            content
          })
        } else {
          return ph
        }
      })
    } else {
      // filter out replacement ph
      this.phs = this.phs.filter(ph => ph.name !== 'replacements')
    }
  }

  joinReplacements(replacements) {
    return Object.keys(replacements).map(
      (replacementKey) => (`${this.delimiters.start} ${replacementKey}, ${replacements[replacementKey].regex}, ${replacements[replacementKey].value} ${this.delimiters.end}`)
    ).join('\n')
  }
  
  executeReplacements(content) {
    return Object.keys(this.replacements || {}).reduce(
      (acc, replacementKey) => {
        const replacement = this.replacements[replacementKey]
        const sourceRegex = this.basePad.replacements[replacementKey].regex
        
        const r = regexParser(sourceRegex)

        return acc.replace(r, replacement.value)
      },
      content
    )
  }
  
  buildOneLinerBlock(blockName, block) {
    let res = `${this.delimiters.inline} ${blockName} ${block.name}`
    if (block.flags) {
      res = `${res} (${block.flags})`
    }
    return res
  }
  
  buildBlockHeader(blockName, block, originalLine = '') {
    let flags = ''
    if (block.flags) {
      flags = `(${block.flags}) `
    }
    let prefix = ''
    const spaces = originalLine.match(/^(\s+)/)
    if(spaces && spaces.length) {
      prefix = spaces[0]
    }
    return `${prefix}${this.delimiters.start} ${blockName} ${block.name} ${flags}${this.delimiters.end}`
  }
  
  isOneLiner (block) {
    return (block.to === block.from)
  }
  
  processLine(l, ln) {
    const ph = this.getPhByLineNumber(ln)
    if (ph) {
      if(this.isOneLiner(ph)) {
        return `${ph.content}${this.buildOneLinerBlock('ph', ph)}\n`
      } else {
        return `${this.buildBlockHeader('ph', ph, l)}\n${ph.content}\n`
      }
    }
    const stamp = this.getStampByLineNumber(ln)
    if (stamp) {
      const res = stamp.content
      this.executeReplacements(res)
      if(this.isOneLiner(stamp)) {
        return `${stamp.content}${this.buildOneLinerBlock('stamp', stamp)}\n`
      } else {
        return `${this.buildBlockHeader('stamp', stamp, l)}\n${stamp.content}\n`
      }
    }
    if (this.isPhWithin(ln) || this.isStampWithin(ln)) {
      return ''
    }
    if (this.isPhEnd(ln) || this.isStampEnd(ln)) {
      return `${l}\n`
    }
    return `${this.executeReplacements(l)}\n`
  }
  
  // public methods

  updateWith(basePad) {
    this.basePad = basePad
    this.baseStream = fs.createReadStream(basePad.filePath, { encoding: 'utf8' })
    this.delimiters = getDelimiters(basePad.filePath)
    this._archetype = basePad._archetype
    this._version = basePad._version
    this.phs = basePad.phs.map(ph => this.getPh(ph))
    this.stamps = basePad.stamps.map(stamp => this.getStamp(stamp))
    this.replicateReplacements()
  }

  flushTo(outputStream) {
    return new Promise(
      resolve => {
        const lineReader = readline.createInterface({ input: this.baseStream })
        let  ln = 1
        lineReader.on('line', (line) => {
          const finalLine = this.processLine(line, ln)
          outputStream.write(finalLine)
          ln++
        })
        
        lineReader.on('close', () => {
          if (outputStream !== process.stdout) outputStream.end()
          resolve()
        })
      }
    )
  }
}

