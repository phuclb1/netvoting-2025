from functools import wraps

from loguru import logger

from core.singleton import SingletonMeta
from internal.gateway.redis_cl import RedisClient

from .backend import CacheBackend
from .key import KeyMaker
from .tags import CacheTag


class CacheManager(metaclass=SingletonMeta):
    backend = None
    key_maker = None

    def init(self, redis_client: RedisClient):
        self.backend = CacheBackend(redis_client=redis_client)
        self.key_maker = KeyMaker()

    def cached(self, prefix: str = None, tag: CacheTag = None, ttl: int = 60):
        def _cached(function):
            @wraps(function)
            async def __cached(*args, **kwargs):
                if not self.backend or not self.key_maker:
                    raise Exception(
                        "backend or key_maker is None")  # pylint: disable=broad-exception-raised

                tmp = prefix if prefix else tag.value
                key = self.key_maker.make(
                    function, tmp, *args, **kwargs
                )
                cached_response = await self.backend.get(key=key)
                if cached_response:
                    logger.info("Use cache")
                    return cached_response

                response = await function(*args, **kwargs)
                await self.backend.set(response=response, key=key, ttl=ttl)
                return response

            return __cached

        return _cached

    async def remove_by_tag(self, tag: CacheTag) -> None:
        await self.backend.delete_startswith(value=tag.value)

    async def remove_by_prefix(self, prefix: str) -> None:
        await self.backend.delete_startswith(value=prefix)

    async def set_cache(self, key, data, ttl=60):
        await self.backend.set(data, key, ttl)

    async def get_cache(self, key):
        await self.backend.get(key)
