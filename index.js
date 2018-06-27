'use strict'

const fs = require('fs')
const solc = require('solc')
const filepaths = require('./metadata/openzeppelin-solidity-filepaths.json')

let contracts = require('./metadata/openzeppelin-solidity-contracts.json')
let libraries = require('./metadata/openzeppelin-solidity-libraries.json')

let inheritables

initializeExports()

module.exports = {
  'contracts': contracts,
  'libraries': libraries
}

/**
 * [initializeExports description]
 * @return {[type]} [description]
 */
function initializeExports() {
  for (let key in contracts) {

  inheritables = getDependencies({}, [ key ])

  contracts[key]['compiled'] = solc.compile({sources: inheritables}, 1, (path) => {
    let split_path = path.split('/')
    return {contents: inheritables[split_path[split_path.length - 1]]}
  })
  }

  for (let key in libraries) {
    libraries[key]['compiled'] = solc.compile(fs.readFileSync(filepaths[key], 'utf8'), 1)
  }
}

/**
 * [getDependencies description]
 * @param  {[type]} solFiles     [description]
 * @param  {[type]} dependencies [description]
 * @return {[type]}              [description]
 */
function getDependencies(solFiles, dependencies) {

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

    // add contract or library source to solFiles
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
  return getDependencies(solFiles, dependencies)
}
