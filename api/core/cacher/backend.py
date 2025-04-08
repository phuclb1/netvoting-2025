from typing import Any
import json
import pickle
from internal.gateway.redis_cl import RedisClient


class CacheBackend:
    redis_client: RedisClient

    def __init__(self, redis_client: RedisClient):
        self.redis_client = redis_client

    async def get(self, key: str) -> Any:
        result: bytes = await self.redis_client.get(key=key)
        if not result:
            return
        try:
            return json.loads(result.decode("utf8"))
        except UnicodeDecodeError:
            return pickle.loads(result)

    async def set(self, response: Any, key: str, ttl: int = 60) -> None:
        if isinstance(response, dict):
            response = json.dumps(response)
        elif isinstance(response, object):
            response = pickle.dumps(response)

        await self.redis_client.set(key=key, value=response, expire=ttl)

    async def delete_startswith(self, value: str) -> None:
        keys = await self.redis_client.keys(pattern=f"{value}::*")
        for key in keys:
            await self.redis_client.delete(key)
