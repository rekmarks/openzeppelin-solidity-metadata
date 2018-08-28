'''
Author: Erik Marks (github.com/rekmarks)

Script for retrieving contract names and dependencies from the OpenZeppelin 
Solidity library.
'''

from os import walk, remove, path
from sys import argv, exit
import json

# input file root path
OPENZEPPELIN_PATH = "./node_modules/openzeppelin-solidity"

CONTRACTS_PATH = "./metadata/openzeppelin-solidity-contracts-dependencies.json"
LIBRARIES_PATH = "./metadata/openzeppelin-solidity-libraries.json"
FILEPATHS_PATH = "./metadata/openzeppelin-solidity-filepaths.json"

# helper function to write data to file at filepath, first deleting the file if
# it already exists
def writeFile(filepath, data):

    # remove file if it already exists
    if path.isfile(filepath):
        remove(filepath)

    # create file and write data to it
    with open(filepath, "w") as data_file:
        json.dump(data, data_file, indent=2, sort_keys=True)

# Get dependencies

contracts = {}
libraries = {}
filepaths = {}

# walk through openzeppelin directory
for (dirpath, dirnames, filenames) in walk(OPENZEPPELIN_PATH):

    # ignore mocks and examples, if using OpenZeppelin repo instead of npm dist
    if dirpath.endswith("mocks") or dirpath.endswith("examples"):
        continue

    # for filename in current directory
    for filename in filenames:
        print('hello')