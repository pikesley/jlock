from tools import STATIC_ROOT, find_things, get_defaults


class RedisPrimer:
    """Preload the Redis."""

    def __init__(self, redis, namespace="production", static_root=STATIC_ROOT):
        """Construct."""
        self.redis = redis
        self.namespace = namespace
        self.static_root = static_root

    @classmethod
    def purge_namespace(cls, redis, namespace):
        """Clean out one namespace."""
        for key in redis.scan_iter(f"{namespace}:*"):
            redis.delete(key)

    def populate(self):
        """Fill ourselves up."""
        defaults = get_defaults(self.static_root)
        for item in ["style", "language"]:
            prefix = f"{self.namespace}:{item}"

            if not self.redis.get(f"{prefix}:current"):
                self.redis.set(f"{prefix}:current", defaults[item])
                self.redis.set(f"{prefix}:previous", defaults[item])

            for member in find_things(item, root=self.static_root):
                self.redis.rpush(f"{prefix}:valids", member)
