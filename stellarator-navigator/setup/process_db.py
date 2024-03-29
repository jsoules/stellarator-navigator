import numpy as np
# import pandas # required for the pickle to load correctly
import pickle
import os
import errno

# NOTE: If ID length or folder structure changes, may need to adjust these
id_length = 7
prefix_length = 4

input_file_name = 'database_full.pkl'
output_file_name = 'database.json'

with open(input_file_name, "rb") as file:
    data = pickle.load(file)

# DROP FIELDS WE DON'T CARE ABOUT--shrink the file size
fields_to_drop = ["constraint_success", #"run_ID", "shear", "well",
                  "volume_profile", "currents",
                  "min_coil2axis_dist", "axis_Rc", "axis_Zs"]
data = data.drop(columns=fields_to_drop)

# fields_to_log_scale = ["qa_error", "gradient"]
fields_to_log_scale = ["qa_error"]
for field in fields_to_log_scale:
    data[field] = data[field].transform(lambda x: np.log10(x))
data["qa_error"] = data["qa_error"].transform(lambda x: x/2) # we actually want sqrt of this value

data.to_json(output_file_name, orient='split', double_precision=10)

# When the database loads separately, we can no longer look up individual records from a Context.
# Solution: include per-record json strings for the records in the database, under a 'records/' directory,
# following the usual naming convention.


for _, row in data.iterrows():
    name = str(row["ID"]).rjust(id_length, "0")
    prename = name[:prefix_length]
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
# data["max_tf"] = [max(row) for row in data["tf_profile"]]
# data["tf_len"] = [len(row) for row in data["tf_profile"]]
# data["iota_len"] = [len(row) for row in data["iota_profile"]]

