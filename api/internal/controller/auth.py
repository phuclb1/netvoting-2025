from datetime import datetime
import hashlib

import jwt
from loguru import logger
from sqlalchemy.ext.asyncio import AsyncSession

from core.settings import settings
from internal.common.exceptions.common import ExceptionUnauthorized
from internal.common.types import ID
from internal.common.schemas.user import UserBase, UserInfo, UserLoginRequest
from internal.repository.registry import Registry


class AuthController:
    repo: Registry

    def __init__(self, repo: Registry):
        self.repo = repo

    async def verify_and_generate_token(self, user_req: UserBase) -> tuple[UserInfo, str]:
        async def _verify_and_generate_token(session: AsyncSession):
            user = await self.repo.user_repo().get_user_by_email(session, user_req.email)
            if user is None:
                raise ExceptionUnauthorized

            auth_token = user.gen_jwt()
            hashed_token = hashlib.sha256(
                auth_token.encode("utf-8")).hexdigest()

            await self.repo.user_repo().set_hashed_token(hashed_token, auth_token)
            await self.repo.user_repo().remove_need_login(user.id)
            return user.view(), hashed_token

        return await self.repo.do_tx(_verify_and_generate_token)

    async def authen_with_password(self, auth_request: UserLoginRequest) -> UserInfo:
        async def _login_with_password(session: AsyncSession):
            user = await self.repo.user_repo().get_user_by_email(session, auth_request.email)
            if user is None:
                raise ExceptionUnauthorized
            if not user.authenticate(auth_request.password):
                raise ExceptionUnauthorized

            return user.view()

        return await self.repo.do_tx(_login_with_password)

    async def logout(self, user: UserInfo):
        await self.need_login(user.id)
        await self.repo.user_repo().delete_hashed_token(user.hashed_token)

    async def resolve_token(self, hashed_token: str) -> UserInfo:
        async def _resolve_token(session: AsyncSession) -> UserInfo:
            access_token = await self.repo.user_repo().get_access_token(hashed_token)
            if not access_token:
                raise ExceptionUnauthorized
            decoded = jwt.decode(
                access_token,
                str(settings.secret_key),
                algorithm="HS256",
                options={"verify_signature": False},
            )
            if datetime.now().timestamp() > decoded["exp"]:
                logger.warning("Key has expired")
                raise ExceptionUnauthorized
            user = await self.repo.user_repo().get_user_by_id(
                session, decoded["id"])
            return user.view()

        res = await self.repo.do_tx(_resolve_token)
        return res

    async def need_login(self, user_id: ID):
        await self.repo.user_repo().set_need_login(user_id)

    async def check_relogin(self, user_id: ID) -> bool:
        need_login = await self.repo.user_repo().get_need_login(user_id)
        if need_login:
            await self.repo.user_repo().remove_need_login(user_id)
            return True
        return False
