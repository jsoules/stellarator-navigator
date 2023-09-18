import numpy as np
import pickle

input_file_name = 'data_19072023.pkl'
output_file_name = 'data_18092023.json'

with open("PKL_FILE_NAME", "rb") as file:
    data = pickle.load(file)

fields_to_log_scale = ["qa_error", "gradient"]

# for gradient, QA error, ...
for field in fields_to_log_scale:
    data[field] = data[field].transform(lambda x: np.log10(x))

data.to_json(output_file_name, orient='split', double_precision=10)
