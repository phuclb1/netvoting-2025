from typing import Annotated, TypeVar

from pydantic import (
    AfterValidator,
    PlainSerializer,
    WithJsonSchema
)


ID = Annotated[
    int,
    AfterValidator(lambda x: int(x)),
    PlainSerializer(lambda x: str(x), return_type=str),
    WithJsonSchema({"type": "string"}, mode="serialization"),
]

T = TypeVar("T")
