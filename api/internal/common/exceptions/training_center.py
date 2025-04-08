from internal.common.exceptions.common import XBaseException, ExceptionObjectDeleted
from internal.common.types import ID


class ExceptionCenterNotFound(XBaseException):
    def __init__(self, center_id: ID):
        super().__init__(status_code=400,
                         message=f"Traning center {center_id} not found")


class ExceptionCenterDeleted(ExceptionObjectDeleted):
    def __init__(self, user_id: ID):
        super().__init__(object_name=f"Training center {user_id}")


class ExceptionCenterAlreadyExists(XBaseException):
    def __init__(self, name: str):
        super().__init__(status_code=400,
                         message=f"Traning center with name {name} already exists")
