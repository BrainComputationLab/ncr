from __future__ import absolute_import, unicode_literals
import unittest

from mongoengine import connect

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
        self.mongo_session.drop_database(config.mongo_test_database)
