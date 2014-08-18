from __future__ import absolute_import, unicode_literals

from flask import request, jsonify
from flask.ext.restful import Resource

from ncr.schemas.auth import auth_schema
from ncr.services.auth import AuthService
from ncr.schemas import validate
from ncr.util import strings


class AuthenticationResource(Resource):

    def post(self):
        """ Handles client requests to authenticate with the system """
        # validate the json request
        req_json = request.get_json(silent=True)
        err = validate(req_json, auth_schema)
        if err:
            res = jsonify(message=err)
            res.status_code = 400
            return res
        # get the username and password and attempt to login
        username = req_json.get('username')
        password = req_json.get('password')
        res = AuthService.attempt_login(username, password)
        # if theres no user matching those credentials
        if res is None:
            res = jsonify(message=strings.API_BAD_CREDENTIALS)
            res.status_code = 401
            return res
        # if it's valid, return a json object with their auth token
        else:
            return jsonify(token=res)
