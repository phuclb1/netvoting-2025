from datetime import datetime
from snowflake import SnowflakeGenerator
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.settings import settings
from internal.common.exceptions.user import ExceptionUserNotFound
from internal.common.schemas.user import (
    CreateUserRequest,
    UpdateUserRequest,
    ListUserRequest,
)
from internal.common.types import ID
from internal.gateway.redis_cl import RedisClient
from internal.models.user import User, UserFilterSet

KEY_LIMIT_LOGINED_USER = "limit_logined_user"
KEY_LIMIT_UNLOGINED_USER = "limit_unlogined_user"


class UserRepository:
    generator: SnowflakeGenerator
    redis_client: RedisClient

    def __init__(self, redis_client: RedisClient):
        self.generator = SnowflakeGenerator(42)
        self.redis_client = redis_client

    async def create_user(self, session: AsyncSession, create_request: CreateUserRequest) -> User:
        user = User(
            id=round(next(self.generator)),
            name=create_request.name,
            role=create_request.role,
            phone_number=create_request.phone_number,
            address=create_request.address,
            email=create_request.email,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        user.raw_password = create_request.password
        session.add(user)
        await session.flush()
        return user

    async def get_user_by_id(self, session: AsyncSession, user_id: ID) -> User:
        stmt = (
            select(User)
            .where(User.id == user_id)
        )
        res = (await session.scalars(stmt)).first()
        if res is None:
            raise ExceptionUserNotFound(user_id=user_id)
        return res

    async def get_user_by_email(self, session: AsyncSession, email: str) -> User | None:
        stmt = (
            select(User)
            .where(User.email == email)
        )
        res = (await session.scalars(stmt)).first()
        return res

    async def update_user(
        self,
        session: AsyncSession,
        user_id: ID,
        update_request: UpdateUserRequest,
    ) -> User:
        user = await self.get_user_by_id(session, user_id)

        model_attrs = list(UpdateUserRequest.model_fields.keys())
        for attr in vars(update_request):
            value = getattr(update_request, attr)
            if attr in model_attrs and value is not None:
                setattr(user, attr, value)
        return user

    async def get_list_user(
        self,
        session: AsyncSession,
        filter_req: ListUserRequest,
    ) -> tuple[int, list[User]]:
        stmt = select(User)
        filter_set = UserFilterSet(session, stmt)
        stmt = filter_set.filter_query(
            filter_req.model_dump(exclude_none=True))
        pagination_stmt = stmt
        if filter_req.skip > 0 or filter_req.limit > 0:
            pagination_stmt = stmt.offset(
                filter_req.skip).limit(filter_req.limit)

        total_res = (await session.scalars(stmt)).all()
        res = (await session.scalars(pagination_stmt)).all()

        return len(total_res), res

    async def delete_user(self, session: AsyncSession, user_ids: list[ID]):
        stmt = (
            select(User)
            .where(User.id.in_(user_ids))
        )
        res = (await session.scalars(stmt)).all()
        for user in res:
            await session.delete(user)

    async def set_hashed_token(self, hashed_token: str, authen_token: str):
        key = f"{settings.cache_token_hash}:{hashed_token}"
        await self.redis_client.set(key, authen_token, 60 *
                                    settings.token_exp_minutes)

    async def delete_hashed_token(self, hashed_token: str):
        key = f"{settings.cache_token_hash}:{hashed_token}"
        await self.redis_client.delete(key)

    async def remove_need_login(self, user_id: ID):
        key = f"{settings.cache_user_need_relogin}:{user_id}"
        await self.redis_client.delete(key)

    async def get_access_token(self, hashed_token: str):
        key = f"{settings.cache_token_hash}:{hashed_token}"
        return await self.redis_client.get(key)

    async def set_need_login(self, user_id: ID):
        key = f"{settings.cache_user_need_relogin}:{user_id}"
        await self.redis_client.set(key, "1", 60 * settings.token_exp_minutes)

    async def get_need_login(self, user_id: ID):
        key_need_login = f"{settings.cache_user_need_relogin}:{user_id}"
        need_login = await self.redis_client.get(key_need_login)
        return need_login

    async def delete_need_login(self, user_id: ID):
        key_need_login = f"{settings.cache_user_need_relogin}:{user_id}"
        await self.redis_client.delete(key_need_login)
