import numpy as np
# import pandas # required for the pickle to load correctly
import pickle

input_file_name = '../../stellarator_database/database.pkl'
output_file_name = 'database.json'

with open(input_file_name, "rb") as file:
    data = pickle.load(file)

fields_to_log_scale = ["qa_error", "gradient"]
for field in fields_to_log_scale:
    data[field] = data[field].transform(lambda x: np.log10(x))
data["qa_error"] = data["qa_error"].transform(lambda x: x/2) # we actually want sqrt of this value

data.to_json(output_file_name, orient='split', double_precision=10)

# Okay, when the database loads separately, we can no longer look up individual records from context.
# Solution: include per-record json strings for the records in the database, under a 'records/' directory,
# following the usual naming convention.

import os
import errno

for _, row in data.iterrows():
    name = str(row["ID"]).rjust(6, "0")
    prename = name[:3]
    directory = os.path.join("records", prename)
    if not os.path.exists(directory):
        try:
            os.makedirs(directory)
        except OSError as error:
            if error.errno != errno.EEXIST:
                raise
    full_file = os.path.join(directory, f"{name}.json")
    row.to_json(full_file, double_precision=10)


# A little bit of poking
# fields = list(data.columns)
# fields.remove("constraint_success")
# def my_range(field: str):
#     minval = np.min(data[field])
#     maxval = np.max(data[field])
#     valrng = (maxval - minval)
#     dist_cnt = len(np.unique(data[field]))
#     print(f"\tField: {field}\n{minval} - {maxval} (range {valrng})\nwith {dist_cnt} distinct values")
# [my_range(field) for field in fields]
