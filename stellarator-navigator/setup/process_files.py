import numpy as np
import os
import json
from collections import deque

## TODO: command-line arguments to suppress display of "output file exists and is newer" messages

def convert_file(file: os.DirEntry[str], path: str):
    if (not file.name.endswith('txt')):
        return

    full_path = os.path.join(path, file.name)
    out_path = full_path.replace('txt', 'json')
    if (os.path.exists(out_path)):
        if os.path.getmtime(full_path) < os.path.getmtime(out_path):
            print(f"WARNING: File {out_path} already exists and is newer than {full_path}. Skipping.")
            return

    if file.name.startswith('curves'):
        data_out = convert_coils(full_path)
    elif file.name.startswith('modB'):
        data_out = convert_modB(full_path)
    elif file.name.startswith('currents'):
        data_out = convert_currents(full_path)
    elif file.name.startswith('surfaces'):
        data_out = convert_surfaces(full_path)
    else:
        # data_out = 'ERROR'
        # SKIP OTHER FILES
        return

    with open (out_path, "w") as out:
        out.write(json.dumps(data_out))


def convert_coils(full_file_path: str):
    coils = np.loadtxt(full_file_path).reshape((160, -1, 3)).transpose((1, 0, 2)) * 10
    return coils.tolist()


def convert_currents(full_file_path: str):
    currents = np.atleast_1d(np.loadtxt(full_file_path))
    currents = currents / np.max(np.abs(currents))
    return currents.tolist()


def convert_modB(full_file_path: str, normalize_surfaces_per_surface: bool = False):
    modB = np.loadtxt(full_file_path).reshape((30, 30, -1)).transpose((2, 0, 1))
    tmp = modB.reshape((-1, 900))
    if normalize_surfaces_per_surface:
        normalized_modB = tmp - np.min(tmp, axis=1, keepdims=True)
        normalized_modB = normalized_modB / np.max(normalized_modB, axis=1, keepdims=True)
    else:
        # normalize per-device
        normalized_modB = tmp - np.min(tmp, keepdims=True)
        normalized_modB = normalized_modB / np.max(normalized_modB, keepdims=True)
    normalized_modB = normalized_modB.reshape((-1, 30, 30))
    return normalized_modB.tolist()


def convert_surfaces(full_file_path: str):
    # Again, multiply by 10 to put points in a more comfortable range for three.js
    surfs = np.loadtxt(full_file_path).reshape((30, 30, -1, 3)).transpose((2, 0, 1, 3)) * 10
    return surfs.tolist()


def process_dir(paths: deque):
    try:
        path = paths.popleft()
        with os.scandir(path) as it:
            for entry in it:
                if entry.is_dir():
                    paths.append(os.path.join(path, entry.name))
                if entry.is_file():
                    if entry.name.endswith('txt'):
                        convert_file(entry, path)
    except IndexError:
        return


def main():
    paths = deque(['.'])
    while (len(paths) > 0):
        process_dir(paths)


if __name__ == '__main__':
    main()


