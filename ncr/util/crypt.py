from __future__ import unicode_literals, absolute_import
import bcrypt
import os


def gen_salt():
    return bcrypt.gensalt()


def hash_password(plaintext, salt):
    import pdb; pdb.set_trace()
    return bcrypt.hashpw(plaintext.encode('utf-8'), salt.encode('utf-8'))


def gen_token(username, datetime):
    random_string = str(os.urandom()) + str(datetime)
    return bcrypt.hashpw(
        random_string.encode('utf-8'),
        username.encode('utf-8')
    )
