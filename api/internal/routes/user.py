from fastapi import APIRouter

from internal.common.schemas.user import ListUserResponse, UserInfo
from internal.handler.user import UserHandler


class UserRoute:
    router: APIRouter
    handler: UserHandler

    def __init__(self, handler: UserHandler):
        self.router = APIRouter()
        self.handler = handler

        self.router.add_api_route(
            path="",
            endpoint=self.handler.create_user,
            methods=["POST"],
            response_model=UserInfo,
            summary="Create user",
            description="Create user",
        )

        self.router.add_api_route(
            path="/{user_id}",
            endpoint=self.handler.get_user_by_id,
            methods=["GET"],
            response_model=UserInfo,
            summary="Get user by ID",
            description="Get user by ID",
        )

        self.router.add_api_route(
            path="/{user_id}",
            endpoint=self.handler.update_user,
            methods=["PUT"],
            response_model=UserInfo,
            summary="Update user",
            description="Update user",
        )

        self.router.add_api_route(
            path="",
            endpoint=self.handler.get_list_user,
            methods=["GET"],
            response_model=ListUserResponse,
            summary="Get list user",
            description="Get list user",
        )

        self.router.add_api_route(
            path="",
            endpoint=self.handler.delete_user,
            methods=["DELETE"],
            summary="Delete users",
            description="Delete users",
        )
