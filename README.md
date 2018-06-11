# openzeppelin-solidity-metadata
OpenZeppelin Solidity metadata, for now merely contract names and dependencies, in JSON format.

Not endorsed by or affiliated with Zeppelin or the OpenZeppelin maintainers.

## usage
Install using `npm install openzeppelin-solidity-metadata`. After importing the package, you can access the following properties:
- `contracts`
    - A sorted array of OpenZeppelin contract names
- `dependencies`
    - An object of OpenZeppelin contract name strings to sorted arrays of dependencies

## notes
JSON data current as of OpenZeppelin `1.10.0`

Ignores `openzeppelin-solidity/contracts/mocks` and `openzeppelin-solidity/contracts/examples`

The `Bounty` contract actually requires the `Target` contract to function, as specified in `openzeppelin-solidity/contracts/Bounty.sol`

## dev
To re-generate data, clone the repo and run the desired getter in your terminal, in the `./getters` directory
