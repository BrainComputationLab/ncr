from __future__ import unicode_literals, absolute_import
import unittest
import mock
from ensure import ensure
import json
import ncr.server
import ncr.strings as strings
import ncr.db


class ApiTestCase(unittest.TestCase):

    def setUp(self):
        self.app = ncr.server.app.test_client()


class TestLogin(ApiTestCase):

    def test_client_login_no_data(self):
        res = self.app.post('/login')
        ensure(res).has_attribute('status_code')
        ensure(res.status_code).equals(400)
        json_data = json.loads(res.get_data().decode())
        ensure(json_data).has_key('message').whose_value.equals(
            strings.API_INVALID_JSON)

    def test_client_login_bad_json(self):
        res = self.app.post('/login', data="{gfds}")
        ensure(res).has_attribute('status_code')
        ensure(res.status_code).equals(400)
        json_data = json.loads(res.get_data().decode())
        ensure(json_data).has_key('message').whose_value.equals(
            strings.API_INVALID_JSON)

    def test_client_login_no_password(self):
        req = {
            "username": "test"
        }
        res = self.app.post('/login', data=json.dumps(req))
        ensure(res).has_attribute('status_code')
        ensure(res.status_code).equals(400)
        json_data = json.loads(res.get_data().decode())
        ensure(json_data).has_key('message')

    def test_client_login_no_username(self):
        req = {
            "password": "password"
        }
        res = self.app.post('/login', data=json.dumps(req))
        ensure(res).has_attribute('status_code')
        ensure(res.status_code).equals(400)
        json_data = json.loads(res.get_data().decode())
        ensure(json_data).has_key('message')

    @mock.patch.object(ncr.db.Service, attribute='attempt_login')
    def test_client_invalid_username(self, mock_method):
        mock_method.return_value = None
        req = {
            "username": "not_a_username",
            "password": "password"
        }
        res = self.app.post('/login', data=json.dumps(req))
        ensure(res).has_attribute('status_code')
        ensure(res.status_code).equals(401)
        json_data = json.loads(res.get_data().decode())
        mock_method.assert_called_with("not_a_username", "password")
        ensure(json_data).has_key('message').whose_value.equals(
            strings.API_BAD_CREDENTIALS
        )

    @mock.patch.object(ncr.db.Service, attribute='attempt_login')
    def test_client_invalid_password(self, mock_method):
        mock_method.return_value = None
        req = {
            "username": "username",
            "password": "not_a_password"
        }
        res = self.app.post('/login', data=json.dumps(req))
        ensure(res).has_attribute('status_code')
        ensure(res.status_code).equals(401)
        json_data = json.loads(res.get_data().decode())
        mock_method.assert_called_with("username", "not_a_password")
        ensure(json_data).has_key('message').whose_value.equals(
            strings.API_BAD_CREDENTIALS
        )

    @mock.patch.object(ncr.db.Service, attribute='attempt_login')
    def test_client_valid_credentials(self, mock_method):
        mock_method.return_value = "token"
        req = {
            "username": "username",
            "password": "password"
        }
        res = self.app.post('/login', data=json.dumps(req))
        ensure(res).has_attribute('status_code')
        ensure(res.status_code).equals(200)
        json_data = json.loads(res.get_data().decode())
        mock_method.assert_called_with("username", "password")
        ensure(json_data).has_key('token').whose_value.equals(
            "token"
        )
