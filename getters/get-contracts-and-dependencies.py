'''
Author: Erik Marks (github.com/rekmarks)

Script for retrieving contract names and dependencies from the OpenZeppelin 
Solidity library.
'''

from os import walk, remove, path
from sys import argv, exit
import json

# input file root path
OPENZEPPELIN_PATH = "../node_modules/openzeppelin-solidity"

# output file paths
CONTRACT_NAMES_PATH = "../metadata/openzeppelin-solidity-contracts.json"
CONTRACT_DEPENDENCIES_PATH = "../metadata/openzeppelin-solidity-dependencies.json"
LIBRARY_NAMES_PATH = "../metadata/openzeppelin-solidity-libraries.json"

# formatting
INDENT_LEVEL = 2

# storage
contract_names = []
contract_dependencies = {}
library_names = []

# Get dependencies

# walk through openzeppelin directory
for (dirpath, dirnames, filenames) in walk(OPENZEPPELIN_PATH):

    ### only if using repo instead of npm dist ###
    # ignore mocks and examples
    # if dirpath.endswith("mocks") or dirpath.endswith("examples"):
    #     continue

    # for filename in current directory
    for filename in filenames:

        # only check Solidity files
        if len(filename) < 5 or not filename.endswith(".sol"):
            continue

        # open Solidity file
        with open(dirpath + "/" + filename, "r") as file:

            for line in file:

                # ignore libraries
                if line.find("library") == 0:
                    
                    ### testing: manually verify library declaration lines ###
                    # print(line)

                    split_line = line.split()
                    
                    library_names.append(split_line[1])

                # parse contract
                if line.find("contract") == 0:

                    ### testing: manually verify contract declaration lines ###
                    # print(line)

                    split_line = line.split()
                    
                    contract_name = split_line[1]
                    contract_names.append(contract_name)

                    # add contract to dependencies dict
                    contract_dependencies[contract_name] = []

                    # find dependencies
                    is_index = line.find(" is ")
                    if is_index == -1:
                        continue # if no dependencies, we are done

                    # get dependencies
                    tokens = line[is_index + 4:].split()

                    # iterate over dependencies (last token is "{\n")
                    for i in range(len(tokens) - 1):

                        current_token = tokens[i]

                        # remove comma
                        if current_token[-1] == ",":
                            current_token = current_token[:-1]

                        if not current_token.isalnum():
                            continue # ignore non-alphanumeric tokens     

                        # add dependency
                        contract_dependencies[contract_name].append(current_token)

                    contract_dependencies[contract_name].sort()

# Write contracts and dependencies as JSON

# sort contract and library names
contract_names.sort()
library_names.sort()

# remove contracts file if it already exists
if path.isfile(CONTRACT_NAMES_PATH):
    remove(CONTRACT_NAMES_PATH)

# create and write contracts file
with open(CONTRACT_NAMES_PATH, "w") as contracts_file:
    json.dump(contract_names, contracts_file, indent=INDENT_LEVEL)

# remove dependencies file if it already exists
if path.isfile(CONTRACT_DEPENDENCIES_PATH):
    remove(CONTRACT_DEPENDENCIES_PATH)

# create and write dependencies file
with open(CONTRACT_DEPENDENCIES_PATH, "w") as dependencies_file:
    json.dump(contract_dependencies, dependencies_file, indent=INDENT_LEVEL, sort_keys=True)

# remove libraries file if it already exists
if path.isfile(LIBRARY_NAMES_PATH):
    remove(LIBRARY_NAMES_PATH)

# create and write libraries file
with open(LIBRARY_NAMES_PATH, "w") as libraries_file:
    json.dump(library_names, libraries_file, indent=INDENT_LEVEL)