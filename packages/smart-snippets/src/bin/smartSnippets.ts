#!/usr/bin/env node

import execute from '../commands'
process.on('unhandledRejection', error => {
  throw error
})

execute()
