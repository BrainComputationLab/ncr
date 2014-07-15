from __future__ import unicode_literals, absolute_import
import csv

from flask import Flask, request, jsonify
from flask.ext.restful import Api, Resource

import ncr.strings as strings
import ncr.exceptions as exceptions
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
    # if the client is sending data to the server, verify it is valid json
    if request.method in ['POST', 'PUT']:
        req_json = request.get_json(force=True, silent=True)
        if not req_json:
            return jsonify(message=strings.API_INVALID_JSON), 400
    # if the client is trying to log in, don't enforce a token
    if request.path == '/login':
        return
    # possibly get the token from the request headers
    token = request.headers.get('token')
    # if they didn't supply a request token
    if token is None:
        return strings.API_MISSING_TOKEN, 401
    # validate the token
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
        # is the id specified
        if not id:
            return jsonify(message=strings.ENTITY_NO_ID), 400
        # try and get the object from the database
        try:
            e = self.resource_type.objects.get(id)
        # if we git more than one, something is horribly wrong
        except self.entity_type.MultipleResultsFound:
            return jsonify(message=strings.ENTITY_MULTIPLE_RESULTS), 500
        # if it doesn't exist, inform the user
        except self.entity_type.DoesNotExist:
            return jsonify(message=strings.ENTITY_NOT_FOUND), 404
        # return the object
        return jsonify(e.to_json()), 200

    def post(self):
        # get the json from the request, it's already validated
        req_json = request.get_json(force=True)
        # validate the request data given a schema for the entity
        err = schemas.validate(req_json, self.schema)
        # if it could not be validated, return why
        if err:
            return jsonify(message=err), 400
        # try to get the tags from the request query string
        try:
            tags = self.get_tags(request)
        except exceptions.InvalidTagsException:
            return jsonify(message=strings.ENTITY_INVALID_TAGS), 401
        # if everything went smootly, create the new entity
        db.create_entity_from_dict(self.entity_type, req_json, tags)
        # indicate success
        return jsonify(message=strings.API_SUCCESS), 200

    def put(self, id):
        # get the json from the request, it's already validated
        req_json = request.get_json(force=True)
        # is the id specified
        if not id:
            return jsonify(message=strings.ENTITY_NO_ID), 400
        # try and get the object from the database
        try:
            self.resource_type.objects.get(id)
        # if we git more than one, something is horribly wrong
        except self.entity_type.MultipleResultsFound:
            return jsonify(message=strings.ENTITY_MULTIPLE_RESULTS), 500
        # if it doesn't exist, inform the user
        except self.entity_type.DoesNotExist:
            return jsonify(message=strings.ENTITY_NOT_FOUND), 404
        # try to get the tags from the request query string
        try:
            tags = self.get_tags(request)
        except exceptions.InvalidTagsException:
            return jsonify(message=strings.ENTITY_INVALID_TAGS), 401
        # if everything went smootly, update the entity
        db.update_entity_from_dict(self.entity_type, req_json, tags)
        # indicate success
        return jsonify(message=strings.API_SUCCESS), 200

    def delete(self, id):
        # is the id specified
        if not id:
            return jsonify(message=strings.ENTITY_NO_ID), 400
        # try and get the object from the database
        try:
            e = self.resource_type.objects.get(id)
        # if we git more than one, something is horribly wrong
        except self.entity_type.MultipleResultsFound:
            return jsonify(message=strings.ENTITY_MULTIPLE_RESULTS), 500
        # if it doesn't exist, inform the user
        except self.entity_type.DoesNotExist:
            return jsonify(message=strings.ENTITY_NOT_FOUND), 404
        # delete the object
        e.delete()
        # indicate success
        return jsonify(message=strings.API_SUCCESS), 200

    def get_tags(request):
        """ get the permission tags list from the request query string """
        tags = request.args.get('tags')
        if tags is None:
            return []
        tag_list = list(csv.reader(tags))
        return tag_list


class UserResource(EntityResource):

    pass

class NeuronResource(EntityResource):

    pass


# add RESTful resources
api.add_resource(UserResource, '/users/<string:username>')
api.add_resource(NeuronResource, '/neuron/<string:id>')

if __name__ == '__main__':
    app.run("0.0.0.0", 9000)
