import json
from unittest import TestCase

import redis

from webserver.controller import app

headers = {"Accept": "application/json", "Content-type": "application/json"}
redis = redis.Redis()


class TestWithNoPayload(TestCase):
    """Test it handles no POST data."""

    def test_with_no_post_data(self):
        """Test it responds nicely to no POST data."""
        client = app.test_client()
        response = client.post("/style", headers=headers)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            json.loads(response.data), {"status": "not OK", "reason": "no data sent"}
        )
