from __future__ import absolute_import, unicode_literals


class ViewMapper(object):

    def to_json_from_model(cls, document):
        raise NotImplementedError

    def to_model_from_json(cls, js):
        raise NotImplementedError
