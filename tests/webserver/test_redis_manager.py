from pathlib import Path
from unittest import TestCase

from webserver.redis_manager import (
    RedisManager,
    find_languages,
    find_styles,
    get_defaults,
    pull_from_js,
)

FIXTURE_ROOT = Path(Path(__file__).resolve().parent, "fixtures")


class TestRedisManager(TestCase):
    """Test the RedisManager."""

    def test_constructor(self):
        """Test it initialises correctly."""
        r_m = get_redis_manager()
        self.assertEqual(r_m.namespace, "test")

    def test_populate_from_scratch(self):
        """Test it populates correctly from a clean start."""
        r_m = get_redis_manager()
        self.assertEqual(r_m.redis.get("test:language:current"), "no")
        self.assertEqual(r_m.redis.get("test:style:current"), "banana")

    def test_populate_with_existing_data(self):
        """Test it populates but respects existing data."""
        temp_rm = get_redis_manager()
        temp_rm.redis.set("test:language:current", "uk")

        r_m = RedisManager(namespace="test", static_root=Path(FIXTURE_ROOT, "static"))
        self.assertEqual(r_m.redis.get("test:language:current"), "uk")

    def test_valids(self):
        """Test it returns `valids`."""
        r_m = get_redis_manager()
        self.assertEqual(r_m.valids("style"), ["banana", "bar", "baz", "foo"])

    def test_current(self):
        """Test it returns `current`."""
        r_m = get_redis_manager()
        self.assertEqual(r_m.current("language"), "no")

    def test_tainting(self):
        """Test it `taints` a key."""
        r_m = get_redis_manager()
        self.assertFalse(r_m.is_changed("style"))

        r_m.taint("style")
        self.assertTrue(r_m.is_changed("style"))

    def test_resolve(self):
        """Test it `resolves` a key."""
        r_m = get_redis_manager()

        r_m.taint("language")
        self.assertTrue(r_m.is_changed("language"))

        r_m.resolve("language")
        self.assertFalse(r_m.is_changed("language"))

    def test_setting(self):
        """Test it `sets` a current."""
        r_m = get_redis_manager()

        self.assertFalse(r_m.is_changed("style"))

        r_m.set("style", "banana")
        self.assertEqual(r_m.current("style"), "banana")
        self.assertTrue(r_m.is_changed("style"))

        r_m.resolve("style")
        self.assertEqual(r_m.current("style"), "banana")
        self.assertFalse(r_m.is_changed("style"))


def test_pull_from_js():
    """Test it can pull correctly from some ES6."""
    data = 'export let en = {\n  name: "English",\n  data: [[{ class: "it" }]],\n};\n'
    assert pull_from_js(data, "name") == "English"


def test_find_styles():
    """Test it finds the stylesheets."""
    assert find_styles(root=Path(FIXTURE_ROOT, "static")) == [
        "banana",
        "bar",
        "baz",
        "foo",
    ]


def test_find_languages():
    """Test it finds the language files."""
    assert find_languages(root=Path(FIXTURE_ROOT, "static")) == {
        "eu": "Basque",
        "no": "Norwegian",
        "pl": "Polish",
        "uk": "Ukrainian",
    }


def test_get_defaults():
    """Test it finds the defaults."""
    assert get_defaults(root=Path(FIXTURE_ROOT, "static")) == {
        "language": "no",
        "style": "banana",
    }


def get_redis_manager():
    """Get a standard, flushed instance to test with."""
    return RedisManager(
        namespace="test", static_root=Path(FIXTURE_ROOT, "static"), flush=True
    )
