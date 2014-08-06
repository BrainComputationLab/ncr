from __future__ import unicode_literals, absolute_import

from ncr.service import mongo_session
from ncr.models import UserSession
from ncr.models import Session as UserSession
from ncr.lib.crypt import hash_password, gen_token

class AuthService(object):

    def attempt_login(self, username, password):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return None
        hashed_pass = hash_password(password, user.salt)
        if hashed_pass != user.password:
            return None
        user_session = mongo_session.objects(username=user.username)
        if user_session:
            return session.token
        token = gen_token()
        self.set_user_session(username, token)
        return token

    def verify_token(self, token):
        session = Session.objects(token=token)
        return True if session else False

    def set_user_session(self, username, token):
        user_session = UserSession(username=user.username, token=token)
        session.save()
