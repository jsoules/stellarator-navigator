from flask import Flask, abort, jsonify, Response
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

## TODO: Use more robust path management

INVALID_PATH_SENTINEL = "INVALID_TYPE"
valid_endpoint_types = ['curves', 'surfaces', 'modB', 'downloadPaths', 'nml', 'simsopt_serials', 'currents']
graphics_types = ['curves', 'currents', 'surfaces', 'modB',]
database_root = "../stellarator_database"

NORMALIZE_SURFACES_PER_SURFACE = True

@app.route('/')
def index() -> str:
    return 'Server works!'


@app.route('/api/<type>/<id>')
def get_data(type: str, id: str):
    if (not id_clean(id) or not (type in valid_endpoint_types)):
        abort(400)
    try:
        if (type == 'curves'):
            response = jsonify(fetch_curves(id))
        elif (type == 'surfaces'):
            response = jsonify(fetch_surfaces(id))
        elif (type == 'downloadPaths'):
            response = jsonify(fetch_download_paths(id))
        else:
            # Can't happen--we already checked all known types above. But
            # we prefer an explicit value test over an "else" assumption
            abort(500)
        return response
    except FileNotFoundError:
        abort(404)
    except Exception as e:
        # print(e.args)
        # print(e)

        abort(500)


def make_file_path(id: str, type: str='curves') -> str:
    if not (type in valid_endpoint_types):
        return INVALID_PATH_SENTINEL
    prefix = id[:-3]
    dir = f"graphics/{type}" if type in graphics_types else type

    suffix = '.txt'
    file_base = f"{type}{id}"
    if type == 'simsopt_serials':
        suffix = '.json'
        file_base = f"serial{id}"
    if type == 'nml':
        suffix = id
        file_base = "input."

    return f"{database_root}/{dir}/{prefix}/{file_base}{suffix}"


# In the current spec, the only valid IDs are pure numeric,
# so that should be enough to ensure the data is safe
def id_clean(id: str) -> bool:
    return id.isnumeric()


def fetch_curves(id: str):
    path = make_file_path(id, type='curves')
    # * 10 to put the points into an order of magnitude that's more comfortable
    # for the 3D library
    coils = np.loadtxt(path).reshape((160, -1, 3)).transpose((1, 0, 2)) * 10
    currents_path = make_file_path(id, type='currents')
    currents = np.loadtxt(currents_path)
    currents = currents / np.max(np.abs(currents)) # normalize current values per device
    response = [{'coil': coils[i].tolist(), 'current': currents[i]} for i in range(currents.shape[0])]
    return response


def fetch_surfaces(id: str):
    s_path = make_file_path(id, type='surfaces')
    m_path = make_file_path(id, type='modB')
    # Again, multiply by 10 to put points in a more comfortable range for three.js
    surfs = np.loadtxt(s_path).reshape((30, 30, -1, 3)).transpose((2, 0, 1, 3)) * 10
    modB = np.loadtxt(m_path).reshape((30, 30, -1)).transpose((2, 0, 1))
    # Bs = []
    # for k in range(modB.shape[0]):
    #     B = (modB[k, :, :] - np.min(modB[k, :, :]))
    #     B = B / np.max(B)
    #     Bs.append(B)
    # normalized_modB = np.array(Bs)

    tmp = modB.reshape((-1, 900))
    if NORMALIZE_SURFACES_PER_SURFACE:
        nmb = tmp - np.min(tmp, axis=1, keepdims=True)
        nmb = nmb / np.max(nmb, axis=1, keepdims=True)
    else:
        # normalize per-device
        nmb = tmp - np.min(tmp, keepdims=True)
        nmb = nmb / np.max(nmb, keepdims=True)
    nmb = nmb.reshape((-1, 30, 30))

    normalized_modB = nmb

    return { "surfacePoints": surfs.tolist(), "pointValues": normalized_modB.tolist() }


def fetch_download_paths(id: str):
    vmec_path = make_file_path(id, 'nml')
    simsopt_path = make_file_path(id, 'simsopt_serials')
    # TODO: Remove this when we switch to the correct paths
    # TODO: MUST ENSURE SAME ORIGIN--"download" property won't be honored cross-origin
    tmp_public_root = 'https://sdsc-users.flatironinstitute.org/~agiuliani/QUASR'
    real_vmec_path = vmec_path.replace(database_root, tmp_public_root, 1)
    real_simsopt_path = simsopt_path.replace(database_root, tmp_public_root, 1)

    return { "vmecPath": real_vmec_path, "simsoptPath": real_simsopt_path }

