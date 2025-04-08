from sqlalchemy.ext.asyncio import AsyncSession

from internal.common.schemas.user import (
    CreateUserRequest,
    UpdateUserRequest,
    ListUserRequest,
    ListUserResponse,
    UserInfo
)
from internal.common.types import ID
from internal.repository.registry import Registry


class UserController:
    repo: Registry

    def __init__(self, repo: Registry):
        self.repo = repo

    async def create_user(self, create_req: CreateUserRequest) -> UserInfo:
        async def _create_user(session: AsyncSession):
            user = await self.repo.user_repo().create_user(session, create_req)
            return user.view()
        return await self.repo.do_tx(_create_user)

    async def get_user_by_id(self, user_id: ID) -> UserInfo:
        async def _get_user_by_id(session: AsyncSession):
            user = await self.repo.user_repo().get_user_by_id(session, user_id)
            return user.view()
        return await self.repo.do_tx(_get_user_by_id)

    async def update_user(self, user_id: ID, update_req: UpdateUserRequest) -> UserInfo:
        async def _update_user(session: AsyncSession):
            user = await self.repo.user_repo().update_user(session, user_id, update_req)
            return user.view()
        return await self.repo.do_tx(_update_user)

    async def get_list_user(self, list_req: ListUserRequest) -> ListUserResponse:
        async def _get_list_user(session: AsyncSession):
            total, users = await self.repo.user_repo().get_list_user(session, list_req)

            return ListUserResponse(
                total=total,
                users=[user.view() for user in users],
                current_page=list_req.page,
                has_next=total > list_req.skip + list_req.limit
            )
        return await self.repo.do_tx(_get_list_user)

    async def delete_user(self, user_ids: list[ID]):
        async def _delete_user(session: AsyncSession):
            await self.repo.user_repo().delete_user(session, user_ids)
        return await self.repo.do_tx(_delete_user)
