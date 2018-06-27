# openzeppelin-solidity-metadata
OpenZeppelin Solidity metadata, in JSON format.

Not endorsed by or affiliated with Zeppelin or OpenZeppelin.

## usage
Install using `npm install openzeppelin-solidity-metadata`. After importing the package, you can access the following properties:
- `contracts`
    - an object of all OpenZeppelin contract names as strings to object values
        - `compiled`
            - the compiled contract, from `solc.compile()`
        - `dependencies`
            - a sorted array of dependencies
- `libraries`
    - an object of OpenZeppelin library names to object values
        - `compiled`
            - the compiled library, from `solc.compile()`

### notes
- JSON data current as of OpenZeppelin `1.10.0`
- Does not include `openzeppelin-solidity/contracts/mocks` and `openzeppelin-solidity/contracts/examples` from the OpenZeppelin repo
- The `Bounty` contract requires the `Target` contract to function, even though it does not *depend* on it
- A Solidity `library` can neither inherit nor be inherited

## dev
To re-generate data, clone the repo and run the desired getter in your terminal, in the `./getters` directory, after running `npm install`