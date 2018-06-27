'use strict'

const fs = require('fs')
const solc = require('solc')
const filepaths = require('./metadata/openzeppelin-solidity-filepaths.json')

let contracts = require('./metadata/openzeppelin-solidity-contracts.json')
let libraries = require('./metadata/openzeppelin-solidity-libraries.json')

initializeExports()

module.exports = {
  'contracts': contracts,
  'libraries': libraries
}

/**
 * Adds compiled Solidity source code to all contracts and libraries so that
 * they can be exported.
 */
function initializeExports() {

  let inheritables, compiled

  // iterate through contracts
  for (let key in contracts) {

    inheritables = getDependencySources({}, [ key ])

    // compile contract with its dependencies, optimizer enabled, callback for
    // handling relative import paths
    compiled = solc.compile({sources: inheritables}, 1, (path) => {

      // return just the filename, which will match to key in the inheritables object
      let split_path = path.split('/')
      return {contents: inheritables[split_path[split_path.length - 1]]}
    })

    if (Object.keys(compiled.contracts).length === 0) {
      console.log(key + '\n')
      console.log(compiled.errors)
    }

    // store only the target compiled contract
    contracts[key]['compiled'] = compiled['contracts'][key + '.sol:' + key]
  }
  throw new Error('exit')

  // iterate through libraries, compiling them outright as they have no dependencies
  for (let key in libraries) {
    compiled = solc.compile(fs.readFileSync(filepaths[key], 'utf8'), 1)
    libraries[key]['compiled'] = compiled['contracts'][':' + key]
  }
}

/**
 * Gets all dependency sources of the OpenZeppelin contract names passed in,
 * including themselves. Depends on the contracts global object.
 * @param  {object} solFiles     an empty object, {}
 * @param  {array}  dependencies an array of contract names
 * @return {object}              an object of contract file name strings to 
 *                               source code strings
 */
function getDependencySources(solFiles, dependencies) {

  // input validation
  if (!solFiles || !dependencies || dependencies.length < 0) {
    throw new Error('Invalid input')
  }

  // base case
  if (dependencies.length === 0) { 
    return solFiles 
  }

  // remove first element
  let inheritable = dependencies.shift()

  // if we have yet to see this contract or library
  if (!solFiles.hasOwnProperty(inheritable + '.sol')) {

    // add contract source to solFiles
    solFiles[inheritable + '.sol'] = fs.readFileSync(filepaths[inheritable], 'utf8')

    // add contract's dependencies to the dependencies array, ignoring libraries
    if (    !libraries.hasOwnProperty(inheritable) 
        &&  contracts[inheritable].hasOwnProperty('dependencies')) 
      {
      for (let dependency of contracts[inheritable]['dependencies']) {
        dependencies.push(dependency)
      }
    }
  }
  return getDependencySources(solFiles, dependencies)
}
