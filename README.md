# openzeppelin-solidity-metadata
OpenZeppelin Solidity metadata, for now merely contract dependencies, in JSON format.

Not endorsed by or affiliated with Zeppelin or the OpenZeppelin maintainers.

## usage
To re-generate data, run the desired getter in your terminal, in the `./getters` directory

Getters assume Unix file structure

## notes
JSON data in `./metadata` up to date with OpenZeppelin library as of most recent commit

Ignores `openzeppelin-solidity/contracts/mocks` and `openzeppelin-solidity/contracts/examples`

The `Bounty` contract actually requires the `Target` contract to function, as specified in `openzeppelin-solidity/contracts/Bounty.sol`
