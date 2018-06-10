
from os import walk, remove, path
from sys import argv, exit
import json

CONTRACTS_FILENAME = "../metadata/openzeppelin-solidity-contracts.json"
DEPENDENCIES_FILENAME = "../metadata/openzeppelin-solidity-dependencies.json"

INDENT_LEVEL = 2


if len(argv) != 2:
    exit("Usage: %s [.../openzeppelin-solidity]" % argv[0])

dependencies = {}

# Get dependencies

# walk through openzeppelin directory
for (dirpath, dirnames, filenames) in walk(argv[1]):

    # ignore mocks and examples
    if dirpath.endswith("mocks") or dirpath.endswith("examples"):
        continue

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
                    break

                # parse contract
                if line.find("contract") == 0:

                    # testing: manually verify contract declaration lines
                    # print(line)

                    split_line = line.split()
                    
                    contract_name = split_line[1]

                    # add contract to dependencies dict
                    dependencies[contract_name] = []

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
                        dependencies[contract_name].append(current_token)

                    dependencies[contract_name].sort()

# Write contracts and dependencies as JSON

# get contract names
contracts = dependencies.keys()
contracts.sort()

# remove contracts file if it already exists
if path.isfile(CONTRACTS_FILENAME):
    remove(CONTRACTS_FILENAME)

# create and write contracts file
with open(CONTRACTS_FILENAME, "w") as contracts_file:
    json.dump(contracts, contracts_file, indent=INDENT_LEVEL)

# remove dependencies file if it already exists
if path.isfile(DEPENDENCIES_FILENAME):
    remove(DEPENDENCIES_FILENAME)

# create and write dependencies file
with open(DEPENDENCIES_FILENAME, "w") as dependencies_file:
    json.dump(dependencies, dependencies_file, indent=INDENT_LEVEL, sort_keys=True)