from __future__ import absolute_import, unicode_literals
import unittest

from mongoengine import connect
from mongoengine.connection import _get_db

from ncr import config


class DatabaseTestCase(unittest.TestCase):

    def setUp(self):
        self.mongo_session = connect(
            config.mongo_test_database,
            host=config.mongo_host,
            port=config.mongo_port,
            username=config.mongo_username,
            password=config.mongo_password,
        )

    def tearDown(self):
        db = _get_db()
        collections = db.collection_names(include_system_collections=False)
        for collection in collections:
            db[collection].drop()
