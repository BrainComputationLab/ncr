from __future__ import unicode_literals, absolute_import

import pytest
from mongoengine import ValidationError

from ncr.tests.services import DatabaseTestCase
from ncr.services.session import SessionService
from ncr.models import Session, User


class TestGetSessionByUsername(DatabaseTestCase):
    """Test for the get_session_by_username function.

    """
    def test_returns_session_when_session_exists(self):
        user = User(
            username='username',
            password='password',
            salt='salt',
        ).save()
        Session(
            user=user,
            token='token',
        ).save()
        session = SessionService.get_session_by_user(user)
        assert session is not None
        assert session.user.username == 'username'
        assert session.token == 'token'

    def test_returns_none_when_session_does_not_exist(self):
        user = User(
            username='username',
            password='password',
            salt='salt',
        ).save()
        session = SessionService.get_session_by_user(user)
        assert session is None


class TestGetSessionByToken(DatabaseTestCase):
    """Test for the get_session_by_token function.

    """
    def test_returns_session_when_session_exists(self):
        user = User(
            username='username',
            password='password',
            salt='salt',
        ).save()
        Session(
            user=user,
            token='token',
        ).save()
        session = SessionService.get_session_by_token('token')
        assert session is not None
        assert session.user.username == 'username'
        assert session.token == 'token'

    def test_returns_none_when_session_does_not_exist(self):
        User(
            username='username',
            password='password',
            salt='salt',
        ).save()
        session = SessionService.get_session_by_token('token')
        assert session is None


class TestCreateSession(DatabaseTestCase):
    """Test for the create_session function.

    """
    def test_creates_session(self):
        user = User(
            username='username',
            password='password',
            salt='salt',
        ).save()
        result = SessionService.create_session(user, 'token')
        session = Session.objects.get(user=user)
        assert result is True
        assert session.user.username == 'username'
        assert session.token == 'token'

    def test_fails_with_bad_token(self):
        user = User(
            username='username',
            password='password',
            salt='salt',
        ).save()
        with pytest.raises(ValidationError):
            SessionService.create_session(user, 1234)


class TestDeleteSessionByUser(DatabaseTestCase):
    """Test for the delete_session_by_user function.

    """
    def test_deletes_session_when_session_exists(self):
        user = User(
            username='username',
            password='password',
            salt='salt',
        ).save()
        Session(
            user=user,
            token='token',
        ).save()
        session = Session.objects.get(user=user)
        assert session is not None
        result = SessionService.delete_session_by_user(user)
        assert result is True
        with pytest.raises(Session.DoesNotExist):
            Session.objects.get(user=user)

    def test_fails_silently_when_session_does_not_exist(self):
        user = User(
            username='username',
            password='password',
            salt='salt',
        ).save()
        result = SessionService.delete_session_by_user(user)
        assert result is False
        with pytest.raises(Session.DoesNotExist):
            Session.objects.get(user=user)


class TestDeleteSessionByToken(DatabaseTestCase):
    """Test for the delete_session_by_token function.

    """
    def test_deletes_session_when_session_exists(self):
        user = User(
            username='username',
            password='password',
            salt='salt',
        ).save()
        Session(
            user=user,
            token='token',
        ).save()
        session = Session.objects.get(token='token')
        assert session is not None
        result = SessionService.delete_session_by_token('token')
        assert result is True
        with pytest.raises(Session.DoesNotExist):
            Session.objects.get(token='token')

    def test_fails_silently_when_session_does_not_exist(self):
        result = SessionService.delete_session_by_token('token')
        assert result is False
        with pytest.raises(Session.DoesNotExist):
            Session.objects.get(token='token')
