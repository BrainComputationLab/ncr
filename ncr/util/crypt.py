from __future__ import unicode_literals, absolute_import
import bcrypt
import os

@classmethod
def gen_salt():
    return bcrypt.gensalt()

@classmethod
def hash_password(plaintext, salt):
    return bcrypt.hashpw(plaintext, salt)

@classmethod
def gen_token(username, datetime):
    return bcrypt.hashpw(str(os.urandom()) + str(datetime), username)
