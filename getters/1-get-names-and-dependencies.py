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

        # only check Solidity files
        if len(filename) < 5 or not filename.endswith(".sol"):
            continue

        # say no to deprecated contracts
        if filename.find("Deprecated") != -1:
            continue

        current_path = dirpath + "/" + filename

        # open Solidity file
        with open(current_path, "r") as file:

            current_path = current_path[1:] # from "../" to "./"

            library_name = ""
            contract_name = ""

            imports = []

            for line in file:

                # parse imports
                if line.find("import") == 0:

                    split_line = line.split("/")

                    current_import = split_line[-1]
                    current_import = current_import[:-7] # .sol";\n

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

                    if len(imports) == 0:
                        continue

                    libraries[library_name]["dependencies"] = []

                    # iterate over imports to add depdendencies
                    for i in range(len(imports)):

                        current_import = imports[i]

                        if not current_import.isalnum():
                            raise RuntimeError("non-alphanumeric import " 
                                + current_import + " for " + filename)     

                        # add dependency
                        libraries[library_name]["dependencies"].append(current_import)

                    libraries[library_name]["dependencies"].sort()

                # parse contract
                elif line.find("contract") == 0 or line.find("interface") == 0:

                    ### testing: manually verify contract declaration lines ###
                    # print(line)

                    split_line = line.split()
                    
                    contract_name = split_line[1]

                    # add contract to dependencies dict
                    contracts[contract_name] = {}
                    filepaths[contract_name] = current_path

                    if len(imports) == 0:
                        continue # if no imports, we are done

                    # if "dependencies" not in contracts[contract_name]:
                    contracts[contract_name]["dependencies"] = []

                    # iterate over imports to add depdendencies
                    for i in range(len(imports)):

                        current_import = imports[i]

                        if not current_import.isalnum():
                            raise RuntimeError("non-alphanumeric import " 
                                + current_import + " for " + filename)     

                        # add dependency
                        contracts[contract_name]["dependencies"].append(current_import)

                    contracts[contract_name]["dependencies"].sort()

# Write contracts and dependencies as JSON

writeFile(CONTRACTS_PATH, contracts)
writeFile(LIBRARIES_PATH, libraries)
writeFile(FILEPATHS_PATH, filepaths)
