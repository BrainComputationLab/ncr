from __future__ import unicode_literals
import bcrypt
import os


class Crypt(object):

    @classmethod
    def gen_salt():
        return bcrypt.gensalt()

    @classmethod
    def hash_pw(plaintext, salt):
        return bcrypt.hashpw(plaintext, salt)

    @classmethod
    def gen_token(username, datetime):
        return bcrypt.hashpw(str(os.urandom()) + str(datetime), username)
