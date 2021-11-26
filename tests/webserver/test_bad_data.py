import json
from unittest import TestCase

import redis

from webserver.controller import app

headers = {"Accept": "application/json", "Content-type": "application/json"}
redis = redis.Redis()


class TestBadDataInRedis(TestCase):
    """Test it deals with crufty data."""

    def setUp(self):
        """Do some initialisation."""
        app.defaults = {"language": "pl", "style": "phony-style"}
        app.valids = {"style": ["phony-style"], "language": {"pl": "Polish"}}

        redis.flushall()
    def tearDown(self):
        """Clean-up after ourselves."""
        redis.flushall()
    def test_with_invalid_style(self):
        """Test it bypasses a bad style in redis."""
        redis.set("style", "something-bad")

        client = app.test_client()
        response = client.get("/style", headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            json.loads(response.data), {"status": "OK", "style": "phony-style"}
        )
