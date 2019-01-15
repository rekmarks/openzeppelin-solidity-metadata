# solidity-metadata
Retrieves your Solidity dependencies and other metadata as JSON.

## example output
~~
{
  "Address": {
    "compiler": "^0.5.0",
    "dependencies": [],
    "name": "Address",
    "type": "library"
  },
  "AllowanceCrowdsale": {
    "compiler": "^0.5.0",
    "dependencies": [
      "Crowdsale",
      "IERC20",
      "Math",
      "SafeERC20",
      "SafeMath"
    ],
    "name": "AllowanceCrowdsale",
    "type": "contract"
  },
  ...
}
~~

# usage
- install using `npm install solidity-metadata`
- use `npm run get-metadata` and specify a directory to get the metadata of all
  Solidity files therein
  - e.g. `npm run get-metadata -- path/to/my/directory`
  - you can also use `npm run get-openzeppelin-metadata` to get the metadata of
    the OpenZeppelin contracts, libraries, and interfaces (check package.json
    to see which version)
- by default, metadata is output to the `metadata` folder in the project root, but
  you can specify another directory as the second parameter
- a Python script does the heavy lifting
  - Use the third parameter to specify a
    path to your local Python installation if it gives you trouble

If importing the package, you can access the following properties:
- ``getMetadata``
    - a function that, given a root directory for some Solidity files, writes
      their metadata and filepaths as JSON files to the project `metadata`
      or another specified directory
    - returns the paths to the output files
