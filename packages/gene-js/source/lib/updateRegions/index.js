import FilePad from './filePad'
import fs from 'fs'

export default async function handler (base, target = null, options) {
  // takes blocks from base
  const baseFilePad = new FilePad()
  await baseFilePad.initialize(base)
  // takes blocks from target if exists
  const targetFilePad = new FilePad()
  await targetFilePad.initialize(target)
  // check archetype and version
  targetFilePad.checkCanBeUpdatedBy(baseFilePad)
  // calculate output stream (target file, stdout, or option)
  let output = options.stdout
  if (target && !options.stdout) {
    output = fs.createWriteStream(target, { encoding: 'utf8' })
  }
  targetFilePad.updateWith(baseFilePad)
  await targetFilePad.flushTo(output)
}
