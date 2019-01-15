
const {PythonShell} = require('python-shell')
const timestamp = require('time-stamp')

getMetadata()

/**
 * getMetadata
 *
 * @param {string} solidityRootDir=null root of directory containing solidity files
 * @param {string} destinationFolder=null folder where outputs will be written
 * @param {string} pythonPath=null path to local python installation, if needed
 * @returns {object} paths to the output files if parameters provided, else
 * true
 */
function getMetadata (
  solidityRootDir=null,
  destinationFolder=null,
  pythonPath=null
) {

  if (Boolean(solidityRootDir) !== Boolean(destinationFolder)) {
    throw new Error(
      'Must provide solidityRootDir and destinationFolder if either is provided.'
    )
  }

  const options = {
    mode: 'text',
  }

  if (pythonPath) { options.pythonPath = pythonPath }

  if (solidityRootDir) {

    if (destinationFolder.slice(-1) !== '/') {
      destinationFolder = destinationFolder.concat('/')
    }

    time = timestamp('YYYY-MM-DD:HH:mm:ss')

    out1 = destinationFolder + 'SolidityMetadata' + time + '.json'
    out2 = destinationFolder + 'SolidityFilepaths' + time + '.json'

    options.args = [solidityRootDir, out1, out2]
  }

  PythonShell.run('./src/get_metadata.py', options, (err, results) => {
    if (err) throw err
    // results is an array consisting of messages collected during execution
    if (results) console.log('results: %j', results)
  })

  if (solidityRootDir) return { metadataPath: out1, filepathsPath: out2 }

  return true
}

module.exports = {
  getMetadata: getMetadata,
}
