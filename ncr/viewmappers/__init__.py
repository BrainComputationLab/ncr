from __future__ import absolute_import, unicode_literals


class ViewMapper(object):

    @classmethod
    def to_json_from_model(cls, document):
        raise NotImplementedError

    @classmethod
    def to_model_from_json(cls, js):
        raise NotImplementedError
