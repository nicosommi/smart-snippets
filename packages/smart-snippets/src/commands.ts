import m = require('meow')
import { saveSmartSnippet, updateFromSmartSnippet } from './index'

const command = m(`
  Usage
    $ smart-snippets [COMMAND] [OPTIONS]

  Commands
    save    Saves the file archetype to the smart snippet workspace
    update  Updates the file with the latest version from the workspace

  Options
    --file      Required. The file being used for the command
    --workspace Optional. The smart snippet workspace. Defaults to homedir/.smart-snippets
  
  Examples
    $ smart-snippets save --file afile.js
    $ smart-snippets update --file "bfile.js" --workspace "./myws"
`, {
  flags: {
    file: {
      type: 'string',
      alias: 'f'
    },
    workspace: {
      type: 'string',
      alias: 'w',
      default: 'default'
    },
    stdout: {
      type: 'boolean',
      default: false
    }
  }
} as any)

export default function execute() {
  switch(command.input[0]) {
    case 'save':
      return saveSmartSnippet(command.flags.file, command.flags.workspace)
    case 'update':
      return updateFromSmartSnippet(command.flags.file, command.flags.workspace)
  }
}
