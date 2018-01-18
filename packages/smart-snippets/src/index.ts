import { updateRegions, FilePad } from 'gene-js'
import * as os from 'os'
import { ensureDir, existsSync } from 'fs-extra'
import copy from './copy'

const workspaces: {[k: string]: string} = {
  default: `${os.homedir()}/.smart-snippets`
}

export async function saveSmartSnippet(base: string, _workspace: string = 'default') {
  const basePad = new FilePad()
  await basePad.initialize(base)
  const target = await buildArchetypePath(basePad, _workspace)
  
  
  if (existsSync(target)) {
    const targetPad = new FilePad()
    await targetPad.initialize(target)
    targetPad.checkCanBeUpdatedBy(basePad)
  }
  
  await copy(base, target)
}

export async function updateFromSmartSnippet(target: string, _workspace: string = 'default') {
  const targetPad = new FilePad()
  await targetPad.initialize(target)
  
  const base = await buildArchetypePath(targetPad, _workspace)
  const basePad = new FilePad()
  await basePad.initialize(base)

  targetPad.checkCanBeUpdatedBy(basePad)
  await updateRegions(base, target, { stdout: false })
}

async function buildArchetypePath(pad: FilePadClass, _workspace: string): Promise<string> {
  const archetype = pad.archetype
  const extension = pad.delimiters.extension.replace('.', '')
  const workspace = workspaces[_workspace] || _workspace
  const vault = `${workspace}/${extension}`
  await ensureDir(workspace)
  await ensureDir(vault)
  return `${vault}/${archetype}.${extension}`
}
