from __future__ import unicode_literals, absolute_import

from ncr.models import User


class UserService(object):

    @classmethod
    def get_user(cls, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None
