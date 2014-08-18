from __future__ import unicode_literals, absolute_import

import unittest

import mock

from ncr.services.auth import AuthService
from ncr.models import User, Session


class TestAttemptLogin(unittest.TestCase):

    def setUp(self):
        self.hash_password_patch = mock.patch(
            'ncr.services.auth.hash_password', return_value='hashed_pass')
        self.gen_token_patch = mock.patch(
            'ncr.services.auth.gen_token', return_value='generated_token')
        self.get_user_patch = mock.patch(
            'ncr.services.auth.UserService.get_user',
            return_value=User(username='username', password='hashed_pass',
                              salt='salt'))
        self.get_session_by_user_patch = mock.patch(
            'ncr.services.auth.SessionService.get_session_by_user',
            return_value=None)
        self.create_session_patch = mock.patch(
            'ncr.services.auth.SessionService.create_session')
        self.mock_hash_password = self.hash_password_patch.start()
        self.mock_gen_token = self.gen_token_patch.start()
        self.mock_get_user = self.get_user_patch.start()
        self.mock_get_session_by_user = \
            self.get_session_by_user_patch.start()
        self.mock_create_session = self.create_session_patch.start()

    def tearDown(self):
        self.hash_password_patch.stop()
        self.gen_token_patch.stop()
        self.get_user_patch.stop()
        self.get_session_by_user_patch.stop()
        self.create_session_patch.stop()

    def test_good_login_with_session_succeeds(self):
        user = User(
            username='username',
            password='password',
            salt='salt',
        )
        self.mock_get_session_by_user.return_value = Session(
            user=user,
            token='token',
        )
        token = AuthService.attempt_login('username', 'password')
        assert token == 'token'
        assert self.mock_get_user.call_count == 1
        assert self.mock_hash_password.call_count == 1
        assert self.mock_get_session_by_user.call_count == 1
        assert self.mock_gen_token.call_count == 0
        assert self.mock_create_session.call_count == 0

    def test_good_login_without_session_succeeds(self):
        token = AuthService.attempt_login('username', 'password')
        assert token == 'generated_token'
        assert self.mock_get_user.call_count == 1
        assert self.mock_hash_password.call_count == 1
        assert self.mock_get_session_by_user.call_count == 1
        assert self.mock_gen_token.call_count == 1
        assert self.mock_create_session.call_count == 1

    def test_bad_username_fails(self):
        self.mock_get_user.return_value = None
        token = AuthService.attempt_login('not_a_username', 'password')
        assert token is None
        assert self.mock_get_user.call_count == 1
        assert self.mock_hash_password.call_count == 0
        assert self.mock_get_session_by_user.call_count == 0
        assert self.mock_gen_token.call_count == 0
        assert self.mock_create_session.call_count == 0

    def test_bad_password_with_session_fails(self):
        user = User(
            username='username',
            password='password',
            salt='salt',
        )
        self.mock_get_session_by_user.return_value = Session(
            user=user,
            token='token',
        )
        self.mock_hash_password.return_value = 'wrong_hashed_pass'
        token = AuthService.attempt_login('username', 'not_my_password')
        assert token is None
        assert self.mock_get_user.call_count == 1
        assert self.mock_hash_password.call_count == 1
        assert self.mock_get_session_by_user.call_count == 0
        assert self.mock_gen_token.call_count == 0
        assert self.mock_create_session.call_count == 0

    def test_bad_password_without_session_fails(self):
        self.mock_hash_password.return_value = 'wrong_hashed_pass'
        token = AuthService.attempt_login('username', 'not_my_password')
        assert token is None
        assert self.mock_get_user.call_count == 1
        assert self.mock_hash_password.call_count == 1
        assert self.mock_get_session_by_user.call_count == 0
        assert self.mock_gen_token.call_count == 0
        assert self.mock_create_session.call_count == 0


class TestVerifyToken(unittest.TestCase):

    @mock.patch('ncr.services.auth.SessionService.get_session_by_token',
                return_value=Session(username='username', token='token'))
    def test_return_true_if_valid_token(self, mock_get_session_by_token):
        is_valid = AuthService.verify_token('token')
        assert is_valid
        assert mock_get_session_by_token.call_count == 1

    @mock.patch('ncr.services.auth.SessionService.get_session_by_token',
                return_value=None)
    def test_return_false_if_not_valid_token(self, mock_get_session_by_token):
        is_valid = AuthService.verify_token('not_a_token')
        assert not is_valid
        assert mock_get_session_by_token.call_count == 1
