import yargs from 'yargs'
import updateRegions from './'

const argv = yargs
.usage('Usage: $0 update [options]')
.command('update', 'update a target archetype with a base specified')
.example('$0 update -b latest.js -t oldy.js', 'updates regions on oldy using the latest archetype')
.alias('b', 'base')
.nargs('b', 1)
.describe('b', 'Base archetype file path.')
.alias('t', 'target')
.nargs('t', 1)
.describe('t', 'Target archetype file path. Optional. Defaults to empty file.')
.alias('s', 'stdout')
.nargs('s', 1)
.describe('stdout', 'Writes output to stdout always. If not specified, target file will be overwritten. If there is no target file specified, stdout will be used as default.')
.alias('q', 'quiet')
.nargs('quiet', 1)
.describe('quiet', 'No interactive questions for replacement values, just use the same values from base.')
.demandOption(['b'])
.help('h')
.alias('h', 'help')
.epilog('Work in progress.')
.argv


export default function command() {
  updateRegions(argv.b, argv.t, { quiet: argv.q, stdout: (argv.stdout || !argv.t) ? process.stdout : null })
}
