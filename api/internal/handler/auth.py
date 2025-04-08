from fastapi import Depends
import jwt
from loguru import logger

from internal.common.exceptions.common import ExceptionUnauthorized
from internal.common.schemas.user import (
    UserBase, UserInfo, UserLoginRequest, LoginResponse
)
from internal.controller.auth import AuthController
from internal.gateway.auth_gw import AuthGateway
from internal.middleware.auth import AuthMiddleware
from tools.uts_exception import exception_handler

auth_middleware = AuthMiddleware()


class AuthHandler:
    controller: AuthController
    auth_gw: AuthGateway

    def __init__(self, controller: AuthController):
        self.controller = controller
        self.auth_gw = AuthGateway()

    async def login_with_payload(self, payload: dict) -> LoginResponse:
        user_base = UserBase(**payload)
        user, hashed_token = await self.controller.verify_and_generate_token(
            user_base)
        if user is None:
            return LoginResponse(need_register=True)
        return LoginResponse(
            user=user,
            access_token=hashed_token
        )

    @exception_handler
    async def login_google(
        self,
        token: str,
    ):
        payload = self.auth_gw.get_google_user(token)
        return await self.login_with_payload(payload)

    @exception_handler
    async def login_with_ms(self, token: str):
        payload = jwt.decode(token, options={"verify_signature": False})
        payload["email"] = payload["unique_name"]
        payload["ms_id"] = payload["oid"]
        return await self.login_with_payload(payload)

    @exception_handler
    async def login_with_password(
        self,
        req: UserLoginRequest
    ):
        authenticated_user = await self.controller.authen_with_password(req)
        return await self.login_with_payload(authenticated_user.model_dump())

    @exception_handler
    async def logout(
        self,
        user_info: UserInfo = Depends(
            auth_middleware.get_current_user)
    ):
        if user_info is None:
            logger.info("User is not login")
            return
        await self.controller.logout(user_info)

    @exception_handler
    async def get_me(
        self,
        user_info: UserInfo = Depends(
            auth_middleware.get_current_user)
    ):
        if user_info is None:
            raise ExceptionUnauthorized
        return user_info
