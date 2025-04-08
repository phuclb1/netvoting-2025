from datetime import datetime
from snowflake import SnowflakeGenerator
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from internal.common.exceptions.training_center import ExceptionCenterNotFound
from internal.common.schemas.training_center import (
    CreateCenterRequest,
    ListCenterRequest,
    UpdateCenterRequest
)
from internal.common.types import ID
from internal.gateway.redis_cl import RedisClient
from internal.models.training_center import CenterFilterSet, TrainingCenter


class TrainingCenterRepository:
    generator: SnowflakeGenerator
    redis_client: RedisClient

    def __init__(self, redis_client: RedisClient):
        self.generator = SnowflakeGenerator(42)
        self.redis_client = redis_client

    async def create_center(
        self,
        session: AsyncSession,
        create_request: CreateCenterRequest
    ) -> TrainingCenter:
        center = TrainingCenter(
            id=round(next(self.generator)),
            manager_id=create_request.manager_id,
            name=create_request.name,
            address=create_request.address,
            type=create_request.type,
            department=create_request.department,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        session.add(center)
        await session.flush()
        return center

    async def get_center_by_id(self, session: AsyncSession, center_id: ID) -> TrainingCenter:
        stmt = (
            select(TrainingCenter)
            .where(TrainingCenter.id == center_id)
        )
        res = (await session.scalars(stmt)).first()
        if res is None:
            raise ExceptionCenterNotFound(center_id=center_id)
        return res

    async def get_list_center(
        self,
        session: AsyncSession,
        filter_req: ListCenterRequest
    ) -> tuple[int, list[TrainingCenter]]:
        stmt = select(TrainingCenter)
        filter_set = CenterFilterSet(session, stmt)
        stmt = filter_set.filter_query(
            filter_req.model_dump(exclude_none=True))
        pagination_stmt = stmt
        if filter_req.skip > 0 or filter_req.limit > 0:
            pagination_stmt = stmt.offset(
                filter_req.skip).limit(filter_req.limit)

        total_res = (await session.scalars(stmt)).all()
        res = (await session.scalars(pagination_stmt)).all()

        return len(total_res), res

    async def update_center(
        self,
        session: AsyncSession,
        center_id: ID,
        update_request: UpdateCenterRequest
    ) -> TrainingCenter:
        center = await self.get_center_by_id(session, center_id)

        model_attrs = list(UpdateCenterRequest.model_fields.keys())
        for attr in vars(update_request):
            value = getattr(update_request, attr)
            if attr in model_attrs and value is not None:
                setattr(center, attr, value)
        return center

    async def delete_center(self, session: AsyncSession, center_ids: list[ID]):
        stmt = (
            select(TrainingCenter)
            .where(TrainingCenter.id.in_(center_ids))
        )
        res = (await session.scalars(stmt)).all()
        for center in res:
            await session.delete(center)
