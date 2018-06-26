'use strict'

const fs = require('fs')
const solc = require('solc')
const filepaths = require('./metadata/openzeppelin-solidity-filepaths.json')

let contracts = require('./metadata/openzeppelin-solidity-contracts.json')
let libraries = require('./metadata/openzeppelin-solidity-libraries.json')

//////// test

// var _getAllFilesFromFolder = function(dir) {

//     var filesystem = require("fs");
//     var results = [];

//     filesystem.readdirSync(dir).forEach(function(file) {

//         file = dir+'/'+file;
//         var stat = filesystem.statSync(file);

//         if (stat && stat.isDirectory()) {
//             results = results.concat(_getAllFilesFromFolder(file))
//         } else results.push(file);

//     });

//     return results;

// };

// console.log(_getAllFilesFromFolder("./node_modules/openzeppelin-solidity/contracts"))

//////// test

// solc parameters
let solFiles
let parameters = {
  language: "Solidity",
  sources: {},
  settings: {
    metadata: {
      // Use only literal content and not URLs (false by default)
      useLiteralContent: true
    },
    outputSelection: {
      "*": {
        "*": [ "abi", "evm.bytecode"]
      }
    }
  }
}

for (let key in contracts) {

  /** compileStandardWrapper 
   * currently results in solc throwing a JSON formatting error
   * see parameters declaration above for input JSON
   */
  solFiles = {}

  solFiles[key + '.sol'] = {}
  solFiles[key + '.sol']['content'] = fs.readFileSync(filepaths[key], 'utf8')

  if (contracts[key].hasOwnProperty('dependencies')) {
    for (let dependency of contracts[key]['dependencies']) {

      solFiles[dependency + '.sol'] = {}
      solFiles[dependency + '.sol']['content'] = fs.readFileSync(filepaths[dependency], 'utf8')      
    }
  }

  parameters.sources = solFiles

  contracts[key]['compiled'] = solc.compileStandardWrapper(
    parameters.toString(),
    function (path) {
      return {error: 'File not found with path: ' + path}
  })
  /**/

  /**
   * compile (regular)
   * compiles but outputs no abi, opcodes, bytecode, or assembly
   */
  // solFiles = {}

  // solFiles[key] = fs.readFileSync(filepaths[key], 'utf8')

  // if (contracts[key].hasOwnProperty('dependencies')) {
  //   for (let dependency of contracts[key]['dependencies']) {      
  //     solFiles[dependency + '.sol'] = fs.readFileSync(filepaths[dependency], 'utf8')
  //   }
  // }

  // contracts[key]['compiled'] = solc.compile({sources: solFiles}, 1)
  /**/
}

for (let key in libraries) {

  libraries[key]['compiled'] = solc.compile(fs.readFileSync(filepaths[key], 'utf8'), 1)
}

module.exports = {
  'contracts': contracts,
  'libraries': libraries
}
