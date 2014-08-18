from __future__ import unicode_literals, absolute_import

from ncr.services.user import UserService
from ncr.services.session import SessionService
from ncr.util.crypt import hash_password, gen_token


class AuthService(object):

    @classmethod
    def attempt_login(cls, username, password):
        user = UserService.get_user(username)
        if not user:
            return None
        hashed_pass = hash_password(password, user.salt)
        if hashed_pass != user.password:
            return None
        session = SessionService.get_session_by_user(user)
        if session:
            return session.token
        token = gen_token()
        SessionService.create_session(user, token)
        return token

    @classmethod
    def verify_token(cls, token):
        session = SessionService.get_session_by_token(token)
        return True if session else False
