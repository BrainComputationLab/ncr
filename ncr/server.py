from __future__ import unicode_literals
from flask import Flask, request, jsonify
from flask.ext.restful import Api, Resource
# from functools import wraps
import ncr.db as db
import json

# Create new application
app = Flask(__name__)
# Set application root
app.config['APPLICATION_ROOT'] = '/ncr/api'
# Debugging is okay for now
app.debug = True
# Create the REST API
api = Api(app)
# Create a db object
app.db = db.Controller()


@app.before_request
def before_request():
    try:
        token = request.headers['token']
    except KeyError:
        return "Missing access token", 401
    valid = app.db.verify_token(token)
    if not valid:
        return "Invalid/Expired auth token", 401

# def authenticate(func):
#     @wraps(func)
#     def wrapper(*args, **kwargs):
#         try:
#             token = request.headers['token']
#         except KeyError:
#         app.db.verify
#         return func(*args, **kwargs)
#     return wrapper


@app.route("/login", methods=['POST'])
def login_route():
    if not request.json:
        return "login data must be valid json", 401
    if 'username' not in request.json:
        return "username is required", 401
    if 'password' not in request.json:
        return "password is required", 401
    username = request.json.username
    password = request.json.password
    res = app.db.login(username, password)
    if not res:
        return "username or password incorrect", 401
    else:
        return jsonify({"token": res})


class NeuronResource(Resource):

    # method_decorators = [authenticate]

    def get(self, id):
        if not id:
            return "id must be specified", 400
        try:
            e = db.Neuron.one({"_id": id})
        except db.MultipleResultsFound:
            return "Error", 500
        return json.dumps(e)

    def post(self, id):
        if not id:
            return "id must be specified", 400
        try:
            e = db.Neuron.one({"_id": id})
        except db.MultipleResultsFound:
            return "Error", 500
        if e:
            return "An entity with this id already exists", 400
        req = json.loads(request.json)
        e = db.Neuron(req)

    def put(self, id):
        if not id:
            return "id must be specified", 400
        try:
            e = db.Neuron.one({"_id": id})
        except db.MultipleResultsFound:
            return "Error", 500
        if not e:
            return "An entity with this id does not exist", 400
        req = json.loads(request.json)
        e = db.Neuron.find_and_modify({"_id": id}, req)

    def delete(self, id):
        if not id:
            return "id must be specified", 400
        try:
            e = db.Neuron.one({"_id": id})
        except db.MultipleResultsFound:
            return "Error", 500
        if not e:
            return "An entity with this id does not exist", 400
        e.delete()


api.add_resource(NeuronResource, '/neuron/<string:id>')

if __name__ == '__main__':
    app.run("0.0.0.0", 9000)
