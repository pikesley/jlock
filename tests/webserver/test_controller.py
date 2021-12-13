from pathlib import Path
from unittest import TestCase

import redis

from webserver.controller import app
from webserver.redis_manager import RedisManager

headers = {"Accept": "application/json", "Content-type": "application/json"}
redis = redis.StrictRedis(encoding="utf-8", decode_responses=True)


class TestWebserver(TestCase):
    """Test the webserver."""

    def setUp(self):
        """Do some initialisation."""
        app.env = "test"
        app.redis_manager = RedisManager(
            namespace="test",
            root_dir=Path(Path(__file__).resolve().parent, "fixtures"),
        )

    def test_root(self):
        """Test '/'."""
        client = app.test_client()
        response = client.get("/", headers=headers)
        self.assertEqual(response.get_json(), {"status": "OK"})

    def test_root_html(self):
        """Test '/'."""
        client = app.test_client()
        response = client.get("/", headers={"Accept": "text/html"})
        self.assertEqual(response.data.decode().split("\n")[0], "<!DOCTYPE html>")
