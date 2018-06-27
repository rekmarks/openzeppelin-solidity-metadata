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
# CONTRACT_NAMES_PATH = "../metadata/openzeppelin-solidity-contracts.json"
# CONTRACT_DEPENDENCIES_PATH = "../metadata/openzeppelin-solidity-dependencies.json"
# LIBRARY_NAMES_PATH = "../metadata/openzeppelin-solidity-libraries.json"
# FILE_PATHS_PATH = "../metadata/openzeppelin-solidity-filepaths.json"

CONTRACTS_PATH = "../metadata/openzeppelin-solidity-contracts.json"
LIBRARIES_PATH = "../metadata/openzeppelin-solidity-libraries.json"
FILE_PATHS_PATH = "../metadata/openzeppelin-solidity-filepaths.json"

# formatting
INDENT_LEVEL = 2

# storage
contracts = {}
libraries = {}
filepaths = {}

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

        current_path = dirpath + "/" + filename

        # open Solidity file
        with open(current_path, "r") as file:

            current_path = current_path[1:] # from "../" to "./"

            library_name = ""
            contract_name = ""

            imports = []

            for line in file:

                if line.find("import") == 0:

                    split_line = line.split("/")

                    current_import = split_line[-1]
                    current_import = current_import[:-2]

                    if current_import in imports:
                        raise RuntimeError("import already added")

                    imports.append(current_import)

                # parse library
                elif line.find("library") == 0:
                    
                    ### testing: manually verify library declaration lines ###
                    # print(line)

                    split_line = line.split()
                    
                    library_name = split_line[1]

                    libraries[library_name] = {}
                    filepaths[library_name] = current_path

                # parse contract
                elif line.find("contract") == 0:

                    ### testing: manually verify contract declaration lines ###
                    # print(line)

                    split_line = line.split()
                    
                    contract_name = split_line[1]

                    # add contract to dependencies dict
                    contracts[contract_name] = {}
                    filepaths[contract_name] = current_path

                    # find dependencies
                    is_index = line.find(" is ")
                    if is_index == -1:
                        continue # if no dependencies, we are done

                    if "dependencies" not in contracts[contract_name]:
                        contracts[contract_name]["dependencies"] = []

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
                        contracts[contract_name]["dependencies"].append(current_token)

                    contracts[contract_name]["dependencies"].sort()

                # add library used by contract as dependency
                elif line.find("using ") != -1:

                    split_line = line.split()

                    # "using" must be the first token
                    if split_line[0] != "using":
                        continue

                    # sanity check/defensive programming
                    if len(contract_name) > 0 and len(library_name) > 0:
                        raise RuntimeError("library_name and contract_name simultaneously non-empty")
                    if len(library_name) > 0:
                        raise RuntimeError("library_name non-empty and found 'using' statement")
                    if len(contract_name) == 0:
                        raise RuntimeError("contract_name empty and found 'using' statement")

                    # add dependency (will always be the second token)
                    if "dependencies" not in contracts[contract_name]:
                        contracts[contract_name]["dependencies"] = []
                    contracts[contract_name]["dependencies"].append(split_line[1])

# Write contracts and dependencies as JSON

# remove contracts file if it already exists
if path.isfile(CONTRACTS_PATH):
    remove(CONTRACTS_PATH)

# create and write contracts file
with open(CONTRACTS_PATH, "w") as contracts_file:
    json.dump(contracts, contracts_file, indent=INDENT_LEVEL, sort_keys=True)

# remove libraries file if it already exists
if path.isfile(LIBRARIES_PATH):
    remove(LIBRARIES_PATH)

# create and write libraries file
with open(LIBRARIES_PATH, "w") as libraries_file:
    json.dump(libraries, libraries_file, indent=INDENT_LEVEL, sort_keys=True)

# remove file paths file if it already exists
if path.isfile(FILE_PATHS_PATH):
    remove(FILE_PATHS_PATH)

# create and write libraries file
with open(FILE_PATHS_PATH, "w") as filepaths_file:
    json.dump(filepaths, filepaths_file, indent=INDENT_LEVEL, sort_keys=True)