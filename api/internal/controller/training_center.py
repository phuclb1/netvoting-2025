from sqlalchemy.ext.asyncio import AsyncSession

from internal.common.schemas.training_center import (
    CenterResponse,
    CreateCenterRequest,
    ListCenterRequest,
    ListCenterResponse,
    UpdateCenterRequest
)
from internal.common.types import ID
from internal.repository.registry import Registry


class TrainingCenterController:
    repo: Registry

    def __init__(self, repo: Registry):
        self.repo = repo

    async def create_center(self, create_req: CreateCenterRequest) -> CenterResponse:
        async def _create_center(session: AsyncSession):
            center = await self.repo.center_repo().create_center(session, create_req)
            return center.view()
        return await self.repo.do_tx(_create_center)

    async def get_center_by_id(self, center_id: ID) -> CenterResponse:
        async def _get_center_by_id(session: AsyncSession):
            center = await self.repo.center_repo().get_center_by_id(session, center_id)
            return center.view()
        return await self.repo.do_tx(_get_center_by_id)

    async def update_center(self, center_id: ID, update_req: UpdateCenterRequest) -> CenterResponse:
        async def _update_center(session: AsyncSession):
            center = await self.repo.center_repo().update_center(session, center_id, update_req)
            return center.view()
        return await self.repo.do_tx(_update_center)

    async def get_list_center(self, list_req: ListCenterRequest) -> ListCenterResponse:
        async def _get_list_center(session: AsyncSession):
            total, centers = await self.repo.center_repo().get_list_center(session, list_req)

            return ListCenterResponse(
                total=total,
                centers=[center.view() for center in centers],
                current_page=list_req.page,
                has_next=total > list_req.skip + list_req.limit
            )
        return await self.repo.do_tx(_get_list_center)

    async def delete_center(self, center_ids: list[ID]):
        async def _delete_center(session: AsyncSession):
            await self.repo.center_repo().delete_center(session, center_ids)
        return await self.repo.do_tx(_delete_center)
