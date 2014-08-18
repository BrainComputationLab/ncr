from __future__ import unicode_literals, absolute_import
import unittest
import json
import mock

from ncr.util import strings
import ncr


class ApiTestCase(unittest.TestCase):

    def setUp(self):
        self.app = ncr.app.test_client()
        self.headers = [
            ('Content-Type', 'application/json')
        ]


class TestBeforeRequest(ApiTestCase):

    def setUp(self):
        super(TestBeforeRequest, self).setUp()
        self.route = '/fake_route'

    def test_request_with_no_json_header_fails(self):
        res = self.app.post(
            self.route,
        )
        assert res.status_code == 400
        json_data = json.loads(res.get_data().decode())
        assert json_data.get('message') == strings.API_NOT_JSON_TYPE

    def test_post_request_with_no_data_fails(self):
        res = self.app.post(
            self.route,
            headers=self.headers,
        )
        assert res.status_code == 400
        json_data = json.loads(res.get_data().decode())
        assert json_data.get('message') == strings.API_INVALID_JSON

    def test_post_request_with_bad_json_fails(self):
        res = self.app.post(
            self.route,
            data="{gfds}",
            headers=self.headers,
        )
        assert res.status_code == 400
        json_data = json.loads(res.get_data().decode())
        assert json_data.get('message') == strings.API_INVALID_JSON

    def test_request_with_no_token_fails(self):
        res = self.app.get(
            self.route,
            headers=self.headers,
        )
        assert res.status_code == 401
        json_data = json.loads(res.get_data().decode())
        assert json_data.get('message') == strings.API_MISSING_TOKEN

    def test_request_with_bad_token_fails(self):
        self.headers.append((ncr.TOKEN_HEADER_KEY, 'a_bad_token'))
        res = self.app.get(
            self.route,
            headers=self.headers,
        )
        assert res.status_code == 401
        json_data = json.loads(res.get_data().decode())
        assert json_data.get('message') == strings.API_BAD_TOKEN

