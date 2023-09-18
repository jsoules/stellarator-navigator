import numpy as np
import pickle

input_file_name = '../../stellarator_database/database.pkl'
output_file_name = 'database.json'

with open(input_file_name, "rb") as file:
    data = pickle.load(file)

fields_to_log_scale = ["qa_error", "gradient"]
for field in fields_to_log_scale:
    data[field] = data[field].transform(lambda x: np.log10(x))

data.to_json(output_file_name, orient='split', double_precision=10)

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
