from __future__ import unicode_literals, absolute_import

from flask import Flask, request, jsonify
from flask.ext.restful import Api

from ncr.services.auth import AuthService
from ncr.util import strings
from ncr.views.auth import AuthenticationResource
from ncr.views.user import UserResource

AUTHENTICATION_ROUTE = '/authenticate'
TOKEN_HEADER_KEY = 'Auth-Token'

# Create new application
app = Flask(__name__)
# Set application root
app.config['APPLICATION_ROOT'] = '/ncr/api'
# Debugging is on for now
app.debug = True
# Create the REST API
api = Api(app)


@app.before_request
def before_request():
    """Before the request we're doing some authentication.

    """
    # if the client is sending data to the server, verify it is valid json
    if request.method in ['POST', 'PUT']:
        # check for the json content-type
        content_type = request.headers.get('Content-Type')
        if not content_type or content_type != 'application/json':
            return jsonify(message=strings.API_NOT_JSON_TYPE), 400
        req_json = request.get_json(silent=True)
        if not req_json:
            return jsonify(message=strings.API_INVALID_JSON), 400
    # if the client is trying to log in, don't enforce a token
    if request.path == AUTHENTICATION_ROUTE:
        return
    # possibly get the token from the request headers
    token = request.headers.get(TOKEN_HEADER_KEY)
    # if they didn't supply a request token
    if token is None:
        return jsonify(message=strings.API_MISSING_TOKEN), 401
    # validate the token
    valid = AuthService.verify_token(token)
    if not valid:
        return jsonify(message=strings.API_BAD_TOKEN), 401

# Add Resources
api.add_resource(AuthenticationResource, AUTHENTICATION_ROUTE)
api.add_resource(UserResource, '/user/<string:username>')
# api.add_resource(NeuronResource, '/<string:repository>/neuron/<string:id>')
