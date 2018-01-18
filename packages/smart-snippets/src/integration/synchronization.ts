import * as cucumber from 'cucumber'
import { binding, given, when, then, after, before } from 'cucumber-tsflow'
import { rm } from 'shelljs'
import copy from '../copy'
import * as fs from 'fs-extra'
import * as os from 'os'
import { saveSmartSnippet, updateFromSmartSnippet } from '../'
import * as expect from 'expect'

const { Given, When, Then } = require('cucumber')

const testWorkspace = `${__dirname}/.testws`

type CallbackType = (err: Error, res: any) => void

@binding()
export default class WorldPart {
  private properties: { [pn: string]: string } = {}
  private clean: any[] = []
  private arguments: { [an: string]: string } = {}

  @before()
  public async before(): Promise<void> {}

  @after()
  public async after(): Promise<void> {
    // console.log('after cleanup')
    await Promise.all(this.clean.map(f => f()))
  }

  @given(/a valid archetype path on '([\w]*)'/)
  public async aSpecificFile(propertyName: string): Promise<any> {
    this.properties[propertyName] = `${__dirname}/../../fixtures/example.archetype.ts`
  }
  
  @given(/a valid old archetype path on '([\w]*)'/)
  public async aSpecificOldFile(propertyName: string): Promise<any> {
    this.properties[propertyName] = `${__dirname}/../../fixtures/example.archetype.old.ts`
  }
  
  @given(/an existing archetype from '([\w]*)'/)
  public async anExistingArcheytpeFrom(propertyName: string): Promise<any> {
    const source = this.properties[propertyName]
    const archetype = `${os.homedir()}/.smart-snippets/ts/fruit.ts`
    await copy(source, archetype)
    this.clean.push(() => rm(archetype))
  }
  
  @given(/passes '([\w]*)' as the '([\w]*)' argument/)
  public async passesThatFileAsAnArgument(propertyName: string, argumentName: string): Promise<any> {
    this.arguments[argumentName] = this.properties[propertyName]
  }
  
  @given(/passes '([\w]*)' as the target argument/)
  public async passesThatFileAsTheTargetArgument(propertyName: string): Promise<any> {
    // backup file
    const backupPath = `${this.properties[propertyName]}.bkp`
    await copy(this.properties[propertyName], backupPath)
    this.arguments['target'] = this.properties[propertyName]
    this.clean.push(() => copy(backupPath, this.properties[propertyName]))
  }
  
  @when(/the user executes the command smart-snippets '([\w]*)'/)
  public async theUserExecutesTheCommandSmartsnippetscreate(subcommand: string): Promise<void> {
    switch (subcommand.toLowerCase()) {
      case 'save':
        await saveSmartSnippet(this.arguments['base'], testWorkspace)
        break
      case 'update':
        await updateFromSmartSnippet(this.arguments['target'], testWorkspace)
        break
    }
  }
  
  @then(/it should save a file named as the archetype in the '([\w]*)' workspace/)
  public itShouldSaveAFileNamedAsTheArchetypeInThedefaultWorkspace(workspace: string): void {
    const target = `${os.homedir()}/.smart-snippets/ts/fruit.ts`
    expect(fs.existsSync(target)).toBe(true)
    this.clean.push(() => rm(target))
  }

  @then(/it should refresh the file to the last version of it/)
  public async itShouldRefreshTheFileToTheLastVersionOfIt(): Promise<void> {
    const expected = fs.readFileSync(`${__dirname}/../../fixtures/expectation.archetype.ts`, { encoding: 'utf8' })
    const actual = fs.readFileSync(this.arguments['target'], { encoding: 'utf8' })
    expect(actual).toEqual(expected)
  }
}
