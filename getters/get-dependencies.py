
from os import walk, remove, path
from sys import argv, exit
import json

JSON_FILENAME = "../metadata/openzeppelin-solidity-dependencies.json"

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

                # nevermind libraries for now
                if line.find("library") == 0:
                    break

                # parse contract
                if line.find("contract") == 0:

                    # for manually verifying contract declaration lines
                    # print(line)

                    split_line = line.split()
                    
                    contract_name = split_line[1]

                    # add contract to contracts list and dependencies dict
                    dependencies[contract_name] = []

                    # find dependencies
                    is_index = line.find(" is ")
                    if is_index == -1:
                        continue # if no dependencies, we are done

                    # get dependencies
                    tokens = line[is_index + 4:].split()

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

# for visualizing output
# contracts = dependencies.keys()
# contracts.sort()
# for key in contracts:
#     print(key)
#     for d in dependencies[key]:
#         print("\t" + d)
#     print

# Write dependencies as JSON

# remove dependencies file if it already exists
if path.isfile(JSON_FILENAME):
    remove(JSON_FILENAME)

# # create and write file
with open(JSON_FILENAME, "w+") as json_file:
    json.dump(dependencies, json_file)
