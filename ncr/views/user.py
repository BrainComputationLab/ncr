from __future__ import absolute_import, unicode_literals

from flask import request, jsonify
from flask.ext.restful import Resource

from ncr.util import strings
# from ncr.schemas.user import user_schema
from ncr.viewmappers.user import UserViewMapper
from ncr.models import User
from ncr.schemas import validate
from ncr.services.user import UserService


class UserResource(Resource):

    def get(self, username):
        if not username:
            return jsonify(message=strings.USER_NO_USERNAME), 400
        # try and get the object from the database
        try:
            user = UserService.get_user(username)
        # if we get more than one, something is horribly wrong
        except User.MultipleObjectsReturned:
            res = jsonify(message=strings.ENTITY_MULTIPLE_RESULTS)
            res.status_code = 500
        # if it doesn't exist, inform the user
        except User.DoesNotExist:
            res = jsonify(message=strings.ENTITY_NOT_FOUND)
            res.status_code = 404
            return res
        # return the object
        json = UserViewMapper.to_json_from_model(user)
        res = jsonify(json)
        res.status_code = 200
        return res

    def post(self, username):
        # get the json from the request, it's already validated
        req_json = request.get_json(force=True)
        # validate the request data given a schema for the entity
        err = validate(req_json, self.schema)
        # if it could not be validated, return why
        if err:
            return jsonify(message=err), 400
        # if everything went smootly, create the new entity
        UserViewMapper.to_model_from_json(req_json)
        # indicate success
        return jsonify(message=strings.API_SUCCESS), 200

    def put(self, username):
        # get the json from the request, it's already validated
        req_json = request.get_json(force=True)
        # is the id specified
        if not id:
            return jsonify(message=strings.ENTITY_NO_ID), 400
        # try and get the object from the database
        try:
            self.resource_type.objects.get(id)
        # if we git more than one, something is horribly wrong
        except self.entity_type.MultipleObjectsReturned:
            return jsonify(message=strings.ENTITY_MULTIPLE_RESULTS), 500
        # if it doesn't exist, inform the user
        except self.entity_type.DoesNotExist:
            return jsonify(message=strings.ENTITY_NOT_FOUND), 404
        # if everything went smoothly, update the entity
        UserService.update_user(req_json)
        # indicate success
        return jsonify(message=strings.API_SUCCESS), 200

    def delete(self, username):
        # is the id specified
        if not id:
            return jsonify(message=strings.ENTITY_NO_ID), 400
        # try and get the object from the database
        try:
            e = self.resource_type.objects.get(id)
        # if we get more than one, something is horribly wrong
        except self.entity_type.MultipleObjectsReturned:
            return jsonify(message=strings.ENTITY_MULTIPLE_RESULTS), 500
        # if it doesn't exist, inform the user
        except self.entity_type.DoesNotExist:
            return jsonify(message=strings.ENTITY_NOT_FOUND), 404
        # delete the object
        e.delete()
        # indicate success
        return jsonify(message=strings.API_SUCCESS), 200
