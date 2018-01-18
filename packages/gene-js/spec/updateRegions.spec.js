import proxyquire from 'proxyquire'
import Promise from '../source/lib/promise.js'
import fs from 'fs-extra'
import updateRegions from '../source/lib/updateRegions'

const readFile = Promise.promisify(fs.readFile)
const copyFile = Promise.promisify(fs.copy)
const statFile = Promise.promisify(fs.lstat)

const fixturePath = `${__dirname}/../fixtures/regions`

describe('update-regions, ', () => {
  beforeEach(function beforeEachBody () {
    this.removeFiles = []
  })

  afterEach(function afterEachBody () {
    this.removeFiles.forEach((fp) => {
      fs.removeSync(fp)
    })
  })

  describe('when called to synchronize an archetype with a new target', () => {
    it('should create the file if not exists', function testBody (done) {
      testToFile.bind(this)('blankFile', { done, remove: true })
    })
    
    it('should write to stdout if flag specified and target is null', function testBody (done) {
      test.bind(this)('blankFile', { stdout: true, done })
    })
    
    it('should ask values for replacements')
    it('should use the same values from origin on replacements, if called with flag --quiet')
    it('should look like the expected result')
  })
  describe('when called to synchronize two archetypes of the same type', () => {
    describe('and the base version is greater than the target version', () => {
      it('should look like the expected result', function testBody(done) {
        testToFile.bind(this)('oldyFile', { done, remove: false })
      })
      it('should ask values for NEW replacements')
      it('should use the same values from origin on NEW replacements, if called with flag --quiet')
    })
    describe('and the base version is lesser or equal than the target version', () => {
      it('should do nothing and look like the expected result')
    })
  })
  describe('when called to synchronize two archetypes of different type', () => {
    it('should fail')
    it('should not write anything')
  })
})

async function test(fixtureName, options) {
  let streamWriter
  let actualFile

  actualFile = `${fixturePath}/${fixtureName}/temporal_test`
  this.removeFiles.push(actualFile)
  streamWriter = fs.createWriteStream(actualFile)
  options.stdout = streamWriter
  
  const expected = await readFile(`${fixturePath}/${fixtureName}/expected.js`, 'utf8')

  const target = options.target ? actualFile : null
  
  await updateRegions(`${fixturePath}/${fixtureName}/base.js`, target, options)

  streamWriter.on('finish', async () => {
    const actual = await readFile(actualFile, 'utf8')
    actual.toString('utf8').should.equal(expected)
    options.done()
    return Promise.resolve()
  })
}

async function testToFile(fixtureName, options) {
  const originalFile = `${fixturePath}/${fixtureName}/target.js`
  let actualFile = `${fixturePath}/${fixtureName}/target.temporal.js`
  try {
    await statFile(originalFile)
    await copyFile(originalFile, actualFile)
    this.removeFiles.push(actualFile)
  } catch(e) {
    actualFile = originalFile
  }
  
  if (options.remove) {
    this.removeFiles.push(actualFile)
  }

  const expected = await readFile(`${fixturePath}/${fixtureName}/expected.js`, 'utf8')

  await updateRegions(`${fixturePath}/${fixtureName}/base.js`, actualFile, options)

  const actual = await readFile(actualFile, 'utf8')
  actual.toString('utf8').should.equal(expected)
  options.done()
}
