

# Responds to issue #2, confirming that every ID in the database has an associated
# file for curves, surfaces, modb, and axis.

# Note that after running process_files.py, most of these (axis not yet supported)
# will have been reformatted and be .json rather than .txt.

# Note also you could probably do this with capturing the output of a find command
# and sorting & comparing the resulting list, but this feels less hacky.

# Another alternative would be to walk the records/ directory, but we already
# have the full IDs list from the database export.

import pickle
import os

id_length = 7
prefix_length = 4

database_name = 'QUASR.pkl'
with open(database_name, "rb") as file:
    data = pickle.load(file)

ids = data["ID"]

#   Patterns:
# axis: graphics/axis/{PREFIX}/axis{ID}.txt
# surfaces: graphics/surfaces/{PREFIX}/surfaces{ID}.[txt | json]
# modb: graphics/modB/{PREFIX}/modB{ID}.txt
# curves: graphics/curves/{PREFIX}/curves{ID}.[txt | json]
# currents: NOT ALWAYS SUPPORTED?

typenames = ['axis', 'surfaces', 'modB', 'curves']
filetype_suffix = "txt"

for id in ids:
    name = str(id).rjust(id_length, "0")
    prename = name[:prefix_length]
    for filetype in typenames:
        expected_data = os.path.join("graphics", filetype, prename, f"{filetype}{name}.{filetype_suffix}")
        if not os.path.exists(expected_data):
            print(f"Missing data--record {id} lacks {filetype} record {expected_data}")
