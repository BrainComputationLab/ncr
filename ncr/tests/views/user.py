from __future__ import absolute_import, unicode_literals
import json

import mock

import ncr
from ncr.tests.views import ApiTestCase
from ncr.models import User


class TestUserResourceGet(ApiTestCase):

    def setUp(self):
        super(TestUserResourceGet, self).setUp()
        self.headers.append((ncr.TOKEN_HEADER_KEY, 'token'))
        self.route = '/user/%s'
        self.verify_token_patch = mock.patch(
            'ncr.AuthService.verify_token',
            return_value=True
        )
        self.mock_verify_token = self.verify_token_patch.start()

    def tearDown(self):
        self.verify_token_patch.stop()

    @mock.patch('ncr.views.user.UserService.get_user')
    def test_gets_user_that_exists(self, mock_get_user):
        mock_get_user.return_value = User(
            username='username',
            password='password',
            salt='salt',
        )
        res = self.app.get(
            self.route % 'username',
            headers=self.headers,
        )
        assert res.status_code == 200
        assert mock_get_user.called_with('username')
        json_data = json.loads(res.get_data().decode())
        assert json_data.get('username') == 'username'
