from __future__ import absolute_import, unicode_literals
import unittest

from ncr.viewmappers.user import UserViewMapper
from ncr.models import User


class TestToJsonFromModel(unittest.TestCase):

    def test_correct_json_output(self):
        user = User(
            username='username',
            password='password',
            salt='salt',
            first_name='first',
            last_name='last',
            institution='university',
            email='test@example.com',
            is_admin=False,
        )
        js = UserViewMapper.to_json_from_model(user)
        assert js['username'] == 'username'
        assert js['first_name'] == 'first'
        assert js['last_name'] == 'last'
        assert js['institution'] == 'university'
        assert js['email'] == 'test@example.com'
        assert js['is_admin'] is False
        assert 'password' not in js
        assert 'salt' not in js

    def test_non_required_output(self):
        user = User(
            username='username',
            password='password',
            salt='salt',
            is_admin=False,
        )
        js = UserViewMapper.to_json_from_model(user)
        assert js['username'] == 'username'
        assert js['first_name'] is None
        assert js['last_name'] is None
        assert js['institution'] is None
        assert js['email'] is None
        assert js['is_admin'] is False
        assert 'password' not in js
        assert 'salt' not in js


class TestToModelFromJson(unittest.TestCase):

    def test_correct_model_output(self):
        js = {
            'username': 'username',
            'password': 'password',
            'first_name': 'first',
            'last_name': 'last',
            'institution': 'university',
            'email': 'test@example.com',
            'is_admin': False,
        }
        model = UserViewMapper.to_model_from_json(js)
        assert model.username == 'username'
        assert model.password == 'password'
        assert model.first_name == 'first'
        assert model.last_name == 'last'
        assert model.institution == 'university'
        assert model.email == 'test@example.com'
        assert model.is_admin is False

    def test_non_required_output(self):
        js = {
            'username': 'username',
            'password': 'password',
        }
        model = UserViewMapper.to_model_from_json(js)
        assert model.username == 'username'
        assert model.password == 'password'
        assert model.is_admin is False
