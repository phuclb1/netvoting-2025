from fastapi import APIRouter

from internal.common.schemas.user import UserInfo, LoginResponse
from internal.handler.auth import AuthHandler


class AuthRoute:
    router: APIRouter
    handler: AuthHandler

    def __init__(self, handler: AuthHandler):
        self.router = APIRouter()
        self.handler = handler

        self.router.add_api_route(
            path="/login/password",
            endpoint=self.handler.login_with_password,
            methods=["POST"],
            summary="Login with password",
            description="Login with password",
            response_model=LoginResponse,
        )

        self.router.add_api_route(
            path="/login/google",
            endpoint=self.handler.login_google,
            methods=["POST"],
            summary="Login with Google",
            description="Login with Google",
            response_model=LoginResponse,
        )

        self.router.add_api_route(
            path="/login/ms",
            endpoint=self.handler.login_with_ms,
            methods=["POST"],
            summary="Login with Microsoft",
            description="Login with Microsoft",
            response_model=LoginResponse,
        )

        self.router.add_api_route(
            path="/logout",
            endpoint=self.handler.logout,
            methods=["POST"],
            summary="Logout",
            description="Logout",
        )

        self.router.add_api_route(
            path="/me",
            endpoint=self.handler.get_me,
            methods=["GET"],
            summary="Get me",
            description="Get me",
            response_model=UserInfo,
        )
