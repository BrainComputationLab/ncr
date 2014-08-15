from __future__ import unicode_literals, absolute_import

from ncr.models import Session


class SessionService(object):

    @classmethod
    def get_session_by_username(cls, username):
        try:
            return Session.objects.get(username=username)
        except Session.DoesNotExist:
            # TODO log something
            return None

    @classmethod
    def get_session_by_token(cls, token):
        try:
            return Session.objects.get(token=token)
        except Session.DoesNotExist:
            # TODO log something
            return None

    @classmethod
    def create_session(cls, username, token):
        Session(username=username, token=token).save()

    @classmethod
    def delete_session_by_username(cls, username):
        try:
            Session.objects.get(username=username).delete()
            return True
        except Session.DoesNotExist:
            # TODO log something
            return False

    @classmethod
    def delete_session_by_token(cls, token):
        try:
            Session.objects.get(token=token).delete()
            return True
        except Session.DoesNotExist:
            # TODO log something
            return False
