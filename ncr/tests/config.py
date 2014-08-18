from __future__ import unicode_literals, absolute_import
import unittest

import ncr.config


class TestConfig(unittest.TestCase):
    """Tests the NCR configuration file.

    """
    def test_config_values_are_set(self):
        attributes = dir(ncr.config)
        assert 'mongo_database' in attributes
        assert 'mongo_test_database' in attributes
        assert 'mongo_host' in attributes
        assert 'mongo_port' in attributes
        assert 'mongo_username' in attributes
        assert 'mongo_password' in attributes
