from __future__ import absolute_import, unicode_literals
import csv

from flask import request, jsonify
from flask.ext.restful import Resource

from ncr.schemas import validate
from ncr.util import strings, exceptions


class EntityResource(Resource):

    def __init__(self, *args, **kwargs):
        self.entity_type = kwargs.get('entity_type')
        self.schema = kwargs.get('schema')
        super(EntityResource, self).__init__()

    def get(self, repository, id):
        # is the id specified
        if not id:
            return jsonify(message=strings.ENTITY_NO_ID), 400
        # try and get the object from the database
        try:
            e = self.entity_type.objects.get(id=id)
        # if we git more than one, something is horribly wrong
        except self.entity_type.MultipleObjectsReturned:
            return jsonify(message=strings.ENTITY_MULTIPLE_RESULTS), 500
        # if it doesn't exist, inform the user
        except self.entity_type.DoesNotExist:
            return jsonify(message=strings.ENTITY_NOT_FOUND), 404
        # return the object
        return jsonify(e.to_json()), 200

    def post(self, repository):
        # get the json from the request, it's already validated
        req_json = request.get_json(force=True)
        # validate the request data given a schema for the entity
        err = validate(req_json, self.schema)
        # if it could not be validated, return why
        if err:
            return jsonify(message=err), 400
        # try to get the tags from the request query string
        try:
            tags = self.get_tags(request)
        except exceptions.InvalidTagsException:
            return jsonify(message=strings.ENTITY_INVALID_TAGS), 401
        # if everything went smootly, create the new entity
        self.entity_type.create_entity_from_dict(req_json, tags)
        # indicate success
        return jsonify(message=strings.API_SUCCESS), 200

    def put(self, repository, id):
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
        # try to get the tags from the request query string
        try:
            tags = self.get_tags(request)
        except exceptions.InvalidTagsException:
            return jsonify(message=strings.ENTITY_INVALID_TAGS), 401
        # if everything went smootly, update the entity
        self.entity_type.update_entity_from_dict(req_json, tags)
        # indicate success
        return jsonify(message=strings.API_SUCCESS), 200

    def delete(self, repository, id):
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

    def get_tags(request):
        """ get the permission tags list from the request query string """
        tags = request.args.get('tags')
        if tags is None:
            return []
        tag_list = list(csv.reader(tags))
        return tag_list
