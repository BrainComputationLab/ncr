from __future__ import unicode_literals, absolute_import
from flask import Flask, request, jsonify
from flask.ext.restful import Api, Resource
import json

import ncr.strings as strings
import ncr.schemas as schemas
import ncr.db as db

# Create new application
app = Flask(__name__)
# Set application root
app.config['APPLICATION_ROOT'] = '/ncr/api'
# Debugging is okay for now
app.debug = True
# Create the REST API
api = Api(app)
# Create a db object
app.db = db.Service()


@app.before_request
def before_request():
    """ before the request we're doing some auth checking """
    if request.method in ['POST', 'PUT']:
        req_json = request.get_json(force=True, silent=True)
        if not req_json:
            return jsonify(message=strings.API_INVALID_JSON), 400
    if request.path == '/login':
        return
    token = request.headers.get('token')
    if token is None:
        return strings.API_MISSING_TOKEN, 401
    valid = app.db.verify_token(token)
    if not valid:
        return strings.API_BAD_TOKEN, 401


@app.route("/login", methods=['POST'])
def login_route():
    """ Handles client requests to log in to the system """
    # validate the json request
    req_json = request.get_json(force=True)
    err = schemas.validate(req_json, schemas.login_schema)
    if err:
        return jsonify(message=err), 400
    # get the username and password and attempt to login
    username = req_json.get('username')
    password = req_json.get('password')
    res = app.db.attempt_login(username, password)
    # if theres no user matching those credentials
    if res is None:
        return jsonify(message=strings.API_BAD_CREDENTIALS), 401
    # if it's valid, return a json object with their auth token
    else:
        return jsonify(token=res)


class EntityResource(Resource):

    def __init__(self, *args, **kwargs):
        self.entity_type = kwargs.get('entity_type')
        self.schema = kwargs.get('schema')
        super(EntityResource, self).__init__(*args, **kwargs)

    def get(self, id):
        if not id:
            return jsonify(message=strings.ENTITY_NO_ID), 400
        try:
            e = self.resource_type.objects.get(id)
        except db.MultipleResultsFound:
            return jsonify(message=strings.ENTITY_MULTIPLE_RESULTS), 500
        return jsonify(e.to_json())

    def post(self):
        req_json = request.get_json(force=True)
        err = schemas.validate(req_json, self.schema)
        if err:
            return jsonify(message=err), 400
        db.create_entity_from_dict(self.entity_type, req_json)

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


class NeuronResource(Resource):

    pass


# add RESTful resources
api.add_resource(NeuronResource, '/neuron/<string:id>')

if __name__ == '__main__':
    app.run("0.0.0.0", 9000)
