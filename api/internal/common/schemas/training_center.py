from typing import List, Optional
from fastapi import Query
from pydantic import BaseModel, Field

from internal.common.enums.training_center import CenterDepartment, CenterType
from internal.common.schemas.common import ListResponse, PagingRequest
from internal.common.schemas.user import UserInfo
from internal.common.types import ID


class CenterInfo(BaseModel):
    manager_id: Optional[ID] = Field(None, description="Manger")
    name: str = Field("", description="Training center name")
    address: str = Field("", description="Training center address")
    type: Optional[CenterType] = Field(
        None, description="Training center type")
    department: Optional[CenterDepartment] = Field(
        None, description="Training center department")


class CreateCenterRequest(CenterInfo):
    ...


class UpdateCenterRequest(CenterInfo):
    ...


class CenterResponse(CenterInfo):
    id: ID = Field(..., description="ID")
    manager: Optional[UserInfo] = Field(None, description="Manager info")
    created_at: int = Field(..., description="Center created at")
    updated_at: int = Field(..., description="Center updated at")


class ListCenterRequest(PagingRequest):
    type: Optional[CenterType] = Field(
        Query(None, description="Training center type"))
    department: Optional[CenterDepartment] = Field(
        Query(None, description="Training center department"))


class ListCenterResponse(ListResponse):
    centers: List[CenterResponse] = Field(...,
                                          description="Training center list")
