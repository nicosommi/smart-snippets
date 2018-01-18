import synchronize from '../source/lib/synchronize.js'
import Promise from '../source/lib/promise.js'
import fs from 'fs-extra'
import regexParser from 'regex-parser'

const readFile = Promise.promisify(fs.readFile)
const copy = Promise.promisify(fs.copy)
const stat = Promise.promisify(fs.stat)

function synchronizeMechanism (source, target, expectation, options = {}, customAssertion = false) {
  const { pathPrefix = 'sourceCodeFiles/' } = options
  const sourceComplete = `${__dirname}/../fixtures/${pathPrefix}sources/${source}`
  const expectationComplete = `${__dirname}/../fixtures/${pathPrefix}expectations/${expectation}`
  const targetSource = `${__dirname}/../fixtures/${pathPrefix}sources/${target}`
  const targetResult = `${__dirname}/../fixtures/${pathPrefix}results/${target}`

  let targetContents

  // read source
  const processPromise = readFile(sourceComplete)
    // prepareTargetFile
    .then(stat(targetSource))
    .then(() => copy(targetSource, targetResult))
    .catch(() => Promise.resolve())
    // synchronize target
    .then(() => synchronize(sourceComplete, targetResult, options))
    // read new target
    .then(() => readFile(targetResult))
    .then((contents) => {
      targetContents = contents.toString('utf8')
    })
    // read expectation
    .then(() => readFile(expectationComplete))
  if (!customAssertion) {
    return processPromise.then((contents) => targetContents.should.eql(contents.toString('utf8')))
  } else {
    return processPromise
  }
}

const bananaOptions = {
  replacements: {
    [/Apple/g]: 'Banana'
  },
  stamps: regexParser('/^(?!throwAway{1}).*$/')
}

describe('synchronize', () => {
  describe('(archetype)', () => {
    it('should copy the contents if the target is new', function testBody () {
      return synchronizeMechanism('banana.js', 'apple.js', 'apple.js', { pathPrefix: 'v2/' })
      it('should refresh the content if source and target are the same version but different dynamic zones')
    })
    it('should do nothing if the target version is higher than the source')
    it('should throw an exception if the archetypes do not match')
  })

  describe('(error handling)', () => {
    it('should throw a warning if there is no blocks on the existing target and 2 or more on the source', () => {
      return synchronizeMechanism('apple.js', 'emptyVegetable.js', 'emptyVegetable.js', {}, true)
        .should.be.rejectedWith(/Warning, there is too much difference between apple.js and emptyVegetable.js. Make sure it's OK and use force flag./)
    })

    it('should not throw when much different phs but force option is set to true', () => {
      const options = { force: true }
      return synchronizeMechanism('apple.js', 'emptyVegetable.js', 'emptyVegetable.js', options)
    })

    it('should not throw when target is new', () => {
      return synchronizeMechanism('apple.js', 'newEmptyVegetable.js', 'emptyVegetable.js')
    })
  })

  describe('(in file options)', () => {
    describe('(stamps)', () => {
      it('should include stamps from the source according to the target', () => {
        return synchronizeMechanism('apple.js', 'banana.js', 'banana.js')
      })

      it('should allow one line array include stamps separated by comma', () => {
        return synchronizeMechanism('apple.js', 'sedlessBanana.js', 'sedlessBanana.js')
      })

      it('should allow multiline ignoring stamps', () => {
        return synchronizeMechanism('apple.js', 'sedlessBanana.js', 'sedlessBanana.js')
      })

      it('should allow files with no ignoring stamps ph', () => {
        return synchronizeMechanism('apple.js', 'orange.js', 'orange.js')
      })

      it('should allow include the stamp content if the source is already ignoring that stamp', () => {
        return synchronizeMechanism('alreadySedlessBanana.js', 'apple.js', 'apple.js')
      })

      it('should keep the original content if the source is ignoring the stamp', () => {
        return synchronizeMechanism('alreadySedlessBanana.js', 'throwableSeedlessBanana.js', 'throwableSeedlessBanana.js')
      })
    })

    describe('(replacements)', () => {
      it('should execute the replacements using the regex from the source and the value from the target, matching by name', () => {
        return synchronizeMechanism('apple.js', 'banana.js', 'banana.js')
      })

      it('should support also a simple case sensitive and global string as regex', () => {
        return synchronizeMechanism('simpleApple.js', 'banana.js', 'banana.js')
      })

      it('should allow empty replacement phs', () => {
        return synchronizeMechanism('staticKiwi.js', 'incompleteApple.js', 'diminishedApple.js')
      })

      it('should allow no replacement ph', () => {
        return synchronizeMechanism('staticKiwi.js', 'staticKiwi.js', 'staticKiwi.js')
      })

      it('should throw if the target has a replacement that was not found on the source', () => {
        return synchronizeMechanism('incompleteApple.js', 'banana.js', 'banana.js', {}, true)
          .should.be.rejectedWith(/Missing replacement key on the source/)
      })

      it('should avoid replacement substring error', () => {
        return synchronizeMechanism('accounts.js', 'linkedAccounts.js', 'linkedAccounts.js')
      })
      
      it('should allow escaped characters', () => {
        return synchronizeMechanism('escapedApple.js', 'escapedLemon.js', 'escapedLemon.js')
      })
    })
  })

  describe('(phs)', () => {
    it('should leave one line phs content as it was on the target originally', () => {
      return synchronizeMechanism('oneLineApple.js', 'oneLineBanana.js', 'oneLineBanana.js', bananaOptions)
    })
    
    it('should leave the phs content as it was on the target originally', () => {
      return synchronizeMechanism('apple.js', 'banana.js', 'banana.js', bananaOptions)
    })

    it('should create a deprecated ph for the removed ones on the source', () => {
      return synchronizeMechanism('apple.js', 'oldBanana.js', 'oldBananaSynchronized.js', bananaOptions)
    })

    it('should accumulate removed phs on the existing deprecated ph', () => {
      return synchronizeMechanism('apple.js', 'veryOldBanana.js', 'veryOldBananaSynchronized.js', bananaOptions)
    })
  })

  describe('(stamps)', () => {
    it('should set the stamp content to the content from the source file', () => {
      return synchronizeMechanism('apple.js', 'newBanana.js', 'applenana.js')
    })
  })
})
