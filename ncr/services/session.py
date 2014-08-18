from __future__ import unicode_literals, absolute_import
import logging

from ncr.models import Session

logger = logging.getLogger(__name__)


class SessionService(object):

    @classmethod
    def get_session_by_user(cls, user):
        try:
            return Session.objects.get(user=user)
        except Session.DoesNotExist:
            logger.info(
                "Cannot retrieve session with username %s: "
                "session doesn't exist.",
                user.username
            )
            return None

    @classmethod
    def get_session_by_token(cls, token):
        try:
            return Session.objects.get(token=token)
        except Session.DoesNotExist:
            logger.info(
                "Cannot retrieve session with token %s: "
                "session doesn't exist.",
                token
            )
            return None

    @classmethod
    def create_session(cls, user, token):
        Session(user=user, token=token).save()
        return True

    @classmethod
    def delete_session_by_user(cls, user):
        try:
            Session.objects.get(user=user).delete()
            return True
        except Session.DoesNotExist:
            logger.warning(
                "Cannot delete session with username %s: "
                "session doesn't exist.",
                user.username,
            )
            return False

    @classmethod
    def delete_session_by_token(cls, token):
        try:
            Session.objects.get(token=token).delete()
            return True
        except Session.DoesNotExist:
            logger.warning(
                "Cannot delete session with token %s: "
                "session doesn't exist.",
                token
            )
            return False
