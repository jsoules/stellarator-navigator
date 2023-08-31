from flask import Flask, abort, jsonify, Response
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

INVALID_PATH_SENTINEL = "INVALID_TYPE"
valid_endpoint_types = ['curves', 'surfaces']

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
    return f"../database/{type}/{prefix}/{type}{id}.txt"


# In the current spec, the only valid IDs are pure numeric,
# so that should be enough to ensure the data is safe
def id_clean(id: str) -> bool:
    return id.isnumeric()


def fetch_curves(id: str):
    path = make_file_path(id, type='curves')
    points = np.loadtxt(path).reshape((60, -1, 3)).transpose((1, 0, 2)) * 10
    return points.tolist()


def fetch_surfaces(id: str):
    s_path = make_file_path(id, type='surfaces')
    m_path = make_file_path(id, type='modB')
    surfs = np.loadtxt(s_path).reshape((30, 30, -1, 3)).transpose((2, 0, 1, 3)) * 10
    modB = np.loadtxt(m_path).reshape((30, 30, -1)).transpose((2, 0, 1))
    normalized_modB = modB - np.min(modB, axis=1, keepdims=True)
    normalized_modB = normalized_modB / np.max(normalized_modB, axis=1, keepdims=True)

    return { "surfacePoints": surfs.tolist(), "pointValues": normalized_modB.tolist() }

