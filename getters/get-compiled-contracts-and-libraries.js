
const filepaths_path = './metadata/openzeppelin-solidity-filepaths.json'
const contracts_path = './metadata/openzeppelin-solidity-contracts.json'
const libraries_path = './metadata/openzeppelin-solidity-libraries.json'

const fs = require('fs')
const solc = require('solc')
const filepaths = require('.' + filepaths_path)

let contracts = require('.' + contracts_path)
let libraries = require('.' + libraries_path)
let allKeys = Object.keys(contracts)
allKeys.concat(Object.keys(libraries))

compileAll()
rewriteMetadata()

/**
 * Deletes and rewrites contracts and libraries metadata files
 */
function rewriteMetadata() {

  fs.unlinkSync(contracts_path)
  fs.unlinkSync(libraries_path)

  fs.writeFileSync(contracts_path, JSON.stringify(contracts, null, 2))
  fs.writeFileSync(libraries_path, JSON.stringify(libraries, null, 2))

  console.log('files rewritten')
}

/**
 * Adds compiled Solidity source code to all contracts and libraries so that
 * they can be exported.
 */
function compileAll() {

  console.log('compiling...\n')

  let inheritables, compiled, collection

  // iterate through contracts and libraries
  // (let key in allKeys) doesn't work here for some reason
  for (let i = 0; i < allKeys.length; i++) {

    let key = allKeys[i]

    console.log(key)

    // point to the correct collection object
    if (contracts.hasOwnProperty(key)) {
      collection = contracts
    } else {
      collection = libraries
    }

    inheritables = getDependencySources({}, [ key ])

    // compile contract with its dependencies, optimizer enabled, callback for
    // handling relative import paths
    compiled = solc.compile({sources: inheritables}, 1, (path) => {

      // return just the filename, which will match to key in the inheritables object
      let split_path = path.split('/')
      return {contents: inheritables[split_path[split_path.length - 1]]}
    })

    if (Object.keys(compiled.contracts).length === 0) {
      throw new Error('contract or library ' + key + ' didn\'t compile')
    }

    // store only the target compiled contract or library
    collection[key]['compiled'] = compiled['contracts'][key + '.sol:' + key]
  }
  console.log('\nall contracts and libraries compiled')
}

/**
 * Gets all dependency sources of the OpenZeppelin contract names passed in,
 * including themselves. Depends on the contracts and libraries global objects.
 * @param  {object} solFiles     an empty object, {}
 * @param  {array}  dependencies an array of dependency names
 * @return {object}              an object of file name strings to 
 *                               source code strings
 */
function getDependencySources(solFiles, dependencies) {

  // input validation
  if (!solFiles || !Array.isArray(dependencies) || dependencies.length < 0) {
    throw new Error('Invalid input')
  }

  // base case
  if (dependencies.length === 0) { 
    return solFiles 
  }

  // remove first element
  let inheritable = dependencies.shift()

  let collection
  if (contracts.hasOwnProperty(inheritable)) {
    collection = contracts
  } else {
    collection = libraries
  }

  // if we have yet to see this contract or library
  if (!solFiles.hasOwnProperty(inheritable + '.sol')) {

    // add contract source to solFiles
    solFiles[inheritable + '.sol'] = fs.readFileSync('.' + filepaths[inheritable], 'utf8')

    // add current item's dependencies to the dependencies array
    if (collection[inheritable].hasOwnProperty('dependencies')) {
      for (let dependency of collection[inheritable]['dependencies']) {
        dependencies.push(dependency)
      }
    }
  }
  return getDependencySources(solFiles, dependencies)
}
