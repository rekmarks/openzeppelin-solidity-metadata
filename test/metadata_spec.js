const chai = require('chai')

describe('metadata format and contents', () => {

  const data = require('../index.js')
  const filepaths = require('../metadata/openzeppelin-solidity-filepaths.json')

  describe('contract and library data', () => {

    it('metadata objects have correct number of entitites', () => {

      chai.expect(data.contracts.length === 61)
      chai.expect(data.libraries.length === 7)
      chai.expect(filepaths.length === data.contracts.length + data.libraries.length)

      console.log(data)
      console.log('\n')
      console.log(filepaths)
      console.log('\n')
    })
  })
})