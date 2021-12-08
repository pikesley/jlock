import json
from unittest import TestCase

import redis

from webserver.controller import app
from webserver.redis_manager import RedisManager

headers = {"Accept": "application/json", "Content-type": "application/json"}
redis = redis.StrictRedis(encoding="utf-8", decode_responses=True)


class TestController(TestCase):
    """Test the webserver."""

    def setUp(self):
        """Do some initialisation."""
        app.env = "test"
        app.redis_manager = RedisManager(namespace="test", flush=True)
        app.redis_manager.redis.set("test:style:current", "phony-style")
        app.redis_manager.redis.set("test:language:current", "pl")
        app.redis_manager.redis.set(
            "test:style:valids", json.dumps(["phony-style", "some-style"])
        )
        app.redis_manager.redis.set(
            "test:language:valids", json.dumps({"pl": "Polish", "ru": "Russian"})
        )

    def tearDown(self):
        """Clean-up after ourselves."""
        redis.flushall()

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

    def test_set_style(self):
        """Test setting the `style`."""
        client = app.test_client()
        response = client.post(
            "/style", headers=headers, data=json.dumps({"value": "phony-style"})
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            json.loads(response.data), {"status": "OK", "style": "phony-style"}
        )
        # self.assertEqual(redis.get("test:style:current"), "phony-style")

    def test_set_bad_style(self):
        """Test it rejects an invalid `style`."""
        redis.set("test:style:current", "this-should-not-change")
        client = app.test_client()
        response = client.post(
            "/style", headers=headers, data=json.dumps({"value": "bad-style"})
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            json.loads(response.data),
            {"reason": "invalid style", "status": "not OK"},
        )
        self.assertEqual(redis.get("test:style:current"), "this-should-not-change")

    def test_get_style(self):
        """Test getting the `style`."""
        app.redis_manager.set("style", "some-style")
        client = app.test_client()
        response = client.get("/style", headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            json.loads(response.data), {"status": "OK", "style": "some-style"}
        )

    def test_set_language(self):
        """Test setting the `language`."""
        client = app.test_client()
        response = client.post(
            "/language", headers=headers, data=json.dumps({"value": "pl"})
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.data), {"language": "pl", "status": "OK"})
        self.assertEqual(redis.get("test:language:current"), "pl")

    def test_set_bad_language(self):
        """Test it rejects an invalid `language`."""
        redis.set("test:language:current", "this-should-not-change")
        client = app.test_client()
        response = client.post(
            "/language", headers=headers, data=json.dumps({"value": "uk"})
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            json.loads(response.data),
            {"reason": "invalid language", "status": "not OK"},
        )
        self.assertEqual(redis.get("test:language:current"), "this-should-not-change")

    def test_get_language(self):
        """Test getting the `language`."""
        app.redis_manager.set("language", "ru")
        client = app.test_client()
        response = client.get("/language", headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.data), {"language": "ru", "status": "OK"})

    def test_bad_get(self):
        """Test attempting to get a nonsense route."""
        client = app.test_client()
        response = client.get("/bananas", headers=headers)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(
            json.loads(response.data),
            {"status": "not OK", "reason": "that's not a thing I know about"},
        )

    def test_bad_set(self):
        """Test attempting to set a nonsense route."""
        client = app.test_client()
        response = client.post(
            "/bananas", headers=headers, data=json.dumps({"value": "chips"})
        )
        self.assertEqual(response.status_code, 404)
        self.assertEqual(
            json.loads(response.data),
            {"status": "not OK", "reason": "that's not a thing I know about"},
        )
