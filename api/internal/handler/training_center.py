from fastapi import Depends
from internal.common.schemas.common import DeleteRequest
from internal.common.schemas.training_center import (
    CreateCenterRequest,
    ListCenterRequest,
    UpdateCenterRequest
)
from internal.common.types import ID
from internal.controller.training_center import TrainingCenterController
from tools.uts_exception import exception_handler


class TrainingCenterHandler:
    controller: TrainingCenterController

    def __init__(self, controller: TrainingCenterController):
        self.controller = controller

    @exception_handler
    async def create_center(self, create_req: CreateCenterRequest):
        return await self.controller.create_center(create_req)

    @exception_handler
    async def get_center_by_id(self, center_id: ID):
        return await self.controller.get_center_by_id(center_id)

    @exception_handler
    async def update_center(self, center_id: ID, update_req: UpdateCenterRequest):
        return await self.controller.update_center(center_id, update_req)

    @exception_handler
    async def get_list_center(self, list_req: ListCenterRequest = Depends()):
        return await self.controller.get_list_center(list_req)

    @exception_handler
    async def delete_center(self, delete_req: DeleteRequest = Depends()):
        return await self.controller.delete_center(delete_req.ids)
