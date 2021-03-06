import json
from pathlib import Path

import redis

ROOT_DIR = Path(__file__).resolve().parent.parent
# STATIC_ROOT = Path(ROOT_DIR, "static")


class RedisManager:
    """Decorate the Redis."""

    def __init__(self, namespace="production", root_dir=ROOT_DIR, flush=False):
        """Construct."""
        self.redis = redis.StrictRedis(encoding="utf-8", decode_responses=True)
        self.namespace = namespace
        if flush:
            for key in self.redis.scan_iter(f"{self.namespace}:*"):
                self.redis.delete(key)

        self.root_dir = root_dir

        self.populate()

    def populate(self):
        """Fill ourselves up."""

        defaults = get_defaults(self.root_dir)
        for item in ["style", "language"]:
            prefix = f"{self.namespace}:{item}"

            if not self.redis.get(f"{prefix}:current"):
                self.redis.set(f"{prefix}:current", defaults[item])
                self.redis.delete(f"{prefix}:changed")

            self.redis.set(
                f"{prefix}:valids", json.dumps(find_things(item, root=self.root_dir))
            )

    def valids(self, key):
        """Find the valid values for this key."""
        return json.loads(self.redis.get(self.assemble_full_key(key, "valids")))

    def set(self, key, value):
        """Change `current` to `value`."""
        self.redis.set(self.assemble_full_key(key, "current"), value)
        self.taint(key)

    def current(self, key):
        """Find the current value for this key."""
        return self.redis.get(self.assemble_full_key(key, "current"))

    def taint(self, key):
        """Mark this key as changed."""
        self.redis.set(self.assemble_full_key(key, "changed"), 1)

    def is_changed(self, key):
        """Find if this key is marked as changed."""
        return self.redis.get(self.assemble_full_key(key, "changed"))

    def resolve(self, key):
        """Mark this key's change as resolved."""
        self.redis.delete(self.assemble_full_key(key, "changed"))

    def assemble_full_key(self, key, attribute):
        """Put together the full key."""
        return f"{self.namespace}:{key}:{attribute}"


def find_things(thing, root=ROOT_DIR):
    """Find the available `thing`."""
    if thing == "style":
        return find_styles(root)

    if thing == "language":
        return find_languages(root)

    return None  # nocov


def find_styles(root=ROOT_DIR):
    """Find the available styles."""
    return sorted(
        list(
            map(
                lambda x: Path(x).stem,
                filter(
                    lambda x: str(x).endswith(".css"),
                    Path(Path(root, "static", "css", "clocks")).glob("*"),
                ),
            )
        )
    )


def find_languages(root=ROOT_DIR):
    """Find the available languages."""
    languages = {}
    lang_root = Path(root, "internationalisation", "languages")
    files = Path(lang_root).glob("*")
    for file in files:
        posix = Path(lang_root, file)
        content = posix.read_text(encoding="UTF-8")
        languages[posix.stem] = json.loads(content)

    return languages


def get_defaults(root=ROOT_DIR):
    """Get the default language and style from the JS."""
    defaults = {}

    conf_file = Path(root, "static", "js", "conf.js")
    content = Path(conf_file).read_text(encoding="UTF-8")

    defaults["language"] = pull_from_js(content, "language")
    defaults["style"] = pull_from_js(content, "style")

    return defaults


def pull_from_js(content, key):
    """Pull a value from some ES6."""
    # we have to parse fucking ES6 because ES6 cannot natively import fucking JSON
    return list(filter(lambda x: f"{key}:" in x, content.split("\n")))[0].split('"')[1]
