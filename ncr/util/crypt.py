from __future__ import unicode_literals, absolute_import
import bcrypt
import binascii
import os


def gen_salt():
    return bcrypt.gensalt()


def hash_password(plaintext, salt):
    return bcrypt.hashpw(plaintext.encode('utf-8'), salt.encode('utf-8'))


def gen_token():
    hashed_token = bcrypt.hashpw(
        os.urandom(8),
        bcrypt.gensalt()
    )
    return binascii.hexlify(hashed_token)[:64]
