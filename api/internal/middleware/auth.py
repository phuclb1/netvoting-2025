from typing import Callable

from fastapi import Request
from loguru import logger

from core.singleton import SingletonMeta
from internal.common.exceptions.common import (
    ExceptionUnauthorized,
    ExceptionForbidden
)
from internal.common.schemas.user import UserInfo, UserRole
from internal.controller.auth import AuthController


class AuthMiddleware(metaclass=SingletonMeta):
    auth_controller: AuthController

    def init(self, auth_controller: AuthController):
        self.auth_controller = auth_controller

    async def get_current_user_from_token(self, hashed_token: str) -> UserInfo:
        if not hashed_token:
            raise ExceptionUnauthorized
        try:
            user = await self.auth_controller.resolve_token(hashed_token)
            user.hashed_token = hashed_token
            return user
        except Exception as e:
            logger.exception(e)
            raise ExceptionUnauthorized from e

    async def get_current_user(self, request: Request) -> UserInfo:
        hashed_token = None
        if "authorization" in request.headers.keys():
            hashed_token = request.headers["authorization"].split(" ")[-1]
        user = await self.get_current_user_from_token(hashed_token)
        user.hashed_token = hashed_token
        return user

    async def is_role_user(self, role: UserRole) -> Callable:
        async def _check_role(request: Request):
            user = await self.get_current_user(request)
            if user.role != role:
                raise ExceptionForbidden
        return _check_role

    async def authenticated(self, request: Request):
        await self.get_current_user(request)
