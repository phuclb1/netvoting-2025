from datetime import datetime, timedelta
from typing import Optional

import bcrypt
import jwt
from sqlalchemy import String, BigInteger, DateTime
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)
from sqlalchemy_filterset import (
    FilterSet,
    InFilter,
    OrderingField,
    OrderingFilter,
    SearchFilter,
)
import pytz

from core.database.postgres import Base
from core.settings import settings
from internal.common.enums.user import UserRole
from internal.common.schemas.user import UserInfo, ID

salt = bcrypt.gensalt()


class User(Base):
    __tablename__ = "users"

    id: Mapped[ID] = mapped_column(BigInteger(), primary_key=True)
    password: Mapped[str] = mapped_column(String(255))
    raw_password: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String())
    email: Mapped[str] = mapped_column(String(), unique=True)
    role: Mapped[UserRole] = mapped_column(String())
    phone_number: Mapped[Optional[str]] = mapped_column(
        String(), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String(), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(),
                                                 default=datetime.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(),
                                                 default=datetime.now(), nullable=False)

    @hybrid_property
    def raw_password(self):
        raise AttributeError("Password hashes may not be viewed.")

    @raw_password.setter
    def raw_password(self, password: str):
        if password is not None:
            hash_password = bcrypt.hashpw(password.encode("utf-8"), salt).decode(
                "utf-8"
            )
            self.password = hash_password

    def view(self) -> UserInfo:
        return UserInfo(
            id=self.id,
            name=self.name,
            email=self.email,
            role=self.role,
            phone_number=self.phone_number,
            address=self.address,
            created_at=int(self.created_at.timestamp() * 1000),
            updated_at=int(self.updated_at.timestamp() * 1000),
        )

    def authenticate(self, password: str):
        if not self.password:
            return False
        valid = bcrypt.checkpw(password.encode(
            "utf-8"), self.password.encode("utf-8"))
        return valid

    def gen_jwt(self):
        payload = {
            "exp": (datetime.now(pytz.utc) + timedelta(days=1, seconds=0)).timestamp(),
            "iat": datetime.now(pytz.utc).timestamp(),
            "id": self.id,
            "role": self.role,
            "email": self.email,
        }
        return jwt.encode(payload, settings.secret_key, algorithm="HS256")


class UserFilterSet(FilterSet):
    query = SearchFilter(User.name, User.email)
    roles = InFilter(field=User.role)
    ordering = OrderingFilter(
        name=OrderingField(User.name),
        email=OrderingField(User.email),
        role=OrderingField(User.role),
        phone_number=OrderingField(User.phone_number),
        address=OrderingField(User.address),
        created_at=OrderingField(User.created_at),
        updated_at=OrderingField(User.updated_at),
    )
