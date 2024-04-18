

# imports

from simsopt._core import load
from simsopt.geo import CurveLength

import os
import json
import numpy as np

def compute_curves(id: int) -> tuple[np.ndarray, np.ndarray]:
    path = get_simsopt_path(id)
    [surfaces, _, coils] = load(path)
    total_length = sum([CurveLength(c.curve).J() for c in coils])
    total_length_per_hp = total_length / surfaces[0].nfp / 2
    return (total_length, total_length_per_hp)


def get_simsopt_path(id: int):
    str_id = f'{id:07}'
    prefix = str_id[:4]
    base = '/mnt/home/jsoules/ceph/QUASR-2024/simsopt_serials/'
    path = os.path.join(base, prefix, f'serial{str_id}.json')
    return path


def get_single_record_path(id: int):
    str_id = f'{id:07}'
    prefix = str_id[:4]
    newname = f'{str_id}.json.REV'
    newpath = os.path.join('/mnt/home/jsoules/ceph/QUASR-2024/records', f'{prefix}', newname)
    return newpath


def read_db(path_to_json_db: str):
    dbjson = os.path.join(path_to_json_db, 'database.json')
    with open(dbjson) as f:
        db = json.load(f)
    return db


def write_single_record(id: int, row):
    path = get_single_record_path(id)
    with open(path, 'w') as f:
        json.dump(row, f)


def write_db(path_to_json_db: str, data):
    new_db = os.path.join(path_to_json_db, 'database.json.REV')
    data.to_json(new_db, orient='split', double_precision=10)


def main():
    db_path = '/mnt/home/jsoules/ceph/QUASR-2024/'
    db = read_db(db_path)
    # look at db['columns'] to identify the column order
    for i, v in enumerate(db['columns']):
        print(f'{v}\t{i}')
    # This shows ID is index 10,
    # coil length per hp is index 1, total coil length is index 2.
    # We have also confirmed that updating the values in the rows
    # will update the values in the parent.
    data = db['data']
    modified_cnt = 0
    modified_list = []
    for record in data:
        id = record[10]
        current_per = record[1]
        current_tot = record[2]
        total_length, length_per_hp = compute_curves(id)
        record[1] = round(length_per_hp.item(), 1)
        record[2] = round(total_length.item(), 1)
        if (abs(current_tot - record[2]) > 0.1
            or abs(current_per - record[1]) > 0.1):
            modified_list.append(f"Updated record {id}\t{current_per} -> {record[1]}, {current_tot} -> {record[2]}")
            modified_cnt += 1
        write_single_record(id, record)
    print(f"Modified {modified_cnt} records.")
    write_db(db_path, db)

