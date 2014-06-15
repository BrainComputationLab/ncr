import unittest
from ensure import ensure
import ncr.server


class ApiTestCase(unittest.TestCase):

    def setUp(self):
        pass

    def test_stuff(self):
        ensure(1).equals(1)
        x = ncr.server.app
