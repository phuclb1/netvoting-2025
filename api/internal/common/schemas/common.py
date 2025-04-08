from typing import Optional, List

from fastapi import Query
from pydantic import (
    BaseModel,
    Field,
    computed_field
)

from internal.common.types import ID


class PagingRequest(BaseModel):
    page: int = Field(..., description="Page number")
    page_size: int = Field(..., description="Page size")
    query: Optional[str] = Field(None, description="Query string")
    ordering: Optional[list[str]] = Field(
        Query(
            ["-created_at"],
            description="Ordering, default is ordering by descending created_at",
            example=["created_at", "-updated_at"],
        ),
    )

    @computed_field
    def skip(self) -> int:
        return (self.page - 1) * self.page_size

    @computed_field
    def limit(self) -> int:
        return self.page_size


class ListResponse(BaseModel):
    total: int = Field(..., description="Total number of samples")
    has_next: bool = Field(..., description="Whether there are more samples")
    current_page: int = Field(..., description="Current page number")


class DeleteRequest(BaseModel):
    ids: List[ID] = Field(Query([], description="ID of the object to delete"))


class DeleteReponse(BaseModel):
    status_code: int = Field(..., description="status code")
    message: str = Field(..., description="Message response")
