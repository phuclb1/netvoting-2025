from aioredis import ConnectionPool, Redis

from core.settings import settings as st


class RedisClient:
    pool: ConnectionPool

    def __init__(self):
        self.pool = ConnectionPool(
            host=st.redis_host, port=st.redis_port, db=0)

    async def set(self, key, value, expire=None):
        async with Redis(connection_pool=self.pool) as client:
            await client.set(key, value, ex=expire)

    async def get(self, key):
        async with Redis(connection_pool=self.pool) as client:
            return await client.get(key)

    async def delete(self, key):
        async with Redis(connection_pool=self.pool) as client:
            await client.delete(key)

    async def decrease(self, key, amount=1):
        async with Redis(connection_pool=self.pool) as client:
            await client.decr(key, amount)
