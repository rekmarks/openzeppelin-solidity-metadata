const chai = require('chai')
const expect = chai.expect

describe('contract and library metadata', () => {

  const data = require('../index.js')
  const contracts = data.contracts
  const libraries = data.libraries
  const filepaths = require('../metadata/openzeppelin-solidity-filepaths.json')

  // manual verification
  console.log(contracts)
  console.log('\n')
  // console.log(libraries)
  // console.log('\n')
  // console.log(filepaths)
  // console.log('\n')

  it('metadata objects have correct number of keys', () => {

    expect(contracts.length === 61)
    expect(libraries.length === 7)
    expect(filepaths.length === data.contracts.length + data.libraries.length)

    for (let key in contracts) {
      expect(contracts[key].length === 2)
    }

    for (let key in libraries) {
      expect(libraries[key].length === 1)
    }
  })

  it('metadata object values have no undefined values', () => {

    for (let key in contracts) {
      for (let _key in contracts[key]) {
        expect(contracts[key][_key])
      }
    }
    for (let key in libraries) {
      for (let _key in libraries[key]) {
        expect(libraries[key][_key])
      }
    }

    // manual verification
    // console.log(contracts['StandardToken'].compiled)
    // console.log('\n')
    // console.log(libraries['Math'].compiled)
    // console.log('\n')

  })

  it('metadata object values are of correct types', () => {

    for (let key in contracts) {

      expect(typeof key === 'string')

      for (let _key in contracts[key]) {

        switch (_key) {
          case 'dependencies':
            expect(Array.isArray(contracts[key][_key]))
          case 'compiled':
            expect(typeof contracts[key][_key] === 'object')
            console.log(contracts[key])
            expect(typeof contracts[key][_key]['opcodes'] === 'string')
            // for (let __key in contracts[key][_key]) {
            //   expect(typeof __key === 'string')
            //   expect(typeof contracts[key][_key][__key]['opcodes'] === 'string')
            // }
        }
      }
    }

    for (let key in libraries) {

      expect(typeof key === 'string')

      for (let _key in libraries[key]) {

        switch (_key) {
          case 'compiled':
            expect(typeof libraries[key][_key] === 'object')
            expect(typeof libraries[key][_key]['opcodes'] === 'string')
        }
      }
    }
  })
})