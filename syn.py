from flask import Flask
from flask.json import jsonify
import nltk
from nltk.corpus import wordnet as wn
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper


def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator


app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"


@app.route('/syn/<word>')
@crossdomain(origin='*')
def get_syn(word):
    # return synonyms for a passed in word
    syn_sets = wn.synsets(word)
    syns = set([])
    for syn_set in syn_sets:
        print '%s synonyms:\t%s' % (syn_set, syn_set.lemma_names)    
        for lemma in syn_set.lemma_names:
            syns.add(lemma)
    res = {"syns": list(syns)}
    return jsonify(res)

@app.route('/def/<word>')
@crossdomain(origin='*')
def get_def(word):
    # return synonyms for a passed in word
    syn_sets = wn.synsets(word)
    defs = set([])
    for syn_set in syn_sets:
        defs.add((syn_set.lexname, syn_set.definition, ))
    res = {"defs": list(defs)}
    return jsonify(res)

if __name__ == "__main__":
    app.debug = True
    app.run()

