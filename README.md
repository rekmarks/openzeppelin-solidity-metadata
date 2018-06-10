# openzeppelin-solidity-metadata
OpenZeppelin Solidity metadata, for now merely contract dependencies, in JSON format

## usage
To re-generate data, run the desired getter in your terminal, in the `./getters` directory

Getters assume Unix file structure

## notes
JSON data in `./metadata` up to date with OpenZeppelin library as of most recent commit

The `Bounty` contract actually requires the `Target` contract to function, as specified in `openzeppelin-solidity/contracts/Bounty.sol`
