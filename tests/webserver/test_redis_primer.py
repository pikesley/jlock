from pathlib import Path
from unittest import TestCase

from redis import StrictRedis

from webserver.redis_primer import RedisPrimer

FIXTURE_ROOT = Path(Path(__file__).resolve().parent, "fixtures")


class TestRedisPrimer(TestCase):
    """Test the RedisPrimer."""

    def test_constructor(self):
        """Test it initialises correctly."""
        rds = StrictRedis(encoding="utf-8", decode_responses=True)
        r_p = RedisPrimer(rds, namespace="test")
        self.assertEqual(r_p.namespace, "test")

    def test_clean_namespace(self):
        """Test it safely cleans a namespace."""
        rds = get_rds()
        rds.set("foo:thing", 1)
        rds.set("foo:other", 2)
        rds.set("bar:whatever", 3)

        RedisPrimer.purge_namespace(rds, "foo")
        self.assertEqual(rds.keys(), ["bar:whatever"])

    def test_populate_from_scratch(self):
        """Test it populates correctly from a clean start."""
        rds = get_rds()

        r_p = RedisPrimer(
            rds, namespace="test", static_root=Path(FIXTURE_ROOT, "static")
        )
        r_p.populate()

    def test_populate_with_existing_data(self):
        """Test it populates but respects existing data."""
        rds = get_rds()
        rds.set("test:language:current", "uk")

        r_p = RedisPrimer(
            rds, namespace="test", static_root=Path(FIXTURE_ROOT, "static")
        )
        r_p.populate()

        self.assertEqual(rds.get("test:language:current"), "uk")


def get_rds():
    """Get a clean Redis."""
    rds = StrictRedis(encoding="utf-8", decode_responses=True)
    rds.flushall()

    return rds
