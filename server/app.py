from flask import Flask, abort, jsonify, Response
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

## TODO: Use more robust path management

INVALID_PATH_SENTINEL = "INVALID_TYPE"
valid_endpoint_types = ['curves', 'surfaces', 'modB']
graphics_types = ['surfaces', 'curves', 'modB',]
database_root = "../stellarator_database"

@app.route('/')
def index() -> str:
    return 'Server works!'


@app.route('/api/<type>/<id>')
def get_coils(type: str, id: str):
    if (not id_clean(id) or not (type in valid_endpoint_types)):
        abort(400)
    try:
        if (type == 'curves'):
            response = jsonify(fetch_curves(id))
        elif (type == 'surfaces'):
            response = jsonify(fetch_surfaces(id))
        else:
            # Can't happen--we already checked type above, but we
            # prefer an explicit value test over an "else" assumption
            abort(500)
        return response
    except FileNotFoundError:
        abort(404)
    except:
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
    if type == 'nml':
        suffix = id
        file_base = "input."
        # return f"{database_root}/{dir}/{prefix}/input.{id}"

    return f"{database_root}/{dir}/{prefix}/{file_base}{suffix}"


# In the current spec, the only valid IDs are pure numeric,
# so that should be enough to ensure the data is safe
def id_clean(id: str) -> bool:
    return id.isnumeric()

def fetch_curves(id: str):
    path = make_file_path(id, type='curves')
    # * 10 to put the points into an order of magnitude that's more comfortable
    # for the 3D library
    points = np.loadtxt(path).reshape((160, -1, 3)).transpose((1, 0, 2)) * 10
    return points.tolist()


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
    nmb = tmp - np.min(tmp, axis=1, keepdims=True)
    nmb = nmb / np.max(nmb, axis=1, keepdims=True)
    nmb = nmb.reshape((-1, 30, 30))

    normalized_modB = nmb

    return { "surfacePoints": surfs.tolist(), "pointValues": normalized_modB.tolist() }

