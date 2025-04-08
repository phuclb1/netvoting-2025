from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy_filterset import FilterSet

from internal.common.schemas.common import PagingRequest


async def get_paging_result(
    session: AsyncSession,
    filter_set: FilterSet,
    filter_request: PagingRequest,
):
    stmt = filter_set.filter_query(
        filter_request.model_dump(exclude_none=True))
    pagination_stmt = stmt
    if filter_request.skip > 0 or filter_request.limit > 0:
        pagination_stmt = stmt.offset(
            filter_request.skip).limit(filter_request.limit)

    total_res = (await session.scalars(stmt)).all()
    res = (await session.scalars(pagination_stmt)).all()
    return len(total_res), res
