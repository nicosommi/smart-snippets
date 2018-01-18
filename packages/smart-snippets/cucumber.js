const format = `--format 'snippets:src/integration/missing.ts'`
// WAIT for support for cucumber expression for 3.0 on tsflow snippets
const formatOptions = `--format-options '{"snippetSyntax": "./node_modules/cucumber-snippets-tsflow", "snippetInterface": "promise"}'`

module.exports = {
  default: `--compiler ts:ts-node/register ${format} ${formatOptions} --require 'src/integration/index.ts'`
}
