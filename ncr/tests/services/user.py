from __future__ import absolute_import, unicode_literals
import pytest

from mongoengine import ValidationError

from ncr.tests.services import DatabaseTestCase
from ncr.services.user import UserService
from ncr.models import User


class TestCreateUser(DatabaseTestCase):

    def test_create_valid_user(self):
        user = UserService.create_user(
            username='username',
            password='password',
            first_name='first',
            last_name='last',
            institution='university',
            email='test@example.com',
        )
        assert user is not None
        db_user = User.objects.get(username='username')
        assert db_user.username == 'username'
        assert db_user.first_name == 'first'
        assert db_user.last_name == 'last'
        assert db_user.institution == 'university'
        assert db_user.email == 'test@example.com'

    def test_create_user_bad_first_name(self):
        with pytest.raises(ValidationError):
            UserService.create_user(
                username='username',
                password='password',
                first_name=123,
                last_name='last',
                institution='university',
                email='test@example.com',
            )

    def test_create_user_bad_email(self):
        with pytest.raises(ValidationError):
            UserService.create_user(
                username='username',
                password='password',
                first_name=123,
                last_name='last',
                institution='university',
                email='not_an_email',
            )


class TestGetUser(DatabaseTestCase):

    def test_gets_user_when_user_exists(self):
        User(
            username='username',
            first_name='first',
            last_name='last',
            salt="$2a$12$DG39IJLyK/8DQ18Zz/GclO",
            password=
                "$2a$12$DG39IJLyK/8DQ18Zz/GclOARDSrOQSZNQ8VRNPYGWiSAsjX380KHK",
            institution='university',
            email='test@example.com',
        ).save()
        user = UserService.get_user('username')
        assert user is not None

    def test_returns_none_when_user_does_not_exist(self):
        User(
            username='username',
            first_name='first',
            last_name='last',
            salt="$2a$12$DG39IJLyK/8DQ18Zz/GclO",
            password=
                "$2a$12$DG39IJLyK/8DQ18Zz/GclOARDSrOQSZNQ8VRNPYGWiSAsjX380KHK",
            institution='university',
            email='test@example.com',
        ).save()
        user = UserService.get_user('not_a_username')
        assert user is None
