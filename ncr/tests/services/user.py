from __future__ import unicode_literals, absolute_import

import unittest

from ncr.util.crypt import gen_salt, hash_password, gen_token


class TestGenSalt(unittest.TestCase):

    def test_returns_salt(self):
        salt = gen_salt()
        assert type(salt) is str
        assert len(salt) == 29


class TestHashPassword(unittest.TestCase):

    def test_hashes_to_correct_value(self):
        salt = "$2a$12$DG39IJLyK/8DQ18Zz/GclO"
        password = 'password'
        hashed_pass = hash_password(password, salt)
        assert hashed_pass == \
            "$2a$12$DG39IJLyK/8DQ18Zz/GclOARDSrOQSZNQ8VRNPYGWiSAsjX380KHK"


class TestGenToken(unittest.TestCase):

    def test_returns_token(self):
        token = gen_token()
        assert type(token) is str
        assert len(token) == 64
