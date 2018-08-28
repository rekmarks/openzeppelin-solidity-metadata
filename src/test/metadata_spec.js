
const assert = require('chai').assert

describe('contract and library metadata', () => {

  const data = require('../../index.js')
  const contracts = data.contracts
  const libraries = data.libraries
  const filepaths = require('../../metadata/openzeppelin-solidity-filepaths.json')

  // console.log(contracts)
  // console.log('\n')
  // console.log(libraries)
  // console.log('\n')
  // console.log(filepaths)
  // console.log('\n')

  it('metadata object values have no undefined values', () => {

    for (let key in contracts) {
      for (let _key in contracts[key]) {
        assert(typeof contracts[key][_key] !== 'undefined')
      }
    }
    for (let key in libraries) {
      for (let _key in libraries[key]) {
        assert(typeof libraries[key][_key] !== 'undefined')
      }
    }

    // console.log(contracts['StandardToken'].compiled)
    // console.log('\n')
    // console.log(libraries['Math'].compiled)
    // console.log('\n')

  })

  it('metadata object values are of correct types', () => {

    for (let key in contracts) {

      assert(typeof key === 'string')

      for (let _key in contracts[key]) {

        switch (_key) {
          case 'dependencies':
            assert(Array.isArray(contracts[key][_key]))
            break
          case 'compiled':
            assert(typeof contracts[key][_key] === 'object')
            assert(typeof contracts[key][_key]['opcodes'] === 'string')
            break
        }
      }
    }

    for (let key in libraries) {

      assert(typeof key === 'string')

      for (let _key in libraries[key]) {

        switch (_key) {
          case 'dependencies':
            assert(Array.isArray(libraries[key][_key]))
            break
          case 'compiled':
            assert(typeof libraries[key][_key] === 'object')
            assert(typeof libraries[key][_key]['opcodes'] === 'string')
            break
        }
      }
    }
  })
})
