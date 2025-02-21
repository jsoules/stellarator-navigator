import os
import re
import sys
from collections import deque

## This was a one-off script to do the data corrections associated with
## issue #32.


tf_profile_zero_checker = re.compile(r'"tf_profile":\[0.0,')
replacer = re.compile(r'"iota_profile":\[[^,]*,(.*)"tf_profile":\[0.0,')
replacement = r'"iota_profile":[\1"tf_profile":['


def check_has_0(jsonstr:  str) -> bool:
    m = tf_profile_zero_checker.search(jsonstr)
    return not (m is None)


def delete_hit(jsonstr: str) -> str:
    return re.sub(replacer, replacement, jsonstr)


def process_file(file: os.DirEntry[str], path: str, commit: bool = False):
    full_path = os.path.join(path, file.name)
    with open(full_path, "r") as f:
        text = f.read()
    
    if not commit:
        valid_file = check_has_0(text)
        if not valid_file:
            print(f"File {full_path} does not match pattern (first tf_profile entry is 0.0)")
    else:
        fixed = delete_hit(text)
        if fixed == text:
            print(f"File {full_path} did not match replacement pattern; manually review!")
            return
        with open(full_path, "w") as out:
            out.write(fixed)


def process_dir(paths: deque, commit: bool = False):
    try:
        path = paths.popleft()
        with os.scandir(path) as it:
            for entry in it:
                if entry.is_dir():
                    paths.append(os.path.join(path, entry.name))
                if entry.is_file():
                    if entry.name.endswith('json'):
                        process_file(entry, path, commit)
    except IndexError:
        return


def main(commit: bool = False):
    paths = deque(['.'])
    while (len(paths) > 0):
        process_dir(paths, commit)


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'commit':
        main(True)
    else:
        main()

