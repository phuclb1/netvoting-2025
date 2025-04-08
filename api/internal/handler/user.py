from fastapi import Depends

from internal.common.schemas.common import DeleteRequest
from internal.common.schemas.user import (
    CreateUserRequest,
    UpdateUserRequest,
    ListUserRequest
)
from internal.common.types import ID
from internal.controller.user import UserController
from tools.uts_exception import exception_handler


class UserHandler:
    controller: UserController

    def __init__(self, controller: UserController):
        self.controller = controller

    @exception_handler
    async def create_user(self, create_req: CreateUserRequest):
        return await self.controller.create_user(create_req)

    @exception_handler
    async def get_user_by_id(self, user_id: ID):
        return await self.controller.get_user_by_id(user_id)

    @exception_handler
    async def update_user(self, user_id: ID, update_req: UpdateUserRequest):
        return await self.controller.update_user(user_id, update_req)

    @exception_handler
    async def get_list_user(self, list_req: ListUserRequest = Depends()):
        return await self.controller.get_list_user(list_req)

    @exception_handler
    async def delete_user(self, delete_req: DeleteRequest = Depends()):
        return await self.controller.delete_user(delete_req.ids)
