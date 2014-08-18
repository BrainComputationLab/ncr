from __future__ import absolute_import, unicode_literals
import unittest

import pytest

from ncr.viewmappers import ViewMapper
from ncr.models import User


class TestViewMapperToJson(unittest.TestCase):

    def test_raises_not_implemented_error_on_invocation(self):
        user = User(
            username='username',
            password='password',
            salt='salt'
        )
        with pytest.raises(NotImplementedError):
            ViewMapper.to_json_from_model(user)


class TestViewMapperToModel(unittest.TestCase):

    def test_raises_not_implemented_error_on_invocation(self):
        json = {}
        with pytest.raises(NotImplementedError):
            ViewMapper.to_model_from_json(json)
