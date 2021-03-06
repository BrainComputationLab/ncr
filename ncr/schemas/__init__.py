from __future__ import unicode_literals, absolute_import
import jsonschema
import jsonschema.exceptions


def validate(json, schema):
    try:
        jsonschema.validate(json, schema)
    except jsonschema.exceptions.ValidationError as err:
        return err.message
    return None
