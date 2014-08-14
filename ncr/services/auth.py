from __future__ import unicode_literals, absolute_import

from ncr.services import mongo_session
from ncr.models import Session as UserSession, User
from ncr.util.crypt import hash_password, gen_token


class AuthService(object):

    @classmethod
    def attempt_login(cls, username, password):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return None
        hashed_pass = hash_password(password, user.salt)
        if hashed_pass != user.password:
            return None
        user_session = mongo_session.objects(username=user.username)
        if user_session:
            return user_session.token
        token = gen_token()
        cls.set_user_session(username, token)
        return token

    @classmethod
    def verify_token(cls, token):
        session = mongo_session.objects(token=token)
        return True if session else False

    @classmethod
    def set_user_session(cls, username, token):
        user_session = UserSession(username=username, token=token)
        user_session.save()
