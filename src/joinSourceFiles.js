
const metadataPath = './metadata/oz-metadata.json'
const filepathsPath = './metadata/oz-filepaths.json'

const fs = require('fs')

const filepaths = require('.' + filepathsPath)
const metadata = require('.' + metadataPath)

/**
 * Given the metadata for a target Solidity entity and its dependencies:
 * - get all source files (getDependencySources)
 * - open a writestream (path and filename are args)
 * - write the pragma statement (per target metadata)
 * - write all dependencies in the order given by getDependencySources,
 *   with the target last
 * - close the stream, return the path to the resulting file
 * Throw errors in case of failure
 * https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options
 * https://nodejs.org/api/stream.html#stream_class_stream_readable
 */
function getJoinedSourceFile (
  contractName,
  dependencies = contracts[contractName]
) {

}

// rewriteMetadata()

/**
 * Deletes and rewrites contracts and libraries metadata files
 */
function rewriteMetadata() {

  fs.unlinkSync(metadataPath)

  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2))

  console.log('files rewritten')
}

/**
 * getDependencySources
 *
 * @param {object} solMetadata the metadata of all Solidity entities
 * @param {array} remainingDeps remaining entities whose dependencies must be
 * processed, pass in target entity's name
 * @param {object} filepaths filepaths by entity names, for all entities
 * @param {array} allDeps an empty array (default)
 * @param {object} depSources an empty object (default)
 * @returns {object} an object with complete dependency sources and an array
 * defining their order
 */
function getDependencySources(
  solMetadata, remainingDeps, filepaths, allDeps=[], depSources={}
) {

  // base case
  if (remainingDeps.length === 0) {
    allDeps.reverse()
    return { sources: depSources, order: allDeps }
  }

  // remove first element
  let inheritable = remainingDeps.shift()

  // if we have yet to see this entity
  if (!depSources.hasOwnProperty(inheritable)) {

    if (!filepaths[inheritable]) {
      throw new Error('inheritable ' + inheritable + ' not in filepaths')
    }

    // add contract source to depSources, and its name to allDeps
    depSources[inheritable] = fs.readFileSync(
      '.' + filepaths[inheritable], 'utf8'
    )
    allDeps.push(inheritable)

    // add current item's dependencies to the remainingDeps array
    if (solMetadata[inheritable].hasOwnProperty('dependencies')) {
      for (let dependency of solMetadata[inheritable]['dependencies']) {
        remainingDeps.push(dependency)
      }
    }
  }
  return getDependencySources(
    solMetadata, remainingDeps, filepaths, allDeps, depSources
  )
}
