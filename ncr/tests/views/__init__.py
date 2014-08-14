from __future__ import unicode_literals, absolute_import

import unittest

import ncr


class ApiTestCase(unittest.TestCase):

    def setUp(self):
        self.app = ncr.app.test_client()
        self.headers = [
            ('Content-Type', 'application/json')
        ]
