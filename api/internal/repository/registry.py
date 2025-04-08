from typing import Callable

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker

from internal.common.types import T
from internal.gateway.redis_cl import RedisClient
from internal.repository.training_center import TrainingCenterRepository
from internal.repository.user import UserRepository


class Registry:
    _pg_engine: AsyncEngine
    _redis_client: RedisClient
    _user_repo: UserRepository
    _center_repo: TrainingCenterRepository

    def __init__(self, pg_engine: AsyncEngine, redis_client: RedisClient):
        self._pg_engine = pg_engine
        self._redis_client = redis_client
        # Construct the repository instances here
        self._user_repo = UserRepository(redis_client)
        self._center_repo = TrainingCenterRepository(redis_client)

    async def do_tx(self, tx_func: Callable[[AsyncSession], T]) -> T:
        try:
            async_session = async_sessionmaker(
                self._pg_engine, expire_on_commit=False)
            session = async_session()
            await session.begin()
            res = await tx_func(session)
            await session.commit()
            return res
        except Exception as e:
            if session is not None and session.is_active:
                await session.rollback()
            raise e
        finally:
            if session is not None and session.is_active:
                await session.close()

    # Function to get the repository instance
    def user_repo(self) -> UserRepository:
        return self._user_repo

    def center_repo(self) -> TrainingCenterRepository:
        return self._center_repo
