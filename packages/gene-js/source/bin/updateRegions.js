#!/usr/bin/env node

import updateRegions from '../lib/updateRegions/command'
process.on('unhandledRejection', error => {
  throw error
})

updateRegions()
