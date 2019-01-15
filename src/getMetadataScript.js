
const { getMetadata } = require('./getMetadata.js')

if (process.argv.length < 3) {
  throw new Error('Missing Solidity files root directory.')
}

getMetadata(...process.argv.slice(2))
