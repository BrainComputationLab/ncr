from __future__ import unicode_literals, absolute_import
import json
import mock

import ncr
from ncr.util import strings
from ncr.tests.views import ApiTestCase


class TestAuthenticate(ApiTestCase):

    def setUp(self):
        super(TestAuthenticate, self).setUp()
        self.route = ncr.AUTHENTICATION_ROUTE

    @mock.patch('ncr.services.auth.AuthService.attempt_login')
    def test_client_login_with_valid_credentials_succeeds(self, mock_method):
        mock_method.return_value = "token"
        req = {
            "username": "username",
            "password": "password"
        }
        res = self.app.post(
            self.route,
            data=json.dumps(req),
            headers=self.headers,
        )
        assert res.status_code == 200
        json_data = json.loads(res.get_data().decode())
        mock_method.assert_called_with("username", "password")
        assert json_data.get('token') == "token"

    def test_client_login_with_no_password_fails(self):
        req = {
            "username": "test"
        }
        res = self.app.post(
            self.route,
            data=json.dumps(req),
            headers=self.headers,
        )
        assert res.status_code == 400
        json_data = json.loads(res.get_data().decode())
        assert 'message' in json_data

    def test_client_login_with_no_username_fails(self):
        req = {
            "password": "password"
        }
        res = self.app.post(
            self.route,
            data=json.dumps(req),
            headers=self.headers,
        )
        assert res.status_code == 400
        json_data = json.loads(res.get_data().decode())
        assert 'message' in json_data

    @mock.patch('ncr.services.auth.AuthService.attempt_login',
                return_value=None)
    def test_client_login_with_invalid_username_fails(self,
                                                      mock_attempt_login):
        req = {
            "username": "not_a_username",
            "password": "password"
        }
        res = self.app.post(
            self.route,
            data=json.dumps(req),
            headers=self.headers,
        )
        assert res.status_code == 401
        json_data = json.loads(res.get_data().decode())
        mock_attempt_login.assert_called_with("not_a_username", "password")
        assert json_data.get('message') == strings.API_BAD_CREDENTIALS

    @mock.patch('ncr.services.auth.AuthService.attempt_login',
                return_value=None)
    def test_client_login_with_invalid_password_fails(self,
                                                      mock_attempt_login):
        req = {
            "username": "username",
            "password": "not_a_password"
        }
        res = self.app.post(
            self.route,
            data=json.dumps(req),
            headers=self.headers,
        )
        assert res.status_code == 401
        json_data = json.loads(res.get_data().decode())
        mock_attempt_login.assert_called_with("username", "not_a_password")
        assert json_data.get('message') == strings.API_BAD_CREDENTIALS
