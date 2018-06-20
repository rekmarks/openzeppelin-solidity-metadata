'use strict'

const solc = require('solc')
const filepaths = require('./metadata/openzeppelin-solidity-filepaths.json')

let contracts = require('./metadata/openzeppelin-solidity-contracts.json')
let libraries = require('./metadata/openzeppelin-solidity-libraries.json')

for (let key in contracts) {
  contracts[key]['compiled'] = solc.compile(filepaths[key], 1)
}

for (let key in libraries) {
  libraries[key]['compiled'] = solc.compile(filepaths[key], 1)
}

module.exports = {
  'contracts': contracts,
  'libraries': libraries
}
