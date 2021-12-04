from pathlib import Path
from unittest import TestCase

from redis import StrictRedis
import redis

from webserver.redis_primer import RedisPrimer

FIXTURE_ROOT = Path(Path(__file__).resolve().parent, "fixtures")


class TestRedisPrimer(TestCase):
    """Test the RedisPrimer."""

    def test_constructor(self):
        """Test it initialises correctly."""
        redis = StrictRedis(encoding="utf-8", decode_responses=True)
        r_p = RedisPrimer(redis, namespace="test")
        self.assertEqual(r_p.namespace, "test")

    def test_clean_namespace(self):
        """Test it safely cleans a namespace."""
        redis = get_redis()
        redis.set("foo:thing", 1)
        redis.set("foo:other", 2)
        redis.set("bar:whatever", 3)

        RedisPrimer.purge_namespace(redis, "foo")
        self.assertEqual(redis.keys(), ["bar:whatever"])

    def test_populate_from_scratch(self):
        """Test it populates correctly from a clean start."""
        redis = get_redis()

        r_p = RedisPrimer(
            redis, namespace="test", static_root=Path(FIXTURE_ROOT, "static")
        )
        r_p.populate()

        self.assertEqual(redis.get("test:style:current"), "banana")
        self.assertEqual(
            redis.lrange("test:language:valids", 0, -1), ["eu", "pl", "uk"]
        )

    def test_populate_with_existing_data(self):
        """Test it populates but respects existing data."""
        redis = get_redis()
        redis.set("test:language:current", "uk")

        r_p = RedisPrimer(
            redis, namespace="test", static_root=Path(FIXTURE_ROOT, "static")
        )
        r_p.populate()

        self.assertEqual(redis.get("test:language:current"), "uk")


def get_redis():
    """Get a clean Redis."""
    redis = StrictRedis(encoding="utf-8", decode_responses=True)
    redis.flushall()

    return redis
