const chai = require('chai')
const expect = chai.expect

describe('metadata format and contents', () => {

  const data = require('../index.js')
  const contracts = data.contracts
  const libraries = data.libraries
  const filepaths = require('../metadata/openzeppelin-solidity-filepaths.json')

  describe('contract and library data', () => {

      // manual verification
      // console.log(contracts)
      // console.log('\n')
      // console.log(libraries)
      // console.log('\n')
      // console.log(filepaths)
      // console.log('\n')

    it('metadata objects have correct number of keys', () => {

      expect(contracts.length === 61)
      expect(libraries.length === 7)
      expect(filepaths.length === data.contracts.length + data.libraries.length)
    })

    it('metadata object values have correct properties', () => {

      console.log(contracts['ERC20'].compiled)
      console.log('\n')
      console.log(libraries['Math'].compiled)

    })
  })
})