
const {PythonShell} = require('python-shell')
const timestamp = require('time-stamp')

/**
 * getMetadata
 *
 * @param {string} solidityRootDir root of directory containing solidity files
 * @param {string} destinationFolder folder where outputs will be written
 * @param {string} pythonPath path to local python installation, if needed
 * @returns {object} paths to the output files if parameters provided, else
 * true
 */
function getMetadata (
  solidityRootDir,
  destinationFolder='./metadata/',
  pythonPath=null
) {

  // PythonShell options
  const options = {
    mode: 'text',
  }

  // for the user's convenience
  if (destinationFolder.slice(-1) !== '/') {
    destinationFolder = destinationFolder.concat('/')
  }

  // define output file paths
  time = timestamp('YYYY-MM-DD@HH:mm:ss')
  out1 = destinationFolder + 'SolidityMetadata' + time + '.json'
  out2 = destinationFolder + 'SolidityFilepaths' + time + '.json'

  // set arguments to python script
  options.args = [solidityRootDir, out1, out2]

  if (pythonPath) { options.pythonPath = pythonPath }

  PythonShell.run('./src/get_metadata.py', options, (err, results) => {
    if (err) throw err
    // results is an array consisting of messages collected during execution
    if (results) console.log('get_metadata.py results: %j', results)
  })

  return { metadataPath: out1, filepathsPath: out2 }
}

module.exports = {
  getMetadata: getMetadata,
}
