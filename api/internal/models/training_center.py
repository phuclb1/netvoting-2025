from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, BigInteger, DateTime, ForeignKey
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)
from sqlalchemy_filterset import FilterSet, InFilter, OrderingField, OrderingFilter, SearchFilter

from core.database.postgres import Base
from internal.common.enums.training_center import CenterDepartment, CenterType
from internal.common.schemas.training_center import CenterResponse
from internal.common.types import ID
from internal.models.user import User


class TrainingCenter(Base):
    __tablename__ = "training_centers"
    id: Mapped[ID] = mapped_column(BigInteger(), primary_key=True)
    manager_id: Mapped[Optional[ID]] = mapped_column(
        BigInteger, ForeignKey("users.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[Optional[CenterType]] = mapped_column(String, nullable=True)
    department: Mapped[Optional[CenterDepartment]
                       ] = mapped_column(String, nullable=True)
    manager: Mapped["User"] = relationship(
        "User", backref="training_center", lazy="selectin"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(), default=datetime.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(), default=datetime.now(), nullable=False)

    def view(self) -> CenterResponse:
        return CenterResponse(
            id=self.id,
            manager_id=self.manager_id,
            name=self.name,
            address=self.address,
            type=self.type,
            department=self.department,
            manager=self.manager.view(),
            created_at=int(self.created_at.timestamp() * 1000),
            updated_at=int(self.updated_at.timestamp() * 1000),
        )


class CenterFilterSet(FilterSet):
    query = SearchFilter(TrainingCenter.name)
    type = InFilter(field=TrainingCenter.type)
    department = InFilter(field=TrainingCenter.department)
    ordering = OrderingFilter(
        name=OrderingField(TrainingCenter.name),
        address=OrderingField(TrainingCenter.address),
        type=OrderingField(TrainingCenter.type),
        department=OrderingField(TrainingCenter.department),
        created_at=OrderingField(TrainingCenter.created_at),
        updated_at=OrderingField(TrainingCenter.updated_at),
    )
