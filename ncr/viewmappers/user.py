from __future__ import absolute_import, unicode_literals

from ncr.viewmappers import ViewMapper


class UserViewMapper(ViewMapper):

    @classmethod
    def to_json_from_model(cls, document):
        return {
            'username': document.username,
            'first_name': document.first_name,
            'last_name': document.last_name,
            'institution': document.institution,
            'email': document.email,
            'is_admin': document.is_admin,
        }

    @classmethod
    def to_model_from_json(cls, js):
        pass
