
const contractDependenciesPath = "./metadata/openzeppelin-solidity-contracts-dependencies.json"
const filepathsPath = './metadata/openzeppelin-solidity-filepaths.json'

const fs = require('fs')

const filepaths = require('.' + filepathsPath)
const contracts = require('.' + contractDependenciesPath)
const keys = Object.keys(contracts)

function getJoinedSourceFile (compileTarget) {

  /**
   * TODO
   * - read in compilation target
   * - store its pragma statement
   * - get all dependencies (which also gives us their filepaths)
   * - read in and write all dependencies in descending order, with the target last
   * https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options
   * https://nodejs.org/api/stream.html#stream_class_stream_readable
   */
}
